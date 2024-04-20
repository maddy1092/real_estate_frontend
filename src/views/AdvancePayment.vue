<template>
  <div class="advance-payment">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Property") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" @click="$router.go(-1)"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="flex-wrap" xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg9>
          <v-card v-show="!isLoading">
            <v-card-title>
              <h3>{{ $t("Advance Payment Request") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-autocomplete
                  v-model="payment.property"
                  v-validate="'required'"
                  :label="$t('Property Name')"
                  data-vv-name="property"
                  item-text="property_name"
                  item-value="id"
                  clearable
                  :disabled="disableProperties"
                  :error-messages="errors.collect('property')"
                  :items="properties"
                  @input.native="fetchProperties"
                  @change="updateUnits"
                />

                <v-select
                  v-model="payment.unit"
                  v-validate="'required'"
                  :label="$t('Unit Name')"
                  required
                  item-text="unit_number"
                  item-value="unit_id"
                  data-vv-name="unit"
                  :no-data-text="
                    payment.property
                      ? $t('No unit found against this property')
                      : $t('Please select a property')
                  "
                  :items="units"
                  :disabled="disableProperties"
                  :error-messages="errors.collect('unit')"
                  @change="updateTenant"
                />

                <v-autocomplete
                  v-model="payment.tenant"
                  v-validate="'required'"
                  pb-3
                  :label="$t('Tenant Name')"
                  data-vv-name="tenant"
                  item-text="tenant_name"
                  item-value="id"
                  clearable
                  :no-data-text="
                    payment.unit
                      ? $t('No tenant found against this unit')
                      : $t('Please select a unit')
                  "
                  :disabled="disableProperties"
                  :items="tenants"
                  :error-messages="errors.collect('tenant')"
                  @change="fetchAdvPayment"
                />

                <v-layout wrap class="re-radio">
                  <v-flex v-for="(month, index) of months" :key="index" xs6 sm4>
                    <v-checkbox
                      v-model="month.isSelected"
                      required
                      type="checkbox"
                      color="grey darken-1"
                      :label="month.duration"
                      :checked="month.isSelected"
                      @change="checkPrevious(index, month.isSelected)"
                    />
                  </v-flex>
                  <span
                    v-if="!isSingleSelected && showError && months.length"
                    class="red-text"
                    >{{ $t("Please select at lease one month") }}</span
                  >
                </v-layout>
              </v-form>
              <div class="text-xs-center re-total">
                <strong>{{ $t("Total Amount") }}:</strong>
                {{ totalAmount || 0 }} {{ $t("KWD") }}
              </div>
            </v-card-text>
          </v-card>
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'600px'"
            :width="'100%'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <div class="text-xs-center mt-4">
      <v-btn
        v-if="!isLoading"
        class="re-orangtbtn"
        :disabled="showError"
        @click="storeData"
        >{{ $t("Save") }}</v-btn
      >
      <v-btn v-if="!isLoading" dark @click="$router.go(-1)">{{
        $t("Cancel")
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import { ContractEnums } from "../enums";
import { splitMonthAndYear, transformforPropertyUnits } from "../helper";
import paymentService from "../services/plugins/payment";
import propertiesService from "../services/plugins/properties";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "AdvancePayment",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      payment: {},
      showError: false,
      months: [],
      isLoading: false,
      disableProperties: false,
      properties: [],
      units: [],
    };
  },
  async created() {
    this.isLoading = true;
    this.$validator.localize("en", this.dictionary);
    const params = this.$route.params;

    await this.fetchProperties();

    if (params.property) {
      this.disableProperties = true;
      await this.$nextTick();
      this.tenants = [
        { value: params.tenant_id, tenant_name: params.tenant_name }
      ];
      await this.$nextTick();
      this.payment = {
        property: params.property.property_id,
        unit: params.property.unit_id
      };

      await this.$nextTick();
      this.updateUnits(params.property.property_id);
      await this.$nextTick();
      this.updateTenant(params.property.unit_id);
      this.payment = {
        ...this.payment,
        tenant: params.tenant_id
      };
      await this.fetchAdvPayment();
    } else {
      this.disableProperties = false;
    }
    this.isLoading = false;
  },
  watch: {
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    },
  },
  computed: {
    dictionary() {
      return{
        custom: {
          tenant: {
            required: () => this.$t("Tenant Name is required")
          },
          property: {
            required: () => this.$t("Property Name is required")
          },
          unit: {
            required: () => this.$t("Unit is required")
          }
        }
      }
    },
    isSingleSelected() {
      return this.selectedMonths.length > 0;
    },
    selectedMonths() {
      return this.months.filter(month => month.isSelected);
    },
    totalAmount() {
      return this.selectedMonths.reduce(
        (prevValue, month) => prevValue + month.amount,
        0
      );
    }
  },
  methods: {
    async updateTenant(data) {
      if (data) {
        const unit = this.units.find(
          unit => (unit.unit_id || unit.id) === data
        );
        if (unit && unit.contract_id && unit.tenant_id) {
          this.tenants = [
            { tenant_name: unit.tenant_name, id: unit.tenant_id }
          ];

          this.payment = {
            ...this.payment,
            contract: unit.contract_id
          };
        } else if (unit && !unit.tenant_id) {
          this.tenants = [];
          this.months = [];
          this.$root.$emit("snackbar", {
            text: this.$t("No tenant found against this unit"),
            color: "error"
          });
        } else {
          this.tenants = [];
          this.months = [];
          this.$root.$emit("snackbar", {
            text: this.$t("No contract found"),
            color: "error"
          });
        }
      } else {
        await this.$nextTick();
        this.payment = {
          ...this.payment,
          tenant: ""
        };
      }
    },
    async checkPrevious(selectedIndex, isChecked) {
      let flag = false;
      if (selectedIndex !== 0 && isChecked) {
        const previous = this.months[selectedIndex - 1];
        if (!previous.isSelected) {
          flag = true;
          this.$root.$emit("snackbar", {
            text: this.$t(
              "Kindly, select month checklist in sequence and block"
            ),
            color: "red"
          });
          await this.$nextTick();
          this.months = this.months.map((month, index) => {
            if (selectedIndex === index) {
              return {
                ...month,
                isSelected: false
              };
            }
            return month;
          });
        }
      }
      await this.$nextTick();
      if (!flag) {
        this.showError = false;
      } else {
        this.showError = true;
      }
    },
    async fetchAdvPayment() {
      try {
        this.isLoading = true;
        this.months = [];
        let resp = await this.$processReq(
          paymentService.fetchAdvPayment({
            property_id: this.payment.property,
            unit_id: this.payment.unit,
            tenant_id: this.payment.tenant
          }),
          false,
          false
        );

        resp = resp.data.body;
        if (!resp.length) {
          this.isLoading = false;
          this.$root.$emit("snackbar", {
            text: this.$t("No advance payment found"),
            color: "error"
          });
        }
        this.months = resp;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("No advance payment found"),
          color: "error"
        });
        this.months = [];
        console.log("Error: ", error);
      }
    },
    async storeData() {
      if (!this.isSingleSelected) {
        this.showError = true;
      } else {
        this.showError = false;
      }

      await this.$nextTick();

      if ((await this.$validator.validateAll()) && !this.showError) {
        try {
          this.isLoading = true;
          let data = {
            ...this.payment,
            is_advanced_payment: true,
            adv_payment_duration: splitMonthAndYear(this.selectedMonths),
            reason: ContractEnums.AdvancePayment
          };

          await this.$processReq(paymentService.addNewPayment(data), true);
          this.$router.go(-1);
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          console.log("Error: Unable to add new payment - ", error);
        }
      }
    },
    async updateUnits(data) {
      if (data) {
        this.units = [];
        const property = this.properties.find(property => property.id === data);

        const { units } = transformforPropertyUnits(property.unit_details);
        this.units = units;
        this.payment = {
          ...this.payment,
          tenant: ""
        };
      } else {
        this.units = [];
        this.payment = {};
        this.months = [];
      }
    },
    async fetchProperties(event) {
      try {
        let params = {
          limit: 10,
          offset: 0
        };
        if (event) {
          params = {
            ...params,
            search: event.target.value
          };
        } else {
          params.search = "";
        }

        const response = await this.$processReq(
          propertiesService.getPropertiesList(params),
          false
        );

        this.properties = response.data.body.results;
      } catch (err) {
        console.log("Error: Unable to get properties list - ", err);
      }
    }
  }
};
</script>

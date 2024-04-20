<template>
  <div class="manual-payment">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Properties") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" @click="$router.go(-1)"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout row class="r-p-24px">
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
              <h3>{{ $t("Manual Payment") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-autocomplete
                  v-model="payment.property"
                  v-validate="'required'"
                  :label="$t('Property Name')"
                  item-text="property_name"
                  item-value="id"
                  data-vv-name="property_name"
                  :disabled="disableProperties"
                  :error-messages="errors.collect('property_name')"
                  :items="properties"
                  :no-data-text="
                    `${
                      isLoadingProperty
                        ? $t('Loading...')
                        : $t('No data available')
                    }`
                  "
                  @change="updateUnits"
                  @input.native="fetchProperties($event.target.value)"
                />

                <v-select
                  v-model="payment.unit"
                  v-validate="'required'"
                  :label="$t('Unit Number')"
                  item-text="unit_number"
                  item-value="unit_id"
                  data-vv-name="unit_number"
                  :loading="unitLoading"
                  :no-data-text="$t('No data available')"
                  :disabled="disableProperties"
                  :error-messages="errors.collect('unit_number')"
                  :items="units"
                  @change="updateTenants"
                />

                <v-select
                  v-model="payment.unitType"
                  :label="$t('Unit Type')"
                  required
                  disabled
                  item-text="unit_type"
                  item-value="unit_type_id"
                  :items="unitTypes"
                />

                <date-picker
                  v-model="payment.payment_date"
                  v-validate="'required'"
                  :label="$t('Payment Date')"
                  data-vv-name="payment_date"
                  :changed="payment.payment_date"
                  :initialValue="payment.payment_date"
                  required
                  :error-messages="errors.collect('payment_date')"
                />

                <date-picker
                  v-model="payment.month"
                  v-validate="'required'"
                  :label="$t('Month')"
                  type="month"
                  openOnTop
                  data-vv-name="payment_month"
                  :disabled="disableMonth"
                  :changed="payment.month"
                  :initialValue="payment.month"
                  :error-messages="errors.collect('payment_month')"
                />

                <year-picker
                  v-model="payment.year"
                  v-validate="'required'"
                  :label="$t('Year')"
                  data-vv-name="payment_year"
                  :initialValue="payment.year"
                  :changed="payment.year"
                  :disabled="disableMonth"
                  :error-messages="errors.collect('payment_year')"
                />

                <v-autocomplete
                  v-model="payment.tenant"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  disabled
                  required
                  data-vv-name="tenant_name"
                  :label="$t('Tenant Name')"
                  :error-messages="errors.collect('tenant_name')"
                  :items="tenants"
                />

                <v-text-field
                  v-model="payment.amount"
                  :label="$t('Price')"
                  disabled
                />

                <v-text-field
                  required
                  data-vv-name="voucher_reference"
                  v-validate="'required|alpha_num'"
                  v-model="payment.receipt_voucher_reference"
                  :error-messages="errors.collect('voucher_reference')"
                  :label="$t('Receipt Voucher Reference')"
                />
              </v-form>
            </v-card-text>
          </v-card>
          <confirmation-dialog
            v-model="isConfirmed"
            :label="$t('Confirmation')"
            :message="
              $t('Are you sure that you want to do this manual transaction?')
            "
            @acceptDialog="storePayment"
          />
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'700px'"
            :width="'100%'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <div class="text-xs-center mt-4">
      <v-btn
        v-if="!isLoading"
        :disabled="hasPayment"
        style="color:white!important"
        class="re-orangtbtn"
        @click="confirmPayment"
      >
        {{ $t("Save") }}
      </v-btn>
      <v-btn v-if="!isLoading" dark @click="$router.go(-1)">
        {{ $t("Cancel") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import moment from "moment";

import ConfirmationDialog from "../components/dialog/ConfirmationDialog.vue";
import DatePicker from "../components/picker/DatePicker.vue";
import YearPicker from "../components/picker/YearPicker.vue";
import { ContractEnums } from "../enums";
import { formatDateForPicker } from "../helper";
import { transformforPropertyUnits } from "../helper";
import paymentService from "../services/plugins/payment";
import propertyService from "../services/plugins/properties";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "ManualPayment",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  components: {
    DatePicker,
    YearPicker,
    ConfirmationDialog
  },
  data: () => ({
    properties: [],
    tenants: [],
    hasPayment: false,
    unitLoading: false,
    isConfirmed: false,
    units: [],
    disableMonth: false,
    disableProperties: false,
    payment: {},
    isLoading: false,
    isLoadingProperty: false,
    fetchProperties: null
  }),
  watch: {
    computedPayment: {
      deep: true,
      handler(val, prevVal) {
        if (val.payment_date !== prevVal.payment_date) return;
        if (isEqual(val, prevVal)) return;
        if (val.receipt_voucher_reference !== prevVal.receipt_voucher_reference)
          return;
        if (val.month && val.year && val.property && val.unit)
          this.checkPayment();
      }
    },
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  async created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.isLoading = true;
    this.$validator.localize("en", this.dictionary);

    const params = this.$route.params;
    if (params.property && params.property.property_id) {
      await this.fetchPropertyById(params.property.property_id);
    } else {
      await this.fetchProperties();
    }

    if (params.isRent) {
      this.disableMonth = true;
      this.disableProperties = true;
      this.updateUnits(params.property.property_id);
      this.updateTenants(params.property.unit_id);

      this.payment = {
        ...this.payment,
        property: params.property.property_id,
        unit: params.property.unit_id,
        month: params.payment_month
          ? moment()
              .month(params.payment_month)
              .year(params.payment_year)
              .format("YYYY-MM")
          : "",
        year: params.payment_year || ""
      };
    } else if (params.property) {
      this.disableProperties = true;
      this.updateUnits(params.property.property_id);
      this.updateTenants(params.property.unit_id);

      this.payment = {
        ...this.payment,
        property: params.property.property_id,
        unit: params.property.unit_id,
        tenant: params.tenant_id
      };
    }

    this.isLoading = false;
  },
  mounted() {
    this.payment.payment_date = moment(this.payment.payment_date).format(
      "YYYY-MM-DD"
    );
  },
  computed: {
    dictionary() {
      return {
        custom: {
          property_name: {
            required: () => this.$t("Property name is required")
          },
          unit_number: {
            required: () => this.$t("Unit number is required")
          },
          tenant_name: {
            required: () => this.$t("Tenant name is required")
          },
          payment_month: {
            required: () => this.$t("Payment month is required")
          },
          payment_year: {
            required: () => this.$t("Payment year is required")
          },
          payment_date: {
            required: () => this.$t("Payment Date is required")
          },
          voucher_reference: {
            required: () =>
              this.$t(
                "Reference number for the receipt voucher is required when performing manual payment"
              )
          }
        }
      };
    },
    computedPayment() {
      return Object.assign({}, this.payment);
    }
  },
  methods: {
    async confirmPayment() {
      if (await this.$validator.validateAll()) {
        this.isConfirmed = true;
      }
    },
    async storePayment() {
      try {
        this.isLoading = true;
        const params = {
          ...this.payment,
          payment_date: formatDateForPicker(this.payment.payment_date, true),
          payment_month: moment(this.payment.month).format("M"),
          payment_year: this.payment.year,
          is_manual_payment: true,
          reason: ContractEnums.ManualPayment
        };
        await this.$processReq(paymentService.updatePayment(params, params.id));
        this.$router.go(-1);
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to update store payment - ", error);
      }
    },
    async fetchPropertyById(id) {
      try {
        const response = await this.$processReq(
          propertyService.getPropertyDetails(id),
          false
        );

        this.properties = [response.data.body];
      } catch (err) {
        console.log("Error: Unable to get property details - ", err);
      }
    },
    async loadProperties(search) {
      try {
        this.isLoadingProperty = true;
        let params = {
          limit: 10,
          offset: 0
        };

        if (search) {
          params = {
            ...params,
            search: search || null
          };
        }

        const resp = await this.$processReq(
          propertyService.getPropertiesList(params),
          false
        );

        this.isLoadingProperty = false;
        this.properties = resp.data.body.results;
      } catch (error) {
        this.isLoadingProperty = false;
        console.log("Error: Unable to get property list - ", error);
      }
    },
    updateUnits(data) {
      this.resetUnit();
      if (data) {
        this.unitLoading = true;
        this.units = [];
        const property = this.properties.find(property => property.id === data);

        const { units, unitTypes } = transformforPropertyUnits(
          property.unit_details
        );
        this.units = units;
        this.unitTypes = unitTypes;
        this.unitLoading = false;
      } else {
        this.units = [];
        this.payment = {};
        this.unitTypes = [];
      }
    },
    updateTenants(data) {
      this.resetUnit(true);
      if (data) {
        const unit = this.units.find(
          unit => (unit.unit_id || unit.id) === data
        );

        this.payment = {
          ...this.payment,
          unitType: unit.unit_type_id
        };
      }
    },
    resetUnit(isUnit) {
      this.payment = {
        ...this.payment,
        unit: isUnit ? this.payment.unit : "",
        tenant: "",
        unitType: "",
        month: "",
        year: "",
        amount: "",
        payment_date: moment(new Date()).format("YYYY-MM-DD"),
        receipt_voucher_reference: ""
      };
    },
    async checkPayment() {
      try {
        this.isLoading = true;
        let params = {
          unit: this.payment.unit,
          property: this.payment.property,
          payment_month: moment(this.payment.month).format("M"),
          payment_year: this.payment.year
        };

        const resp = await this.$processReq(
          paymentService.checkPayment(params),
          false
        );

        const data = resp.data.body;

        if (!data.id) {
          this.hasPayment = true;
        } else {
          this.hasPayment = false;
        }

        this.tenants = [{ name: data.tenant, id: data.tenant }];

        await this.$nextTick();

        this.payment = {
          ...this.payment,
          id: data.id,
          amount: data.amount,
          contract: data.contract,
          tenant: data.tenant
        };
        this.isLoading = false;
      } catch (err) {
        this.hasPayment = true;
        this.isLoading = false;
        console.log("Error: Unable to check payment - ", err);
      }
    }
  }
};
</script>

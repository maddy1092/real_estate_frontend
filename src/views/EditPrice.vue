<template>
  <div class="edit-price">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Properties") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" @click="goBack()"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex class="flex-wrap" xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm12 lg9>
        <v-card v-if="!isLoading">
          <v-card-title>
            <h3>{{ $t("Edit Price") }}</h3>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-autocomplete
                v-model="unit.property"
                v-validate="'required'"
                :label="$t('Property Name')"
                item-text="property_name"
                item-value="id"
                data-vv-name="property_name"
                clearable
                :items="properties"
                :disabled="disableProperty"
                :error-messages="errors.collect('property_name')"
                :no-data-text="
                  `${
                    isLoadingProperty
                      ? $t('Loading...')
                      : $t('No data available')
                  }`
                "
                @change="updateUnitsData"
                @input.native="fetchProperties($event.target.value)"
              />

              <v-select
                v-model="unit.id"
                v-validate="'required'"
                :label="$t('Unit Number')"
                item-text="unit_number"
                item-value="unit_id"
                data-vv-name="unit_number"
                clearable
                :no-data-text="$t('Please select a property to load units')"
                :loading="isLoadingUnits"
                :items="units"
                :disabled="disableProperty"
                :error-messages="errors.collect('unit_number')"
                @change="updateAmountAndUnitType"
              />

              <v-select
                :label="$t('Unit Type')"
                v-model="unit.unittype"
                item-text="unit_type"
                item-value="unit_type_id"
                :items="unitTypes"
                disabled
              />

              <v-text-field
                v-model="unit.current_price"
                :label="$t('Current Unit Amount')"
                required
                disabled
              />

              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="unit.current_discount"
                    :label="$t('Current Unit Discount')"
                    required
                    disabled
                  />
                </v-flex>
                <v-flex xs6>
                  <v-radio-group
                    v-model="unit.current_discount_type"
                    row
                    class="re-radios"
                  >
                    <v-radio
                      :label="$t('Percentage')"
                      value="percentage"
                      color="grey darken-1"
                      disabled
                    ></v-radio>
                    <v-radio
                      :label="$t('Fixed')"
                      value="fixed"
                      color="grey darken-1"
                      disabled
                    ></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>

              <v-text-field
                v-model="unit.current_invoice_amount"
                :label="$t('Current Unit Net Amount')"
                required
                disabled
              />

              <v-text-field
                v-model="unit.price"
                v-validate="'required|decimal:3'"
                :label="$t('New Unit Amount')"
                data-vv-name="price"
                required
                :error-messages="errors.collect('price')"
                @input="calculateInvoice"
              />

              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="unit.discount"
                    v-validate="'required|decimal:3'"
                    :label="$t('New Unit Discount')"
                    required
                    data-vv-name="discount"
                    :error-messages="errors.collect('discount')"
                    @input="calculateInvoice"
                  />
                </v-flex>
                <v-flex xs6>
                  <v-radio-group
                    v-model="unit.discount_type"
                    v-validate="'required'"
                    row
                    class="re-radios"
                    data-vv-name="discount_type"
                    :error-messages="errors.collect('discount_type')"
                    @change="calculateInvoice"
                  >
                    <v-radio
                      :label="$t('Percentage')"
                      value="percentage"
                      color="grey darken-1"
                      mandatory
                    />
                    <v-radio
                      :label="$t('Fixed')"
                      value="fixed"
                      color="grey darken-1"
                    />
                  </v-radio-group>
                </v-flex>
              </v-layout>

              <v-text-field
                v-model="unit.invoice_amount"
                v-validate="{regex: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,3}$/}"
                :label="$t('New Unit Net Amount')"
                disabled
                required
                data-vv-name="invoice_amount"
                :error-messages="errors.collect('invoice_amount')"
              />
            </v-form>
          </v-card-text>
        </v-card>
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :width="'100%'"
          :height="'750px'"
          animation="fade"
        />
      </v-flex>
    </v-layout>

    <div class="text-xs-center mt-4">
      <v-btn
        v-if="!isLoading"
        dark
        class="re-orangtbtn"
        @click="storePriceData"
        >{{ $t("Save") }}</v-btn
      >
      <v-btn v-if="!isLoading" dark @click="goBack()">{{ $t("Cancel") }}</v-btn>
    </div>
  </div>
</template>

<script>
import { isEmpty, debounce} from "lodash";
import { mapActions, mapGetters } from "vuex";

import { ContractEnums } from "../enums";
import {
  calcualteNetInvoiceAmount,
  transformforPropertyUnits
} from "../helper";
import propertiesService from "../services/plugins/properties";
import unitsService from "../services/plugins/units";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "unit",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      disableProperty: false,
      properties: [],
      units: [],
      unitTypes: [],
      isLoading: false,
      isLoadingUnits: false,
      isLoadingProperty: false,
      unit: {
        discount: 0,
        discount_type: this.$t("Percentage")
      },
      prevRoute: "",
      fetchProperties: null
    };
  },
  watch: {
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    },
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
          price: {
            required: () => this.$t("New unit amount is required"),
            numeric: () =>
              this.$t("New unit amount may only contain numeric characters")
          },
          discount: {
            required: () => this.$t("New unit discount is required"),
            numeric: () =>
              this.$t("New unit discount may only contain numeric characters")
          },
          discount_type: {
            required: () => this.$t("Discount type is required")
          },
          invoice_amount: {
            required: () => this.$t("New unit net amount is required"),
            regex: () =>
              this.$t(
                "New unit net amount may only contain positive decimal number"
              )
          }
        }
      }
    },
    ...mapGetters("contract", ["getContract"]),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  async created() {
    this.fetchProperties = debounce(this.loadProperties, 500)
    this.$validator.localize("en", this.dictionary);
    this.isLoading = true;
    const params = this.$route.params;

    if (params.property && params.property.property_id) {
      await this.fetchPropertyById(params.property.property_id);
    } else {
      await this.fetchProperties();
    }

    if (
      !isEmpty(params.property) &&
      params.property.property_id &&
      params.property.unit_id
    ) {
      this.disableProperty = true;

      this.unit = {
        ...this.unit,
        property: params.property.property_id
      };
      this.updateUnitsData(params.property.property_id);

      this.unit = {
        ...this.unit,
        id: params.property.unit_id
      };

      this.updateAmountAndUnitType(params.property.unit_id);
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions("contract", ["setAmount"]),
    emptyUnit() {
      this.unit = {
        ...this.unit,
        unittype: "",
        current_discount_type: "",
        current_discount: "",
        current_price: "",
        current_invoice_amount: ""
      };
    },
    resetUnit(isUnit) {
      this.unit = {
        property: this.unit.property,
        id: isUnit ? this.unit.id : "",
        discount: 0,
        discount_type: "percentage"
      };
    },
    async storePriceData() {
      try {
        if (await this.$validator.validateAll()) {
          this.isLoading = true;

          const data = {
            ...this.unit,
            reason: ContractEnums.EditPrice
          };

          const res = await this.$processReq(
            unitsService.updateUnit(data.id, data),
            true
          );
          this.isLoading = false;
          this.goBack(res.data.body);
        }
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to Update unit - ", err);
      }
    },
    goBack(unit) {
      if (this.prevRoute && this.prevRoute.path.includes("renew_contract")) {
        if (this.getContract) {
          this.setAmount(
            unit ? unit.invoice_amount : this.unit.current_invoice_amount
          );
        }

        this.$router.push({
          name: this.prevRoute.name,
          params: {
            property: {
              unit_id: this.unit.id,
              property_id: this.unit.property
            },
            contract_id: this.prevRoute.params.contract_id
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    calculateInvoice() {
      this.unit.invoice_amount = calcualteNetInvoiceAmount(this.unit);
    },
    updateUnitsData(data) {
      this.resetUnit();
      if (data) {
        const property = this.properties.find(item => item.id === data);
        if (property) {
          const { units, unitTypes } = transformforPropertyUnits(
            property.unit_details
          );

          this.units = units;
          this.unitTypes = unitTypes;
        } else {
          this.emptyUnit();
        }
      } else {
        this.emptyUnit();
        this.unit.id = "";
        this.units = [];
        this.unitTypes = [];
      }
    },
    updateAmountAndUnitType(data) {
      this.resetUnit(true);
      if (data) {
        const unit = this.units.find(unit => unit.unit_id === data);
        if (unit) {
          this.unit.unittype = unit.unit_type_id;

          this.unit = {
            ...this.unit,
            current_discount_type: unit.discount_type
              ? unit.discount_type.toLowerCase()
              : "percentage",
            current_discount: unit.discount,
            current_price: parseFloat(unit.price).toFixed(3),
            current_invoice_amount: parseFloat(unit.invoice_amount).toFixed(3)
          };

          delete unit.discount_type;
          delete unit.discount;
          delete unit.price;
          delete unit.invoice_amount;

          this.unit = {
            ...this.unit,
            ...unit
          };
        } else {
          this.emptyUnit();
        }
      } else {
        this.emptyUnit();
      }
    },
    async fetchPropertyById(id) {
      try {
        this.isLoadingProperty = true;
        const res = await this.$processReq(
          propertiesService.getPropertyDetails(id),
          false
        );

        this.properties = [res.data.body];
        this.isLoadingProperty = false;
      } catch (err) {
        this.isLoadingProperty = false;
        console.log("Error: Unable to fetch property by Id - ", err);
      }
    },
    async loadProperties(search) {
      try {
        this.isLoadingProperty = true;
        const res = await this.$processReq(
          propertiesService.getPropertiesList({
            limit: 10,
            offset: 0,
            search: search || null
          }),
          false
        );

        this.properties = res.data.body.results;
        this.isLoadingProperty = false;
      } catch (err) {
        this.isLoadingProperty = false;
        console.log("Error: Unable to get properties list - ", err);
      }
    }
  }
};
</script>

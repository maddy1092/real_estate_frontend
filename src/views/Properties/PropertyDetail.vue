<template>
  <div class="property-details">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Property") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn
          @click="$router.push({ name: 'properties' })"
          dark
          class="mt-4 r-m-end"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout class="r-p-24px">
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
          <v-card v-if="!isLoading">
            <v-card-title>
              <h3>{{ $t("Property Details") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="property.property_name_en"
                  v-validate="'required'"
                  required
                  :label="$t('Unit Property Name (EN)')"
                  data-vv-name="property_name"
                  :error-messages="errors.collect('property_name')"
                />
                <v-text-field
                  v-model="property.property_name_ar"
                  required
                  :label="$t('Unit Property Name (AR)')"
                />
                <v-text-field
                  v-model="property.address"
                  v-validate="'required'"
                  required
                  :label="$t('Address')"
                  data-vv-name="address"
                  :error-messages="errors.collect('address')"
                />
                <v-select
                  v-model="property.pg_code"
                  v-validate="'required'"
                  item-text="display_name"
                  item-value="code"
                  clearable
                  data-vv-name="gateway"
                  :items="gateWays"
                  :label="$t('Gateway')"
                  :error-messages="errors.collect('gateway')"
                />
                <v-checkbox
                  :label="$t('Allow cash payment')"
                  v-model="property.is_cash_payment_allowed"
                  color="grey darken-1"
                ></v-checkbox>
              </v-form>
            </v-card-text>
          </v-card>
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'358px'"
            :width="'100%'"
            animation="fade"
          />
          <table-loader v-if="isLoading" />
        </v-flex>
      </v-layout>
    </v-layout>
    <div>
      <v-layout v-if="!isLoading" row wrap justify-center>
        <v-flex md12 lg9 text-xs-right>
          <v-btn
            @click="addUnitTypesWithUnits"
            class="re-orangtbtn mt-5 mb-3 mr-0"
          >
            {{ $t("Add Unit Type With Units") }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout
        v-for="(unit_type, index) of property.unit_types"
        :key="index"
        row
        wrap
        justify-center
      >
        <unit-type-card
          v-if="!isLoading"
          :property="property"
          :unitTypes="unitTypes"
          :index="index"
          :propertyUnitType="unit_type.unit_type_id"
          :derivedUnits="unit_type.units"
          @updateUnitType="updateUnitType($event, index)"
          @updateUnits="updatePropertyUnits($event, index)"
        />
      </v-layout>
    </div>
    <div class="text-xs-center mt-4">
      <v-btn
        v-if="!isLoading"
        @click="saveProperty"
        dark
        class="re-orangtbtn"
        >{{ $t("Save") }}</v-btn
      >
      <v-btn v-if="!isLoading" @click="$router.push({ name: 'properties' })">{{
        $t("Cancel")
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import UnitTypeCard from "../../components/Properties/UnitTypeCard.vue";
import {
  transformPropertiesRequest,
  transformPropertyUnits
} from "../../helper";
import { getPaymentOptions } from "../../services/common";
import propertyService from "../../services/plugins/properties";
import unitTypeService from "../../services/plugins/unit_type";
import TableLoader from "../loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "PropertyDetails",
  components: { UnitTypeCard, TableLoader },
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  created() {
    const params = this.$route.params;

    if (!isEmpty(this.getProperty) && params.id === this.getProperty.id) {
      this.property = this.getProperty;
      this.setProperty({});
    } else {
      this.fetchPropertyData();
      this.setProperty({});
    }
    this.fetchUnitTypes();
    this.getGatewayOptions();
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
  },
  data() {
    return {
      showEditUnit: false,
      pagination: {
        rowsPerPage: 5
      },
      property: {},
      isLoading: false,
      unitTypes: [],
      gateWays: [],
      items3: [
        this.$t("All"),
        this.$t("Rent"),
        this.$t("Lease"),
        this.$t("Buy")
      ],
    };
  },
  computed: {
    ...mapGetters("property", ["getProperty"]),
    dictionary() {
      return {
        custom: {
          gateway: {
            required: () => this.$t("Gateway code is required")
          },
          property_name: {
            required: () => this.$t("The property_name field is required")
          },
          address: {
            required: () => this.$t("The address field is required")
          }
        }
      };
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    },
    isEdit() {
      return this.property.id && this.property.id > 0 ? true : false;
    }
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchUnitTypes();
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  methods: {
    ...mapActions("property", ["setProperty"]),
    async getGatewayOptions() {
      try {
        const resp = await getPaymentOptions();

        this.gateWays = resp.data.actions.POST.gateways;
      } catch (err) {
        console.log("Error: Unable to get payment option - ", err);
      }
    },
    async fetchPropertyData() {
      try {
        const id = this.$route.params.id;
        if (id) {
          this.isLoading = true;
          const resp = await this.$processReq(
            propertyService.getPropertyDetails(id),
            false
          );
          this.isLoading = false;
          this.property = {
            ...this.property,
            ...resp.data.body,
            unit_types: transformPropertyUnits(resp.data.body.unit_details)
          };
        }
      } catch (err) {
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while fetching results"),
          color: "error"
        });
        console.log(err);
      }
    },
    async fetchUnitTypes() {
      try {
        const resp = await this.$processReq(
          unitTypeService.getUnitTypeList({
            offset: 0,
            limit: 1000
          }),
          false
        );
        this.unitTypes = resp.data.body.results;
      } catch (err) {
        console.log('Error: Unable to get unittpe list - ', err);
      }
    },
    async saveProperty() {
      if (!(this.property.unit_types && this.property.unit_types.length)) {
        this.$root.$emit("snackbar", {
          text: this.$t(
            "Kindly, insert at least one unit type with their units"
          ),
          color: "error"
        });
        return;
      }

      if (!this.checkUnitsExist(this.property.unit_types)) {
        return;
      }
      if (await this.$validator.validateAll()) {
        const response = {
          ...this.property,
          property_name: this.property.property_name_en,
          pg_name: this.property.pg_code
        };
        const request = transformPropertiesRequest(response);

        this.isLoading = true;
        try {
          if (this.isEdit) {
            await this.$processReq(
              propertyService.updateProperty(request, request.id),
              true
            );
            this.isLoading = false;
            this.$router.push({ name: "properties" });
          } else {
            await this.$processReq(
              propertyService.addNewProperty(request),
              true
            );
            this.isLoading = false;
            this.$router.push({ name: "properties" });
          }
        } catch (error) {
          this.isLoading = false;
          console.log("Error: Unable to update and add property - ", error);
        }
      }
    },
    addUnitTypesWithUnits() {
      if (this.property.unit_types) {
        this.property.unit_types.push({ unit_type_id: "", units: [] });
      } else {
        this.property = {
          ...this.property,
          unit_types: [{ unit_type_id: "", units: [] }]
        };
      }
    },
    updatePropertyUnits(units, index) {
      Vue.set(this.property.unit_types, index, units);
    },
    updateUnitType(event, index) {
      if (event) {
        Vue.set(this.property.unit_types, index, {
          ...this.property.unit_types[index],
          unit_type_id: event
        });
      }
    },
    checkUnitsExist(unit_types) {
      let flag = true;
      const unit = unit_types.find(unit_type => !unit_type.units.length);

      if (unit) {
        const unitType = this.unitTypes.find(
          unitType => unitType.id === unit.unit_type_id
        );
        if (unitType) {
          this.$root.$emit("snackbar", {
            text: `${this.$t(
              "Kindly, insert at least one unit against unit type"
            )} (${unitType.unit_type_name || ""})`,
            color: "error"
          });
        } else {
          this.$root.$emit("snackbar", {
            text: this.$t("Kindly, insert unit type with their units"),
            color: "error"
          });
        }
        flag = false;
      }

      return flag;
    }
  }
};
</script>

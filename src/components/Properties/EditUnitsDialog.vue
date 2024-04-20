<template>
  <v-card class="pb-3">
    <v-card-title class="headline re-card-title ">
      {{ $t("Edit Units") }} {{ this.unitType }}
    </v-card-title>
    <v-card-text>
      <div style="overflow:auto">
        <v-data-table
          :headers="headers"
          :items="editUnits"
          class="re-table"
          item-key-name="index"
          persistent
          :pagination.sync="pagination"
          hide-actions
        >
          <template v-slot:items="props">
            <td class="re-orange-color text-xs-center">
              {{ props.item.id || 0 }}
            </td>
            <td class="text-xs-center">
              <v-text-field
                v-model="props.item.unit_number"
                v-validate="'required'"
                class="custom-input"
                outline
                :name="`unit_number_${props.index}`"
                :data-vv-name="`unit_number_${props.index}`"
                :error-messages="errors.collect(`unit_number_${props.index}`)"
              />
              <span class="red-text">{{
                errors.collect(`unit_number_${props.index}`).length > 0
                  ? $t("This field is required")
                  : ""
              }}</span>
            </td>
            <td class="text-xs-center">
              <v-text-field
                v-model="props.item.floor"
                v-validate="'required'"
                outline
                class="custom-input re-width-custom"
                :data-vv-name="`floor_${props.index}`"
                :error-messages="errors.collect(`floor_${props.index}`)"
              />
              <span class="red-text">{{
                errors.collect(`floor_${props.index}`).length > 0
                  ? $t("This field is required")
                  : ""
              }}</span>
            </td>
            <td class="text-xs-center re-100">
              {{ props.item.price }} {{ $t("KWD") }}
            </td>
            <td class="text-xs-center">
              <v-layout>
                <v-flex xs12 sm6 lg4>
                  <v-text-field
                    v-model="props.item.discount"
                    outline
                    class="width100 discount_input"
                    :disabled="props.item.contract_id"
                    @input="calculateInvoiceAmount(props)"
                  />
                </v-flex>
                <v-flex xs6 sm7 lg8>
                  <v-radio-group
                    v-model="props.item.discount_type"
                    row
                    class="re-radios re-discount-type"
                    :disabled="props.item.contract_id"
                    @change="calculateInvoiceAmount(props)"
                  >
                    <v-radio
                      :label="$t('Percentage')"
                      value="percentage"
                      color="grey darken-1"
                    />
                    <v-radio
                      :label="$t('Fixed')"
                      value="fixed"
                      color="grey darken-1"
                    />
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </td>
            <td class="text-xs-center">
              {{ props.item.invoice_amount }} {{ $t("KWD") }}
            </td>
            <td @click.stop>
              <v-icon @click="removeFromArray(props.item)"> close </v-icon>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card-text>

    <v-layout wrap class="pl-5 re-pl-5 mt-3">
      <v-flex xs12 sm3 d-flex>
        <p class="r-p ">
          {{ $t("How many units would you like to add ?") }}
        </p>
      </v-flex>
      <v-flex xs12 sm9>
        <v-layout>
          <v-flex xs6 sm3 mr-3 no-mr class="r-quantity text-left">
            <v-text-field
              v-model="unit_entered"
              v-validate="'numeric'"
              class="re-input"
              placeholder="1"
              outline
              data-vv-name="unit_entered"
              :error-messages="errors.collect('unit_entered')"
            />
            <span class="red-text">{{
              errors.collect("unit_entered").length
                ? errors.collect("unit_entered")[0]
                : ""
            }}</span>
          </v-flex>
          <v-flex xs6 sm3 class="r-price">
            <v-text-field
              v-model="price"
              v-validate="'decimal:3'"
              class="re-input"
              :placeholder="$t('Price')"
              outline
              data-vv-name="price"
              :error-messages="errors.collect('price')"
            />
            <span class="red-text">{{
              errors.collect("price").length ? errors.collect("price")[0] : ""
            }}</span>
          </v-flex>
          <v-flex xs4 sm3 re-text-center>
            <v-btn dark class="re-add-btn" @click="updateUnitList">
              {{ $t("Add") }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-layout row justify-end>
        <v-flex sm7 md5 class="mr-5">
          <v-btn @click="updateUnits" dark class="re-orangtbtn">{{
            $t("Save and Return")
          }}</v-btn>
          <v-btn color="primary" flat @click="cancelEditUnits">
            {{ $t("Cancel") }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import Vue from "vue";

import { calcualteNetInvoiceAmount } from "../../helper";

export default {
  name: "edit-units-dialog",
  $_veeValidate: {
    validator: "new"
  },
  props: {
    units: {
      default: []
    },
    unitType: {
      default: ""
    },
    showEditUnit: {
      default: false
    }
  },
  data() {
    return {
      unit_entered: "",
      price: "",
      pagination: { rowsPerPage: 1000 },
      editUnits: []
    };
  },
  created() {
    this.editUnits = cloneDeep(this.units);
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
  },
  watch: {
    showEditUnit() {
      if (this.showEditUnit) {
        if (this.unitType === "") {
          this.$root.$emit("snackbar", {
            text: this.$t("Kindly, select unit type"),
            color: "error"
          });
          this.$emit("closeDialog");
        }
        this.editUnits = cloneDeep(this.units);
      } else {
        this.editUnits = [];
      }
    },
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t("Id"), align: "center", sortable: false },
        { text: this.$t("Unit Number"), align: "center", sortable: false },
        { text: this.$t("Floor"), align: "center", sortable: false },
        { text: this.$t("Price"), align: "center", sortable: false },
        {
          text: this.$t("Discount"),
          value: "discount",
          align: !this.$vuetify.rtl ? "left" : "right",
          sortable: false
        },
        { text: this.$t("Invoice Amount"), align: "center", sortable: false }
      ];
    },
    dictionary() {
      return {
        custom: {
          price: {
            required: () => this.$t("This field is required"),
            decimal: () => this.$t("Please enter decimal value upto 3 points")
          },
          unit_entered: {
            required: () => this.$t("This field is required"),
            decimal: () => this.$t("Please enter decimal value upto 2 points")
          }
        }
      };
    }
  },
  methods: {
    async updateUnitList() {
      if (
        (await this.$validator.validate("unit_entered", this.unit_entered)) &&
        (await this.$validator.validate("price", this.price))
      ) {
        if (this.price === "" || this.unit_entered === "") {
          this.$root.$emit("snackbar", {
            text: this.$t(
              "Kindly, enter both the price and the count of added records."
            ),
            color: "error"
          });
        } else {
          for (let i = 0; i < this.unit_entered; i++) {
            this.editUnits.push({
              price: this.price,
              discount_type: "percentage",
              discount: 0,
              invoice_amount: this.price
            });
          }
          this.unit_entered = "";
          this.price = "";
        }
      }
    },
    removeFromArray(item) {
      if (item.contract_id) {
        this.$root.$emit("snackbar", {
          text: "Unit having active contract cannot be deleted",
          color: "error"
        });
        return;
      }

      this.editUnits = this.editUnits.filter(unit => unit != item);
    },
    cancelEditUnits() {
      this.editUnits = [];
      this.$emit("closeDialog");
    },
    async updateUnits() {
      if (await this.$validator.validateAll()) {
        if (this.unitType === "") {
          this.$root.$emit("snackbar", {
            text: this.$t("Kindly, select a property type"),
            color: "error"
          });
        } else {
          this.$emit("updateUnits", cloneDeep(this.editUnits));
        }
      }
    },
    calculateInvoiceAmount(unit) {
      const item = unit.item;
      item.invoice_amount = calcualteNetInvoiceAmount(item);
      Vue.set(this.editUnits, unit.index, item);
    }
  }
};
</script>

<style lang="css" scoped>
.text-xs-center >>> .v-text-field__details,
.v-messages {
  margin-bottom: 0px !important;
  /* height: 0px !important; */
  min-height: unset !important;
}
.discount_input {
  margin-top: 0px !important;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  display: flex !important;
}
::v-deep .v-text-field input {
  margin: 0;
}
.re-input {
  width: 50%;
}
::v-deep .re-input input {
  text-align: center;
}
.re-card-title {
  max-width: 100% !important;
  padding: 0px 23px !important;
  padding-top: 10px !important;
}

.custom-input {
  width: 50%;
  margin: 5px auto !important;
}
</style>

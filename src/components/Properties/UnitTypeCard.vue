<template>
  <v-flex md12 lg9>
    <v-card class="tenant pb-4 my-5">
      <v-toolbar class="re-toolbar">
        <h3>{{ $t("Unit Type") }}</h3>
      </v-toolbar>
      <v-layout row wrap justify-center>
        <v-flex lg8 class="pl-4 mt-3">
          <v-select
            v-model="selectedUnitType"
            :label="$t('Unit Type')"
            item-text="unit_type_name"
            item-value="id"
            :items="unitTypes"
          />
        </v-flex>
        <v-flex lg4 class="text-xs-right pr-2 mt-3">
          <v-btn
            dark
            class="re-orangtbtn mt-3 mb-3 mr-0"
            :disabled="disableUnitType"
            @click="navigateToUnitType"
          >
            {{ $t("Add Unit Type") }}
          </v-btn>
        </v-flex>
      </v-layout>
      <div>
        <v-layout wrap>
          <v-flex xs12 lg8 class="mt-5 pl-4 flex-start">
            <h3 style="display:flex;">
              {{ $t("Units of Type") }} {{ unitTypeName }}
            </h3>
          </v-flex>
          <v-flex xs12 lg4 class="text-xs-right mt-5 pr-2">
            <v-dialog v-model="showEditUnit" width="75%" class="re-dialog">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  dark
                  class="re-orangtbtn"
                  :disabled="disableUnitType"
                >
                  {{ $t("Add Or Edit Units") }}
                </v-btn>
              </template>

              <edit-units-dialog
                :showEditUnit="showEditUnit"
                :units="units"
                :unitType="unitTypeName"
                @updateUnits="
                  units => {
                    $emit('updateUnits', { unit_type_id: unitType, units });
                    showEditUnit = false;
                  }
                "
                @closeDialog="showEditUnit = false"
              />
            </v-dialog>
          </v-flex>
        </v-layout>
        <div style="overflow:auto">
          <v-data-table
            :headers="headers"
            :items="units"
            class=" re-table"
            hide-actions
            :no-data-text="$t('No data available')"
          >
            <template v-slot:items="props">
              <td
                class="re-orange-color text-xs-center"
                style="cursor:pointer;"
                @click="navigateToEdit(props.item.id, props.index)"
              >
                {{ props.item.id || 0 }}
              </td>
              <td class="text-xs-center">{{ props.item.unit_number }}</td>
              <td class="text-xs-center">{{ props.item.floor }}</td>
              <td class="text-xs-center">{{ props.item.price }}</td>
              <td class="text-xs-center d-flex re-select">
                {{ props.item.discount }}
                <v-form class="re-discount-type">
                  <v-radio-group
                    v-model="props.item.discount_type"
                    row
                    class="re-radios"
                    style="margin-top:0px!important"
                  >
                    <v-radio
                      :label="$t('Percentage')"
                      value="percentage"
                      disabled
                      color="grey darken-1"
                    />
                    <v-radio
                      :label="$t('Fixed')"
                      value="fixed"
                      color="grey darken-1"
                      disabled
                    />
                  </v-radio-group>
                </v-form>
              </td>
              <td class="text-xs-center">{{ props.item.invoice_amount }}</td>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
import { mapActions } from "vuex";

import EditUnitsDialog from "./EditUnitsDialog.vue";

export default {
  name: "unit-type-card",
  components: { EditUnitsDialog },
  props: {
    derivedUnits: {
      default: () => []
    },
    unitTypes: {
      default: []
    },
    propertyUnitType: {
      default: 0
    },
    property: {
      default: () => {}
    },
    index: {
      default: ""
    }
  },
  data() {
    return {
      units: this.derivedUnits,
      showEditUnit: false,
      selectedUnitType: this.propertyUnitType,
      disableUnitType: false
    };
  },
  created() {
    const params = this.$route.params;
    if (this.index === params.unit_type_index) {
      this.unitType = params.unit_type_id;
    } else if (Array.isArray(this.derivedUnits) && this.derivedUnits.length) {
      this.unitType = this.derivedUnits[0].unittype;
    }
  },
  watch: {
    unitType() {
      this.selectedUnitType = this.unitType;
    },
    derivedUnits() {
      this.units = this.derivedUnits;
    },
    async selectedUnitType(newVal, prevVal) {
      const selectedUnitTypes = this.property.unit_types;

      if (
        selectedUnitTypes.some(
          val => val.unit_type_id === this.selectedUnitType
        ) &&
        this.unitType !== this.selectedUnitType
      ) {
        this.$root.$emit("snackbar", {
          text: this.$t("This unit type is already defined for this property"),
          color: "error"
        });
        this.unitType = prevVal;
        await this.$nextTick();
        this.selectedUnitType = prevVal;
        this.disableUnitType = true;
      } else {
        this.addNewUnitType();
        this.disableUnitType = false;
      }
    }
  },
  computed: {
    unitType: {
      set(val) {
        this.$emit("updateUnitType", val);
      },
      get() {
        return this.propertyUnitType;
      }
    },
    headers(){
      return [
        { text: this.$t("Id"), align: "center", sortable: false },
        { text: this.$t("Unit Number"), align: "center", sortable: false },
        { text: this.$t("Floor"), align: "center", sortable: false },
        { text: this.$t("Price"), align: "center", sortable: false },
        { text: this.$t("Discount"), align: !this.$vuetify.rtl ? "left" : "right", sortable: false },
        { text: this.$t("Invoice Amount"), align: "center", sortable: false }
      ]
    },
    unitTypeName() {
      const unit = this.unitTypes.find(ut => ut.id == this.unitType);

      return unit ? unit.unit_type_name : "";
    }
  },
  methods: {
    ...mapActions("property", ["setProperty", "setIndex", "setUnitIndex"]),
    addNewUnitType() {
      this.unitType = this.selectedUnitType;
      this.disableUnitType = false;
    },
    navigateToEdit(id, unit_index) {
      if (id) {
        this.$router.push({ name: "edit_unit", params: { id: id } });

        this.setProperty(this.property);
        this.setIndex(this.index);
        this.setUnitIndex(unit_index);
      } else {
        this.$root.$emit("snackbar", {
          text: this.$t("This is a new added unit"),
          color: "error"
        });
        this.setProperty({});
        this.setIndex(0);
        this.setUnitIndex(0);
      }
    },
    navigateToUnitType() {
      this.$router.push({
        name: "add_unit_type",
        params: { index: this.index }
      });
      this.setProperty(this.property);
      this.setIndex(this.index);
    }
  }
};
</script>

<style lang="css">
.re-discount-type {
  margin-left: 30px !important;
}
</style>

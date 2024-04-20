<template>
  <v-card flat>
    <v-card-text v-if="contract.id">
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
          <v-list-tile-content class="orange-c">{{
            contract.id
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(contract.modified, true)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
          <v-list-tile-content class="orange-c">{{
            contract.initiator
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
          <v-list-tile-content class="orange-c">{{
            contract.tenant_name
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
          <v-list-tile-content>{{
            contract.property_name
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
          <v-list-tile-content>{{ contract.unit_number }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            {{ $t("Contract Reference") }}
          </v-list-tile-content>

          <v-list-tile-content>
            <div v-if="!contract.reference">
              -
            </div>
            <div v-else>
              {{ contract.reference }}
            </div>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("Contract Start Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(contract.contract_start_date)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("Contract End Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(contract.contract_end_date)
          }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { defaultFormat } from "../../helper";

export default {
  name: "contract-dialog",
  props: {
    showDialog: Boolean,
    selectedContract: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: "Label"
    },
    filterType: {
      default: "new_contract",
      type: String
    }
  },
  data() {
    return {
      dialog: this.showDialog,
      contract: {
        tenant: {},
        unit: {},
        property: {}
      }
    };
  },
  computed: {
    isSuspended() {
      return this.filterType === "is_suspended";
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$emit("closeDialog");
      }
    },
    showDialog(value) {
      this.dialog = value;
    },
    selectedContract() {
      this.contract = this.selectedContract;
    }
  },
  methods: {
    formatDates(value, containsTime) {
      return defaultFormat(value, containsTime);
    }
  }
};
</script>

<style scoped>
.headline {
  padding: 0px 25px !important;
  padding-top: 15px !important;
}
.v-list__tile__content {
  flex: 1 1 50% !important;
}
</style>

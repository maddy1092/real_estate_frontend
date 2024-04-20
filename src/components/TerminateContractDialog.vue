<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="420">
      <v-card>
        <v-card-title
          class="headline d-flex justify-space-between form-title"
          primary-title
        >
          <span class="text-start"> {{ $t("Terminate Contract") }} </span>
          <v-icon class="d-flex justify-end" @click="dialog = false">
            close
          </v-icon>
        </v-card-title>

        <v-card-text v-if="selectedContract.id">
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
              <v-list-tile-content class="orange-c">{{
                selectedContract.id
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
              <v-list-tile-content>{{
                formatDate(selectedContract.modified, true)
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
              <v-list-tile-content class="orange-c">{{
                selectedContract.initiator
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Status") }}</v-list-tile-content>
              <v-list-tile-content :class="{ ongoing: false, expired: true }">{{
                selectedContract.status.toLowerCase()
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{
                $t("Property Name")
              }}</v-list-tile-content>
              <v-list-tile-content>{{
                selectedContract.property_name
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
              <v-list-tile-content>{{
                selectedContract.unit_number
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
              <v-list-tile-content class="orange-c">{{
                selectedContract.tenant_name
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
              <v-list-tile-content>{{
                selectedContract.unittype
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{
                $t("Start Date")
              }}</v-list-tile-content>
              <v-list-tile-content>{{
                formatDate(selectedContract.contract_start_date)
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{
                $t("End Date")
              }}</v-list-tile-content>
              <v-list-tile-content>{{
                formatDate(selectedContract.contract_end_date)
              }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>{{
                $t("Termination Date")
              }}</v-list-tile-content>
              <v-list-tile-content>{{
                formatDate(selectedContract.termination_date) || "--"
              }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defaultFormat } from "../helper";

export default {
  name: "terminate-contract-dialog",
  props: ["value", "selectedContract"],
  data() {
    return {
      dialog: this.value
    };
  },
  watch: {
    value() {
      if (this.value) {
        this.dialog = this.value;
      }
    },
    dialog() {
      if (!this.dialog) {
        this.$emit("input", false);
      }
    }
  },
  methods: {
    formatDate(value, addTime) {
      return defaultFormat(value, addTime);
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

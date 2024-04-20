<template>
  <v-dialog v-model="dialog" width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-space-between form-title"
        primary-title
      >
        <span class="text-start">{{ label }}</span>
        <v-icon class="d-flex justify-end" @click="$emit('closeDialog')">
          close
        </v-icon>
      </v-card-title>
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
            <v-list-tile-content>{{ $t("Status") }}</v-list-tile-content>
            <v-list-tile-content
              :class="{
                ongoing: !contract.status.includes('termina'),
                expired:
                  contract.status.includes('termina') ||
                  contract.status.includes('Termina')
              }"
            >
              {{ contract.status }}
            </v-list-tile-content>
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
            <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
            <v-list-tile-content>{{ contract.unittype }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
            <v-list-tile-content>{{
              contract.unit_number
            }}</v-list-tile-content>
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
              $t("Payment Start Date")
            }}</v-list-tile-content>
            <v-list-tile-content>{{
              contract.payment_start_date
                ? formatDates(contract.payment_start_date)
                : "--"
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

          <v-list-tile>
            <v-list-tile-content>{{ $t("Amount") }}</v-list-tile-content>
            <v-list-tile-content>
              {{ parseInt(contract.amount).toFixed(3) }} {{ $t("KD") }}
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              {{ $t("Original Contract Amount") }}
            </v-list-tile-content>
            <v-list-tile-content>
              {{ parseInt(contract.original_amount).toFixed(3) }} {{ $t("KD") }}
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              {{ $t("Insurance Amount") }}
            </v-list-tile-content>

            <v-list-tile-content>
              <div v-if="!contract.insurance_amount">
                -
              </div>
              <div v-else>
                {{ parseInt(contract.insurance_amount).toFixed(3) }}
                {{ $t("KD") }}
              </div>
            </v-list-tile-content>
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
          <!-- Is suspended -->
          <v-list-tile>
            <v-list-tile-content>{{ $t("Is Suspended") }}</v-list-tile-content>
            <v-list-tile-content>
              <v-checkbox v-model="contract.is_suspended" disabled />
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="!isSuspended">
            <v-list-tile-content>{{ $t("Download") }}</v-list-tile-content>
            <v-list-tile-content>
              <div v-if="!contract.attachment">
                -
              </div>
              <v-icon v-else @click="$emit('downloadImage', contract)">
                download
              </v-icon>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
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

<template>
  <v-card>
    <v-card-text>
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
            formatDates(selectedContract.modified, true)
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
          <v-list-tile-content>
            <rent-statuses
              :status="selectedContract.status"
              :showIcon="false"
            />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
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
          <v-list-tile-content>{{ $t("Unit Type") }}</v-list-tile-content>
          <v-list-tile-content>{{
            selectedContract.unittype
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
          <v-list-tile-content class="orange-c">{{
            selectedContract.tenant_name
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("Old Contract Start Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(selectedContract.contract_start_date)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("Old Contract End Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(selectedContract.contract_end_date)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("Old Contract Amount")
          }}</v-list-tile-content>
          <v-list-tile-content
            >{{ parseInt(selectedContract.amount).toFixed(3) }}
            {{ $t("KD") }}</v-list-tile-content
          >
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content :class="{ 'pr-10': $i18n.locale === 'en' }">
            {{ $t("Old Original Contract Amount") }}
          </v-list-tile-content>
          <v-list-tile-content>
            {{ parseInt(selectedContract.original_amount).toFixed(3) }}
            {{ $t("KD") }}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("New Contract Start Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(selectedContract.new_contract_start_date)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("New Contract End Date")
          }}</v-list-tile-content>
          <v-list-tile-content>{{
            formatDates(selectedContract.new_contract_end_date)
          }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{
            $t("New Contract Amount")
          }}</v-list-tile-content>
          <v-list-tile-content
            >{{ parseInt(selectedContract.new_amount).toFixed(3) }}
            {{ $t("KD") }}</v-list-tile-content
          >
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content :class="{ 'pr-10': $i18n.locale === 'en' }">
            {{ $t("New Original Contract Amount") }}
          </v-list-tile-content>
          <v-list-tile-content
            >{{ parseInt(selectedContract.new_original_amount).toFixed(3) }}
            {{ $t("KD") }}</v-list-tile-content
          >
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content style="padding-right: 10px;">
            {{ $t("Contract Reference") }}
          </v-list-tile-content>
          <v-list-tile-content
            >{{ selectedContract.reference || "-" }}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>{{ $t("Download") }}</v-list-tile-content>
          <v-list-tile-content>
            <div v-if="!selectedContract.attachment">
              -
            </div>
            <v-icon
              v-if="selectedContract.attachment"
              @click="$emit('downloadImage', selectedContract)"
              >download</v-icon
            ></v-list-tile-content
          >
        </v-list-tile>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import RentStatuses from "../../components/RentStatuses.vue";
import { defaultFormat } from "../../helper";

export default {
  name: "contract-dialog",
  components: {
    RentStatuses
  },
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

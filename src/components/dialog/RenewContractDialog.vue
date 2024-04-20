<template>
  <v-dialog v-model="dialog" width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-space-between form-title"
        primary-title
      >
        <span class="text-start"> {{ $t("Renew Contract") }} </span>
        <v-icon class="d-flex justify-end" @click="$emit('closeDialog')">
          close
        </v-icon>
      </v-card-title>
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
              formatDate(selectedContract.contract_start_date)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("Old Contract End Date")
            }}</v-list-tile-content>
            <v-list-tile-content>{{
              formatDate(selectedContract.contract_end_date)
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
              formatDate(selectedContract.new_contract_start_date)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{
              $t("New Contract End Date")
            }}</v-list-tile-content>
            <v-list-tile-content>{{
              formatDate(selectedContract.new_contract_end_date)
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
  </v-dialog>
</template>

<script>
import { defaultFormat } from "../../helper";
import RentStatuses from "../RentStatuses.vue";

export default {
  components: { RentStatuses },
  name: "renew-contract-dialog",
  emits: ["closeDialog"],
  props: {
    selectedContract: Object,
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: this.showDialog
    };
  },
  watch: {
    showDialog() {
      this.dialog = this.showDialog;
    },
    dialog(value) {
      if (!value) {
        this.$emit("closeDialog");
      }
    }
  },
  methods: {
    formatDate(date, addTime) {
      return defaultFormat(date, addTime);
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
.pr-10 {
  padding-right: 10px;
}
</style>

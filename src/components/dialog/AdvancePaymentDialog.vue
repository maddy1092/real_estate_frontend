<template>
  <v-dialog v-model="dialog" max-width="420">
    <v-card>
      <v-card-title
        class="headline d-flex justify-center form-title"
        primary-title
      >
        <span class="text-start"> {{ $t("Advance Payment") }} </span>
        <v-icon class="d-flex justify-end" @click="dialog = false">
          close
        </v-icon>
      </v-card-title>

      <v-card-text>
        <v-list dense>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Id") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.id
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Created") }}</v-list-tile-content>
            <v-list-tile-content>{{
              formatDate(selectedPayment.created, true)
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Initiator") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.initiator
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Status") }}</v-list-tile-content>
            <v-list-tile-content :class="{ ongoing: true }">
              {{ selectedPayment.status }}
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Property Name") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.property_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Unit Number") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.unit_number
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Tenant Name") }}</v-list-tile-content>
            <v-list-tile-content class="orange-c">{{
              selectedPayment.tenant_name
            }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>{{ $t("Total Amount") }}</v-list-tile-content>
            <v-list-tile-content>{{
              selectedPayment.total_amount
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
        <div style="padding-inline-start: 18px" class="text-start">
          {{ $t("Paid Months/Year") }}
        </div>
        <v-layout wrap class="check">
          <v-flex
            xs6
            sm6
            v-for="item of selectedPayment.paid_month_year"
            :key="item"
          >
            <v-checkbox
              :label="
                `${item.payment_month}, ${item.payment_year}, ${
                  item.amount
                } ${$t('KD')}`
              "
              input-value="true"
              disabled
              color="grey darken-1"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defaultFormat } from "../../helper";

export default {
  name: "advance-list-dialogue",
  props: ["value", "selectedPayment"],
  emits: ["input"],
  data: () => ({
    dialog: false
  }),
  watch: {
    value(val) {
      if (val) {
        this.dialog = val;
      }
    },
    dialog(val) {
      if (!val) {
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
.v-list__tile__content {
  flex: 1 1 50% !important;
}
</style>

<template>
  <div>
    <v-layout class="mb-4">
      <v-flex md4>
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="re-green-c font-weight-medium">
              {{ $t("Total Paid This Month") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">
              {{
                payment.total_paid
                  ? parseFloat(payment.total_paid).toFixed(3)
                  : "0.000"
              }}
              {{ $t("KWD") }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="re-lime-c font-weight-medium">
              {{ $t("Pending Payments") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">
              {{
                payment.pending_payment
                  ? parseFloat(payment.pending_payment).toFixed(3)
                  : "0.000"
              }}
              {{ $t("KWD") }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="font-weight-medium re-grey-c">
              {{ $t("Total Amount") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">
              {{
                payment.total_amount
                  ? parseFloat(payment.total_amount).toFixed(3)
                  : "0.000"
              }}
              {{ $t("KWD") }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="re-red-c font-weight-medium">
              {{ $t("Late Payments") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">
              {{
                payment.late_payment
                  ? parseFloat(payment.late_payment).toFixed(3)
                  : "0.000"
              }}
              {{ $t("KWD") }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mb-4">
      <v-flex md4>
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="re-green-c font-weight-medium">
              {{ $t("Total Paid Count") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">{{ payment.total_paid_count }}</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="re-lime-c font-weight-medium">
              {{ $t("Total Pending Count") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">{{ payment.pending_payment_count }}</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="font-weight-medium  re-grey-c">
              {{ $t("Total Count") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">{{ payment.total_count }}</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md4 class="ml-2">
        <vue-skeleton-loader
          rounded
          class="w-full"
          type="rect"
          v-if="isLoading"
          :height="'125px'"
          :width="'300px'"
          animation="fade"
        />
        <v-card class="pb-3" v-if="!isLoading">
          <v-toolbar class="re-toolbar re-justify-center" dense>
            <h4 class="font-weight-medium  re-grey-c">
              {{ $t("(Grace, Open, Missed) Amount") }}
            </h4>
          </v-toolbar>
          <v-card-text>
            <div class="re-amount">
              {{ parseFloat(getTotalMissedCounts(payment)).toFixed(3) }}
              {{ $t("KWD") }}
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import otherAmountsMixin from "../../mixins/otherAmountsMixin";

export default {
  name: "cards",
  mixins: [otherAmountsMixin],
  props: {
    payment: Object,
    isLoading: Boolean
  }
};
</script>
<style scoped>
.re-grey-c {
  color: #808080 !important;
}
</style>

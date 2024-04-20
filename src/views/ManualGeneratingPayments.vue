<template>
  <div class="manual-generating-payment">
    <v-layout wrap justify-center>
      <v-flex xs12 sm12 lg10>
        <v-layout>
          <div class="heading">
            <h1 class="pa-1">
              {{ $t("Generate Invoices") }}
            </h1>
            <p class="pl-4">
              {{
                $t(
                  "Easily Generate Invoices by selecting the date of the desired period"
                )
              }}
            </p>
          </div>
        </v-layout>
        <v-layout>
          <v-flex class="flex-wrap" xs12 pa-1>
            <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
              <template v-slot:divider>
                <v-icon>fiber_manual_record</v-icon>
              </template>
            </v-breadcrumbs>
          </v-flex>
        </v-layout>
        <table-loader v-if="isLoading" />
        <v-card v-if="!isLoading">
          <v-layout>
            <div class="filter-controls">
              <div class="left__div">
                <v-menu
                  ref="datePickerMenu"
                  v-model="datePickerMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="selectedDate"
                      readonly
                      v-on="on"
                      class="re-datepicker re-custom-date-picker"
                    >
                      <template v-slot:prepend>
                        <img src="../assets/calendar.svg" />
                      </template>
                    </v-text-field>
                  </template>

                  <v-date-picker
                    v-model="date"
                    type="month"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn flat color="primary" @click="datePickerMenu = false">
                      {{ $t("Cancel") }}
                    </v-btn>
                    <v-btn flat color="primary" @click="showAlert()">{{
                      $t("OK")
                    }}</v-btn>
                  </v-date-picker>
                </v-menu>
                <v-btn class="showbtn" @click="fetchPayments()">{{
                  $t("Show")
                }}</v-btn>
              </div>
              <div class="right__div">
                <v-btn
                  class="printbtn"
                  @click="printPayment"
                  :disabled="
                    !(
                      notGeneratedPaymentList.length ||
                      generatedPaymentList.length
                    )
                  "
                >
                  <img class="m-6 clr-white" src="../assets/printer.svg" />
                  {{ $t("Print") }}
                </v-btn>
                <v-btn
                  class="generatebtn"
                  :disabled="!notGeneratedPaymentList.length"
                  @click="showInvoiceAlert"
                >
                  {{ $t("Generate Invoices and Send Payment Links") }}
                </v-btn>
              </div>
            </div>
          </v-layout>
          <v-layout>
            <div class="reheading-like">
              {{ $t("Not Generated Payments") }}
            </div>
          </v-layout>
          <v-layout
            class="table-container"
            :class="{
              'overflow-data': notGeneratedPaymentList.length > 10
            }"
          >
            <v-data-table
              :headers="headers"
              :items="notGeneratedPaymentList"
              item-key-name="index"
              :no-data-text="$t('No data available')"
              hide-actions
              class="payments"
            >
              <template v-slot:items="props">
                <tr
                  :class="
                    getReportRowColor(
                      props.item,
                      null,
                      props.item.is_last_month_paid
                    )
                  "
                >
                  <td class="text-xs-center" dense>
                    {{ props.item.property_name }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.unit_number }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.id }}
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{
                        props.item.contract_start_date
                          ? defaultFormatted(props.item.contract_start_date)
                          : "-"
                      }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{
                        props.item.contract_end_date
                          ? defaultFormatted(props.item.contract_end_date)
                          : "-"
                      }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{
                        props.item.termination_date
                          ? defaultFormatted(props.item.termination_date)
                          : "-"
                      }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{ props.item.is_last_month_paid ? "Yes" : "No" }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{ props.item.is_suspended ? "Yes" : "No" }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{ props.item.original_amount }} {{ "KD" }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{ props.item.amount }} {{ "KD" }}
                    </div>
                  </td>
                  <td>
                    <v-text-field
                      v-model="props.item.actual_paid_amount"
                      v-validate="`max_value: ${props.item.original_amount}`"
                      :name="`actual_paid_amount_${props.index}`"
                      :data-vv-name="`actual_paid_amount_${props.index}`"
                      class="re-custom-input"
                      :disabled="props.item.is_grace_period"
                    />
                    <span class="red-text">{{
                      errors.collect(`actual_paid_amount_${props.index}`).length
                        ? $t(
                            "Actual paid amount should be less than or equal to the original amount"
                          )
                        : ""
                    }}</span>
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.tenant_name }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.phone_number }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.civil_id }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>
          <v-layout>
            <div class="re-generated-total">
              <div>
                {{ $t("Totals") }}
              </div>
              <ul>
                <li>
                  <span
                    ><span>{{ $t("Count") }}</span
                    >{{ notGeneratedPaymentsTotalCount }}</span
                  >
                </li>
                <li>
                  <span>
                    <span>{{ $t("Original Contract Amount") }}</span
                    >{{
                      notGeneratedPaymentsTotalOriginalAmount
                        ? parseInt(
                            notGeneratedPaymentsTotalOriginalAmount
                          ).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}</span
                  >
                </li>
                <li>
                  <span>
                    <span>{{ $t("Paid Amount") }}</span>
                    {{
                      notGeneratedPaymentsTotalAmount
                        ? parseInt(notGeneratedPaymentsTotalAmount).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Actual Paid Amount") }}</span>
                    {{
                      notGeneratedActualPaidAmount
                        ? parseInt(notGeneratedActualPaidAmount).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Grace Period Amount") }}</span>
                    {{
                      notGeneratedPaymentsTotalGracePeriodAmount
                        ? parseInt(
                            notGeneratedPaymentsTotalGracePeriodAmount
                          ).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
              </ul>
            </div>
          </v-layout>
          <v-layout>
            <div class="border"></div>
          </v-layout>
          <v-layout>
            <div class="reheading-like">
              {{ $t("Generated Payments") }}
            </div>
          </v-layout>
          <v-layout
            class="table-container"
            :class="{
              'overflow-data': generatedPaymentList.length > 10
            }"
          >
            <v-data-table
              :headers="headers"
              :items="generatedPaymentList"
              hide-actions
              :no-data-text="$t('No data available')"
              class="payments"
            >
              <template v-slot:items="props">
                <tr
                  :class="
                    getReportRowColor(
                      props.item,
                      null,
                      props.item.is_last_month_paid
                    )
                  "
                >
                  <td class="text-xs-center" dense>
                    {{ props.item.property_name }}
                  </td>
                  <td dense>
                    {{ props.item.unit_number }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.id }}
                  </td>

                  <td class="text-xs-center" dense>
                    {{
                      props.item.contract_start_date
                        ? defaultFormatted(props.item.contract_start_date)
                        : "-"
                    }}
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{
                        props.item.contract_end_date
                          ? defaultFormatted(props.item.contract_end_date)
                          : "-"
                      }}
                    </div>
                  </td>
                  <td class="text-xs-center" dense>
                    {{
                      props.item.termination_date
                        ? defaultFormatted(props.item.termination_date)
                        : "-"
                    }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.is_last_month_paid ? "Yes" : "No" }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.is_suspended ? "Yes" : "No" }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.original_amount || "0.000" }} {{ $t("KD") }}
                  </td>
                  <td class="text-xs-center" dense>
                    <div class="re-width-70">
                      {{
                        parseInt(props.item.paid_amount).toFixed(3) || "0.000"
                      }}
                      {{ $t("KD") }}
                    </div>
                  </td>
                  <td class="text-xs-center">
                    {{ parseInt(props.item.amount).toFixed(3) || "0.000" }}
                    {{ $t("KD") }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.tenant_name }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.phone_number }}
                  </td>
                  <td class="text-xs-center" dense>
                    {{ props.item.civil_id }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>

          <v-layout>
            <div class="re-generated-total">
              <div>
                {{ $t("Totals") }}
              </div>
              <ul>
                <li>
                  <span
                    ><span>{{ $t("Count") }} </span
                    ><span class="ml-5">{{
                      generatedPaymentsTotalCount
                    }}</span></span
                  >
                </li>
                <li>
                  <span>
                    <span>{{ $t("Original Contract Amount") }} </span>
                    {{
                      generatedPaymentsTotalOriginalAmount
                        ? parseInt(
                            generatedPaymentsTotalOriginalAmount
                          ).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Paid Amount") }} </span>
                    {{
                      generatedPaymentsTotalPaidAmount
                        ? parseInt(generatedPaymentsTotalPaidAmount).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Actual Paid Amount") }} </span>
                    {{
                      generatedPaymentsTotalAmount
                        ? parseInt(generatedPaymentsTotalAmount).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Grace Period Amount") }}</span>
                    {{
                      generatedPaymentsTotalGracePeriodAmount
                        ? parseInt(
                            generatedPaymentsTotalGracePeriodAmount
                          ).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
                <li>
                  <span>
                    <span>{{ $t("Missed Invoices Amount") }}</span>
                    {{
                      generatedPaymentsTotalMissedInvoicesAmount
                        ? parseInt(
                            generatedPaymentsTotalMissedInvoicesAmount
                          ).toFixed(3)
                        : "0.000"
                    }}
                    {{ $t("KD") }}
                  </span>
                </li>
              </ul>
            </div>
          </v-layout>
          <color-details />
        </v-card>
      </v-flex>
    </v-layout>

    <template>
      <div class="text-xs-center">
        <confirmation-dialog
          v-model="alert"
          :label="$t('Confirmation')"
          :message="
            $t(
              'Manual payment records will be reset. Are you sure you want to continue'
            )
          "
          @acceptDialog="confirmDialog"
          @closeDialog="dialog = false"
        />
      </div>
    </template>

    <template>
      <div class="text-xs-center">
        <confirmation-dialog
          v-model="invoiceAlert"
          :label="$t('Confirmation')"
          :message="$t('Are you sure that you want to generate the invoices')"
          @acceptDialog="generatePayments"
          @closeDialog="dialog = false"
        />
      </div>
    </template>
  </div>
</template>

<script>
import ColorDetails from "../components/ColorDetails";
import ConfirmationDialog from "../components/dialog/ConfirmationDialog.vue";
import { defaultFormat } from "../helper";
import invoices from "../services/plugins/invoices";
import TableLoader from "../views/loaders/TableLoader";
import "../assets/styles.css";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import colorMixin from "@/mixins/colorMixin";
import generatedReport from "@/services/plugins/generated_report";

export default {
  name: "ManualGeneratingPayments",
  components: { TableLoader, ConfirmationDialog, ColorDetails },
  mixins: [breadItemsSetLang, colorMixin],
  data() {
    return {
      isLoading: false,
      dialog: false,
      alert: false,
      invoiceAlert: false,
      date: new Date().toISOString().slice(0, 7),
      selectedDate: new Date().toISOString().slice(0, 7),
      datePickerMenu: false,

      notGeneratedActualPaidAmount: 0.0,

      generatedPaymentsTotalCount: 0,
      generatedPaymentsTotalPaidAmount: 0.0,
      generatedPaymentsTotalAmount: 0.0,
      generatedPaymentsTotalOriginalAmount: 0.0,
      generatedPaymentsTotalGracePeriodAmount: 0.0,
      generatedPaymentsTotalMissedInvoicesAmount: 0.0,

      notGeneratedPaymentsTotalAmount: 0.0,
      notGeneratedPaymentsTotalCount: 0.0,
      notGeneratedPaymentsTotalOriginalAmount: 0.0,
      notGeneratedPaymentsTotalGracePeriodAmount: 0.0,

      generatedPaymentList: [],
      notGeneratedPaymentList: []
    };
  },
  watch: {
    notGeneratedPaymentList: {
      deep: true,
      handler() {
        this.notGeneratedActualPaidAmount = this.notGeneratedPaymentList.reduce(
          (result, payment) => {
            return (
              result +
              parseInt(payment.is_grace_period ? 0 : payment.actual_paid_amount)
            );
          },
          0
        );
      }
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Property"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Unit"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract No."),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Start Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("End Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Termination Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Last Month Paid"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Suspended"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Original AMT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Paid AMT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Actual Paid AMT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Tenant Name"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Phone"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Civil ID"),
          align: "center",
          sortable: false
        }
      ];
    }
  },
  methods: {
    defaultFormatted(value) {
      return defaultFormat(value);
    },
    closeDialog() {
      this.dialog = false;
    },
    showAlert() {
      this.alert = true;
    },
    showInvoiceAlert() {
      this.invoiceAlert = true;
    },
    confirmDialog() {
      this.selectedDate = this.date;
      this.fetchPayments();
    },

    async fetchPayments(showLoading) {
      try {
        if (!showLoading) {
          this.isLoading = true;
        }
        const params = {
          payment_month: this.selectedDate.slice(5, 7),
          payment_year: this.selectedDate.slice(0, 4)
        };

        this.resetPayments();

        const generatedPaymentResp = await this.$processReq(
          invoices.fetchGeneratedPaymentsList(params),
          false
        );

        this.generatedPaymentList = generatedPaymentResp.data.body.results;
        this.generatedPaymentsTotalCount = generatedPaymentResp.data.body.count;
        this.generatedPaymentsTotalAmount =
          generatedPaymentResp.data.body.total_amount;
        this.generatedPaymentsTotalOriginalAmount =
          generatedPaymentResp.data.body.total_original_amount;
        this.generatedPaymentsTotalPaidAmount =
          generatedPaymentResp.data.body.total_paid_amount;
        this.generatedPaymentsTotalGracePeriodAmount =
          generatedPaymentResp.data.body.total_amount_grace_period;
        this.generatedPaymentsTotalMissedInvoicesAmount =
          generatedPaymentResp.data.body.total_amount_missed_invoices;

        const notGeneratedPaymentResp = await this.$processReq(
          invoices.fetchNotGeneratedPaymentsList(params),
          false
        );

        const notGeneratedPaymentList =
          notGeneratedPaymentResp.data.body.results;
        this.notGeneratedPaymentsTotalCount =
          notGeneratedPaymentResp.data.body.count;
        this.notGeneratedPaymentsTotalAmount =
          notGeneratedPaymentResp.data.body.total_amount;
        this.notGeneratedPaymentsTotalOriginalAmount =
          notGeneratedPaymentResp.data.body.total_original_amount;
        this.notGeneratedPaymentsTotalGracePeriodAmount =
          notGeneratedPaymentResp.data.body.total_amount_grace_period;

        this.notGeneratedPaymentList = notGeneratedPaymentList.map(
          notGeneratedPayment => {
            return {
              ...notGeneratedPayment,
              actual_paid_amount: notGeneratedPayment.amount
            };
          }
        );
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to fetch payment list - ", err);
      }
    },

    async generatePayments() {
      if (await this.$validator.validateAll()) {
        try {
          this.isLoading = true;

          const contracts_payments_data_list = this.notGeneratedPaymentList.map(
            notGeneratedPayment => ({
              contract_id: notGeneratedPayment.id,
              paid_amount: notGeneratedPayment.amount,
              amount: notGeneratedPayment.actual_paid_amount,
              is_grace_period: notGeneratedPayment.is_grace_period
            })
          );

          const params = {
            payment_month: this.selectedDate.slice(5, 7),
            payment_year: this.selectedDate.slice(0, 4),
            contracts_payments_data_list
          };

          await this.$processReq(invoices.createPayments(params), false);

          this.$root.$emit("snackbar", {
            text: this.$t("Your request is in progress"),
            color: "info"
          });

          this.resetNotGeneratedPayments();

          this.isLoading = false;
        } catch (err) {
          this.isLoading = false;
          console.log("Error: Unable to generate payment - ", err);
        }
      } else {
        this.$root.$emit("snackbar", {
          text: this.$t(
            "Actual paid amount should be less than or equal to the maximum contract amount"
          ),
          color: "error"
        });
      }
    },
    resetNotGeneratedPayments() {
      this.notGeneratedPaymentList = [];
      this.notGeneratedPaymentsTotalAmount = 0.0;
      this.notGeneratedPaymentsTotalCount = 0.0;
      this.notGeneratedPaymentsTotalOriginalAmount = 0.0;
    },
    resetPayments() {
      this.generatedPaymentList = [];
      this.generatedPaymentsTotalAmount = 0.0;
      this.generatedPaymentsTotalCount = 0.0;
      this.generatedPaymentsTotalOriginalAmount = 0.0;
      this.generatedPaymentsTotalPaidAmount = 0.0;

      this.notGeneratedPaymentList = [];
      this.notGeneratedPaymentsTotalAmount = 0.0;
      this.notGeneratedPaymentsTotalCount = 0.0;
      this.notGeneratedPaymentsTotalOriginalAmount = 0.0;

      this.datePickerMenu = false;
    },
    async printPayment() {
      this.isLoading = true;
      try {
        const contracts_actual_paid_amount = this.notGeneratedPaymentList.map(
          notGeneratedPayment => {
            return {
              contract_id: notGeneratedPayment.id,
              actual_paid_amount: notGeneratedPayment.actual_paid_amount
            };
          }
        );

        const data = {
          file_format: "pdf",
          payment_month: this.selectedDate.slice(5, 7),
          payment_year: this.selectedDate.slice(0, 4),
          contracts_actual_paid_amount
        };

        await this.$processReq(generatedReport.printPayments(data), false);

        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Payments are being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to print payment - ", err);
      }
    }
  }
};
</script>

<style scoped>
img {
  margin: 6px;
}
.ml-5 {
  margin-left: 5px !important;
}

.re-width-70 {
  width: 70px !important;
}

.text-xs-center {
  padding: 0 12px !important;
}
.text-white >>> .v-text-field__slot input {
  color: white !important;
}
</style>

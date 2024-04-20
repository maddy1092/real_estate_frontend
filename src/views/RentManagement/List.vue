<template>
  <div class="rent-managmement">
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <rent-header v-model="filter" />
          <cards :payment="payments" :isLoading="isLoading" />
          <table-loader v-if="isLoading" />
          <v-card v-show="!isLoading">
            <table-header
              :payment="payments"
              :limit="limit"
              :page="page"
              :totalCount="totalCount"
              @search="searchInput($event, true)"
              @loadSearch="searchInput"
              @changeRow="changeRow"
              :exportRent="exportRent"
              :printRent="printRent"
              :showDialog="showDialog"
              :search="search"
            />
            <v-layout style="overflow:auto" class="container__div">
              <div class="listing__table text-bold">
                <v-data-table
                  hide-actions
                  :items="payments.data_list"
                  :expand="expand"
                  item-key="property_id"
                  :no-data-text="$t('No data available')"
                  :headers="topHeader"
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td
                        class="re-orange"
                        :class="{ 'text-xs-center': $i18n.locale === 'ar' }"
                      >
                        <strong>{{ props.item.property_name }}</strong>
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_paid_amount
                            ? parseFloat(props.item.total_paid_amount).toFixed(
                                3
                              )
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_pending_amount
                            ? parseFloat(
                                props.item.total_pending_amount
                              ).toFixed(3)
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_amount
                            ? parseFloat(props.item.total_amount).toFixed(3)
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_late_amount
                            ? parseFloat(props.item.total_late_amount).toFixed(
                                3
                              )
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_paid_count
                            ? parseFloat(props.item.total_paid_count).toFixed(3)
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_pending_count
                            ? parseFloat(
                                props.item.total_pending_count
                              ).toFixed(3)
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          props.item.total_count
                            ? parseFloat(props.item.total_count).toFixed(3)
                            : "0.000"
                        }}
                      </td>
                      <td :class="{ 'text-xs-center': $i18n.locale === 'ar' }">
                        {{
                          parseFloat(getTotalMissedCounts(props.item)).toFixed(
                            3
                          )
                        }}
                        {{ $t("KWD") }}
                      </td>
                      <td class="text-xs-center">
                        <button @click="props.expanded = !props.expanded">
                          <img
                            v-if="props.expanded"
                            src="@/assets/downArrow.svg"
                          />
                          <img v-else src="@/assets/upArrow.svg" />
                        </button>
                      </td>
                    </tr>
                  </template>
                  <template v-slot:expand="props">
                    <v-card flat>
                      <v-card-text>
                        <v-data-table
                          :headers="headers1"
                          :items="props.item.tenants"
                          :custom-sort="sortData"
                          :expand="expand"
                          :no-data-text="$t('No data available')"
                          item-key="unit_number"
                          hide-actions
                          class=""
                        >
                          <template v-slot:items="data">
                            <tr
                              :class="
                                getRowColor(data.item, null, null, false, true)
                              "
                            >
                              <td class="text-xs-center">
                                {{ data.item.unit_number }}
                              </td>
                              <td class="text-xs-center">
                                {{ data.item.tenant_name }}
                              </td>
                              <td class="text-xs-center">
                                {{ data.item.civil_id }}
                              </td>
                              <td class="text-xs-center">
                                {{ data.item.phone_number }}
                              </td>
                              <td class="text-xs-center">
                                <rent-statuses
                                  :status="data.item.payment_status"
                                />
                              </td>

                              <td class="text-xs-center">
                                {{ data.item.rent_amount }}
                              </td>
                              <td class="text-xs-center">
                                {{ formatDates(data.item.payment_date) }}
                              </td>
                              <td class="text-xs-center">
                                {{ data.item.is_manual_payment ? "Yes" : "No" }}
                              </td>

                              <td class="text-xs-center">
                                {{ data.item.receipt_voucher_reference || "-" }}
                              </td>
                              <td
                                class="d-flex justify-space-around align-center"
                              >
                                <v-menu offset-y>
                                  <template v-slot:activator="{ on }">
                                    <img
                                      v-on="on"
                                      class="actions"
                                      src="@/assets/dotedVertical.svg"
                                    />
                                  </template>
                                  <v-list>
                                    <v-list-tile
                                      v-for="(action, index) in actions"
                                      :key="index"
                                      :disabled="
                                        checkDisabled(
                                          action,
                                          data.item,
                                          props.item
                                        )
                                      "
                                      @click="
                                        perfomAction(
                                          action,
                                          data.item,
                                          props.item
                                        )
                                      "
                                    >
                                      <v-list-tile-title>{{
                                        action.title
                                      }}</v-list-tile-title>
                                    </v-list-tile>
                                  </v-list>
                                </v-menu>
                                <button
                                  class="more-details"
                                  @click="data.expanded = !data.expanded"
                                  :class="{
                                    active: data.expanded,
                                    black_color: data.item.is_grace_period
                                  }"
                                >
                                  {{ $t("More Details") }}
                                </button>
                              </td>
                            </tr>
                          </template>
                          <template v-slot:expand="props">
                            <v-card flat>
                              <v-card-text>
                                <v-data-table
                                  :headers="headers2"
                                  :items="[props.item]"
                                  :no-data-text="$t('No data available')"
                                  item-key="contract_id"
                                  hide-actions
                                  class="most-inner-datatable"
                                >
                                  <template v-slot:items="props">
                                    <tr>
                                      <td class="text-xs-center">
                                        {{ props.item.contract_id }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          props.item.is_late_payment
                                            ? "Yes"
                                            : "No"
                                        }}
                                      </td>

                                      <td class="text-xs-center">
                                        {{
                                          props.item.is_suspended ? "Yes" : "No"
                                        }}
                                      </td>

                                      <td class="text-xs-center">
                                        {{ props.item.floor }}
                                      </td>

                                      <td class="text-xs-center">
                                        {{ props.item.email }}
                                      </td>
                                    </tr>
                                  </template>
                                </v-data-table>
                              </v-card-text>
                            </v-card>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </template>
                </v-data-table>
              </div>
            </v-layout>
          </v-card>
          <v-card>
            <color-details />
          </v-card>

          <div class="overflow-hidden text-xs-center pt-4">
            <v-pagination
              v-model="page"
              :length="pages"
              :total-visible="10"
              class="re-pagination"
              @input="fetchPayment(false)"
            ></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <confirmation-dialog
      v-model="dialog"
      :label="$t('Confirmation')"
      :message="
        $t('Are you sure that you want to send reminder notifications?')
      "
      @acceptDialog="notifyPayments"
      @closeDialog="dialog = false"
    />
  </div>
</template>

<script>
import moment from "moment";

import "@/assets/listingStyles.css";
import ColorDetails from "../../components/ColorDetails";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
import RentStatuses from "../../components/RentStatuses.vue";
import colorMixin from "../../mixins/colorMixin";
import otherAmountsMixin from "../../mixins/otherAmountsMixin";
import TableLoader from "../../views/loaders/TableLoader";

import { defaultFormat } from "@/helper/index.js";
import { getPaymentReminder } from "@/services/common";
import generatedReport from "@/services/plugins/generated_report";
import paymentService from "@/services/plugins/payment";
import Cards from "@/views/RentManagement/Cards.vue";
import RentHeader from "@/views/RentManagement/Header.vue";
import TableHeader from "@/views/RentManagement/TableHeader.vue";

export default {
  name: "RentMangement",
  mixins: [colorMixin, otherAmountsMixin],
  props: {
    source: String
  },
  components: {
    ConfirmationDialog,
    RentHeader,
    RentStatuses,
    Cards,
    TableHeader,
    TableLoader,
    ColorDetails
  },
  data() {
    return {
      isLoading: true,
      dialog: false,
      page: 1,
      limit: 10,
      search: {},
      payments: [],
      filter: "",
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10
      },
      totalCount: 0,
      menu: false,
      expand: true,
      row: "",
      on: {}
    };
  },
  async created() {
    try {
      await this.fetchPayment();
    } catch (err) {
      console.log("Error: Unable to fetch payment - ", err);
    }
  },
  watch: {
    filter() {
      this.fetchPayment();
    },
    "$i18n.locale": function() {
      this.fetchPayment();
    }
  },
  computed: {
    actions() {
      return [
        {
          title: this.$t("Manual Payment"),
          value: "manual",
          route: "manual_payment"
        },
        {
          title: this.$t("Payment Reminder"),
          value: "reminder",
          route: "payment_reminder"
        }
      ];
    },
    topHeader() {
      return [
        {
          text: this.$t("Property"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Total Paid"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Pending Payments"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Total Amount"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Late Payment"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Paid Count"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },

        {
          text: this.$t("Pending Count"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("Total Count"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: this.$t("(Grace, Open, Missed) Amount"),
          align: this.$i18n.locale === "ar" ? "center" : "left",
          sortable: false
        },
        {
          text: "",
          sortable: false
        }
      ];
    },
    headers1() {
      return [
        {
          text: this.$t("Unit"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Tenant Name"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Civil Id"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Phone"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Payment Status"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Rent Amount"),
          align: "center",
          sortable: false
        },

        {
          text: this.$t("Payment Date"),
          align: "center",
          sortable: false
        },

        {
          text: this.$t("Is Manual"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Voucher Number"),
          align: "center",
          sortable: false
        },
        {
          text: "",
          align: "center",
          sortable: false
        }
      ];
    },
    headers2() {
      return [
        {
          text: this.$t("Contract Id"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Is Late Payment"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Is Suspended"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Floor"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Email"),
          align: "center",
          sortable: false
        }
      ];
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  methods: {
    sortData(arr) {
      let newarray = [];
      newarray = arr.sort((a, b) => a.unit_number - b.unit_number);
      return newarray;
    },
    formatDates(value) {
      return defaultFormat(value);
    },
    checkDisabled(item, tenant) {
      if (
        item.value === "manual" &&
        (!tenant.can_pay_manual_payment ||
          tenant.payment_status.toLowerCase() === "paid")
      ) {
        return true;
      } else if (
        item.value === "new_payment" &&
        tenant.payment_status.toLowerCase() !== "expired"
      ) {
        return true;
      } else if (item.value === "reminder" && !tenant.can_send_reminder) {
        return true;
      } else if (tenant.is_grace_period) {
        return true;
      }
      return false;
    },
    async perfomAction(item, tenant, property) {
      if (item.value === "manual") {
        this.$router.push({
          name: item.route,
          params: {
            isRent: true,
            property: {
              property_id: property.property_id,
              unit_id: tenant.unit_id
            },
            tenant_id: tenant.tenant_id,
            payment_month: tenant.payment_month,
            payment_year: tenant.payment_year
          }
        });
      }

      if (item.value === "reminder" && tenant.can_send_reminder === true) {
        try {
          this.isLoading = true;
          await this.$processReq(
            getPaymentReminder(tenant.extra_data.payment_id)
          );
          this.isLoading = false;
        } catch (err) {
          this.isLoading = false;
          console.log("Error: Unable to sent payment link reminder - ", err);
          return;
        }
      }
    },
    changeRow(row) {
      this.row = row;
      this.fetchPayment();
    },
    async exportRent() {
      this.isLoading = true;
      try {
        let data = {
          file_format: "xls",
          payment_month: this.getMonth(this.search.payment_month) || null,
          payment_year: this.search.payment_year,
          is_manual_payment: this.search.is_manual_payment ? true : undefined,
          is_missed: this.search.is_missed ? true : undefined,
          is_open_balance: this.search.is_open_balance ? true : undefined,
          is_late_payment: this.search.is_late_payment ? true : undefined,
          is_suspended: this.search.is_suspended ? true : undefined,
          status: this.search.status || undefined,
          property: this.search.contract__property,
          search: this.search.search,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        };
        if (this.row === "show-all") {
          data = {
            ...data,
            limit: this.totalCount,
            offset: 0
          };
        }

        await this.$processReq(generatedReport.exportRent(data), false);
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Report is being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
      }
    },
    showDialog() {
      this.dialog = true;
    },
    getMonth(month) {
      if (Number(month) > 0 && Number(month) < 13) return month;

      return moment()
        .month(month)
        .format("M");
    },
    async notifyPayments() {
      this.isLoading = true;
      try {
        const params = {
          month: this.getMonth(this.search.payment_month) || null,
          year: this.search.payment_year
        };
        const response = await this.$processReq(
          paymentService.notifyPayments(params),
          false
        );
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t(
            response.data?.body["Under Processing"] ||
              "Payment records are being notified"
          ),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
      }
    },
    async printRent(search) {
      this.isLoading = true;
      try {
        let data = {
          ...search,
          file_format: "pdf",
          payment_month: this.getMonth(search.payment_month) || null,
          status: search.status || undefined,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        };
        await this.$processReq(generatedReport.printRent(data), false);
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("PDF is being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
      }
    },
    searchInput(search, load) {
      this.search = search;
      this.fetchPayment(load);
    },
    async fetchPayment(blockLoading) {
      try {
        this.menu = false;
        if (!blockLoading) {
          this.isLoading = true;
        }

        let search = this.search;
        if (search.payment_month) {
          search = {
            ...search,
            payment_month: this.getMonth(search.payment_month)
          };
        }

        let params = {
          ...search,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        };

        if (this.row === "show-all") {
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }

        if (this.filter) {
          params = {
            ...params,
            status: this.filter
          };
        }
        const list = await this.$processReq(
          paymentService.getPaymentList(params),
          false
        );
        this.isLoading = false;
        const response = list.data.body;
        this.payments = response.results;
        this.search.payment_month = this.payments.last_payment_month;
        this.search.payment_year = this.payments.last_payment_year;

        this.pagination = {
          ...this.pagination,
          totalItems: response.count,
          page: this.pagination.page > 0 ? this.pagination.page : 1,
          rowsPerPage: this.row !== "" ? response.count : 10
        };

        if (this.totalCount <= response.count) {
          this.totalCount = response.count;
        }

        if (this.row === "show-all") {
          this.pagination = {
            ...this.pagination,
            rowsPerPage: this.totalCount
          };
          this.sortBy = {
            ...this.sortBy,
            rowsPerPage: this.totalCount
          };
        }
      } catch (err) {
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while fetching results"),
          color: "error"
        });
        console.log("Error: Unable to get payment list - ", err);
      }
    }
  }
};
</script>
<style>
.re-width-70 {
  width: 70px !important;
}
</style>

<style scoped>
.actions {
  padding-bottom: 2px;
  height: 30px;
  width: 30px;
}
::v-deep .v-btn .v-btn__content .v-icon {
  color: inherit !important;
}

.orangeRow {
  background-color: orange !important;
}
.greenRow {
  background-color: lightgreen !important;
}
::v-deep .highlight-text-is-missed:hover {
  background-color: #302f37 !important;
}

::v-deep .text-bold th {
  font-weight: bold;
}
.black_color {
  background-color: black !important;
}
</style>

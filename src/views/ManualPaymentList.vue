<template>
  <div class="ManualPaymentList">
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <v-layout class="pt-5" row wrap>
            <v-flex grow pa-1 xs12 sm5 md8>
              <v-layout align-start wrap>
                <v-flex xs6 sm4>
                  <h2 class="display-2">{{ $t("Manual Payment List") }}</h2>
                </v-flex>
                <v-flex xs6 sm8>
                  <v-select
                    :items="paymentStatuses"
                    :label="$t('All')"
                    solo
                    class="re-rent w-100"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout class="re-mm-24">
            <v-flex>
              <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
                <template v-slot:divider>
                  <v-icon>fiber_manual_record</v-icon>
                </template>
              </v-breadcrumbs>
            </v-flex>
          </v-layout>
          <table-loader v-if="isLoading" />
          <v-card v-show="!isLoading">
            <v-toolbar class="re-toolbar re-wrap">
              <div class="re-flex">
                {{ $t("Rows Per Page") }}
                <v-radio-group
                  v-model="row"
                  row
                  class="re-radios"
                  @change="fetchPayments(false)"
                  ><v-radio :label="$t('All')" value="show-all"></v-radio>
                </v-radio-group>
              </div>

              <v-spacer />
              <v-text-field
                hide-details
                :placeholder="$t('Search')"
                outline
                class="search-field"
                v-model="search"
                single-line
                @input.native="fetchPayments"
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>
              <contract-list-filter
                v-model="filter"
                filterType="manual_payment"
                @fetchResult="fetchPayments"
              />
            </v-toolbar>
            <v-layout style="overflow:auto" class="container__div">
              <div class="listing__table">
                <v-data-table
                  hide-actions
                  :items="payments"
                  :expand="expand"
                  item-key="id"
                  :no-data-text="$t('No data available')"
                  :pagination.sync="sortBy"
                  :options.sync="pagination"
                  :server-items-length="pagination.totalItems"
                  :headers="topHeaders"
                  class=""
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td
                        @click="showDialog(props.item)"
                        class="text-xs-center actions re-orange-color"
                      >
                        <div>{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ formatDate(props.item.created) }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.initiator }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.tenant_name }}</div>
                      </td>

                      <td class="text-xs-center">
                        {{ props.item.property_name }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.unit_number }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.payment_month }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.payment_year }}
                      </td>
                      <td class="text-xs-center">
                        {{ parseInt(props.item.amount).toFixed(3) }}
                        {{ $t("KD") }}
                      </td>
                      <td>
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
                              @click="showAlert(props.item)"
                            >
                              <v-list-tile-title>{{
                                action.title
                              }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
            </v-layout>
          </v-card>
          <div class="overflow-hidden text-xs-center pt-4" v-if="!isLoading">
            <v-pagination
              v-model="pagination.page"
              :length="pages"
              :total-visible="10"
              class="re-pagination"
              @input="fetchPayments(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <manual-payment-dialog
          :showDialog="dialog"
          :selectedPayment="selectedPayment"
          @closeDialog="dialog = false"
        />
      </div>
    </template>

    <template>
      <div class="text-xs-center">
        <confirmation-dialog
          v-model="alert"
          :label="$t('Confirmation')"
          :message="
            $t('Are you sure that you want to roll back the manual payment?')
          "
          @acceptDialog="acceptDialog"
          @closeDialog="dialog = false"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty } from "lodash";

import ConfirmationDialog from "../components/dialog/ConfirmationDialog.vue";
import ManualPaymentDialog from "../components/dialog/ManualPaymentDialogue.vue";
import { ContractEnums } from "../enums";
import { formatDateForList } from "../helper";
import { transformContractFilter } from "../helper/filters";
import logs from "../services/plugins/logs";

import ContractListFilter from "./contracts/List/ContractListFilter.vue";
import TableLoader from "./loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "ManualPaymentList",
  components: {
    ContractListFilter,
    ManualPaymentDialog,
    TableLoader,
    ConfirmationDialog
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      selectedPaymentId: 0,
      drawer: null,
      menu: false,
      alert: false,
      dialog: false,
      row: "",
      filter: {},
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      search: "",
      selectedPayment: {},
      payments: [],
      totalCount: 0,
      isLoading: false
    };
  },
  created() {
    this.fetchPayments();
  },
  computed: {
    topHeaders() {
      return [
        {
          id: 1,
          text: this.$t("ID"),
          align: "center",
          value: "id",
          desc: false,
          sortable: true
        },
        {
          id: 2,
          text: this.$t("Created"),
          align: "center",
          value: "created",
          desc: false,
          sortable: true
        },
        {
          id: 3,
          text: this.$t("Initiator"),
          align: "center",
          value: "history_user__username",
          desc: false,
          sortable: true
        },
        {
          id: 5,
          text: this.$t("Tenant Name"),
          align: "center",
          value: "tenant__tenant_name",
          desc: false,
          sortable: true
        },
        {
          text: this.$t("Property Name"),
          value: "property__property_name",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Unit Number"),
          value: "unit__unit_number",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Month"),
          value: "month",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Year"),
          value: "year",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Amount"),
          value: "amount",
          align: "center",
          sortable: false
        },
        {
          text: "",
          align: "center",
          value: "",
          sortable: false
        }
      ];
    },
    actions() {
      return [
        {
          title: this.$t("Manual Payment Roll back"),
          value: "manual_payment_rollback",
          route: ""
        }
      ];
    },
    paymentStatuses() {
      return [
        this.$t("All"),
        this.$t("Paid"),
        this.$t("Pending"),
        this.$t("Late")
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
    },
    order() {
      return this.sortBy.descending;
    }
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchPayments();
    },
    order() {
      this.fetchPayments(false);
    }
  },
  methods: {
    resetFlags(id) {
      switch (id) {
        case 1:
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[4].desc = false;
          break;
        case 2:
          this.topHeaders[1].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[4].desc = false;
          break;
        case 3:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[4].desc = false;
          break;
        case 4:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
      }
    },
    sortData(headers) {
      this.resetFlags(headers.id);

      this.sortBy.sortBy = headers.value;
      headers.desc = !headers.desc;
      this.sortBy.descending = !this.sortBy.descending;
      this.fetchPayments(false);
    },
    showDialog(item) {
      this.dialog = true;
      this.selectedPayment = item;
    },
    acceptDialog() {
      this.dialog = false;
      this.manualPaymentRollBack();
    },
    showAlert(payment) {
      this.selectedPaymentId = payment.id;
      this.alert = true;
    },
    formatDate(value) {
      return formatDateForList(value);
    },
    async manualPaymentRollBack() {
      try {
        this.isLoading = true;
        await this.$processReq(
          logs.manualPaymentRollback(this.selectedPaymentId)
        );
        this.fetchPayments(false);
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to delete contract - ", error);
      }
    },
    async fetchPayments(data) {
      if (this.call) return;
      try {
        if (!data) {
          this.isLoading = true;
        }
        let params = {
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || "",
          ordering: !this.sortBy.descending
            ? this.sortBy.sortBy
            : `-${this.sortBy.sortBy}`
        };

        if (this.row === "show-all") {
          this.payments = [];
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }

        if (!isEmpty(this.filter)) {
          params = {
            ...params,
            ...transformContractFilter(this.filter, true)
          };
        }
        const resp = await this.$processReq(
          logs.fetchPaymentList(ContractEnums.ManualPayment, params),
          false
        );

        this.payments = resp.data.body.results;
        this.isLoading = false;
        this.pagination = {
          ...this.pagination,
          totalItems: resp.data.body.count,
          page: this.pagination.page > 0 ? this.pagination.page : 1,
          rowsPerPage: this.row !== "" ? resp.data.body.count : 10
        };

        if (this.totalCount <= resp.data.body.count) {
          this.totalCount = resp.data.body.count;
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
        console.log("Error: Unable to fetch payment list - ", err);
      }
    }
  }
};
</script>

<style scoped>
::v-deep .v-btn .v-btn__content .v-icon {
  color: inherit !important;
}
.v-dialog {
  max-width: 420px !important;
}
.list-item {
  padding-top: 7px !important;
  padding-bottom: 0px !important;
  border-bottom: 0px !important;
}
.row-pointer:hover {
  cursor: pointer !important;
}
.display-2 {
  width: 19rem;
}
span {
  margin-right: 5px;
}
.text-align-center {
  text-align: center;
}
</style>

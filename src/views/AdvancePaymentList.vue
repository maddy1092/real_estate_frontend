<template>
  <div class="advance-payment">
    <v-layout wrap justify-center>
      <v-layout wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <v-layout class="pt-5" wrap>
            <v-flex grow pa-1 xs10 sm7 md8>
              <v-layout align-start wrap>
                <v-flex xs6 sm4>
                  <h2 class="display-2">{{ $t("Advance Payment List") }}</h2>
                </v-flex>
                <v-flex xs6 sm8>
                  <v-select
                    :items="items3"
                    label="All"
                    solo
                    class="re-rent w-100"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1 xs2 sm5 md4 class="re-rel-pos text-xs-right">
              <v-btn fab small outline v-on="on" class="re-abs-pos">
                <v-icon>history</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout class="re-mm-24 n-margin-left">
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
                  class="re-radios"
                  @change="fetchPayments(false)"
                >
                  <v-radio label="all" value="show-all"></v-radio>
                </v-radio-group>
              </div>
              <v-spacer />
              <v-text-field
                v-model="search"
                hide-details
                :placeholder="$t('Search')"
                single-line
                @input.native="fetchPayments"
              />

              <v-spacer />

              <contract-list-filter
                v-model="filter"
                filterType="advance_payment"
                @fetchResult="fetchPayments"
              />
            </v-toolbar>

            <v-layout style="overflow: auto">
              <v-data-table
                :headers="headers"
                :items="payments"
                :pagination.sync="sortBy"
                :options.sync="pagination"
                :server-items-length="pagination.totalItems"
                :no-data-text="$t('No data available')"
                hide-actions
                class="width100"
              >
                <template v-slot:items="props">
                  <tr @click="showDialog(props.item)">
                    <td class="text-xs-left re-td re-orange-color div">
                      <div>{{ props.item.id }}</div>
                    </td>
                    <td class="text-xs-center div">
                      <div>{{ formatDate(props.item.created) }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.initiator }}</div>
                    </td>
                    <td class="text-xs-center" :class="{ ongoing: true }">
                      <div>{{ props.item.status }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.property_name }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.unit_number }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.tenant_name }}</div>
                    </td>
                    <td class="text-xs-center">
                      <div>{{ props.item.total_amount }} {{ $t("KD") }}</div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-layout>
          </v-card>
          <div class="overflow-hidden text-xs-center pt-4">
            <v-pagination
              v-model="pagination.page"
              :length="pages"
              :total-visible="10"
              class="re-pagination"
              @input="fetchPayments(false)"
            ></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <advance-payment-dialog
          v-model="dialog"
          :selectedPayment="selectedPayment"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty } from "lodash";

import AdvancePaymentDialog from "../components/dialog/AdvancePaymentDialog.vue";
import { ContractEnums } from "../enums";
import { formatDateForList } from "../helper";
import { transformContractFilter } from "../helper/filters";
import logs from "../services/plugins/logs";

import ContractListFilter from "./contracts/List/ContractListFilter.vue";
import TableLoader from "./loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "AdvancePaymentList",
  components: {
    TableLoader,
    ContractListFilter,
    AdvancePaymentDialog
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      dialog: false,
      row: "",
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10
      },
      items3: [
        this.$t("All"),
        this.$t("Paid"),
        this.$t("Pending"),
        this.$t("Late")
      ],
      selectedPayment: {},
      filter: {},
      isLoading: false,
      totalCount: 0,
      search: "",
      payments: []
    };
  },
  computed: {
    headers() {
      return [
        { text: this.$t("Id"), align: "left", sortable: false },
        { text: this.$t("Created"), align: "center", sortable: false },
        { text: this.$t("Initiator"), align: "center", sortable: false },
        { text: this.$t("Status"), align: "center", sortable: false },
        { text: this.$t("Property Name"), align: "center", sortable: false },
        { text: this.$t("Unit Number"), align: "center", sortable: false },
        { text: this.$t("Tenant"), align: "center", sortable: false },
        { text: this.$t("Total Amount"), align: "center", sortable: false }
      ]
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
  created() {
    this.fetchPayments();
  },
  methods: {
    showDialog(item) {
      this.selectedPayment = item;
      this.dialog = true;
    },
    async fetchPayments(data) {
      try {
        if (!data) {
          this.isLoading = true;
        }
        let params = {
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || ""
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
          logs.fetchPaymentList(ContractEnums.AdvancePayment, params),
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
        console.log("Error: Unable to Fetch payment list - ", err);
      }
    },
    formatDate(value) {
      return formatDateForList(value);
    }
  }
};
</script>

<style scoped>
.v-dialog .headline {
  max-width: 420px !important;
  padding: 0px 23px !important;
  padding-top: 10px !important;
}
</style>

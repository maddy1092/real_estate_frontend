<template>
  <div class="NewContractList">
    <v-layout wrap justify-center>
      <v-layout wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <v-layout class="pt-5" wrap>
            <v-flex grow pa-1 xs10 sm7 md8>
              <v-layout align-start wrap>
                <v-flex xs6 sm4>
                  <h2 class="display-2">{{ $t("Invoice List") }}</h2>
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
                  @change="fetchContracts(false)"
                >
                  <v-radio :label="$t('All')" value="show-all" />
                </v-radio-group>
              </div>
              <v-spacer />
              <v-text-field
                v-model="search"
                hide-details
                :placeholder="$t('Search')"
                single-line
                @input="fetchContracts"
              />

              <v-spacer />

              <contract-list-filter
                v-model="filter"
                @fetchResult="fetchContracts"
              />
            </v-toolbar>
            <v-layout style="overflow: auto">
              <div class="listing__table">
                <v-data-table
                  :headers="headers"
                  :items="contracts"
                  :pagination.sync="sortBy"
                  :options.sync="pagination"
                  :server-items-length="pagination.totalItems"
                  :no-data-text="$t('No data available')"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <tr @click="showDialog(props.item)" class="row-pointer">
                      <td class="re-td text-xs-center re-orange-color">
                        <div>{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ formatDates(props.item.modified) }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.initiator }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.tenant_name }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.property_name }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>{{ props.item.unit_number }}</div>
                      </td>
                      <td class="text-xs-center" v-if="props.item.reference">
                        <div>{{ props.item.reference }}</div>
                      </td>
                      <td class="text-xs-center" v-else>
                        <div>-</div>
                      </td>
                      <td class="text-xs-center">
                        <div>
                          {{ defaultFormatted(props.item.contract_start_date) }}
                        </div>
                      </td>
                      <td class="text-xs-center">
                        <div>
                          {{ defaultFormatted(props.item.contract_end_date) }}
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
            </v-layout>
          </v-card>
          <div class="overflow-hidden text-xs-center pt-4">
            <v-pagination
              v-model="pagination.page"
              :length="pages"
              :total-visible="10"
              class="re-pagination"
              @input="fetchContracts(false)"
            ></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <ContractInvoiceListDialogue
          :label="$t('Contract')"
          :showDialog="dialog"
          @closeDialog="dialog = false"
          :isDialogLoading="isLoadingInvoices"
          :selectedInvoices="currentContractInvoices"
          :pagination="invoicePagination"
          @refetch="fetchContractInvoices"
          @updatePagination="updatePagination"
        >
          <template v-slot:contract>
            <ContractDetails
              :selectedContract="selectedContract"
              @downloadImage="downloadImage($event)"
            />
          </template>
        </ContractInvoiceListDialogue>
      </div>
    </template>

    <template>
      <div class="text-xs-center">
        <confirmation-dialog
          v-model="alert"
          :label="$t('Confirmation')"
          :message="
            $t(
              'Contract, payment records are going to be deleted , are you sure you want to continue'
            )
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
import moment from "moment";

import ContractDetails from "../components/Contract/InvoiceContractDetails.vue";
import ConfirmationDialog from "../components/dialog/ConfirmationDialog.vue";
// import ContractDialogue from "../components/dialog/ContractDialogue.vue";
import ContractInvoiceListDialogue from "../components/dialog/ContractInvoiceListDialogue.vue";
import { ContractEnums } from "../enums";
import {
  defaultFormat,
  formatDateForList,
  downloadImage,
  getFileExtension
} from "../helper";
import { transformContractFilter } from "../helper/filters";
import contractService from "../services/plugins/contract";
import logsService from "../services/plugins/logs";
import TableLoader from "../views/loaders/TableLoader";

import ContractListFilter from "./contracts/List/ContractListFilter.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "NewContractList",
  components: {
    ContractInvoiceListDialogue,
    ConfirmationDialog,
    TableLoader,
    ContractListFilter,
    ContractDetails
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      selectedContractId: 0,
      row: "",
      alert: false,
      dialog: false,
      isLoading: false,
      pagination: {
        rowsPerPage: 30
      },
      isLoadingInvoices: false,
      sortBy: {
        rowsPerPage: 30,
        descending: false
      },
      totalCount: 0,
      items3: [
        this.$t("All"),
        this.$t("Paid"),
        this.$t("Pending"),
        this.$t("Late")
      ],
      search: "",
      filter: {},
      selectedContract: {},
      contracts: [],
      currentContractInvoices: [],
      invoicePagination: {
        rowsPerPage: 6
      }
    };
  },
  created() {
    this.fetchContracts();
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchContracts();
    },
    order() {
      this.fetchContracts(false);
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Id"),
          value: "id",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Created"),
          value: "created",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Initiator"),
          value: "history_user__username",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Tenant Name"),
          value: "tenant__tenant_name",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Property"),
          value: "property__property_name",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Unit Number"),
          value: "unit__unit_number",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Contract Reference"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract Start Date"),
          value: "contract_start_date",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Contract End Date"),
          value: "contract_end_date",
          align: "center",
          sortable: true
        }
      ];
    },
    actions() {
      return [
        {
          title: this.$t("Contract Rollback"),
          value: "contract_rollback",
          route: ""
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
    },
    order() {
      return this.sortBy.descending;
    }
  },
  methods: {
    showAlert(contract) {
      this.selectedContractId = contract.id;
      this.alert = true;
    },
    async fetchContractInvoices() {
      try {
        this.isLoadingInvoices = true;
        this.invoicePagination = {
          ...this.invoicePagination,
          totalItems: this.selectedContract.paid_month_year.length,
          page:
            this.invoicePagination.page > 0 ? this.invoicePagination.page : 1,
          rowsPerPage:
            this.row !== "" ? this.selectedContract.paid_month_year.length : 6
        };
        const contractInvoices = this.selectedContract.paid_month_year || [];
        this.currentContractInvoices = contractInvoices.map(invoice => ({
          ...invoice,
          is_paid:
            invoice.status === "Paid" || invoice.is_grace_period ? true : false,
          payment_date: moment(invoice.payment_date).format("YYYY-MM-DD"),
          allowed_date: moment(invoice.payment_date).format("YYYY-MM-DD")
        }));
        this.currentContractInvoices = this.currentContractInvoices.slice(
          this.invoicePagination.page * 6 - 6,
          this.invoicePagination.page * 6
        );
        this.isLoadingInvoices = false;
      } catch (err) {
        this.isLoadingInvoices = false;
        console.log("Error: Unable to update Invoices - ", err);
      }
    },
    checkDisabled(contract) {
      if (
        contract.status === this.$t("Active") ||
        contract.status === "مفعّل"
      ) {
        return false;
      }

      return true;
    },
    acceptDialog() {
      this.dialog = false;
      this.newContractRollBack();
    },
    showDialog(item) {
      this.selectedContract = item;
      this.fetchContractInvoices();
      this.dialog = true;
    },
    closeFilter() {
      this.filter = {};
    },
    async newContractRollBack() {
      try {
        this.isLoading = true;
        await this.$processReq(
          logsService.contractRollback(this.selectedContractId),
          false
        );
        this.fetchContracts(false);
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to delete contract - ", error);
      }
    },
    async fetchContracts(data) {
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
          this.contracts = [];
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }

        if (!isEmpty(this.filter)) {
          params = {
            ...params,
            ...transformContractFilter(this.filter)
          };
        }

        const reason = ContractEnums.TenantContractInvoice;
        const resp = await this.$processReq(
          logsService.fetchPaymentList(reason, params),
          false
        );

        this.contracts = resp.data.body.results;
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
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to fetch contract list - ", error);
      }
    },
    formatDates(value) {
      return formatDateForList(value);
    },
    async downloadImage(contract) {
      try {
        this.isLoading = true;
        this.dialog = false;

        const resp = await contractService.downloadImage(contract.attachment);
        downloadImage(
          resp.data,
          `${contract.id}-${contract.property_name}-${
            contract.unit_number
          }${getFileExtension(resp.data.type)}`
        );
        this.$root.$emit("snackbar", {
          text: this.$t("Image have been downloaded successfully"),
          color: "success"
        });
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to download image - ", error);
      }
    },
    defaultFormatted(value) {
      return defaultFormat(value);
    }
  }
};
</script>

<style scoped>
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
</style>

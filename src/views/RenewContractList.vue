<template>
  <div class="renew-contract-list">
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <v-layout class="pt-5" row wrap>
            <v-flex grow pa-1 xs12 sm5 md8>
              <v-layout align-start row wrap class="re-mm-24">
                <v-flex xs12 md4>
                  <h2
                    class="display-2 padding-left"
                    style="margin-inline-start: 0;"
                  >
                    {{ $t("Renew Contract List") }}
                  </h2>
                </v-flex>
                <v-flex xs12 md8> </v-flex>
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
                  @change="fetchContractList(false)"
                >
                  <v-radio :label="$t('All')" value="show-all"></v-radio>
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
                @input="fetchContractList(true)"
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>

              <contract-list-filter
                v-model="filter"
                filterType="is_renew"
                @fetchResult="fetchContractList"
              />
            </v-toolbar>
            <v-layout class="container__div">
              <div class="listing__table">
                <v-data-table
                  hide-actions
                  :items="contracts"
                  :expand="expand"
                  item-key="id"
                  :no-data-text="$t('No data available')"
                  :pagination.sync="sortBy"
                  :options.sync="pagination"
                  :server-items-length="pagination.totalItems"
                  :headers="topHeaders"
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expand }"
                      class="outer-row"
                    >
                      <td
                        @click="handleClick(props.item)"
                        class="text-xs-center re-orange-color actions"
                      >
                        <div>{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center">
                        <div>
                          {{ defaultFormattedDate(props.item.created) }}
                        </div>
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
                      <td class="text-xs-center re-padding">
                        {{ props.item.unit_number }}
                      </td>

                      <td class="text-xs-center re-padding">
                        <div>
                          {{ props.item.new_contract_start_date }}
                        </div>
                      </td>

                      <td class="text-xs-center re-width-145">
                        {{ props.item.new_contract_end_date }}
                      </td>

                      <td class="d-flex justify-space-around align-center">
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
                              :disabled="checkDisabled(props.item)"
                              @click="showAlert(props.item)"
                            >
                              <v-list-tile-title>{{
                                action.title
                              }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                        <div @click="props.expanded = !props.expanded">
                          <img
                            v-if="props.expanded"
                            src="@/assets/downArrow.svg"
                          />
                          <img v-else src="@/assets/upArrow.svg" />
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-slot:expand="props">
                    <v-card flat>
                      <v-card-text>
                        <v-data-table
                          :headers="headers"
                          :items="[props.item]"
                          :no-data-text="$t('No data available')"
                          item-key="unit_number"
                          hide-actions
                        >
                          <template v-slot:items="props">
                            <tr :class="{ 'active-class': props.expand }">
                              <td
                                class="status-position ongoing div re-width-165"
                              >
                                <rent-statuses
                                  :status="props.item.status"
                                  :showIcon="false"
                                />
                              </td>

                              <td class="text-xs-center">
                                {{ props.item.unittype }}
                              </td>
                              <td class="text-xs-center">
                                {{
                                  formatDates(props.item.contract_start_date)
                                }}
                              </td>
                              <td class="text-xs-center">
                                {{ formatDates(props.item.contract_end_date) }}
                              </td>
                              <td class="text-xs-center">
                                {{ parseInt(props.item.amount).toFixed(3) }}
                                {{ $t("KD") }}
                              </td>
                              <td class="text-xs-center">
                                {{
                                  parseInt(props.item.original_amount).toFixed(
                                    3
                                  )
                                }}
                                {{ $t("KD") }}
                              </td>
                              <td class="text-xs-center re-padding">
                                {{ props.item.new_original_amount }}
                              </td>
                              <td class="text-xs-center re-padding">
                                <div>{{ props.item.new_amount }}</div>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
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
              @input="fetchContractList(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <!-- <renew-contract-dialog
          :showDialog="dialog"
          :selectedContract="selectedContract"
          @closeDialog="dialog = false"
        /> -->
        <ContractInvoiceListDialogue
          :label="$t('Contract')"
          :showDialog="dialog"
          :selectedContract="selectedContract"
          @closeDialog="dialog = false"
          :isDialogLoading="isLoadingInvoices"
          :selectedInvoices="currentContractInvoices"
          :pagination="invoicePagination"
          @refetch="fetchContractInvoices"
          @updatePagination="updatePagination"
        >
          <template v-slot:contract>
            <RenewContractDetails
              :selectedContract="selectedContract"
              @downloadImage="downloadImage($event)"
            />
          </template>
        </ContractInvoiceListDialogue>
      </div>
    </template>

    <template>
      <div class="text-xs-center">
        <contract-invoice-dialogue
          v-model="showInvoices"
          :title="$t('Contract Invoices')"
          :isDialogLoading="isLoadingInvoices"
          :selectedInvoices="currentContractInvoices"
          :pagination="invoicePagination"
          :isRenew="true"
          @refetch="fetchContractInvoices"
          @updatePagination="updatePagination"
        />
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

import RenewContractDetails from "../components/Contract/RenewContractDetails.vue";
import ConfirmationDialog from "../components/dialog/ConfirmationDialog.vue";
import ContractInvoiceDialogue from "../components/dialog/ContractInvoiceDialogue.vue";
import ContractInvoiceListDialogue from "../components/dialog/ContractInvoiceListDialogue.vue";
// import RenewContractDialog from "../components/dialog/RenewContractDialog.vue";
import RentStatuses from "../components/RentStatuses.vue";
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
import colorMixin from "@/mixins/colorMixin";

export default {
  name: "RenewContractList",
  components: {
    ConfirmationDialog,
    TableLoader,
    // RenewContractDialog,
    ContractListFilter,
    RentStatuses,
    ContractInvoiceDialogue,
    RenewContractDetails,
    ContractInvoiceListDialogue
  },
  mixins: [breadItemsSetLang, colorMixin],
  data() {
    return {
      selectedContractId: 0,
      totalCount: 0,
      row: "",
      search: "",
      menu: false,
      dialog: false,
      alert: false,
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      selectedContract: {},
      filter: {},
      isLoading: false,
      contracts: [],
      currentContractInvoices: [],
      invoicePagination: {
        rowsPerPage: 6
      },
      showInvoices: false,
      isLoadingInvoices: false,
      contractId: ""
    };
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
          sortable: true,
          class: "re-padding-1"
        },
        {
          id: 4,
          text: this.$t("Created"),
          align: "center",
          value: "created",
          desc: false,
          sortable: true,
          class: "r-padding-15"
        },
        {
          id: 3,
          text: this.$t("Initiator"),
          align: "center",
          value: "history_user__username",
          desc: false,
          sortable: true,
          class: "re-padding-1"
        },
        {
          id: 2,
          text: this.$t("Tenant Name"),
          align: "center",
          value: "tenant__tenant_name",
          desc: false,
          sortable: true,
          class: "re-padding-1"
        },
        {
          text: this.$t("Property Name"),
          value: "property__property_name",
          align: "center",
          class: "r-padding-15",
          sortable: false
        },
        {
          text: this.$t("Unit Number"),
          value: "unit__unit_number",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("New Contract Start Date"),
          value: "contract_end_date",
          align: "center",
          class: "r-padding-15",
          sortable: false
        },
        {
          text: this.$t("New Contract End Date"),
          value: "contract_end_date",
          align: "center",
          class: "r-padding-15",
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
    headers() {
      return [
        {
          text: this.$t("Status"),
          value: "status",
          align: "center",
          sortable: false,
          class: "re-padding-1"
        },
        {
          text: this.$t("Unit Type"),
          value: "unit__unittype__unit_type_name",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Old Contract Start Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Old Contract End Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Old Contract Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Old Original Contract Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("New Original Contract Amount"),
          value: "",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("New Contract Amount"),
          value: "",
          align: "center",
          sortable: false,
          class: "r-padding-1"
        }
      ];
    },
    actions() {
      return [
        {
          title: this.$t("Renew Contract Rollback"),
          value: "renew_contract_rollback",
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
  created() {
    this.fetchContractList();
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchContractList();
    },
    showInvoices() {
      this.invoicePagination = {
        rowsPerPage: 6
      };
    },
    order() {
      this.fetchContractList(false);
    }
  },
  methods: {
    async fetchContractInvoices() {
      try {
        this.isLoadingInvoices = true;
        let params = {
          limit: 6,
          contract__id: this.contractId,
          offset: this.invoicePagination.page
            ? (this.invoicePagination.page - 1) * 6
            : 0
        };
        const resp = await this.$processReq(
          logsService.fetchPaymentList(
            ContractEnums.RenewContractInvoice,
            params
          ),
          false
        );
        this.invoicePagination = {
          ...this.invoicePagination,
          totalItems: resp.data.body.count,
          page:
            this.invoicePagination.page > 0 ? this.invoicePagination.page : 1,
          rowsPerPage: this.row !== "" ? resp.data.body.count : 6
        };
        const contractInvoices = resp.data.body.results || [];

        this.currentContractInvoices = contractInvoices.map(invoice => ({
          ...invoice,
          is_paid:
            invoice.status === "Paid" || invoice.is_grace_period ? true : false,
          payment_date: moment(invoice.payment_date).format("YYYY-MM-DD"),
          allowed_date: moment(invoice.payment_date).format("YYYY-MM-DD")
        }));
        this.isLoadingInvoices = false;
      } catch (err) {
        this.isLoadingInvoices = false;
        console.log("Error: Unable to update Invoices - ", err);
      }
    },
    handleClick(item) {
      this.selectedContract = item;
      this.contractId = this.selectedContract.id;
      this.fetchContractInvoices();
      this.dialog = true;
    },
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
      this.fetchContractList(false);
    },
    showDialogBox(item) {
      this.selectedContract = item;
      this.dialog = true;
    },
    acceptDialog() {
      this.dialog = false;
      this.renewContractRollBack();
    },
    showAlert(contract) {
      this.selectedContractId = contract.id;
      this.alert = true;
    },
    checkDisabled(renewContract) {
      if (
        renewContract.status === "Active" ||
        renewContract.status === "Waiting for activation" ||
        renewContract.status === "بانتظار التفعيل"
      ) {
        return false;
      }
      return true;
    },
    async renewContractRollBack() {
      try {
        this.isLoading = true;
        await this.$processReq(
          logsService.contractRollback(this.selectedContractId),
          false
        );
        this.fetchContractList(false);
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to delete contract - ", error);
      }
    },
    async fetchContractList(showLoading) {
      try {
        if (!showLoading) {
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

        const resp = await this.$processReq(
          logsService.fetchContractList(ContractEnums.RenewContract, params),
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
      return defaultFormat(value);
    },
    defaultFormattedDate(value) {
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
          text: "Image have been download successfully.",
          color: "success"
        });
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to download image - ", error);
      }
    }
  }
};
</script>

<style scoped>
.actions {
  padding-bottom: 2px;
  height: 30px;
  width: 30px;
}
img {
  cursor: pointer;
}
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
.re-padding {
  padding: 0rem !important;
}
::v-deep thead th .re-padding-1 {
  padding: 0 1px !important;
}
::v-deep thead th:not(:first-child) .re-padding-15 {
  padding-right: 15px !important;
}
span {
  margin-right: 5px;
}
</style>

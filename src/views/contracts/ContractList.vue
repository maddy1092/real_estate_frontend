<template>
  <div class="NewContractList">
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
                    {{ $t("New Contract List") }}
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
                  @change="fetchContracts(false)"
                >
                  <v-radio :label="$t('All')" value="show-all" />
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
                @input="fetchContracts"
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>
              <contract-list-filter
                v-model="filter"
                @fetchResult="fetchContracts"
              />
            </v-toolbar>
            <v-layout class="container__div">
              <div class="listing__table">
                <v-data-table
                  :headers="topHeaders"
                  hide-actions
                  :items="contracts"
                  :expand="expand"
                  item-key="id"
                  :pagination.sync="sortBy"
                  :options.sync="pagination"
                  :server-items-length="pagination.totalItems"
                  :no-data-text="$t('No data available')"
                  class="contract-list-selector"
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td @click="showDialog(props.item)">
                        <div class="re-orange-color actions">
                          {{ props.item.id }}
                        </div>
                      </td>
                      <td>
                        <div>{{ formatDates(props.item.created) }}</div>
                      </td>
                      <td>
                        <div>{{ props.item.initiator }}</div>
                      </td>
                      <td>
                        <div>{{ props.item.tenant_name }}</div>
                      </td>
                      <td>
                        <div>{{ props.item.property_name }}</div>
                      </td>
                      <td>
                        <div>{{ props.item.unit_number }}</div>
                      </td>
                      <td>
                        <div>
                          {{ defaultFormatted(props.item.contract_start_date) }}
                        </div>
                      </td>
                      <td>
                        <div>
                          {{ defaultFormatted(props.item.contract_end_date) }}
                        </div>
                      </td>
                      <td>
                        <div>{{ props.item.reference || "-" }}</div>
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
                              :disabled="
                                checkDisabled(props.item, action.value)
                              "
                              @click="showAlert(props.item)"
                            >
                              <v-list-tile-title>{{
                                action.title
                              }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>

                      <td>
                        <div
                          @click="props.expanded = !props.expanded"
                          class="row-pointer"
                        >
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
                            <tr>
                              <td class="text-xs-center">
                                {{
                                  props.item.payment_start_date
                                    ? defaultFormatted(
                                        props.item.payment_start_date
                                      )
                                    : "--"
                                }}
                              </td>
                              <td
                                class="text-xs-center ongoing"
                                :class="{
                                  expired:
                                    props.item.status.includes('termina') ||
                                    props.item.status.includes('Termina') ||
                                    props.item.status.includes('deacti') ||
                                    props.item.status.includes('Deacti')
                                }"
                              >
                                {{ props.item.status }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.unittype }}
                              </td>
                              <td class="text-xs-center">
                                {{
                                  parseInt(props.item.original_amount).toFixed(
                                    3
                                  )
                                }}
                                {{ $t("KD") }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.amount.toFixed(3) }}
                                {{ $t("KD") }}
                              </td>

                              <td class="text-xs-center">
                                {{
                                  props.item.insurance_amount
                                    ? parseInt(
                                        props.item.insurance_amount
                                      ).toFixed(3)
                                    : "-"
                                }}
                              </td>

                              <td class="text-xs-center" dense>
                                <v-checkbox
                                  v-model="props.item.is_suspended"
                                  disabled
                                  class="justify-center"
                                />
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
              @input="fetchContracts(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <!-- <contract-dialogue
          :label="$t('New Contract')"
          :showDialog="dialog"
          :selectedContract="selectedContract"
          @closeDialog="dialog = false"
          @downloadImage="downloadImage($event)"
        /> -->
        <ContractInvoiceListDialogue
          :label="$t('Contract')"
          :showDialog="dialog"
          @closeDialog="dialog = false"
          :isDialogLoading="isLoadingInvoices"
          :selectedInvoices="currentContractInvoices"
          :pagination="invoicePagination"
          :isRenew="false"
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

    <template>
      <div class="text-xs-center">
        <contract-invoice-dialogue
          v-model="showInvoices"
          :title="$t('Contract Invoices')"
          :isDialogLoading="isLoadingInvoices"
          :selectedInvoices="currentContractInvoices"
          :pagination="invoicePagination"
          @refetch="fetchContractInvoices"
          @updatePagination="updatePagination"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import moment from "moment";

import ContractDetails from "../../components/Contract/ContractDetails.vue";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
// import ContractDialogue from "../../components/dialog/ContractDialogue.vue";
import ContractInvoiceListDialogue from "../../components/dialog/ContractInvoiceListDialogue.vue";
import { ContractEnums } from "../../enums";
import {
  defaultFormat,
  formatDateForList,
  downloadImage,
  getFileExtension
} from "../../helper";
import { transformContractFilter } from "../../helper/filters";
import contractService from "../../services/plugins/contract";
import logsService from "../../services/plugins/logs";
import TableLoader from "../../views/loaders/TableLoader";

import ContractListFilter from "./List/ContractListFilter.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import colorMixin from "@/mixins/colorMixin";

export default {
  name: "NewContractList",
  components: {
    ContractInvoiceListDialogue,
    ConfirmationDialog,
    TableLoader,
    ContractListFilter,
    ContractDetails
  },
  mixins: [breadItemsSetLang, colorMixin],
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
      sortBy: {
        rowsPerPage: 30,
        descending: false
      },
      totalCount: 0,
      search: "",
      filter: {},
      selectedContract: {},
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
  created() {
    this.fetchContracts();
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchContracts();
    },
    showInvoices() {
      this.invoicePagination = {
        rowsPerPage: 6
      };
    },
    order() {
      this.fetchContracts(false);
    }
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
          id: 4,
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
          id: 2,
          text: this.$t("Tenant Name"),
          align: "center",
          value: "tenant__tenant_name",
          desc: false,
          sortable: true
        },

        {
          id: 5,
          text: this.$t("Property"),
          align: "center",
          value: "property__property_name",
          desc: false,
          sortable: true
        },
        {
          text: this.$t("Unit Number"),
          value: "unit__unit_number",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract Start Date"),
          value: "contract_start_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract End Date"),
          value: "contract_end_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract Reference"),
          align: "center",
          sortable: false
        },
        {
          text: "",
          align: "center",
          value: "",
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
          text: this.$t("Payment Start Date"),
          value: "payment_start_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Status"),
          value: "status",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Unit Type"),
          value: "unit__unittype__unit_type_name",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Original Contract Amount"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Amount"), align: "center", sortable: false },
        {
          text: this.$t("Insurance Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Is Suspended"),
          value: "is_suspended",
          align: "center",
          sortable: false
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
    updatePagination(value) {
      this.invoicePagination = value;
    },
    async fetchContractInvoices() {
      try {
        this.isLoadingInvoices = true;
        let params = {
          contract__id: this.contractId,
          limit: 6,
          offset: this.invoicePagination.page
            ? (this.invoicePagination.page - 1) * 6
            : 0
        };

        const resp = await this.$processReq(
          logsService.fetchPaymentList(
            ContractEnums.NewContractInvoice,
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
    resetFlags(id) {
      switch (id) {
        case 1:
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[4].desc = false;
          this.topHeaders[5].desc = false;
          break;
        case 2:
          this.topHeaders[1].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[4].desc = false;
          this.topHeaders[5].desc = false;
          break;
        case 3:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[4].desc = false;
          this.topHeaders[5].desc = false;
          break;
        case 4:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[5].desc = false;
          break;
        case 5:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          this.topHeaders[4].desc = false;
      }
    },
    sortData(headers) {
      this.resetFlags(headers.id);

      this.sortBy.sortBy = headers.value;
      headers.desc = !headers.desc;
      this.sortBy.descending = !this.sortBy.descending;
      this.fetchContracts(false);
    },
    showAlert(contract) {
      this.selectedContractId = contract.id;
      this.alert = true;
    },
    checkDisabled(contract, value) {
      if (value === "invoices") {
        return false;
      }

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
      this.contractId = item.id;
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

        const reason = [
          ContractEnums.NewContract,
          ContractEnums.NEW_SUSPENDED_CONTRACT
        ].join(",");
        const resp = await this.$processReq(
          logsService.fetchContractList(reason, params),
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
table.v-table tbody td:not(:first-child) {
  padding: 0 12px;
}
span {
  margin-right: 5px;
}
.contract-list-selector {
  text-align: center;
}
</style>

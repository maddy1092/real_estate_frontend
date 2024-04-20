<template>
  <div class="terminate-list">
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
                    {{ $t("Terminate Contract List") }}
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
                @input.native="fetchContractList"
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>
              <contract-list-filter
                v-model="filter"
                filterType="terminate"
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
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td @click="updateDialogBox(props.item)">
                        <div class="text-xs-center re-orange-color div actions">
                          {{ props.item.id }}
                        </div>
                      </td>
                      <td>
                        <div class="text-xs-center">
                          {{ formatDate(props.item.created) }}
                        </div>
                      </td>
                      <td>
                        <div class="text-xs-center">
                          {{ props.item.initiator }}
                        </div>
                      </td>
                      <td>
                        <div class="text-xs-center">
                          {{ props.item.tenant_name }}
                        </div>
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.property_name }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.unit_number }}
                      </td>
                      <td class="text-xs-center">
                        {{ defaultFormatted(props.item.contract_start_date) }}
                      </td>
                      <td class="text-xs-center">
                        {{ defaultFormatted(props.item.contract_end_date) }}
                      </td>
                      <td class="text-xs-center">
                        {{ defaultFormatted(props.item.termination_date) }}
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
                              :disabled="checkDisabled(props.item)"
                              @click="showAlert(props.item)"
                            >
                              <v-list-tile-title>{{
                                action.title
                              }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                      <!-- <td></td> -->
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
                          :expand="expand"
                          :no-data-text="$t('No data available')"
                          item-key="unit_number"
                          hide-actions
                          class="most-inner-datatable"
                        >
                          <template v-slot:items="props">
                            <tr>
                              <td>
                                <rent-statuses
                                  :status="props.item.status"
                                  :showIcon="false"
                                />
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.unittype }}
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
                              </td>
                              <td class="div re-width-165 invisible">
                                Invisible
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
        <terminate-contract-dialog
          v-model="dialog"
          :selectedContract="selectedContract"
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
              'Are you sure that you want to roll back the contract termination'
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

import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
import RentStatuses from "../../components/RentStatuses.vue";
import TerminateContractDialog from "../../components/TerminateContractDialog.vue";
import { ContractEnums } from "../../enums";
import { defaultFormat, formatDateForList } from "../../helper";
import { transformContractFilter } from "../../helper/filters";
import logs from "../../services/plugins/logs";
import TableLoader from "../loaders/TableLoader.vue";

import ContractListFilter from "./List/ContractListFilter.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
export default {
  name: "TerminateList",
  mixins: [breadItemsSetLang],
  components: {
    RentStatuses,
    TableLoader,
    TerminateContractDialog,
    ContractListFilter,
    ConfirmationDialog
  },
  data() {
    return {
      row: "",
      menu: false,
      dialog: false,
      alert: false,
      selectedContractId: 0,
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      filter: {},
      selectedContract: {},
      search: "",
      totalCount: 0,
      isLoading: false,
      contracts: []
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
          text: this.$t("Termination Date"),
          value: "termination_date",
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
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "left",
          sortable: false
        }
      ];
    },
    actions() {
      return [
        {
          title: this.$t("Terminate Contract Rollback"),
          value: "terminate_contract_rollback",
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
    order() {
      this.fetchContractList(false);
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
      this.fetchContractList(false);
    },
    acceptDialog() {
      this.dialog = false;
      this.terminateContractRollBack();
    },
    showAlert(contract) {
      this.selectedContractId = contract.id;
      this.alert = true;
    },
    formatDate(value) {
      return formatDateForList(value);
    },
    defaultFormatted(value) {
      return defaultFormat(value);
    },
    checkDisabled(terminateContract) {
      if (terminateContract.status !== "Active") {
        return false;
      }
      return true;
    },
    defaultFormat(value) {
      return defaultFormat(value);
    },
    async terminateContractRollBack() {
      try {
        this.isLoading = true;
        await this.$processReq(
          logs.terminateContractRollback(this.selectedContractId),
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
          logs.fetchContractList(ContractEnums.TerminateContract, params),
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
        console.log("Error: Unable to get contract list - ", error);
      }
    },
    updateDialogBox(selectedContract) {
      this.selectedContract = selectedContract;
      this.dialog = true;
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

.display-2 {
  width: 21rem;
}
span {
  margin-right: 5px;
}
.invisible {
  visibility: hidden;
}
</style>

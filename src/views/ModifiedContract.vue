<template>
  <div class="ModifiedContractList">
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
                    {{ $t("Modified Contract List") }}
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
                @input.native="fetchContracts"
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>
              <contract-list-filter
                v-model="filter"
                filterType="is_modified"
                @fetchResult="fetchContracts"
              />
            </v-toolbar>
            <v-layout style="overflow:auto" class="container__div">
              <div class="listing__table">
                <v-data-table
                  hide-actions
                  :items="contracts"
                  :expand="expand"
                  item-key="modified"
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
                      <td
                        @click="showDialog(props.item)"
                        class="text-xs-center actions re-orange-color"
                      >
                        <div>{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center">
                        {{ formatDates(props.item.created) }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.initiator }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.tenant_name }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.property_name }}
                      </td>

                      <td class="text-xs-center">
                        {{ props.item.unit_number }}
                      </td>

                      <td class="text-xs-center">
                        {{ parseInt(props.item.original_amount).toFixed(3) }}
                        {{ $t("KD") }}
                      </td>
                      <td class="text-xs-center">
                        {{ parseInt(props.item.amount).toFixed(3) }}
                        {{ $t("KD") }}
                      </td>
                      <td class="text-xs-center">
                        {{ parseInt(props.item.new_amount).toFixed(3) }}
                        {{ $t("KD") }}
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
              @input="fetchContracts(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <ModifiedContractDialogue
          :label="$t('Modified Contract')"
          :showDialog="dialog"
          :selectedContract="selectedContract"
          @closeDialog="closeDialog"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty } from "lodash";

import ModifiedContractDialogue from "../components/dialog/ModifiedContractDialogue.vue";
import { ContractEnums } from "../enums";
import { defaultFormat, formatDateForList } from "../helper";
import { transformContractFilter } from "../helper/filters";
import logsService from "../services/plugins/logs";
import ContractListFilter from "../views/contracts/List/ContractListFilter.vue";
import TableLoader from "../views/loaders/TableLoader";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "NewContractList",
  components: { ModifiedContractDialogue, TableLoader, ContractListFilter },
  mixins: [breadItemsSetLang],
  data() {
    return {
      row: "",
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
      items3: [
        this.$t("All"),
        this.$t("Paid"),
        this.$t("Pending"),
        this.$t("Late")
      ],
      search: "",
      filter: {},
      selectedContract: {},
      contracts: []
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
    topHeaders() {
      return [
        {
          id: 0,
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
          id: 4,
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
          text: this.$t("Original Amount"),
          value: "contract_start_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Before Modified Amount"),
          value: "before_modified_amount",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("After Modified Amount"),
          value: "after_modified_amount",
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
    },
    order() {
      return this.sortBy.descending;
    }
  },
  methods: {
    resetFlags(id) {
      switch (id) {
        case 0:
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          break;
        case 1:
          this.topHeaders[0].desc = false;
          this.topHeaders[2].desc = false;
          this.topHeaders[3].desc = false;
          break;
        case 2:
          this.topHeaders[0].desc = false;
          this.topHeaders[1].desc = false;
          this.topHeaders[3].desc = false;
          break;
        case 3:
          this.topHeaders[0].desc = false;
          this.topHeaders[1].desc = false;
          this.topHeaders[2].desc = false;
      }
    },
    sortData(headers) {
      this.resetFlags(headers.id);

      this.sortBy.sortBy = headers.value;
      headers.desc = !headers.desc;
      this.sortBy.descending = !this.sortBy.descending;
      this.fetchContracts(false);
    },
    closeDialog() {
      this.dialog = false;
    },
    showDialog(item) {
      this.selectedContract = item;
      this.dialog = true;
    },
    closeFilter() {
      this.filter = {};
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
            ...transformContractFilter(this.filter, false, true)
          };
        }

        const resp = await this.$processReq(
          logsService.fetchContractList(
            ContractEnums.MODIFY_CONTRACT_AMOUNT,
            params
          ),
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
.display-2 {
  width: 20rem;
}
span {
  margin-right: 5px;
}
</style>

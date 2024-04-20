<template>
  <div class="edit-price-list">
    <v-layout wrap justify-center>
      <v-layout wrap justify-center>
        <v-flex xs12 sm12 lg10>
          <v-layout class="pt-5" wrap>
            <v-flex grow pa-1 xs10 sm7 md8>
              <v-layout align-start wrap>
                <v-flex xs6 sm4>
                  <h2 class="display-2">{{ $t("Edit Price List") }}</h2>
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
                  @change="fetchUnits(false)"
                >
                  <v-radio :label="$t('All')" value="show-all" />
                </v-radio-group>
              </div>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                hide-details
                :placeholder="$t('Search')"
                single-line
                @input.native="fetchUnits"
              />

              <v-spacer />

              <contract-list-filter
                v-model="filter"
                filterType="edit_price"
                @fetchResult="fetchUnits"
              />
            </v-toolbar>

            <v-layout>
              <div class="listing__table">
                <v-data-table
                  :headers="header1"
                  :items="units"
                  :pagination.sync="sortBy"
                  :options.sync="pagination"
                  :server-items-length="pagination.totalItems"
                  :no-data-text="$t('No data available')"
                  :expand="expand"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <tr selected="props.item.id">
                      <td
                        @click="handleClick(props.item)"
                        class="text-xs-left re-td re-orange-color re-width-70 div "
                      >
                        <div class="actions">{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>{{ formatDate(props.item.modified) }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>{{ props.item.initiator }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>{{ props.item.property_name }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>{{ props.item.unit_number }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>{{ props.item.old_invoice_amount }}</div>
                      </td>
                      <td class="text-xs-center div">
                        <div>
                          {{ props.item.invoice_amount }} {{ $t("KD") }}
                        </div>
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
                      <v-layout>
                        <v-data-table
                          :headers="header2"
                          :items="[props.item]"
                          hide-actions
                          item-key="modified"
                        >
                          <template v-slot:items="props">
                            <tr>
                              <td class="text-xs-center">
                                <div>
                                  {{ props.item.unittype }}
                                </div>
                              </td>
                              <td class="text-xs-center re-width-145">
                                <div>
                                  {{ props.item.old_price }} {{ $t("KD") }}
                                </div>
                              </td>
                              <td class="text-xs-center re-width-145">
                                <div>{{ props.item.old_discount }}</div>
                              </td>
                              <td class="text-xs-center re-width-145">
                                <div>
                                  {{
                                    capitalFirst(props.item.old_discount_type)
                                  }}
                                </div>
                              </td>
                              <!-- <td class="text-xs-center">
                                <div>
                                  {{ props.item.invoice_amount }}
                                  {{ $t("KD") }}
                                </div>
                              </td> -->
                              <td class="text-xs-center re-width-145">
                                <div>{{ props.item.price }} {{ $t("KD") }}</div>
                              </td>
                              <td class="text-xs-center re-width-145">
                                <div>{{ props.item.discount }}</div>
                              </td>
                              <td class="text-xs-center re-width-115">
                                <div>
                                  {{ capitalFirst(props.item.discount_type) }}
                                </div>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-layout>
                    </v-card>
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
              @input="fetchUnits(false)"
            ></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <template>
      <div class="text-xs-center">
        <edit-price-dialogue
          :showDialog="dialog"
          :selectedUnit="selectedUnit"
          @closeDialog="dialog = false"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty } from "lodash";

import EditPriceDialogue from "../components/dialog/EditPriceDialogue.vue";
import { ContractEnums } from "../enums";
import { capitalizeFirstLetter, formatDateForList } from "../helper";
import { transformContractFilter } from "../helper/filters";
import logs from "../services/plugins/logs";

import ContractListFilter from "./contracts/List/ContractListFilter.vue";
import TableLoader from "./loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  components: { ContractListFilter, EditPriceDialogue, TableLoader },
  name: "EditPriceList",
  mixins: [breadItemsSetLang],
  data() {
    return {
      drawer: null,
      menu: false,
      dialog: false,
      index: 0,
      row: "",
      search: "",
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      items3: [
        this.$t("All"),
        this.$t("Paid"),
        this.$t("Pending"),
        this.$t("Late")
      ],
      units: [],
      totalCount: 0,
      filter: {},
      selectedUnit: {},
      isLoading: false
    };
  },
  created() {
    this.fetchUnits();
  },
  computed: {
    header1() {
      return [
        {
          text: this.$t("Id"),
          value: "id",
          align: !this.$vuetify.rtl ? "left" : "right",
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
          text: this.$t("Property Name"),
          value: "unit_property__property_name",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Unit Number"),
          value: "unit_number",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Current Unit Net Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("New Unit Net Amount"),
          align: "center",
          sortable: false
        },
        {
          text: "",
          value: "",
          align: "center",
          sortable: false
        }
      ];
    },
    header2() {
      return [
        {
          text: this.$t("Unit Type"),
          value: "unittype",
          align: "center",
          sortable: true
        },
        {
          text: this.$t("Current Unit Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Current Unit Discount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Current Percentage/Fixed"),
          align: "center",
          sortable: false
        },
        { text: this.$t("New Unit Amount"), align: "center", sortable: false },
        {
          text: this.$t("New Unit Discount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("New Percentage/Fixed"),
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
  watch: {
    "$i18n.locale": function() {
      this.fetchUnits(false);
    },
    order() {
      this.fetchUnits(false);
    }
  },
  methods: {
    handleClick(item) {
      this.selectedUnit = item;
      this.dialog = true;
    },
    async fetchUnits(data) {
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
          this.units = [];
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
          logs.fetchUnitLogs(ContractEnums.EditPrice, params),
          false
        );
        this.units = resp.data.body.results;
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
        console.log("Error: Unable to fetch unit logs - ", err);
      }
    },
    formatDate(value) {
      return formatDateForList(value);
    },
    capitalFirst(value) {
      return capitalizeFirstLetter(value);
    }
  }
};
</script>

<style scoped>
.v-dialog {
  max-width: 420px !important;
}
</style>

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
                    {{ $t("Shortly Expired Contracts") }}
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
          <v-card v-if="!isLoading">
            <v-toolbar class="re-toolbar re-wrap">
              <div class="re-flex">
                {{ $t("Rows Per Page") }}
                <v-radio-group
                  v-model="row"
                  class="re-radios"
                  @change="fetchData(false)"
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
                @input="fetchData"
              />

              <v-spacer />

              <v-btn dark class="re-full" @click="printPayments">
                <img class="print-icon" src="@/assets/printer.svg" />
                {{ $t("Print") }}
              </v-btn>
              <v-btn dark class="re-full" @click="exportCsv">{{
                $t("Export")
              }}</v-btn>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
                class="re-filter"
              >
                <template v-slot:activator="{ on }">
                  <v-btn dark class="re-orangtbtn re-full" v-on="on">
                    {{ $t("Filter") }}<v-icon right>filter_list</v-icon>
                  </v-btn>
                </template>

                <v-card class="pb-4">
                  <v-list>
                    <v-list-tile avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ $t("Filter") }}</v-list-tile-title
                        >
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn icon @click="menu = false">
                          <v-icon> close </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>

                  <v-divider />

                  <v-list>
                    <v-list-tile>
                      {{ $t("Contracts expire within") }}
                      <v-text-field
                        v-model="filter.days"
                        class="pos"
                        placeholder="120"
                        outline
                        style="width: 60px; border-radius: 5px"
                      />
                      {{ $t("Days") }}
                    </v-list-tile>
                    <v-list-tile>
                      <v-autocomplete
                        v-model="filter.property"
                        :label="$t('Properties')"
                        item-text="property_name"
                        item-value="id"
                        :items="properties"
                        :no-data-text="
                          `${
                            isLoadingOptions
                              ? $t('Loading...')
                              : $t('No data available')
                          }`
                        "
                        @input.native="fetchProperties"
                      />
                    </v-list-tile>

                    <v-list-tile>
                      <v-autocomplete
                        v-model="filter.tenant"
                        item-text="tenant_name"
                        item-value="id"
                        :label="$t('Tenant')"
                        :items="tenants"
                        :no-data-text="
                          `${
                            isLoadingOptions
                              ? $t('Loading...')
                              : $t('No data available')
                          }`
                        "
                        @input.native="fetchTenants"
                      />
                    </v-list-tile>
                  </v-list>

                  <v-card-actions>
                    <v-spacer />

                    <v-btn dark class="re-orangtbtn" @click="fetchData()">{{
                      $t("Search")
                    }}</v-btn>
                    <v-btn
                      flat
                      class="re-gray-btn re-box-shadow"
                      @click="
                        filter = { days: 120 };
                        fetchData();
                      "
                      >{{ $t("Reset") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-toolbar>
            <v-layout style="overflow:auto" class="container__div">
              <div class="listing__table">
                <v-data-table
                  hide-actions
                  :items="contracts"
                  item-key="id"
                  :no-data-text="$t('No data available')"
                  :headers="topHeaders"
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td
                        @click="showDialog(props.item)"
                        class="text-xs-center re-orange-color"
                      >
                        <div>{{ props.item.id }}</div>
                      </td>
                      <td class="text-xs-center">
                        <span>{{ props.item.property.property_name }}</span>
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.unit.unit_number }}
                      </td>
                      <td class="text-xs-center">
                        <span>{{ props.item.tenant.tenant_name }}</span>
                      </td>
                      <td class="text-xs-center">
                        <span>{{ props.item.tenant.phone }}</span>
                      </td>
                      <td class="text-xs-center">
                        {{ defaultFormatted(props.item.contract_start_date) }}
                      </td>
                      <td class="text-xs-center">
                        {{ defaultFormatted(props.item.contract_end_date) }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.pending_amount || 0 }}
                        {{ $t("KWD") }}
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
                              class="hoverable-list hoverable"
                              v-for="(action, index) in actions"
                              :key="index"
                              @click="showDialog(action.route, props.item)"
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
              @input="fetchData(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>

    <template>
      <div class="text-xs-center">
        <confirmation-dialog
          v-model="confirmationDialog"
          :label="'Confirmation'"
          :message="
            $t(
              'There is a pending amount that should be paid, are you sure that you want to continue.'
            )
          "
          @acceptDialog="doAction"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { isEmpty, debounce } from "lodash";

import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
import { defaultFormat } from "../../helper";
import contract from "../../services/plugins/contract";
import generated_report from "../../services/plugins/generated_report";
import propertyService from "../../services/plugins/properties";
import tenantService from "../../services/plugins/tenant";
import TableLoader from "../loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "Contracts",
  components: { TableLoader, ConfirmationDialog },
  mixins: [breadItemsSetLang],
  data() {
    return {
      editItemRoute: "",
      editItemId: "",
      confirmationDialog: false,
      drawer: null,
      pagination: {
        rowsPerPage: 10
      },
      sortBy: {
        rowsPerPage: 10
      },
      menu: false,
      row: "",
      on: {},
      filter: {
        days: 120
      },
      isLoading: false,
      totalCount: 0,
      tenants: [],
      properties: [],
      contracts: [],
      isLoadingOptions: false,
      fetchProperties: null,
      fetchTenants: null
    };
  },
  created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.fetchTenants = debounce(this.loadTenants, 500);
    this.fetchData();
    this.fetchProperties();
    this.fetchTenants();
  },
  computed: {
    actions() {
      return [
        { title: this.$t("Terminate Contract"), route: "terminate_contract" },
        { title: this.$t("Renew Contract"), route: "renew_contract" }
      ];
    },
    topHeaders() {
      return [
        { text: this.$t("Contract"), align: "center", sortable: false },
        {
          text: this.$t("Property"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Unit Number"), align: "center", sortable: false },
        {
          text: this.$t("Tenant"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Phone"),
          align: "center",
          sortable: false
        },

        {
          text: this.$t("Contract Start Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract End Date"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Pending"), align: "center", sortable: false },
        { text: "", align: "center", sortable: false }
      ];
    },
    headers() {
      return [
        { text: this.$t("Unit Type"), align: "center", sortable: false },

        { text: this.$t("Amount"), align: "center", sortable: false }
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
  watch: {
    "$i18n.locale": function() {
      this.fetchData();
    }
  },
  methods: {
    async exportCsv() {
      this.isLoading = true;
      try {
        let payload = {
          file_format: "xls",
          search: this.search || "",
          property: this.filter.property,
          tenant: this.filter.tenant,
          shortly_expired_contract_period: this.filter.days
        };
        await this.$processReq(
          generated_report.exportShortlyExpiredContracts(payload),
          false
        );
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Report is being generated"),
          color: "success"
        });
      } catch (err) {
        console.log("Error: Unable to Export CSV - ", err);
        this.isLoading = false;
      }
    },
    defaultFormatted(value) {
      return defaultFormat(value);
    },
    async printPayments() {
      this.isLoading = true;
      try {
        let payload = {
          file_format: "pdf",
          search: this.search || "",
          shortly_expired_contract_period: this.filter.days,
          property: this.filter.property,
          tenant: this.filter.tenant
        };
        await this.$processReq(
          generated_report.printShortlyExpiredContracts(payload),
          false
        );
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("PDF is being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to Print PDF - ", err);
      }
    },
    showDialog(editItemRoute, editItem) {
      this.editItemRoute = editItemRoute;
      this.editItemId = editItem.id;
      if (editItem.is_payment_pending) {
        this.confirmationDialog = true;
      } else {
        this.doAction();
      }
    },
    doAction() {
      this.$router.push({
        name: this.editItemRoute,
        params: { contract_id: this.editItemId }
      });
    },
    async loadTenants(event) {
      try {
        this.isLoadingOptions = true;
        let params = {
          limit: 10,
          offset: 0
        };

        if (event) {
          params = {
            ...params,
            search: event.target.value || ""
          };
        }

        const resp = await this.$processReq(
          tenantService.getTenantsList(params),
          false
        );

        this.tenants = resp.data.body.results;
        this.isLoadingOptions = false;
      } catch (err) {
        this.isLoadingOptions = false;
        console.log("Error: Unable to get tenant list - ", err);
      }
    },
    async loadProperties(event) {
      this.isLoadingOptions = true;
      try {
        let params = {
          limit: 10,
          offset: 0
        };

        if (event) {
          params = {
            ...params,
            search: event.target.value || ""
          };
        }
        const resp = await this.$processReq(
          propertyService.getPropertiesList(params),
          false
        );

        this.properties = resp.data.body.results;
        this.isLoadingOptions = false;
      } catch (err) {
        this.isLoadingOptions = false;
        console.log("Error: Unable to get properties list - ", err);
      }
    },
    async fetchData(blockLoading) {
      try {
        this.menu = false;
        if (!blockLoading) {
          this.isLoading = true;
        }
        let params = {
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || ""
        };

        if (!isEmpty(this.filter)) {
          params = {
            ...params,
            property: this.filter.property || null,
            tenant: this.filter.tenant || null,
            shortly_expired_contract_period: this.filter.days || null
          };
        }

        if (this.row === "show-all") {
          this.contracts = [];
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }
        const list = await this.$processReq(
          contract.fetchContractList(params),
          false
        );
        this.isLoading = false;
        this.contracts = list.data.body.results;
        this.pagination = {
          ...this.pagination,
          totalItems: list.data.body.count,
          page: this.pagination.page > 0 ? this.pagination.page : 1,
          rowsPerPage: this.row !== "" ? list.data.body.count : 10
        };

        if (this.totalCount <= list.data.body.count) {
          this.totalCount = list.data.body.count;
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
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while fetching results"),
          color: "error"
        });
        console.log(error, "Error: Fetching Result of Unit type");
      }
    }
  }
};
</script>

<style scoped>
.print-icon {
  padding-left: 6px !important;
  margin-right: 6px;
  filter: brightness(0) invert(1);
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
</style>

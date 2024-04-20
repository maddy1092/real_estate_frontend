<template>
  <div class="properties">
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg9>
          <v-layout class="pt-5" row wrap>
            <v-flex grow pa-1 xs12 sm5 md8>
              <v-layout align-start row wrap>
                <v-flex xs6 md4>
                  <h2 class="display-2 re-add-ml">{{ $t("Properties") }}</h2>
                </v-flex>
                <v-flex xs6 md8> </v-flex>
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1 xs12 sm7 md4 class="re-rel-pos text-xs-right">
              <v-btn
                @click="$router.push({ name: 'add_property' })"
                class="re-orangtbtn re-ml-4"
              >
                <v-icon>add</v-icon> {{ $t("Add Property") }}
              </v-btn>
              <v-btn fab small outline v-on="on" class="re-abs-pos">
                <v-icon>history</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex class="flex-wrap" xs12 pa-1>
              <v-breadcrumbs :items="breadItemsSetLang()" class="re-add-ml">
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
                <v-radio-group v-model="row" row class="re-radios">
                  <v-radio :label="$t('All')" value="show-all"></v-radio>
                </v-radio-group>
              </div>
              <v-spacer></v-spacer>
              <v-text-field
                hide-details
                :placeholder="$t('Search')"
                v-model="search"
                single-line
              />
              <v-spacer />
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark class="re-fill" @click="printProperties">
                    <img src="@/assets/printer.svg" />
                    {{ $t("Print") }}
                  </v-btn>
                  <v-btn dark class="re-full" @click="exportProperties">{{
                    $t("Export Properties")
                  }}</v-btn>
                  <v-btn
                    dark
                    class="re-orangtbtn re-full"
                    v-on="on"
                    v-bind="attrs"
                  >
                    {{ $t("Filter") }}<v-icon right>filter_list</v-icon>
                  </v-btn>
                </template>

                <v-card class="pb-4">
                  <v-list>
                    <v-list-tile avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{
                          $t("Filter")
                        }}</v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-btn icon @click="menu = false">
                          <v-icon> close </v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>

                  <v-divider></v-divider>

                  <v-list>
                    <v-list-tile>
                      <v-select
                        :label="$t('Unit Type')"
                        :items="unitTypes"
                        v-model="unitType"
                        item-text="unit_type_name"
                        item-value="id"
                      />
                    </v-list-tile>

                    <v-list-tile>
                      <v-select
                        v-model="status"
                        :label="$t('Status')"
                        item-text="label"
                        item-value="value"
                        :items="statuses"
                      />
                    </v-list-tile>

                    <v-list-tile>
                      <v-checkbox
                        v-model="isCashPayment"
                        :label="$t('Is Cash Payment Allowed')"
                      />
                    </v-list-tile>
                  </v-list>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      @click="fetchProperties(false)"
                      dark
                      class="re-orangtbtn"
                      >{{ $t("Search") }}</v-btn
                    >
                    <v-btn
                      flat
                      @click="resetAllFilters"
                      class="re-gray-btn re-box-shadow"
                      >{{ $t("Reset") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-toolbar>
            <v-layout style="overflow:auto">
              <v-data-table
                :headers="headers"
                :items="properties"
                class="width100"
                :pagination.sync="sortBy"
                :options.sync="pagination"
                :server-items-length="pagination.totalItems"
                :no-data-text="$t('No data available')"
                hide-actions
              >
                <template v-slot:items="props">
                  <td class="text-xs-left re-first__td  d-sm-table-cell">
                    <div
                      @click.stop="
                        $router.push({
                          name: 'edit_property',
                          params: { id: props.item.id }
                        })
                      "
                      style="cursor:pointer;width: 122px"
                      class="re-orange-color"
                    >
                      {{ props.item.property_name }}
                    </div>
                  </td>
                  <td class="text-xs-left re-first__td  d-sm-table-cell">
                    <div style="width: 122px;padding: 10px 0px">
                      {{ props.item.address }}
                    </div>
                  </td>

                  <td class="p-0">
                    <div
                      v-if="!props.item.unit_details.length"
                      class="text-xs-center"
                    >
                      -----
                    </div>
                    <div
                      v-for="unit of props.item.unit_details"
                      :key="unit.id"
                      class="bg-grey text-xs-center"
                    >
                      <property-units
                        :unit="unit"
                        :is_cash_payment_allowed="
                          props.item.is_cash_payment_allowed
                        "
                        :property="props.item.id"
                        @handleNavigation="
                          val =>
                            handleNavigation(val.action, val.data, val.property)
                        "
                      />
                    </div>
                  </td>

                  <td class="p-0">
                    <div
                      v-if="!props.item.unit_details.length"
                      class="text-xs-center"
                    >
                      -----
                    </div>
                    <div
                      v-for="unit of props.item.unit_details"
                      :key="unit.id"
                      class="bg-grey text-xs-center"
                    >
                      <v-btn dark class="re-show">{{
                        unit.unit_description
                      }}</v-btn>
                    </div>
                  </td>
                  <td class="p-0">
                    <div
                      v-if="!props.item.unit_details.length"
                      class="text-xs-center"
                    >
                      -----
                    </div>
                    <div
                      v-for="unit of props.item.unit_details"
                      :key="unit.id"
                      class="bg-grey text-xs-center"
                    >
                      <v-btn dark class="re-show">{{ unit.total_units }}</v-btn>
                    </div>
                  </td>
                  <td class="p-0">
                    <div
                      v-if="!props.item.unit_details.length"
                      class="text-xs-center"
                    >
                      -----
                    </div>
                    <div
                      v-for="unit of props.item.unit_details"
                      :key="unit.id"
                      class="bg-grey text-xs-center"
                    >
                      <v-btn dark class="re-show">{{
                        unit.rented_units
                      }}</v-btn>
                    </div>
                  </td>
                  <td class="p-0">
                    <div
                      v-if="!props.item.unit_details.length"
                      class="text-xs-center"
                    >
                      -----
                    </div>
                    <div
                      v-for="unit of props.item.unit_details"
                      :key="unit.id"
                      class="bg-grey text-xs-center"
                    >
                      <v-btn dark class="re-show">{{
                        unit.vacant_units
                      }}</v-btn>
                    </div>
                  </td>
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
              @input="fetchProperties(false)"
            ></v-pagination>
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import PropertyUnits from "../../components/Properties/PropertyUnits.vue";
import contractServices from "../../services/plugins/contract";
import propertyService from "../../services/plugins/properties";
import unitTypeService from "../../services/plugins/unit_type";
import TableLoader from "../../views/loaders/TableLoader";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import generatedReport from "@/services/plugins/generated_report";

export default {
  components: { PropertyUnits, TableLoader },
  name: "properties_list",
  props: ["on"],
  mixins: [breadItemsSetLang],
  data() {
    return {
      menu: "",
      unitTypes: [],
      totalCount: "",
      isCashPayment: "",
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      pagination: {
        rowsPerPage: 10
      },
      statuses: [
        { label: this.$t("Occupied"), value: "occupied" },
        { label: this.$t("Vacant"), value: "vacant" }
      ],
      unitType: "",
      isLoading: false,
      search: "",
      properties: [],
      status: "",
      row: ""
    };
  },
  async created() {
    try {
      await this.fetchProperties();
      const resp = await this.$processReq(
        unitTypeService.getUnitTypeList({
          limit: 1000
        }),
        false
      );
      this.unitTypes = resp.data.body.results;
    } catch (err) {
      console.log("Error: Unable to get unittype list - ", err);
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Property Name"),
          value: "property_name",
          align: !this.$vuetify.rtl ? "left" : "right",
          sortable: true
        },
        {
          text: this.$t("Address"),
          align: !this.$vuetify.rtl ? "left" : "right",
          sortable: false
        },
        { text: this.$t("Unit Type"), align: "center", sortable: false },
        { text: this.$t("Unit Description"), align: "center", sortable: false },
        { text: this.$t("Total Units"), align: "center", sortable: false },
        { text: this.$t("Rented Units"), align: "center", sortable: false },
        { text: this.$t("Vacant Units"), align: "center", sortable: false }
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
      this.fetchProperties();
    },
    row() {
      this.fetchProperties();
    },
    search() {
      this.fetchProperties(true);
    },
    order() {
      this.fetchProperties();
    }
  },
  methods: {
    async exportProperties() {
      this.isLoading = true;
      try {
        let data = {
          file_format: "xls",
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || undefined,
          unittype: this.unitType || undefined,
          status: this.status || undefined,
          isCashPayment: this.isCashPayment || undefined
        };

        if (this.row === "show-all") {
          data = {
            ...data,
            limit: this.totalCount,
            offset: 0
          };
        }

        if (this.filter) {
          data = {
            ...data,
            status: this.filter
          };
        }

        await this.$processReq(generatedReport.exportProperties(data), false);
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Report is being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: "Something went wrong while exporting csv",
          color: "error"
        });
      }
    },
    async printProperties() {
      this.isLoading = true;
      try {
        let data = {
          file_format: "pdf",
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || undefined,
          unittype: this.unitType || undefined,
          status: this.status || undefined,
          isCashPayment: this.isCashPayment || undefined
        };

        if (this.row === "show-all") {
          data = {
            ...data,
            limit: this.totalCount,
            offset: 0
          };
        }

        await this.$processReq(generatedReport.printProperties(data), false);
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("PDF is being generated"),
          color: "success"
        });
      } catch (err) {
        this.isLoading = false;
      }
    },
    async handleNavigation(action, data, property_id) {
      this.isLoading = true;
      if (
        action.value === "new_contract" ||
        action.value === "renew" ||
        action.value === "terminate"
      ) {
        const param = {
          unit: data.item.unit_id,
          action: action.id
        };
        try {
          await this.$processReq(
            contractServices.fetchContractValidation(param),
            false
          );
          this.isLoading = false;
        } catch (err) {
          console.log("Error: Unable to fetch contract validation - ", err);
          this.isLoading = false;
          return;
        }
      }
      const activeContract =
        data.item.contracts.find(
          contract => contract.status === this.$t("active")
        ) || {};
      this.$router
        .push({
          name: action.route,
          params: {
            id:
              action.value === "renew" ? activeContract.id : data.item.unit_id,
            property: {
              unit_id: data.item.unit_id,
              property_id
            },
            tenant_id: activeContract.tenant_id,
            tenant_name: activeContract.tenant_name,
            contract_id: activeContract.id
          }
        })
        .catch(error => console.log(error));
    },
    resetAllFilters() {
      this.unitType = "";
      this.status = "";
      this.isCashPayment = "";
      this.fetchProperties();
    },
    async fetchProperties(blockLoading) {
      try {
        this.menu = false;
        if (!blockLoading) {
          this.isLoading = true;
        }
        let params = {
          search: this.search,
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          ordering:
            (this.sortBy && this.sortBy.descending
              ? "-property_name"
              : "+property_name") || "",
          is_cash_payment_allowed: this.isCashPayment,
          unittype: this.unitType,
          unit_status: this.status
        };

        if (this.row === "show-all") {
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }
        const list = await this.$processReq(
          propertyService.getPropertiesList(params),
          false
        );
        this.isLoading = false;
        const response = list.data.body;

        this.properties = response.results;

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
        console.log(err);
      }
    }
  }
};
</script>

<style lang="css" scoped>
span {
  top: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.87);
  left: 4px;
}
.expanded .triangle {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  top: -2px;
}
.re-show:after {
  display: none;
}
.bg-grey:nth-child(even) {
  background: #e9ebef;
}
.p-0 {
  padding: 0px !important;
}
img {
  padding-left: 6px !important;
  margin-right: 6px;
  filter: brightness(0) invert(1);
}
</style>

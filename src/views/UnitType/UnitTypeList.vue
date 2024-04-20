<template>
  <v-layout wrap justify-center>
    <v-layout wrap justify-center>
      <v-flex xs12 sm12 lg10>
        <v-layout class="pt-5" wrap>
          <v-flex grow pa-1 xs10 sm7 md8>
            <v-layout align-start wrap>
              <h2 class="display-2 pl-4">{{ $t("Unit Type List") }}</h2>
            </v-layout>
          </v-flex>
          <v-flex shrink pa-1 xs2 sm5 md4 class="re-rel-pos" text-xs-right>
            <v-btn
              dark
              class="re-orangtbtn"
              :disabled="isLoading"
              :to="{ name: 'add_unit_type' }"
              >+ {{ $t("Add New Unit Type") }}</v-btn
            >
            <v-btn
              fab
              small
              outline
              v-on="on"
              :disabled="isLoading"
              class="re-abs-pos"
            >
              <v-icon>history</v-icon>
            </v-btn>
          </v-flex>
          <v-flex shrink pa-1 xs6 text-xs-right> </v-flex>
        </v-layout>

        <v-layout>
          <v-flex class="flex-wrap" xs12 pa-1>
            <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
              <template #divider>
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
              <v-radio-group v-model="row" class="re-radios">
                <v-radio :label="$t('All')" value="show-all" />
              </v-radio-group>
            </div>
            <v-spacer />
            <v-text-field
              hide-details
              v-model="search"
              :placeholder="$t('Search')"
              single-line
            />
            <v-spacer />
            <v-menu
              v-model="fitler"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="false"
                  dark
                  class="re-full"
                  @click="exportDataToCSV"
                >
                  {{ $t("Export Unit Type") }}
                </v-btn>
                <v-btn dark class="re-orangtbtn re-full" v-on="on">
                  {{ $t("Filter") }} <v-icon right>filter_list</v-icon>
                </v-btn>
              </template>

              <v-card class="pb-4">
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ $t("Filter") }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-btn icon @click="fitler = false">
                        <v-icon>close</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>

                <v-divider />

                <v-list>
                  <v-list-tile class="select-option">
                    <v-select
                      v-model="isCommercial"
                      :label="$t('Is Commercial')"
                      hide-details
                      item-text="label"
                      item-value="value"
                      :items="commercialFilter"
                    />
                  </v-list-tile>
                </v-list>

                <v-card-actions>
                  <v-spacer />
                  <v-btn dark class="re-orangtbtn" @click="searchFilters">{{
                    $t("Search")
                  }}</v-btn>
                  <v-btn
                    flat
                    class="re-gray-btn re-box-shadow"
                    @click="resetFilters"
                    >{{ $t("Reset") }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-toolbar>

          <v-layout style="overflow: auto">
            <v-data-table
              hide-actions
              class="width100"
              :headers="headers"
              :items="unitTypes"
              :pagination.sync="sortBy"
              :options.sync="pagination"
              :server-items-length="pagination.totalItems"
              :no-data-text="$t('No data available')"
            >
              <template v-slot:items="props">
                <tr @click="dialog = true">
                  <td
                    class="re-orange-color"
                    :class="{
                      'text-xs-right': $vuetify.rtl,
                      'text-xs-left': !$vuetify.rtl
                    }"
                  >
                    <div>{{ props.item.unit_type_name }}</div>
                  </td>
                  <td class="text-xs-center div ">
                    <div>{{ props.item.description }}</div>
                  </td>
                  <td class="text-xs-center">
                    <div>
                      {{ props.item.is_commercial ? $t("Yes") : $t("No") }}
                    </div>
                  </td>
                  <td class="re-td text-xs-center ">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">more_vert</v-icon>
                      </template>
                      <v-list>
                        <v-list-tile
                          class="list_tile"
                          style="cursor:pointer"
                          @click="
                            $router.push({
                              name: 'edit_unit_type',
                              params: { id: props.item.id }
                            })
                          "
                        >
                          <v-list-tile-title>{{
                            $t("Edit")
                          }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>
        </v-card>
        <div class="overflow-hidden text-xs-center pt-4" v-if="!isLoading">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
            :total-visible="10"
            class="re-pagination"
            @input="fetchData(false)"
          ></v-pagination>
        </div>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import { downloadCSV } from "../../helper";
import generatedReport from "../../services/plugins/generated_report";
import unitTypeService from "../../services/plugins/unit_type";
import TableLoader from "../../views/loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "unit_type_list",
  props: ["on"],
  components: {
    TableLoader
  },
  mixins: [breadItemsSetLang],
  async created() {
    await this.fetchData();
  },
  data() {
    return {
      isLoading: false,
      isCommercial: "",
      sortBy: {
        rowsPerPage: 10,
        descending: false
      },
      breadCrumbs: [],
      fitler: false,
      pagination: {
        rowsPerPage: 10
      },
      unitTypes: [],
      row: "",
      search: "",
      totalCount: 0
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Unit Type Name"),
          align: !this.$vuetify.rtl ? "left" : "right",
          value: "unit_type_name"
        },
        {
          text: this.$t("Unit Type Description"),
          align: "center",
          sortable: false,
          value: "unit_type-description"
        },
        { text: this.$t("Commercial"), align: "center", sortable: false },
        { text: this.$t("Action"), align: "center", sortable: false }
      ];
    },
    commercialFilter() {
      return [
        {
          label: this.$t("Is Commercial"),
          value: "true"
        },
        {
          label: this.$t("Is Residential"),
          value: "false"
        },
        {
          label: this.$t("Both Commercial and Residential"),
          value: ""
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
      this.fetchData();
    },
    async order() {
      if (this.row !== "show-all") {
        this.unitTypes = [];
        await this.fetchData();
      }
    },
    search() {
      this.fetchData(true);
    },
    row() {
      this.fetchData();
    }
  },
  methods: {
    searchFilters() {
      this.unitTypes = [];
      this.fetchData();
    },
    resetFilters() {
      this.isCommercial = "";
      this.fetchData();
    },
    async exportDataToCSV() {
      this.isLoading = true;
      try {
        let data = {
          file_format: "csv",
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || "",
          is_commercial: this.isCommercial,
          property: this.search.property,
          ordering:
            (this.sortBy && this.sortBy.descending
              ? "-unit_type_name"
              : "+unit_type_name") || ""
        };

        if (this.row === "show-all") {
          this.unitTypes = [];
          data = {
            ...data,
            limit: this.totalCount,
            offset: 0
          };
        }

        const result = await this.$processReq(
          generatedReport.exportUnitTypeToCSV(data),
          false
        );
        this.isLoading = false;

        downloadCSV(result.data, this.$t("Unit Type"));
        this.$root.$emit("snackbar", {
          text: this.$t("CSV downloaded succesfully"),
          color: "success"
        });
        this.$router.push({
          name: "generated-reports"
        });
      } catch (err) {
        this.isLoading = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while downloading csv"),
          color: "error"
        });
        console.log(err, "Error: Fetching Result of Unit type");
      }
    },
    async fetchData(blockLoading) {
      try {
        this.fitler = false;
        if (!blockLoading) {
          this.isLoading = true;
        }
        let params = {
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          search: this.search || "",
          is_commercial: this.isCommercial,
          ordering:
            (this.sortBy && this.sortBy.descending
              ? "-unit_type_name"
              : "+unit_type_name") || ""
        };

        if (this.row === "show-all") {
          this.unitTypes = [];
          params = {
            ...params,
            limit: this.totalCount,
            offset: 0
          };
        }

        const list = await this.$processReq(
          unitTypeService.getUnitTypeList(params),
          false
        );
        this.isLoading = false;
        this.unitTypes = list.data.body.results;
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

<style lang="css" scoped>
.list_tile {
  width: 8rem;
}
.list_tile:hover {
  background: #dcdcdc;
  color: orange;
}
.select-option >>> .v-list__tile {
  width: 28rem;
}
.select-option >>> .v-input {
  width: 100%;
}
</style>

<template>
  <v-container fluid>
    <v-layout column>
      <filtered-table-wrap :enableFilters="false">
        <template v-slot:header>
          <span class="mr-2">{{ $t("rows per page") }}:</span>
          <v-radio-group v-model="per_page" row>
            <v-radio v-if="total_rows_count > 10" label="10" :value="10" />
            <v-radio v-if="total_rows_count > 50" label="50" :value="50" />
            <v-radio v-if="total_rows_count > 100" label="100" :value="100" />
          </v-radio-group>
        </template>
        <v-data-table
          :headers="table_headers"
          :items="table_data"
          item-key="id"
          hide-actions
          class="table-wrap px-0"
        >
          <template v-slot:items="props">
            <td class="text-xs-left">
              {{ props.item["exported_at"] }}
            </td>
            <td class="text-xs-left">
              {{ props.item["module"] }}
            </td>
            <td class="text-xs-left">
              {{ props.item["file_format"] }}
            </td>
            <td class="text-xs-left">
              {{ props.item["records_amount"] | intformat }}
            </td>
            <td class="text-xs-left">
              {{ props.item["file"] && props.item["file"].size | sizeformat }}
            </td>
            <td class="text-xs-left">
              {{ props.item["duration"] || "-" }}
              <!-- {{duration(props.item["exported_at"],props.item["available_until"])}} -->
            </td>
            <td class="text-xs-left">
              {{ props.item["available_until"] }}
            </td>
            <td class="text-xs-left">
              {{ props.item["exported_by"] }}
            </td>
            <td class="text-xs-center d-flex align-center">
              <a
                v-if="props.item['status'] == 'finished'"
                :href="props.item['file']['url']"
                download
              >
                <v-icon color="success">download</v-icon>
              </a>
              <span v-else-if="props.item['status'] == 'in_progress'">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </span>
              <span v-else>
                <div>
                  <v-tooltip left color="error">
                    <template v-slot:activator="{ on }">
                      <v-icon color="error" v-on="on">close</v-icon>
                    </template>
                    {{ props.item["message"] }}
                  </v-tooltip>
                </div>
              </span>
            </td>
          </template>
        </v-data-table>
      </filtered-table-wrap>
      <Paginator v-if="pages_count > 1" :pages-count="pages_count" />
    </v-layout>
  </v-container>
</template>

<script>
import FilteredTableWrap from "../../components/FilteredTableWrap";
import Paginator from "../../components/Paginator";
import { getListFiltersFromQuery } from "../../lib/filters";
import GeneratedReports from "../../services/plugins/generated_report";
import BaseList from "../BaseList";
export default {
  name: "GeneratedReportList",
  mixins: [BaseList],
  components: {
    Paginator,
    FilteredTableWrap
  },
  data: () => ({
    table_data: [],
    pages_count: 0,
    total_rows_count: 0
  }),
  computed: {
    default_table_headers() {
      const headers = [
        { text: this.$t("Export Date"), value: "exported_at", sortable: false },
        { text: this.$t("Module"), value: "type", sortable: false },
        { text: this.$t("Format"), value: "file_format", sortable: false },
        { text: this.$t("Records"), value: "records_amount", sortable: false },
        { text: this.$t("Size"), value: "size", sortable: false },
        { text: this.$t("Duration"), value: "period", sortable: false },
        {
          text: this.$t("Available until"),
          value: "available",
          sortable: false
        },
        { text: this.$t("Exported by"), value: "username", sortable: false },
        { text: this.$t("Download"), value: "file", sortable: false }
      ];
      return headers;
    },
    table_headers() {
      // const configured_headers = this.config_fields?.map(field => ({
      //   text: field["label_" + this.$i18n.locale],
      //   value: field.name,
      //   sortable: false
      // }));
      return [
        ...this.default_table_headers
        // ...configured_headers
      ];
    },
    per_page: {
      get: function() {
        return parseInt(this.$route.query.per_page) || 10;
      },
      set: function(value) {
        this.$router.push({ query: { ...this.$route.query, per_page: value } });
      }
    }
  },
  methods: {
    async getListConfig() {
      try {
        return await GeneratedReports.getListMetadata();
        // this.setConfig(res.data.actions.GET);
      } catch (err) {
        console.log("Error: Unable to get List of Metadata - ", err);
      }
    },
    setConfig(config) {
      this.config_fields = config.config_fields.map(
        ({ name, label_en, label_ar }) => ({ name, label_en, label_ar })
      );
    },
    async getGeneratedReportsList(params) {
      try {
        const res = await GeneratedReports.getList(params);
        this.table_data = res.data.body.results;
        this.total_rows_count = res.data.body.count;
        this.pages_count = Math.ceil(res.data.body.count / this.per_page);
      } catch (err) {
        console.log("Error: Unable to get generated report list - ", err);
      }
    },
    hasPerm() {
      // TODO: get data from vuex
      return true;
    },
    async getDetail(id, notification) {
      try {
        const res = await GeneratedReports.getDetails(id);
        var found = this.table_data.filter(f => f.id == id)[0];
        if (found) {
          for (const property in found) {
            found[property] = res.data[property];
          }
        }
        if (notification) {
          if (res.data.status === "finished") {
            this.$root.$emit("snackbar", {
              text: this.$t(
                "Your export is completed please download it from below list."
              ),
              color: "info"
            });
          } else {
            this.$root.$emit("snackbar", {
              text: this.$t(
                "Your export is in process you can download once it will be done."
              ),
              color: "info"
            });
          }
        }
      } catch (err) {
        console.log("Error: Unable to get Details - ", err);
      }
    }
  },
  filters: {
    intformat: function(value) {
      if (!value) return "-";
      var amt = Number(value);
      return (
        (amt && amt.toLocaleString(undefined, { maximumFractionDigits: 2 })) ||
        "0"
      );
    },
    sizeformat: function(value) {
      var data = Number(value);
      const const_term = 1024;
      var to = "";
      switch ((data / const_term).toFixed(0).toString().length) {
        case 1:
        case 2:
        case 3:
          to = "KB";
          break;
        case 4:
        case 5:
        case 6:
          to = "MB";
          break;
        case 7:
        case 8:
        case 9:
          to = "GB";
          break;
        default:
          break;
      }
      if (data <= const_term) {
        return data + " bytes";
      } else if (to === "KB") {
        return (data / const_term).toFixed(1) + "KB";
      } else if (to === "MB") {
        return (data / const_term ** 2).toFixed(1) + "MB";
      } else if (to === "GB") {
        return (data / const_term ** 3).toFixed(1) + "GB";
      } else if (to === "TB") {
        return (data / const_term ** 4).toFixed(1) + "TB";
      } else {
        return (data / const_term).toFixed(0).toString().length;
      }
    }
  },
  created() {
    const params = getListFiltersFromQuery(this.$route.query, this.per_page);
    if (this.$route.params.id) {
      this.getDetail(this.$route.params.id, true);
    }
    this.getListConfig();
    this.getGeneratedReportsList(params);
  },
  watch: {
    "$route.query": function(new_params) {
      const params = this.getListFilters(new_params);
      this.getGeneratedReportsList(params);
    }
    // it could be 'data' in payload this means paymen
  }
};
</script>

<style scoped></style>

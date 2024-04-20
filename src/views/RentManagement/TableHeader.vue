<template>
  <v-toolbar class="re-toolbar re-wrap">
    <div class="re-flex">
      {{ $t("Rows Per Page") }}
      <v-radio-group v-model="row" class="re-radios" @change="changeRow">
        <v-radio :label="$t('All')" value="show-all"></v-radio>
      </v-radio-group>
    </div>
    <v-spacer></v-spacer>
    <v-text-field
      hide-details
      :placeholder="$t('Search')"
      single-line
      v-model="search.search"
      @input="inputSearch"
    />
    <v-spacer></v-spacer>
    <v-btn dark class="re-fill" @click="showDialog">
      {{ $t("Notify Payments") }}
    </v-btn>
    <v-btn dark class="re-fill" @click="printRent(search)">
      <img src="@/assets/printer.svg" />
      {{ $t("Print") }}
    </v-btn>
    <v-btn dark class="re-full" @click="exportRent">{{
      $t("Export Rent Details")
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
              v-model="search.payment_month"
              :label="$t('Month')"
              :items="months"
            />
          </v-list-tile>

          <v-list-tile>
            <v-text-field :label="$t('Year')" v-model="search.payment_year" />
          </v-list-tile>

          <v-list-tile>
            <v-autocomplete
              v-model="search.contract__property"
              :label="$t('Property name')"
              item-text="property_name"
              item-value="id"
              :items="properties"
              :no-data-text="
                `${
                  isLoadingOptions ? $t('Loading...') : $t('No data available')
                }`
              "
              @input.native="fetchProperties"
            />
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile>
            <v-select
              v-model="search.status"
              item-text="label"
              item-value="value"
              :label="$t('Status')"
              :items="statuses"
            />
          </v-list-tile>
        </v-list>
        <v-list>
          <v-list-tile>
            <v-checkbox
              :label="$t('Is Manual')"
              v-model="search.is_manual_payment"
              :false-value="null"
              :true-value="true"
            />
          </v-list-tile>
        </v-list>
        <v-list>
          <v-list-tile>
            <v-checkbox
              :label="$t('Is Late Payment')"
              v-model="search.is_late_payment"
              :false-value="null"
              :true-value="true"
            />
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile>
            <v-checkbox
              :label="$t('Is Missed')"
              v-model="search.is_missed"
              :false-value="null"
              :true-value="true"
            />
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile>
            <v-checkbox
              :label="$t('Is Open Balance')"
              v-model="search.is_open_balance"
              :false-value="null"
              :true-value="true"
            />
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile>
            <v-checkbox
              v-model="search.is_suspended"
              :label="$t('Is Suspended')"
              :false-value="null"
              true-value="True"
            />
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn dark class="re-orangtbtn" @click="searchClick">
            {{ $t("Search") }}
          </v-btn>
          <v-btn flat @click="resetClick" class="re-gray-btn re-box-shadow">{{
            $t("Reset")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { isEmpty, debounce } from "lodash";
import moment from "moment";

import { getMonthLabels } from "../../lib/date_time";
import propertiesService from "../../services/plugins/properties";

export default {
  props: [
    "limit",
    "page",
    "totalCount",
    "payment",
    "printRent",
    "exportRent",
    "showDialog"
  ],
  data: () => ({
    row: "",
    search: {},
    menu: false,
    months: getMonthLabels(),
    properties: "",
    isLoadingOptions: false,
    fetchProperties: null
  }),
  created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.fetchProperties();
  },
  watch: {
    payment() {
      if (this.payment && this.payment.last_payment_month) {
        this.search.payment_month = moment()
          .month(this.payment.last_payment_month)
          .format("MMM");
        this.search.payment_year = this.payment.last_payment_year;
      }
    }
  },
  computed: {
    statuses() {
      return [
        { label: this.$t("All"), value: null },
        { label: this.$t("Paid"), value: "Paid" },
        { label: this.$t("Pending"), value: "Pending,Expired" }
      ];
    }
  },
  methods: {
    changeRow() {
      this.$emit("changeRow", this.row);
    },
    inputSearch() {
      let search = this.search;
      if (search.payment_month) {
        search = {
          ...search,
          payment_month: moment()
            .month(search.payment_month)
            .format("M")
        };
      }
      this.$emit("search", search);
    },
    resetClick() {
      this.search = {};
      this.$emit("loadSearch", this.search);
      this.menu = false;
    },
    searchClick() {
      let flag = false;

      if (isEmpty(this.search)) {
        flag = true;
      }

      if (!(this.search.payment_month && this.search.payment_year)) {
        flag = true;
      }

      if (flag) {
        this.$root.$emit("snackbar", {
          text: "Kindly, select the month and year of the payment list",
          color: "error"
        });
        return;
      }

      let search = this.search;
      if (search.payment_month) {
        search = {
          ...search,
          payment_month: moment()
            .month(search.payment_month)
            .format("M")
        };
      }
      this.$emit("loadSearch", search);
      this.menu = false;
    },
    async loadProperties(event) {
      try {
        this.isLoadingOptions = true;
        let params = {
          limit: 10,
          offset: 0
        };
        if (event) {
          params = {
            ...params,
            search: event.target.value
          };
        } else {
          params.search = "";
        }

        const response = await this.$processReq(
          propertiesService.getPropertiesList(params),
          false
        );

        this.properties = response.data.body.results;
        this.isLoadingOptions = false;
      } catch (err) {
        this.isLoadingOptions = false;
        console.log("Error: Unable to get properties list - ", err);
      }
    }
  }
};
</script>

<style scoped>
img {
  margin-right: 6px;
  padding-left: 6px;
  filter: brightness(0) invert(1);
}
</style>

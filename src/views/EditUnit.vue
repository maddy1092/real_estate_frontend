<template>
  <div class="edit-unit">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Property") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" @click="goBack"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="flex-wrap" xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg9>
          <v-card v-if="!isLoading">
            <v-card-title>
              <h3>{{ $t("Edit Unit") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <div class="d-flex flex-row justify-space-between">
                  <div class="v-text-field v-input">
                    {{ $t("Property Name") }}
                  </div>
                  <div align="center" class="d-flex">
                    <div cols="6">
                      <v-subheader class="justify-end align-end"
                        >{{ $t("Status") }}:</v-subheader
                      >
                    </div>
                    <div cols="6" style="flex:0.5 1 0% !important">
                      <v-select
                        v-model="unit.status"
                        disabled
                        dense
                        :items="unitStatuses"
                      />
                    </div>
                  </div>
                </div>
                <v-text-field
                  v-model="unit.unit_number"
                  v-validate="'required|alpha_num'"
                  dense
                  required
                  :label="$t('Unit Number')"
                  data-vv-name="unit_number"
                  :error-messages="errors.collect('unit_number')"
                />
                <v-text-field
                  v-model="unit.floor"
                  v-validate="'required|alpha_num'"
                  dense
                  required
                  :label="$t('Floor')"
                  data-vv-name="floor"
                  :error-messages="errors.collect('floor')"
                />
              </v-form>
            </v-card-text>
          </v-card>

          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'300px'"
            :width="'100%'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex md12 lg9 text-xs-right>
        <v-btn
          v-if="!isLoading"
          @click="checkNavigation"
          class="re-orangtbtn mt-5 mb-3 mr-0"
        >
          {{ $t("New Contract") }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-flex md12 lg9>
        <v-card class="tenant pb-4" v-if="!isLoadingTable">
          <v-card-title>
            <h3>{{ $t("Tenant History") }}</h3>
          </v-card-title>
          <div style="overflow:auto">
            <v-data-table
              :headers="headers"
              :items="contracts"
              class="width100 p-5"
              :options.sync="pagination"
              :no-data-text="$t('No data available')"
              hide-actions
            >
              <template v-slot:items="props">
                <td class="re-orange-color text-xs-center">
                  {{ props.item.tenant.tenant_name }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.tenant.tenant_info.phone_number }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.tenant.tenant_info.email }}
                </td>
                <td class="text-xs-center">{{ props.item.id }}</td>
                <td class="text-xs-center">
                  {{ props.item.contract_start_date }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.contract_end_date }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.leave_notice_date }}
                </td>
              </template>
            </v-data-table>
          </div>
        </v-card>
        <div class="overflow-hidden text-xs-center pt-4" v-if="!isLoadingTable">
          <v-pagination
            v-model="pagination.page"
            :length="pages"
            :total-visible="10"
            class="re-pagination"
            @input="fetchContractHistory"
          ></v-pagination>
        </div>
        <table-loader v-if="isLoadingTable" />
      </v-flex>
    </v-layout>
    <div class="text-xs-center mt-4">
      <v-btn v-if="!isLoading" dark class="re-orangtbtn" @click="updateUnit">{{
        $t("Save")
      }}</v-btn>
      <v-btn v-if="!isLoading" dark @click="goBack">{{ $t("Cancel") }}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import contractServices from "../services/plugins/contract";
import unitService from "../services/plugins/units";

import TableLoader from "./loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  components: { TableLoader },
  name: "edit-unit",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      unit: {},
      isAllowed: false,
      isLoading: false,
      isLoadingTable: false,
      contracts: [],
      prevRoute: "",
      pagination: {
        rowsPerPage: 5
      }
    };
  },
  async created() {
    const params = this.$route.params;
    if (params.id) {
      this.fetchUnitDetails(params.id);
      await this.validateUnit();
    }
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchContractHistory();
    }
  },
  computed: {
    ...mapGetters("property", ["getProperty", "getIndex", "getUnitIndex"]),
    unitStatuses() {
      return [
        { text: this.$t("Vacant"), value: "vacant" },
        { text: this.$t("Occupied"), value: "occupied" }
      ];
    },
    headers() {
      return [
        { text: this.$t("Tenant Name"), align: "center", sortable: false },
        { text: this.$t("Phone"), align: "center", sortable: false },
        { text: this.$t("Email"), align: "center", sortable: false },
        { text: this.$t("Contract Id"), align: "center", sortable: false },
        { text: this.$t("Start Date"), align: "center", sortable: false },
        { text: this.$t("End Date"), align: "center", sortable: false },
        { text: this.$t("Leave Date"), align: "center", sortable: false }
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
  methods: {
    ...mapActions("property", ["setProperty"]),
    goBack() {
      if (this.prevRoute && this.prevRoute.path.includes("property")) {
        let property = this.getProperty;

        property.unit_types[this.getIndex].units[this.getUnitIndex] = {
          ...property.unit_types[this.getIndex].units[this.getUnitIndex],
          unit_number: this.unit.unit_number,
          floor: this.unit.floor
        };
        this.setProperty(property);
        this.$router.push({
          name: this.prevRoute.name,
          params: {
            id: this.prevRoute.params.id
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    checkNavigation() {
      if (this.isAllowed) {
        this.$router.push({
          name: "add_contract",
          params: {
            property: {
              unit_id: this.unit.id,
              property_id: this.unit.unit_property
            }
          }
        });
      } else {
        this.$root.$emit("snackbar", {
          text: this.$t(
            "All the previous contracts should be terminated before making a new contract"
          ),
          color: "error"
        });
      }
    },
    async validateUnit() {
      try {
        this.isLoading = true;
        await this.$processReq(
          contractServices.validateUnit(this.$route.params.id),
          false,
          false
        );

        this.isAllowed = true;
        this.isLoading = false;
      } catch (err) {
        this.isAllowed = false;
        console.log('Error: Unable to validate unit - ', err);
      }
    },
    async fetchUnitDetails(unitID) {
      try {
        this.isLoading = true;
        this.isLoadingTable = true;

        const response = await this.$processReq(
          unitService.fetchUnitByID(unitID),
          false
        );

        this.isLoading = false;
        this.unit = response.data.body;

        this.fetchContractHistory();
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to Fetch unit by ID - ", err);
      }
    },
    async fetchContractHistory() {
      try {
        this.isLoadingTable = true;
        let params = {
          limit: 10,
          offset: this.pagination.page ? (this.pagination.page - 1) * 5 : 0,
          unit: this.unit.id
        };

        const response = await this.$processReq(
          contractServices.fetchContractList(params),
          false
        );
        this.isLoadingTable = false;

        this.contracts = response.data.body.results;
        this.pagination = {
          ...this.pagination,
          totalItems: response.data.body.count,
          page: this.pagination.page > 0 ? this.pagination.page : 1,
          rowsPerPage: 5
        };

        this.totalCount = response.data.body.count;
      } catch (err) {
        this.isLoadingTable = false;
        console.log("Error: Unable to Fetch contract list - ", err);
      }
    },
    async updateUnit() {
      try {
        if (await this.$validator.validateAll()) {
          this.isLoading = true;
          this.isLoadingTable = true;
          const resp = {
            ...this.unit,
            price: parseFloat(this.unit.price),
            invoice_amount: parseFloat(this.unit.invoice_amount)
          };

          const response = await this.$processReq(
            unitService.updateUnit(this.unit.id, resp),
            false
          );
          this.isLoading = false;
          this.isLoadingTable = false;
          this.unit = response.data.body;
          if (response.status === 200 || response.status === 201) {
            this.goBack();
          }
        }
      } catch (err) {
        this.isLoading = false;
        this.isLoadingTable = false;
        console.log('Error: Unable to update unit - ', err);
      }
    }
  }
};
</script>

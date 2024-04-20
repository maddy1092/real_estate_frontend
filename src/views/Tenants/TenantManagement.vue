<template>
  <div class="tenant-managmement">
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
                    {{ $t("Tenant Management") }}
                  </h2>
                </v-flex>
                <v-flex xs12 md8> </v-flex>
              </v-layout>
            </v-flex>
            <v-flex shrink pa-1 xs12 sm7 md4 class="re-rel-pos text-xs-right">
              <v-btn
                dark
                class="re-orangtbtn re-ml-4"
                @click="$router.push({ name: 'add_tenant' })"
                ><v-icon>add</v-icon> {{ $t("Add Tenant") }}
              </v-btn>
              <v-btn fab small outline v-on="on">
                <v-icon>history</v-icon>
              </v-btn>
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
                <v-radio-group v-model="row" row class="re-radios"
                  ><v-radio :label="$t('All')" value="show-all"></v-radio>
                </v-radio-group>
              </div>
              <div class="re-flex">
                <v-checkbox
                  v-model="allExpanded"
                  :label="$t('Expand')"
                  :false-value="null"
                  :true-value="true"
                />
              </div>
              <v-spacer />

              <v-text-field
                hide-details
                :placeholder="$t('Search')"
                outline
                class="search-field"
                v-model="search"
                single-line
              >
                <template v-slot:prepend>
                  <img src="@/assets/search.svg" />
                </template>
              </v-text-field>

              <v-btn dark class="re-fill" @click="printTenantContracts">
                <img class="print-icon" src="@/assets/printer.svg" />
                {{ $t("Print") }}
              </v-btn>
              <contract-list-filter
                v-model="filter"
                filterType="is_tenant"
                :tenantsData="tenants"
                @fetchResult="fetchTenants"
              />
            </v-toolbar>
            <v-layout style="overflow:auto" class="container__div">
              <div class="tenant-management__table">
                <v-data-table
                  hide-headers
                  hide-actions
                  :items="tenants"
                  :expand="expand"
                  :item-key="allExpanded ? 'expandId' : 'id'"
                  :no-data-text="$t('No data available')"
                  :headers="headers"
                  ref="dTable"
                >
                  <template v-slot:items="props">
                    <tr
                      :class="{ 'active-class': props.expanded }"
                      class="outer-row"
                    >
                      <td>
                        <div style="width: fit-content">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <img
                                class="actions"
                                v-on="on"
                                src="@/assets/dotedVertical.svg"
                              />
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(action, index) in actions"
                                :key="index"
                                @click="
                                  $router.push({
                                    name: action.route,
                                    params: {
                                      id: props.item.id,
                                      tenant_id: props.item.id,
                                      isTenant: true
                                    }
                                  })
                                "
                              >
                                <v-list-tile-title>{{
                                  action.title
                                }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </div>
                      </td>
                      <td>
                        <span class="icons">
                          <img src="@/assets/contact.svg" />
                        </span>

                        <span>
                          {{
                            $i18n.locale === "ar"
                              ? props.item.tenant_name_ar
                              : props.item.tenant_name_en
                          }}
                        </span>
                      </td>
                      <td>
                        <span>{{ $t("Civil ID") }}</span>
                        <span>
                          {{ props.item.tenant_info.civil_id_number }}
                        </span>
                      </td>
                      <td>
                        <span>{{ $t("ID") }}</span>
                        <span>{{ props.item.id }}</span>
                      </td>
                      <td>
                        <span class="icons">
                          <img src="@/assets/phone.svg" />
                        </span>

                        <span>{{ props.item.tenant_info.phone_number }}</span>
                      </td>
                      <td>
                        <span class="icons">
                          <img src="@/assets/email.svg" />
                        </span>

                        <span>{{ props.item.tenant_info.email }}</span>
                      </td>
                      <td>
                        <button @click="props.expanded = !props.expanded">
                          <img
                            v-if="props.expanded"
                            src="@/assets/downArrow.svg"
                          />
                          <img v-else src="@/assets/upArrow.svg" />
                        </button>
                      </td>
                    </tr>
                  </template>
                  <template v-slot:expand="props">
                    <v-card flat>
                      <v-card-text>
                        <v-data-table
                          :headers="headers"
                          :custom-sort="sortData"
                          :items="props.item.contract_info"
                          :expand="expand"
                          :no-data-text="$t('No data available')"
                          item-key="contract_number"
                          hide-actions
                          class="nested-datatable"
                        >
                          <template v-slot:items="props">
                            <tr>
                              <td class="text-xs-center">
                                {{ props.item.property_name }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.unit_number }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.contract_number }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.reference || "-" }}
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
                                {{ props.item.start_date || "-" }}
                              </td>

                              <td class="text-xs-center">
                                {{ props.item.end_date || "-" }}
                              </td>
                              <td class="text-xs-center">
                                {{ props.item.amount || "-" }}
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
                                      v-for="(action, index) in actions2"
                                      :disabled="
                                        disableAction(props.item, action)
                                      "
                                      :key="index"
                                      @click="
                                        handleNavigation(
                                          action,
                                          props.item,
                                          props
                                        )
                                      "
                                    >
                                      <v-list-tile-title>{{
                                        action.title
                                      }}</v-list-tile-title>
                                    </v-list-tile>
                                  </v-list>
                                </v-menu>
                              </td>

                              <td class="text-xs-center">
                                <button
                                  @click="props.expanded = !props.expanded"
                                >
                                  <img
                                    v-if="props.expanded"
                                    src="@/assets/downArrow.svg"
                                  />
                                  <img v-else src="@/assets/upArrow.svg" />
                                </button>
                              </td>
                            </tr>
                          </template>
                          <template v-slot:expand="props">
                            <v-card flat>
                              <v-card-text>
                                <v-data-table
                                  :headers="headers1"
                                  :items="[props.item]"
                                  :no-data-text="$t('No data available')"
                                  hide-actions
                                  class="most-inner-datatable"
                                >
                                  <template v-slot:items="props">
                                    <tr>
                                      <td class="text-xs-center">
                                        {{
                                          props.item.payment_start_date || "-"
                                        }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{ props.item.termination_date || "-" }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.original_amount || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td>
                                        <v-checkbox
                                          class="justify-center"
                                          v-model="props.item.is_suspended"
                                          disabled="true"
                                        />
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.insurance_amount || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        <div v-if="!props.item.attachment">
                                          -
                                        </div>
                                        <v-icon
                                          v-else
                                          @click="downloadImage(props.item)"
                                        >
                                          download
                                        </v-icon>
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.ob_not_paid_amt || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        {{ props.item.ob_not_paid_count || 0 }}
                                      </td>
                                    </tr>
                                  </template>
                                </v-data-table>
                              </v-card-text>
                            </v-card>
                            <v-card flat>
                              <v-card-text>
                                <v-data-table
                                  :headers="headers2"
                                  :items="[props.item]"
                                  :no-data-text="$t('No data available')"
                                  hide-actions
                                  class="most-inner-datatable"
                                >
                                  <template v-slot:items="props">
                                    <tr>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.ob_paid_amt || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        {{ props.item.ob_paid_count || 0 }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.invoice_not_paid_amt || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          props.item.invoice_not_paid_count || 0
                                        }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.invoice_paid_amt || 0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        {{ props.item.invoice_paid_count || 0 }}
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          parseInt(
                                            props.item.remaining_invoice_amt ||
                                              0
                                          ).toFixed(3)
                                        }}
                                        KD
                                      </td>
                                      <td class="text-xs-center">
                                        {{
                                          props.item.remaining_invoice_count ||
                                            0
                                        }}
                                      </td>
                                    </tr>
                                  </template>
                                </v-data-table>
                              </v-card-text>
                            </v-card>
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
              @input="fetchTenants(false)"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-layout>
    <invoices-dialogue
      v-model="showInvoiceTab"
      :title="$t('Contract Invoices')"
      :selectedInvoices="selectedContractInvoices"
      :isDialogLoading="invoiceDialog"
      :isUpdatingInvices="isUpdatingInvices"
      @updateInvoices="updateInvoices"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import moment from "moment";
import Vue from "vue";

import InvoicesDialogue from "../../components/dialog/InvoicesDialogue.vue";
import { ContractEnums } from "../../enums";
import { downloadImage, getFileExtension } from "../../helper";
import { getYear, numToMonth } from "../../helper";
import { transformContractFilter } from "../../helper/filters";
import { fetchPlugins } from "../../services/common.js";
import contractServices from "../../services/plugins/contract";
import invoiceServices from "../../services/plugins/invoices.js";
import tenantServices from "../../services/plugins/tenant";
import TableLoader from "../../views/loaders/TableLoader.vue";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import generatedReport from "@/services/plugins/generated_report";
import ContractListFilter from "@/views/contracts/List/ContractListFilter.vue";
import "@/assets/tenantStyles.css";

export default {
  name: "TenantManagement",
  mixins: [breadItemsSetLang],
  props: ["on"],
  components: { TableLoader, InvoicesDialogue, ContractListFilter },
  data() {
    return {
      is_activated: false,
      selectedContract: "",
      dialog: false,
      row: "",
      expand: false,
      filter: {
        status: "running"
      },
      filterMenu: false,
      loadProperties: null,
      pagination: {
        rowsPerPage: 5
      },
      totalCount: 0,
      sortBy: {
        rowsPerPage: 10
      },
      properties: [],
      selectedProperties: "",
      isSuspended: "",
      tenants: [],
      allExpanded: false,
      showInvoiceTab: false,
      contract: {},
      isLoading: false,
      count: 10,
      isLoadingOptions: false,
      search: "",

      generatedInvoices: [],
      missedInvoices: [],
      openBalanceInvoices: [],
      selectedContractInvoices: [],
      invoiceDialog: false,
      isDialogLoading: false,
      isUpdatingInvices: false
    };
  },
  watch: {
    "$i18n.locale": function() {
      this.fetchTenants();
    },
    search() {
      this.fetchTenants(true);
    },
    row() {
      this.fetchTenants();
    },
    orderBy() {
      this.fetchTenants();
    },
    allExpanded(val) {
      if (val) {
        this.$set(this.$refs.dTable.expanded, Vue.prototype.$merchant, true);
      } else {
        for (const tenant of this.tenants) {
          this.$set(this.$refs.dTable.expanded, tenant.id, false);
        }
      }
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Property"),
          value: "property",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Unit"),
          value: "unit",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract No."),
          value: "contract_no",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Contract Ref"),
          value: "contract_ref",
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
          text: this.$t("Start Date"),
          value: "start_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("End Date"),
          value: "end_date",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Paid Amount"),
          value: "paid_amount",
          align: "center",
          sortable: false
        },
        {
          text: "",
          align: "left",
          sortable: false
        },
        {
          text: "",
          align: "left",
          sortable: false
        }
      ];
    },
    headers1() {
      return [
        {
          text: this.$t("Payment Start Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Termination Date"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Original Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Is Suspended"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Insurance Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Download Link"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("OB NOT PAID AMOUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("OB NOT PAID COUNT"),
          align: "center",
          sortable: false
        }
      ];
    },
    headers2() {
      return [
        {
          text: this.$t("OB PAID AMOUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("OB PAID COUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("INVOICE NOT PAID AMOUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("INVOICE NOT PAID COUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("INVOICE PAID AMOUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("INVOICE PAID COUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("REMAINING INVOICE AMOUNT"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("REMAINING INVOICE COUNT"),
          align: "center",
          sortable: false
        }
      ];
    },
    actions() {
      return [
        { title: this.$t("Edit Tenant"), route: "edit_tenant" },
        {
          title: this.$t("New Contract"),
          route: "add_contract"
        }
      ];
    },
    actions2() {
      return [
        {
          id: 2,
          title: this.$t("Renew Contract"),
          value: "renew",
          route: "renew_contract"
        },
        {
          id: 3,
          title: this.$t("Terminate Contract"),
          value: "terminate",
          route: "terminate_contract"
        },
        {
          title: this.$t("Manual Payment"),
          value: "manual",
          route: "manual_payment"
        },
        {
          title: this.$t("Suspend Contract"),
          value: "suspend"
        },
        {
          title: this.$t("Resume Contract"),
          value: "resume"
        },
        {
          title: this.$t("Modify Contract"),
          value: "modify",
          route: "modify_payment"
        },
        {
          title: this.$t("Invoices"),
          value: "invoice",
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
    orderBy() {
      return this.sortBy.descending;
    }
  },
  created() {
    this.fetchTenants();
    this.getConfig();
  },
  mounted() {
    this.allExpanded = true;
  },
  methods: {
    sortData(items) {
      return items.sort(
        (a, b) =>
          a.property_name.localeCompare(b.property_name) ||
          a.unit_number - b.unit_number
      );
    },
    async getConfig() {
      try {
        let res = await this.$processReq(fetchPlugins(), false);

        this.is_activated = res.data.is_activated;
      } catch (err) {
        console.log("Unable to get Configurations", err);
      }
    },
    closeDialog() {
      this.selectedContractInvoices = [];
      this.generatedInvoices = [];
      this.missedInvoices = [];
      this.openBalanceInvoices = [];
    },
    closeFilter() {
      this.filter = {};
    },
    async printTenantContracts() {
      this.isLoading = true;
      try {
        let data = {
          file_format: "pdf",
          tenant: this.filter.tenant,
          property: this.filter.property,
          civil_id: this.filter.civilId,
          reference: this.filter.reference,
          is_suspended: this.filter.is_suspended ? true : undefined,
          status: this.filter.status,
          search: this.search || undefined,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        };
        await this.$processReq(generatedReport.printTenant(data));
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Enable to print tenants", err);
      }
    },
    async fetchGeneratedInvoices(contract_id) {
      try {
        let data = {
          is_open_balance: 0,
          is_missed: 0
        };
        const resp = await this.$processReq(
          invoiceServices.fetchSelectedInvoices(data, contract_id),
          false
        );

        const invoices = resp.data.body;
        this.generatedInvoices = invoices.map(invoice => {
          return {
            ...invoice,
            is_paid: invoice.status === "Paid" || invoice.is_grace_period,
            payment_date: invoice.payment_date
              ? moment(invoice.payment_date).format("YYYY-MM-DD")
              : "",
            payment_year: invoice.payment_year || getYear(invoice.payment_date),
            payment_month:
              invoice.payment_month || numToMonth(invoice.payment_date),
            is_generated: true
          };
        });

        this.selectedContractInvoices = [
          ...this.openBalanceInvoices,
          ...this.missedInvoices,
          ...this.generatedInvoices
        ];
      } catch (err) {
        console.log("Enable to fetch normally generated invoices", err);
      }
    },
    async fetchOpenBalanceInvoices(contract_id) {
      try {
        let data = {
          is_open_balance: 1
        };
        const resp = await this.$processReq(
          invoiceServices.fetchSelectedInvoices(data, contract_id),
          false
        );

        const invoices = resp.data.body;
        this.openBalanceInvoices = invoices.map(invoice => {
          return {
            ...invoice,
            is_paid: invoice.status === "Paid" || invoice.is_grace_period,
            payment_date: invoice.payment_date
              ? moment(invoice.payment_date).format("YYYY-MM-DD")
              : "",
            payment_year: invoice.payment_year || getYear(invoice.payment_date),
            payment_month:
              invoice.payment_month || numToMonth(invoice.payment_date),
            is_open_balance: true
          };
        });
      } catch (err) {
        console.log("Enable to fetch open balance invoices", err);
      }
    },
    async fetchMissedInvoices(contract_id) {
      try {
        let data = {
          is_missed: 1
        };
        const resp = await this.$processReq(
          invoiceServices.fetchSelectedInvoices(data, contract_id),
          false
        );

        const invoices = resp.data.body;
        this.missedInvoices = invoices.map(invoice => ({
          ...invoice,
          is_paid: invoice.status === "Paid" || invoice.is_grace_period,
          payment_date: invoice.payment_date
            ? moment(invoice.payment_date).format("YYYY-MM-DD")
            : "",
          payment_year: invoice.payment_year || getYear(invoice.payment_date),
          payment_month:
            invoice.payment_month || numToMonth(invoice.payment_date),
          is_missed: true
        }));
      } catch (err) {
        console.log("Enable to fetch missed invoices", err);
      }
    },
    async updateInvoices() {
      this.isUpdatingInvices = true;
      try {
        let invoices = this.selectedContractInvoices.map(invoice => {
          invoice = {
            ...invoice,
            status: invoice.is_paid ? "Paid" : "Expired",
            payment_year: invoice.payment_year || getYear(invoice.payment_date),
            payment_month:
              invoice.payment_month || numToMonth(invoice.payment_date)
          };

          delete invoice.is_paid;
          delete invoice.actual_paid_amount;
          return invoice;
        });

        invoices = invoices.filter(invoice => !invoice.is_generated);

        const data = {
          reason: ContractEnums.TenantContractInvoice,
          modified_payments: invoices
        };

        const response = await this.$processReq(
          invoiceServices.updateInvoices(data),
          false
        );
        this.$root.$emit("snackbar", {
          text: this.$t(
            `${response.data?.body?.success || "Payments has been updated"}`
          ),
          color: "success"
        });
        this.showInvoiceTab = false;
      } catch (err) {
        this.showInvoiceTab = false;
        console.log("Unable to update invoices invoices", err);
      }
      this.isUpdatingInvices = false;
      this.fetchTenants();
    },
    async handleNavigation(action, item, props) {
      this.isLoading = true;
      if (action.value === "renew" || action.value === "terminate") {
        const param = {
          unit: item.unit_id,
          action: action.id
        };
        try {
          await this.$processReq(
            contractServices.fetchContractValidation(param),
            false
          );
        } catch (err) {
          console.log(err, "Error: Unable to fetch contract validation - ");
          this.isLoading = false;
          return;
        }
      }
      if (action.value === "invoice") {
        this.invoiceDialog = true;
        await this.fetchOpenBalanceInvoices(item.contract_number);
        await this.fetchMissedInvoices(item.contract_number);
        await this.fetchGeneratedInvoices(item.contract_number);
        this.invoiceDialog = false;
        this.showInvoiceTab = true;
      }
      if (action.value === "suspend" || action.value === "resume") {
        try {
          this.isLoading = true;
          const contract = await this.fetchContractById(item.contract_number);
          const data = {
            ...contract,
            leave_notice_date: contract.leave_notice_date || undefined,
            insurance_amount: contract.insurance_amount || undefined,
            attachment: undefined,
            reference: contract.reference || undefined,
            updated_by: contract.updated_by || undefined,
            is_suspended: !item.is_suspended,
            reason:
              action.value === "suspend"
                ? ContractEnums.SUSPEND_CONTRACT
                : ContractEnums.RESUME_CONTRACT
          };
          const isActive = ["active", "waiting for activation"].includes(
            contract.status.toLowerCase(contract.status)
          );
          if (item.is_suspended && action.value === "resume") {
            await this.$processReq(
              contractServices.updateContract(data, item.contract_number)
            );
          } else if (!item.is_suspended && isActive) {
            await this.$processReq(
              contractServices.updateContract(data, item.contract_number)
            );
          } else {
            this.$root.$emit("snackbar", {
              text: this.$t(
                `You cannot suspend this contract as it is with the status`,
                { status: contract.status }
              ),
              color: "error"
            });
            this.isLoading = false;
            return;
          }
          this.fetchTenants();
          this.$root.$emit("snackbar", {
            text: this.$t(
              `Contract has been ${
                action.value === "suspend" ? "suspended" : "resumed"
              }`
            ),
            color: "success"
          });
          this.isLoading = false;
          return;
        } catch (error) {
          this.isLoading = false;
          console.log("Error: Unable to suspend contract - ", error);
        }
      }
      this.isLoading = false;
      if (action.value !== "invoice") {
        this.$router.push({
          name: action.route,
          params: {
            contract_id: item.contract_number,
            property: {
              unit_id: item.unit_id,
              property_id: item.property_id
            },
            tenant_id: props.item.id,
            tenant_name: props.item.tenant_name,
            is_suspended: props.item.is_suspended
          }
        });
      }
    },
    disableAction(item, action) {
      if (item.status === "Terminated" || item.status === "deactivated") {
        if (
          action.value === "invoice" ||
          (action.value === "manual" && item.is_cash_payment_allowed)
        ) {
          return false;
        }
        return true;
      }
      if (item.status === "vacant") {
        return true;
      }

      if (action.value === "modify" && !item.contract_number) {
        return true;
      }

      if (action.value === "manual" && !item.is_cash_payment_allowed) {
        return true;
      }

      if (item.is_suspended && action.value === "suspend") {
        return true;
      }
      if (!item.is_suspended && action.value === "resume") {
        return true;
      }

      if (action.value === "invoice" && !this.is_activated) {
        return true;
      }

      return false;
    },
    async downloadImage(contract) {
      try {
        this.isLoading = true;
        this.dialog = false;
        const resp = await contractServices.downloadImage(contract.attachment);
        downloadImage(
          resp.data,
          `${contract.property_id}-${contract.property_name}-${
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
    async fetchContractById(contract_id) {
      try {
        const res = await this.$processReq(
          contractServices.fetchContractById(contract_id),
          false
        );

        const result = res.data.body;
        return {
          ...result,
          property: result.property.id,
          tenant: result.tenant.id,
          unit: result.unit.id
        };
      } catch (err) {
        console.log("Error: Unable to fetch contract by ID - ", err);
      }
    },
    async fetchTenants(blockLoading) {
      try {
        this.filterMenu = false;
        if (!blockLoading) {
          this.isLoading = true;
        }
        let params = {
          limit: 10,
          search: this.search || "",
          offset: this.pagination.page ? (this.pagination.page - 1) * 10 : 0,
          ordering:
            (this.sortBy && this.sortBy.descending
              ? "-tenant_name"
              : "+tenant_name") || "",
          property_id: this.filter.property,
          civil_id: this.filter.civilId || null
        };

        if (this.row === "show-all") {
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

        delete params.property;

        const response = await this.$processReq(
          tenantServices.getTenantsList(params),
          false
        );

        this.tenants = response.data.body.results;
        this.tenants = this.tenants.map(tenant => {
          return {
            ...tenant,
            expandId: Vue.prototype.$merchant
          };
        });
        this.isLoading = false;
        this.pagination = {
          ...this.pagination,
          totalItems: response.data.body.count,
          page: this.pagination.page > 0 ? this.pagination.page : 1,
          rowsPerPage: this.row !== "" ? response.data.body.count : 10
        };

        if (this.totalCount <= response.data.body.count) {
          this.totalCount = response.data.body.count;
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
          text: this.$t("Something went wrong while fetching tenants"),
          color: "error"
        });
        console.log("Error: Unable to get tenant list - ", err);
      }
    },
    resetFilters() {
      this.filterMenu = false;
      this.selectedProperties = "";
      this.isSuspended = "";
      this.fetchTenants();
    }
  }
};
</script>
<style scoped>
::v-deep .v-btn .v-btn__content .v-icon {
  color: inherit !important;
}
::v-deep thead th:not(:first-child) {
  padding: 0px !important;
}
::v-deep .most-inner-datatable thead th {
  padding: 0 3px !important;
  font-size: 12px !important;
}
</style>

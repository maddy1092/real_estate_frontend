<template>
  <div class="new-contract">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Property") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" @click="$router.go(-1)"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout class="re-mm-24px">
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
          <v-card v-show="!isLoading">
            <v-tabs v-model="tab" @change="onTabChange">
              <v-tab>
                <v-card-title>
                  <h3>{{ $t("New Contract") }}</h3>
                </v-card-title>
              </v-tab>
              <v-tab :disabled="isLoadingInvoices">
                <v-card-title>
                  <h3>{{ $t("Invoices") }}</h3>
                </v-card-title>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card-text>
                  <v-form>
                    <v-autocomplete
                      v-model="contract.tenant"
                      v-validate="'required'"
                      pb-3
                      clearable
                      :label="$t('Tenant Name')"
                      data-vv-name="tenant"
                      item-text="tenant_name"
                      item-value="id"
                      :disabled="disableTenant"
                      :items="tenants"
                      :error-messages="errors.collect('tenant')"
                      :no-data-text="
                        `${
                          isLoadingOptions
                            ? $t('Loading...')
                            : $t('No data available')
                        }`
                      "
                      @input.native="fetchTenants"
                    />

                    <v-autocomplete
                      v-model="contract.property"
                      v-validate="'required'"
                      :label="$t('Property Name')"
                      data-vv-name="property"
                      item-text="property_name"
                      item-value="id"
                      clearable
                      :disabled="disableProperties"
                      :error-messages="errors.collect('property')"
                      :items="properties"
                      :no-data-text="
                        `${
                          isLoadingOptions
                            ? $t('Loading...')
                            : $t('No data available')
                        }`
                      "
                      @change="updateUnits"
                      @input.native="fetchProperties"
                    />

                    <v-select
                      v-model="contract.unit"
                      v-validate="'required'"
                      :label="$t('Unit Number')"
                      required
                      item-text="unit_number"
                      item-value="unit_id"
                      data-vv-name="unit"
                      :no-data-text="
                        $t('Please select a property to load units')
                      "
                      :items="units"
                      :disabled="disableProperties"
                      :error-messages="errors.collect('unit')"
                      @change="updateUnitAmount"
                    />

                    <v-select
                      v-model="contract.unittype"
                      :label="$t('Unit Type')"
                      required
                      disabled
                      item-text="unit_type"
                      item-value="unit_type_id"
                      :items="unitTypes"
                    />

                    <date-picker-without-buttons
                      v-model="contract.contract_start_date"
                      v-validate="'required'"
                      name="contract_start_date"
                      :label="$t('Contract Start Date')"
                      data-vv-name="contract_start_date"
                      :changed="contract.contract_start_date"
                      :allowedDates="allowFirstDay"
                      :error-messages="errors.collect('contract_start_date')"
                    />

                    <date-picker-without-buttons
                      v-model="contract.payment_start_date"
                      v-validate="
                        `required|date_format:yyyy-MM-dd|date_between:${contract.contract_start_date},2100-01-01,${contract.contract_start_date}`
                      "
                      name="payment_start_date"
                      :label="$t('Payment Start Date')"
                      data-vv-name="payment_start_date"
                      :changed="contract.payment_start_date"
                      :allowedDates="allowFirstDay"
                      :error-messages="errors.collect('payment_start_date')"
                    />

                    <date-picker-without-buttons
                      v-model="contract.contract_end_date"
                      v-validate="
                        `required|date_format:yyyy-MM-dd|date_between:${contract.payment_start_date},2100-01-01`
                      "
                      name="contract_end_date"
                      :label="$t('Contract End Date')"
                      data-vv-name="contract_end_date"
                      :changed="contract.contract_end_date"
                      :allowedDates="allowLastDay"
                      :error-messages="errors.collect('contract_end_date')"
                    />

                    <v-text-field
                      v-model="contract.amount"
                      class="custom"
                      disabled
                      required
                      :label="$t('Amount')"
                    />

                    <v-text-field
                      v-model="contract.original_amount"
                      v-validate="
                        `required|decimal:3|min_value:${contract.amount || 0}`
                      "
                      data-vv-name="original_amount"
                      class="custom"
                      :label="$t('Original Contract Amount')"
                      :error-messages="errors.collect('original_amount')"
                      @change="checkOriginalAmount"
                    />

                    <v-text-field
                      v-model="contract.insurance_amount"
                      v-validate="'decimal:3'"
                      class="custom"
                      data-vv-name="insurance_amount"
                      :label="$t('Insurance Amount')"
                      :error-messages="errors.collect('insurance_amount')"
                    />

                    <v-text-field
                      v-model="contract.reference"
                      class="custom"
                      :label="$t('Contract Reference')"
                    />

                    <v-checkbox
                      :label="$t('Suspended')"
                      v-model="contract.is_suspended"
                    />

                    <v-layout class="align-center mb-2 ml-3">
                      <span class="re-upload__span">{{
                        $t("Upload Contract")
                      }}</span>
                      <input
                        type="file"
                        id="myUpload"
                        style="display: none"
                        ref="uploadContract"
                        accept="image/*"
                        @change="event => uploadImage(event)"
                      />
                      <v-btn
                        @click="$refs.uploadContract.click()"
                        class="re-custom-file-input"
                        >{{ $t("Upload") }}</v-btn
                      >
                      <span v-if="contract.attachment">
                        {{ getImageName(contract.attachment.contract_file) }}
                      </span>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <invoice
                    v-if="tab === 1"
                    :title="$t('New Contract Invoices')"
                    :selectedInvoices="selectedInvoices"
                    :isDialogLoading="isLoadingInvoices"
                    :isAction="true"
                  />
                </v-card-text>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :width="'100%'"
            :height="'750px'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
      <ConfirmationDialog
        v-model="isConfirmed"
        :label="$t('Confirmation')"
        :message="$t('Are you sure that you want to make a new contract?')"
        @acceptDialog="saveData"
      />
    </v-layout>

    <div class="text-xs-center mt-4">
      <v-btn
        class="re-orangtbtn"
        :disabled="isLoading || isUploadingFile || isLoadingInvoices"
        @click="confirmData"
        >{{ $t("Save") }}</v-btn
      >

      <v-btn dark :disabled="isLoading" @click="$router.go(-1)">{{
        $t("Cancel")
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import moment from "moment";

import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import Invoice from "../../components/Invoices/Invoice.vue";
import DatePickerWithoutButtons from "../../components/picker/DatePickerWithoutButtons.vue";
import { ContractEnums } from "../../enums";
import {
  formatDateForPicker,
  transformforPropertyUnits,
  getYear,
  numToMonth
} from "../../helper";
import contractService from "../../services/plugins/contract";
import invoiceService from "../../services/plugins/invoices";
import propertiesService from "../../services/plugins/properties";
import tenantServices from "../../services/plugins/tenant";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import dateMixins from "@/mixins/date_mixins";

export default {
  name: "NewContract",
  mixins: [breadItemsSetLang, dateMixins],
  components: {
    Invoice,
    ConfirmationDialog,
    DatePickerWithoutButtons
  },
  $_veeValidate: {
    validator: "new"
  },
  data() {
    return {
      isConfirmed: false,
      label: "",
      message: "",
      isLoading: false,
      contract: {
        is_suspended: false
      },
      tab: null,
      currentTab: null,
      unitTypes: [],
      properties: [],
      tenants: [],
      units: [],
      newContractInvoices: [],
      selectedInvoices: [],
      isUploadingFile: false,
      disableTenant: false,
      disableProperties: false,
      isLoadingOptions: false,
      fetchProperties: null,
      fetchTenants: null,
      showInvoiceTab: false,
      isLoadingInvoices: false,
      showReset: false
    };
  },
  async created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.fetchTenants = debounce(this.loadTenants, 500);
    this.isLoading = true;
    await this.initialCall();

    this.$validator.localize("en", this.dictionary);
    this.isLoading = false;
    this.initializeData();
  },
  computed: {
    dictionary() {
      return {
        custom: {
          tenant: {
            required: () => this.$t("Tenant Name is required")
          },
          property: {
            required: () => this.$t("Property Name is required")
          },
          unittype: {
            required: () => this.$t("Unit Type is required")
          },
          unit: {
            required: () => this.$t("Unit is required")
          },
          contract_end_date: {
            required: () => this.$t("Contract end date is required"),
            date_between: () =>
              this.$t(
                "Kindly, enter a contract end date which is greater than the contract start date and payment start date"
              )
          },
          payment_start_date: {
            required: () => this.$t("Payment start date is required"),
            date_between: () =>
              this.$t(
                "Kindly, enter a contract payment start date which is greater than the contract start date"
              )
          },
          leave_notice_date: {
            required: () => this.$t("Leave notice date is required"),
            date_between: () =>
              this.$t(
                "Kindly, enter a contract notice date which is greater than the contract start date"
              )
          },
          contract_start_date: {
            required: () => this.$t("Contract start date is required")
          },
          actual_leave_date: {
            date_between: () =>
              this.$t(
                "Kindly, enter a contract leave date which is greater than the contract start date"
              )
          },
          original_amount: {
            required: () => this.$t("Original Amount is Required"),
            min_value: () =>
              this.$t(
                "Monthly paid amount cannot be greater than the original contract amount"
              )
          }
        }
      };
    },
    duplicateContract() {
      return Object.assign({}, this.contract);
    }
  },
  watch: {
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
      this.initialCall();
      this.initializeData();
    },
    async duplicateContract(newVal, oldVal) {
      if (isEqual(newVal, oldVal)) return;

      if (newVal.original_amount !== oldVal.original_amount) {
        return;
      }

      if (
        !(
          newVal.contract_start_date &&
          newVal.contract_end_date &&
          newVal.payment_start_date &&
          newVal.property &&
          newVal.unit
        )
      ) {
        return;
      }

      if (
        newVal.contract_start_date !== oldVal.contract_start_date ||
        newVal.contract_end_date !== oldVal.contract_end_date ||
        newVal.payment_start_date !== oldVal.payment_start_date ||
        newVal.property !== oldVal.property ||
        newVal.unit !== oldVal.unit
      ) {
        await this.callInvoices();
      }
    }
  },
  methods: {
    async checkOriginalAmount() {
      if (
        !(
          this.duplicateContract.contract_start_date &&
          this.duplicateContract.contract_end_date &&
          this.duplicateContract.payment_start_date &&
          this.duplicateContract.original_amount &&
          this.duplicateContract.property &&
          this.duplicateContract.unit
        )
      ) {
        return;
      }

      await this.callInvoices();
    },
    async onTabChange(tab) {
      if (tab === 1 && !(await this.$validator.validateAll())) {
        this.tab = 0;
        return;
      }

      this.tab = tab;
    },
    async initialCall() {
      const params = this.$route.params;

      if (params.isTenant) {
        this.fetchTenantById(params.tenant_id);
      } else {
        this.fetchTenants();
      }

      if (!params.isTenant && params.property && params.property.property_id) {
        await this.fetchPropertyById(params.property.property_id);
      } else {
        await this.fetchProperties();
      }
    },
    async callInvoices() {
      await this.fetchInvoices();

      if (this.showReset) {
        this.$root.$emit("snackbar", {
          text: this.$t("Your invoice changes has been reset."),
          color: "success"
        });
      }

      if (!this.showReset) {
        this.showReset = true;
      }
    },
    async uploadImage(e) {
      try {
        this.isUploadingFile = true;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("contract_file", file);

        const response = await this.$processReq(
          contractService.uploadImages(formData),
          false
        );
        this.$root.$emit("snackbar", {
          text: this.$t("File Uploaded Successfully"),
          color: "success"
        });
        this.isUploadingFile = false;

        this.contract = {
          ...this.contract,
          attachment: response.data.body
        };
      } catch (err) {
        this.isUploadingFile = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while uploading file"),
          color: "error"
        });
        console.log("Error: Unable to Upload image - ", err);
      }
    },
    async initializeData() {
      const params = this.$route.params;

      if (params.isTenant) {
        await this.$nextTick();

        this.contract = {
          ...this.contract,
          tenant: params.tenant_id
        };
        this.disableTenant = true;
      } else if (params.property) {
        this.contract = {
          ...this.contract,
          property: params.property.property_id
        };

        await this.$nextTick();
        await this.updateUnits(params.property.property_id);

        await this.$nextTick();
        this.contract = {
          ...this.contract,
          unit: params.property.unit_id
        };

        await this.$nextTick();
        this.updateUnitAmount(params.property.unit_id);
        this.disableProperties = true;
      }
    },
    updateUnitAmount(data) {
      this.resetValues(true);
      if (data) {
        const unit = this.units.find(
          unit => data === (unit.unit_id || unit.id)
        );

        this.contract = {
          ...this.contract,
          original_amount: unit.invoice_amount.toFixed(3),
          amount: unit.invoice_amount.toFixed(3),
          reference: unit.reference,
          unittype: unit.unit_type_id || unit.unittype
        };
      }
    },
    async updateUnits(data) {
      this.resetValues();
      if (data) {
        this.units = [];
        this.unitTypes = [];

        const property = this.properties.find(property => property.id === data);
        const { units, unitTypes } = transformforPropertyUnits(
          property.unit_details
        );

        this.units = units;
        this.unitTypes = unitTypes;
      } else {
        this.units = [];
        this.unitTypes = [];
      }
    },
    resetValues(isUnit) {
      this.showReset = false;
      if (this.contract.contract_start_date) {
        this.contract = {
          ...this.contract,
          contract_start_date: ""
        };
      }

      if (this.contract.contract_end_date) {
        this.contract = {
          ...this.contract,
          contract_end_date: ""
        };
      }

      if (this.contract.payment_start_date) {
        this.contract = {
          ...this.contract,
          payment_start_date: ""
        };
      }

      this.contract = {
        ...this.contract,
        unit: isUnit ? this.contract.unit : "",
        unittype: "",
        amount: "",
        original_amount: "",
        insurance_amount: "",
        reference: "",
        attachment: null,
        is_suspended: false
      };
    },
    async fetchPropertyById(id) {
      try {
        const response = await this.$processReq(
          propertiesService.getPropertyDetails(id),
          false
        );

        this.properties = [response.data.body];
      } catch (err) {
        console.log("Error: Unable to fetch property by ID - ", err);
      }
    },
    async fetchTenantById(id) {
      try {
        const response = await this.$processReq(
          tenantServices.fetchTenantById(id),
          false
        );

        this.tenants = [response.data.body];
      } catch (err) {
        console.log("Error: Unable to fetch tenant by ID - ", err);
      }
    },
    async confirmData() {
      try {
        if (await this.$validator.validateAll()) {
          this.isConfirmed = true;
        }
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to confirm data - ", err);
      }
    },
    async saveData() {
      try {
        this.isLoading = true;
        let data = cloneDeep(this.contract);
        data = {
          ...data,
          attachment: this.contract.attachment
            ? this.contract.attachment.id
            : undefined,
          insurance_amount: this.contract.insurance_amount || undefined,
          contact_reference: this.contract.reference || undefined,
          contract_start_date: formatDateForPicker(
            this.contract.contract_start_date
          ),
          contract_end_date: formatDateForPicker(
            this.contract.contract_end_date
          ),
          payment_start_date: formatDateForPicker(
            this.contract.payment_start_date
          ),
          reason: ContractEnums.NewContract,
          modified_payments: this.selectedInvoices.map(invoice => {
            invoice = {
              ...invoice,
              status: invoice.is_paid ? "Paid" : "Expired",
              amount: invoice.actual_paid_amount
            };

            delete invoice.is_paid;
            delete invoice.actual_paid_amount;
            delete invoice.allowed_date;
            return invoice;
          })
        };
        await this.$processReq(contractService.saveContract(data), false);
        this.$root.$emit("snackbar", {
          text: this.$t("Contract Created Successfully"),
          color: "success"
        });
        this.$router.go(-1);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to save contract - ", err);
      }
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
            search: event.target.value
          };
        } else {
          params.search = "";
        }

        const response = await this.$processReq(
          tenantServices.getTenantsList(params),
          false
        );

        this.tenants = response.data.body.results;
        this.isLoadingOptions = false;
      } catch (err) {
        this.isLoadingOptions = false;
        console.log("Error: Unable to get tenant list - ", err);
      }
    },
    getImageName(imageUrl) {
      if (imageUrl) {
        let url = new URL(imageUrl);

        // eslint-disable-next-line no-useless-escape
        url = url.pathname.replace(/^.*(\\|\/|\:)/, "");
        return url;
      }

      return "";
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
    },
    async fetchInvoices() {
      try {
        this.isLoadingInvoices = true;
        let params = {
          contract_start_date: this.contract.contract_start_date,
          contract_end_date: this.contract.contract_end_date,
          payment_start_date: this.contract.payment_start_date,
          original_amount: this.contract.original_amount,
          amount: this.contract.amount,
          contract_termination_date: ""
        };

        const response = await this.$processReq(
          invoiceService.fetchInvoices(params),
          false
        );

        const invoices = response.data.body;

        this.selectedInvoices = invoices.open_balance_missing_payments.map(
          payment => {
            return {
              ...payment,
              is_paid: payment.is_grace_period
                ? true
                : payment.is_missed || payment.is_open_balance
                ? true
                : false,
              receipt_voucher_reference: null,
              payment_date: moment(payment.payment_date).format("YYYY-MM-DD"),
              allowed_date: moment(payment.payment_date).format("YYYY-MM-DD"),
              payment_year: payment.payment_year
                ? payment.payment_year
                : getYear(payment.payment_date),
              payment_month: payment.payment_month
                ? payment.payment_month
                : numToMonth(payment.payment_date),
              amount: this.contract.original_amount,
              paid_amount: this.contract.amount,
              actual_paid_amount: this.contract.amount
            };
          }
        );
        this.isLoadingInvoices = false;
      } catch (err) {
        this.isLoadingInvoices = false;
        console.log("Error: Unable to show Invoices - ", err);
      }
    }
  }
};
</script>

<style scoped>
.re-orangtbtn {
  color: white !important;
}
.re-orangtbtn:disabled {
  background-color: #f5f5f5 !important;
  color: black !important;
}
</style>

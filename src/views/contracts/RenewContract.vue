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
                  <h3>{{ $t("Renew Contract") }}</h3>
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
                      @input.native="fetchProperties"
                      :no-data-text="
                        `${
                          isLoadingProperty
                            ? $t('Loading...')
                            : $t('No data available')
                        }`
                      "
                      @change="updateUnits"
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
                      @change="updateUnitType"
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

                    <v-autocomplete
                      v-model="contract.tenant"
                      pb-3
                      clearable
                      :label="$t('Tenant Name')"
                      data-vv-name="tenant"
                      item-text="tenant_name"
                      item-value="id"
                      disabled
                      :items="tenants"
                      :error-messages="errors.collect('tenant')"
                    />
                    <date-picker
                      v-model="contract.contract_start_date"
                      disabled
                      name="contract_start_date"
                      :label="$t('Old Contract Start Date')"
                      data-vv-name="contract_start_date"
                      :default_date="contract.contract_start_date"
                      :error-messages="errors.collect('contract_start_date')"
                    />

                    <date-picker
                      v-model="contract.contract_end_date"
                      disabled
                      name="contract_end_date"
                      :label="$t('Old Contract End Date')"
                      data-vv-name="contract_end_date"
                      :default_date="contract.contract_end_date"
                      :error-messages="errors.collect('contract_end_date')"
                    />

                    <v-text-field
                      v-model="contract.amount"
                      :label="$t('Old Contract Amount')"
                      class="custom"
                      disabled
                      required
                    />

                    <v-text-field
                      v-model="contract.original_amount"
                      class="custom"
                      required
                      disabled
                      data-vv-name="contract_original_amount"
                      :label="$t('Old Original Contract Amount')"
                    />

                    <date-picker
                      v-model="contract.new_contract_start_date"
                      v-validate="'date_format:yyyy-MM-dd'"
                      disabled
                      name="new_contract_start_date"
                      :label="$t('New Contract Start Date')"
                      data-vv-name="new_contract_start_date"
                      :default_date="contract.new_contract_start_date"
                      :error-messages="
                        errors.collect('new_contract_start_date')
                      "
                    />

                    <date-picker-without-buttons
                      v-model="contract.new_contract_end_date"
                      v-validate="
                        `required|date_format:yyyy-MM-dd|date_between:${contract.contract_end_date},2100-01-01`
                      "
                      name="new_contract_end_date"
                      :label="$t('New Contract End Date')"
                      data-vv-name="new_contract_end_date"
                      :changed="contract.new_contract_end_date"
                      :allowedDates="allowLastDay"
                      :initialValue="contract.new_contract_end_date"
                      :error-messages="errors.collect('new_contract_end_date')"
                    />

                    <v-layout>
                      <v-flex>
                        <v-text-field
                          v-model="contract.new_amount"
                          :label="$t('New Contract Amount')"
                          class="custom"
                          disabled
                          required
                        />
                      </v-flex>
                      <v-flex xs4 md2 class="text-xs-right">
                        <v-btn
                          dark
                          class="re-orangtbtn"
                          @click="changePriceOfUnit()"
                        >
                          {{ $t("Edit Price") }}
                        </v-btn>
                      </v-flex>
                    </v-layout>

                    <v-text-field
                      v-model="contract.new_original_amount"
                      v-validate="
                        `required|decimal:3|min_value:${contract.new_amount ||
                          0}`
                      "
                      class="custom"
                      required
                      data-vv-name="new_contract_original_amount"
                      :label="$t('New Original Contract Amount')"
                      :error-messages="
                        errors.collect('new_contract_original_amount')
                      "
                      @change="checkOriginalAmount"
                    />

                    <v-text-field
                      v-model="contract.reference"
                      class="custom"
                      :label="$t('Contract Reference')"
                    />

                    <v-layout class="align-center mb-2 ml-3">
                      <span class="re-upload__span">{{
                        $t("Upload Attachement")
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
                        <v-btn
                          flat
                          icon
                          color="blue"
                          @click="downloadImage(contract.attachment)"
                        >
                          <v-icon>download</v-icon>
                        </v-btn>
                      </span>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <invoice
                    v-if="tab === 1"
                    :title="$t('Contract Invoices')"
                    :selectedInvoices="selectedInvoices"
                    :isDialogLoading="isLoadingInvoices"
                    :isRenew="true"
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
    </v-layout>

    <div class="text-xs-center mt-4">
      <v-btn
        class="re-orangtbtn"
        :disabled="isLoading || isUploadingFile || isLoadingInvoices"
        @click="saveData"
      >
        {{ $t("Save") }}
      </v-btn>
      <v-btn dark :disabled="isLoading" @click="$router.go(-1)">
        {{ $t("Cancel") }}
      </v-btn>
    </div>
    <confirmation-dialog
      v-model="pendingDialog"
      :label="$t('Confirmation')"
      :message="
        $t(
          'There is a pending amount that should be paid, are you sure that you want to continue.'
        )
      "
      :saveMessage="$t('Yes')"
      :cancelMessage="$t('No')"
      @acceptDialog="doAction"
    />
    <confirmation-dialog
      v-model="confirmationDialog"
      :label="$t('Confirmation')"
      :message="$t('Are you sure that you want to renew contract?')"
      :saveMessage="$t('Yes')"
      :cancelMessage="$t('No')"
      @acceptDialog="doAction"
    />
  </div>
</template>

<script>
import { isEmpty, debounce } from "lodash";
import isEqual from "lodash/isEqual";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";

import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
import Invoice from "../../components/Invoices/Invoice.vue";
import DatePicker from "../../components/picker/DatePicker.vue";
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

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "renew_contract",
  components: {
    Invoice,
    DatePicker,
    ConfirmationDialog,
    DatePickerWithoutButtons
  },
  $_veeValidate: {
    validator: "new"
  },

  mixins: [breadItemsSetLang],
  data() {
    return {
      tab: 0,
      isLoading: false,
      pendingDialog: false,
      confirmationDialog: false,
      contract: {},
      unitTypes: [],
      properties: [],
      newContractInvoices: [],
      selectedInvoices: [],
      tenants: [],
      units: [],
      disableTenant: false,
      disableProperties: false,
      isLoadingProperty: false,
      fetchProperties: null,
      isUploadingFile: false,
      showInvoiceTab: false,
      isLoadingInvoices: false,
      showReset: false
    };
  },
  async created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.initializeData();
    this.$validator.localize("en", this.dictionary);
  },
  computed: {
    ...mapGetters("contract", ["getContract", "getTenants"]),
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
                "Kindly, enter a contract end date which is greater than the contract start date"
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
          new_contract_start_date: {
            required: () => this.$t("New contract start date is required"),
            date_between: () =>
              this.$t(
                "Kindly, select a date which is greater than the old contract end date"
              )
          },
          new_contract_end_date: {
            required: () => this.$t("New contract end date is required"),
            date_between: () =>
              this.$t(
                "Kindly, select a date which is greater than the old contract end date"
              )
          },
          contract_original_amount: {
            required: () =>
              this.$t("Contract original amount is a required field")
          },
          new_contract_original_amount: {
            required: () => this.$t("New original contract amount is required"),
            min_value: min =>
              `${this.$t(
                "New contract amount cannot be greater than the new original contract amount"
              )} ${min}`
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
      this.initializeData();
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    },
    async duplicateContract(newVal, oldVal) {
      if (isEqual(newVal, oldVal)) return;

      if (newVal.new_original_amount !== oldVal.new_original_amount) {
        return;
      }

      if (
        !(newVal.new_contract_end_date && newVal.original_amount && newVal.id)
      ) {
        return;
      }

      if (newVal.new_contract_end_date !== oldVal.new_contract_end_date) {
        await this.callInvoices();
      }
    }
  },
  methods: {
    async checkOriginalAmount() {
      if (
        !(
          this.duplicateContract.new_contract_end_date &&
          this.duplicateContract.id
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
    ...mapActions("contract", ["setContract", "setTenant"]),
    allowLastDay(val) {
      return (
        parseInt(
          moment(val)
            .clone()
            .add(1, "day")
            .format("DD")
        ) === 1
      );
    },
    async callInvoices() {
      if (await this.$validator.validateAll()) {
        await this.fetchInvoices();

        if (this.showReset) {
          this.$root.$emit("snackbar", {
            text: this.$t("Your invoice changes has been reset."),
            color: "success"
          });
        }
      }

      if (!this.showReset) {
        this.showReset = true;
      }
    },
    async initializeData() {
      this.isLoading = true;
      const params = this.$route.params;
      if (params.property && params.property.property_id) {
        await this.fetchPropertyById(params.property.property_id);
      } else {
        await this.loadProperties();
      }

      if (params.contract_id) {
        this.disableProperties = true;
      }

      if (!isEmpty(this.getContract)) {
        this.updateUnits(this.getContract.property);
        this.contract = this.getContract;
        await this.fetchInvoices();
        await this.$validator.validateAll();
        this.updateUnitType(this.contract.unit, true);
        this.tenants = this.getTenants;

        this.setContract({});
        this.setTenant([]);
      } else if (params.contract_id) {
        await this.fetchContractById(params.contract_id);
      }
      this.isLoading = false;
    },
    async updateUnits(data) {
      this.contract = {
        property: this.contract.property
      };
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
        this.contract = {};
      }
    },
    updateUnitType(data, callData) {
      if (data) {
        const unit = this.units.find(
          unit => data === (unit.unit_id || unit.id)
        );
        if (!(this.$route.params.contract_id || callData)) {
          this.fetchContract(unit);
        }
      }
    },
    async fetchContract(unit) {
      try {
        this.isLoading = true;
        const resp = await this.$processReq(
          contractService.fetchContractList({
            status: "active",
            unit: unit.id || unit.unit_id || null
          }),
          false
        );

        const result = resp.data.body.results[0];
        if (result) {
          this.contract = {
            ...this.contract,
            ...result,
            tenant: result.tenant.id,
            property: this.contract.property,
            unit: unit.id || unit.unit_id,
            unittype: unit.unittype || unit.unit_type_id,
            contract_start_date: formatDateForPicker(
              result.contract_start_date
            ),
            contract_end_date: formatDateForPicker(result.contract_end_date),
            payment_start_date: formatDateForPicker(result.payment_start_date),
            new_contract_start_date: formatDateForPicker(
              moment(result.contract_end_date).add(1, "days")
            ),
            new_contract_end_date: undefined,
            amount: parseFloat(result.amount).toFixed(3),
            original_amount: parseFloat(
              result.original_amount || unit.invoice_amount
            ).toFixed(3),
            new_amount: parseFloat(unit.invoice_amount).toFixed(3),
            new_original_amount: parseFloat(unit.invoice_amount).toFixed(3),
            reference: undefined,
            attachment: undefined
          };

          this.tenants = [result.tenant];
        } else {
          this.contract = {
            property: this.contract.property,
            unit: this.contract.unit
          };
          this.$root.$emit("snackbar", {
            text: this.$t("No contract find against this unit"),
            color: "error"
          });
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to fetch contract list  - ", err);
      }
    },
    async saveData() {
      if (await this.$validator.validateAll()) {
        if (this.contract.is_payment_pending) {
          this.pendingDialog = true;
        } else {
          this.confirmationDialog = true;
        }
      }
    },
    async doAction() {
      try {
        this.isLoading = true;
        const data = {
          ...this.contract,
          attachment: this.contract.attachment
            ? this.contract.attachment.id
            : null,
          insurance_amount: this.contract.insurance_amount || undefined,
          reference: this.contract.reference || undefined,
          contract_start_date: formatDateForPicker(
            this.contract.contract_start_date
          ),
          new_contract_start_date: formatDateForPicker(
            this.contract.new_contract_start_date
          ),
          new_contract_end_date: formatDateForPicker(
            this.contract.new_contract_end_date
          ),
          contract_end_date: formatDateForPicker(
            this.contract.contract_end_date
          ),
          payment_start_date: formatDateForPicker(
            this.contract.payment_start_date
          ),
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
          }),
          reason: ContractEnums.RenewContract
        };

        delete data.updated_by;
        delete data.leave_notice_date;

        await this.$processReq(
          contractService.updateContract(data, this.contract.id),
          false
        );
        this.$root.$emit("snackbar", {
          text: this.$t("Contract Renewed successfully"),
          color: "success"
        });
        this.isLoading = false;
        this.$router.go(-1);
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to update contract - ", err);
      }
    },
    async fetchPropertyById(id) {
      try {
        const response = await this.$processReq(
          propertiesService.getPropertyDetails(id),
          false
        );

        this.properties = [response.data.body];
      } catch (err) {
        console.log("Error: Unable to get property details - ", err);
      }
    },
    async loadProperties(event) {
      try {
        this.isLoadingProperty = true;
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

        this.isLoadingProperty = false;
        this.properties = response.data.body.results;
      } catch (err) {
        this.isLoadingProperty = false;
        console.log("Error: Unable to get properties list - ", err);
      }
    },
    async fetchContractById(contract_id) {
      try {
        const res = await this.$processReq(
          contractService.fetchContractById(contract_id),
          false
        );

        const result = res.data.body;

        this.properties = [result.property];

        await this.$nextTick();
        await this.updateUnits(result.unit.unit_property);

        this.contract = {
          ...this.contract,
          ...result,
          property: result.unit.unit_property,
          tenant: result.tenant.id,
          unit: result.unit.id,
          unittype: result.unit.unittype,
          contract_start_date: formatDateForPicker(result.contract_start_date),
          contract_end_date: formatDateForPicker(result.contract_end_date),
          payment_start_date: formatDateForPicker(result.payment_start_date),
          new_contract_start_date: formatDateForPicker(
            moment(result.contract_end_date).add(1, "days")
          ),
          amount: parseFloat(result.amount).toFixed(3),
          original_amount: parseFloat(
            result.original_amount || result.unit.invoice_amount
          ).toFixed(3),
          new_amount: parseFloat(result.unit.invoice_amount).toFixed(3),
          new_original_amount: parseFloat(result.unit.invoice_amount).toFixed(
            3
          ),
          reference: undefined,
          attachment: undefined
        };

        this.tenants = [result.tenant];
        this.updateUnitType(result.unit.id);
      } catch (err) {
        console.log("Error: Unable to fetch contract by ID - ", err);
      }
    },
    async changePriceOfUnit() {
      if (
        (await this.$validator.validate("property", this.contract.property)) &&
        (await this.$validator.validate("unit", this.contract.unit))
      ) {
        this.setContract(this.contract);
        this.setTenant(this.tenants);

        this.$router.push({
          name: "edit_price",
          params: {
            property: {
              unit_id: this.contract.unit,
              property_id: this.contract.property
            }
          }
        });
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
    async downloadImage(image) {
      try {
        this.isLoading = true;
        var link = document.createElement("a");

        const resp = await contractService.downloadImage(image.id);

        var blob = new Blob([resp.data], { type: "image/*" });
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";

        // eslint-disable-next-line no-useless-escape
        link.download = image.contract_file.replace(/^.*(\\|\/|\:)/, "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to download image - ", error);
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
    async fetchInvoices() {
      try {
        this.isLoadingInvoices = true;
        let params = {
          contract_start_date: this.contract.new_contract_start_date,
          contract_end_date: this.contract.new_contract_end_date,
          payment_start_date: this.contract.new_contract_start_date,
          original_amount: this.contract.new_original_amount,
          amount: this.contract.new_amount
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
              is_paid:
                payment.is_grace_period ||
                payment.is_missed ||
                payment.is_open_balance
                  ? true
                  : false,
              amount: this.contract.new_original_amount,
              paid_amount: this.contract.new_amount,
              actual_paid_amount: this.contract.new_amount,
              payment_date: moment(payment.payment_date).format("YYYY-MM-DD"),
              allowed_date: moment(payment.payment_date).format("YYYY-MM-DD"),
              payment_year: payment.payment_year
                ? payment.payment_year
                : getYear(payment.payment_date),
              payment_month: payment.payment_month
                ? payment.payment_month
                : numToMonth(payment.payment_date)
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
.v-dialog .headline {
  max-width: 100% !important;
}
.re-orangtbtn {
  color: white !important;
}

.re-orangtbtn:disabled {
  background-color: #f5f5f5 !important;
  color: black !important;
}
</style>

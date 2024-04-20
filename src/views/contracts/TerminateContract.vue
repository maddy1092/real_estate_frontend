<template>
  <div class="terminate-contract">
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
          <v-card v-show="!isLoading">
            <v-card-title>
              <h3>{{ $t("Terminate Contract") }}</h3>
            </v-card-title>
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
                  :no-data-text="$t('Please select a property to load units')"
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
                  :label="$t('Contract Start Date')"
                  data-vv-name="contract_start_date"
                  :default_date="contract.contract_start_date"
                  :error-messages="errors.collect('contract_start_date')"
                />

                <date-picker
                  v-model="contract.contract_end_date"
                  name="contract_end_date"
                  disabled
                  :label="$t('Contract End Date')"
                  data-vv-name="contract_end_date"
                  :default_date="contract.contract_end_date"
                  :error-messages="errors.collect('contract_end_date')"
                />

                <date-picker
                  v-model="contract.termination_date"
                  v-validate="
                    `required|date_format:yyyy-MM-dd|date_between:${contract.contract_start_date},2100-01-01|date_greater_end:${contract.contract_end_date}|date_between_leave:${contract.leave_notice_date}|after:${contract.actual_leave_date},2100-01-01`
                  "
                  name="termination_date"
                  data-vv-name="termination_date"
                  :label="$t('Terminate Date')"
                  :allowedDates="allowLastDay"
                  :changed="contract.termination_date"
                  :error-messages="errors.collect('termination_date')"
                />

                <date-picker
                  v-model="contract.actual_leave_date"
                  v-validate="
                    `required|date_format:yyyy-MM-dd|date_between:${contract.contract_start_date},2100-01-01,${contract.contract_start_date}|after:${contract.leave_notice_date},2100-01-01`
                  "
                  name="actual_leave_date"
                  :label="$t('Actual Leave Date')"
                  ref="actual_leave_date"
                  data-vv-name="actual_leave_date"
                  :changed="contract.actual_leave_date"
                  :error-messages="errors.collect('actual_leave_date')"
                />

                <date-picker
                  v-model="contract.leave_notice_date"
                  v-validate="
                    `required|date_format:yyyy-MM-dd|date_between:${contract.contract_start_date},2100-01-01,${contract.contract_start_date}`
                  "
                  name="leave_notice_date"
                  :label="$t('Leave Notice Date')"
                  ref="contract.leave_notice_date"
                  data-vv-name="leave_notice_date"
                  :changed="contract.leave_notice_date"
                  :error-messages="errors.collect('leave_notice_date')"
                />
              </v-form>
            </v-card-text>
          </v-card>
          <vue-skeleton-loader
            rounded
            class="w-full"
            type="rect"
            v-if="isLoading"
            :height="'700px'"
            :width="'100%'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <div class="text-xs-center mt-4">
      <v-btn v-if="!isLoading" dark class="re-orangtbtn" @click="storeData">{{
        $t("Save")
      }}</v-btn>
      <v-btn v-if="!isLoading" dark @click="$router.go(-1)">{{
        $t("Cancel")
      }}</v-btn>
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
      :message="$t('Are you sure that you want to terminate this contract?')"
      :saveMessage="$t('Yes')"
      :cancelMessage="$t('No')"
      @acceptDialog="doAction"
    />

    <confirmation-dialog
      v-model="isTerminate"
      :label="$t('Confirmation')"
      :message="this.message"
      :saveMessage="$t('Yes')"
      :cancelMessage="$t('No')"
      @acceptDialog="terminateConfimation"
      @cancelDialog="isTerminate = false"
    />
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import moment from "moment";

import ConfirmationDialog from "../../components/dialog/ConfirmationDialog.vue";
import DatePicker from "../../components/picker/DatePicker.vue";
import { ContractEnums } from "../../enums";
import { formatDateForPicker, transformforPropertyUnits } from "../../helper";
import contractService from "../../services/plugins/contract";
import propertiesService from "../../services/plugins/properties";
import tenantServices from "../../services/plugins/tenant";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";
import dateMixins from "@/mixins/date_mixins";

export default {
  components: { DatePicker, ConfirmationDialog },
  name: "terminate-contract",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang, dateMixins],
  data() {
    return {
      isLoading: false,
      pendingDialog: false,
      confirmationDialog: false,
      contract: {},
      properties: [],
      isTerminate: false,
      termination_confirmed: false,
      tenants: [],
      units: [],
      unitTypes: [],
      isLoadingOptions: false,
      fetchProperties: null,
      message: ""
    };
  },
  async created() {
    this.fetchProperties = debounce(this.loadProperties, 500);
    this.isLoading = true;
    this.$validator.localize("en", this.dictionary);
    const params = this.$route.params;

    this.fetchTenants();
    if (params.property && params.property.property_id) {
      await this.fetchPropertyById(params.property.property_id);
    } else {
      await this.loadProperties();
    }

    if (params.contract_id) {
      this.disableProperties = true;
      await this.fetchContractById(params.contract_id);
    }
    this.isLoading = false;
    this.$validator.extend("date_between_leave", {
      getMessage: () => {
        return this.$t(
          "Kindly, select a date which is greater than or equal to actual leave date and leave notice date."
        );
      },
      validate: () => {
        const moment1 = moment(this.contract.leave_notice_date);
        const moment2 = moment(this.contract.termination_date);

        return moment2.isSameOrAfter(moment1);
      }
    });

    this.$validator.extend("date_greater_end", {
      getMessage: () => {
        return this.$t(
          "Kindly, select a date which is less than contract end date"
        );
      },
      validate: () => {
        const moment1 = moment(this.contract.termination_date);
        const moment2 = moment(this.contract.contract_end_date);

        return moment2.isSameOrAfter(moment1);
      }
    });
  },
  watch: {
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
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
          contract_start_date: {
            required: () => this.$t("Contract start date is required")
          },
          contract_end_date: {
            required: () => this.$t("Contract end date is require")
          },
          termination_date: {
            required: () => this.$t("Termination date is required"),
            date_between: () =>
              this.$t(
                "Kindly, select a date which is greater than the contract start date."
              ),
            after: () =>
              this.$t(
                "Kindly, select a date which is greater than or equal to actual leave date and leave notice date."
              )
          },
          actual_leave_date: {
            required: () => this.$t("Actual leave date is required"),
            date_between: () =>
              this.$t(
                "Kindly, select a date which is greater than or equal to contract start date."
              ),
            after: () =>
              this.$t(
                "Kindly, select a date which is greater than or equal to leave notice date."
              )
          },
          leave_notice_date: {
            required: () => this.$t("Leave notice date is required"),
            date_between: () =>
              this.$t(
                "Kindly, select a date which is greater than the contract start date."
              )
          }
        }
      };
    }
  },
  methods: {
    terminateConfimation() {
      this.termination_confirmed = true;
      this.doAction();
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
    async updateUnits(data) {
      this.resetValue();
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
    updateUnitType(data) {
      this.resetValue(true);
      if (data) {
        const unit = this.units.find(
          unit => data === (unit.unit_id || unit.id)
        );
        this.fetchContract(unit);
      }
    },
    async resetValue(isUnit) {
      this.contract = {
        ...this.contract,
        unit: isUnit ? this.contract.unit : "",
        unittype: "",
        contract_start_date: "",
        contract_end_date: "",
        tenant: "",
        termination_date: undefined,
        actual_leave_date: undefined,
        leave_notice_date: undefined
      };
    },
    async storeData() {
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
          contract_start_date: formatDateForPicker(
            this.contract.contract_start_date
          ),
          contract_end_date: formatDateForPicker(
            this.contract.contract_end_date
          ),
          leave_notice_date: formatDateForPicker(
            this.contract.leave_notice_date
          ),
          termination_date: formatDateForPicker(this.contract.termination_date),
          actual_leave_date: formatDateForPicker(
            this.contract.actual_leave_date
          ),
          reason: ContractEnums.TerminateContract,
          property: this.contract.property,
          unit: this.contract.unit,
          unittype: this.contract.unittype,
          tenant: this.contract.tenant,
          amount: this.contract.amount,
          payment_start_date: this.contract.payment_start_date,
          is_suspended: this.contract.is_suspended,
          original_amount: this.contract.original_amount,
          deleting_invoice_flag: this.termination_confirmed
        };
        await this.$processReq(
          contractService.updateContract(data, this.contract.id),
          true,
          false
        );

        this.isLoading = false;
        this.$router.go(-1);
      } catch (err) {
        this.isLoading = false;
        if (
          err.response?.status === 406 &&
          err.response.data?.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          this.message = err.response.data.errors[0].field_error;
          this.isTerminate = true;
        } else if (
          err.response.data?.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          this.$root.$emit("snackbar", {
            text: this.$t(err.response.data.errors[0].field_error),
            color: "error"
          });
        }
        console.log("Error: Unable to update contract - ", err);
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
            leave_notice_date: undefined,
            actual_leave_date: undefined,
            unit: unit.id || unit.unit_id,
            termination_date: undefined,
            unittype: unit.unittype || unit.unit_type_id,
            contract_start_date: formatDateForPicker(
              result.contract_start_date
            ),
            contract_end_date: formatDateForPicker(result.contract_end_date),
            amount: unit.invoice_amount,
            new_amount: unit.invoice_amount
          };
        } else {
          this.$root.$emit("snackbar", {
            text: this.$t("No contract find against this unit"),
            color: "error"
          });
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to get contract list - ", err);
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

        this.updateUnits(result.unit.unit_property);

        this.contract = {
          ...this.contract,
          ...result,
          property: result.unit.unit_property,
          tenant: result.tenant.id,
          unit: result.unit.id,
          unittype: result.unit.unittype,
          contract_start_date: formatDateForPicker(result.contract_start_date),
          leave_notice_date: undefined,
          actual_leave_date: undefined,
          termination_date: undefined,
          contract_end_date: formatDateForPicker(result.contract_end_date),
          amount: result.unit.invoice_amount,
          new_amount: result.unit.invoice_amount
        };
        this.tenants = [result.tenant];
      } catch (err) {
        console.log("Error: Unable to fetch contract by ID - ", err);
      }
    },
    async fetchTenants(event) {
      try {
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
      } catch (err) {
        console.log("Error: Unable to get tenant list - ", err);
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
    }
  }
};
</script>

<style scoped>
.v-dialog .headline {
  max-width: 100% !important;
}
</style>

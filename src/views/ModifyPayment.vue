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
            <v-card-title>
              <h3>{{ $t("Modify Payment") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="contract.property.property_name"
                  disabled
                  :label="$t('Property Name')"
                />

                <v-text-field
                  v-model="contract.unit.unit_number"
                  disabled
                  :label="$t('Unit Number')"
                />

                <v-text-field
                  v-model="contract.unit.unittype"
                  disabled
                  :label="$t('Unit Type')"
                />

                <v-text-field
                  v-model="contract.tenant.tenant_name"
                  disabled
                  :label="$t('Tenant Name')"
                />

                <v-text-field
                  v-model="contract.id"
                  item-value="id"
                  disabled
                  :label="$t('Contract Id')"
                />

                <v-text-field
                  v-model="contract.reference"
                  disabled
                  :label="$t('Contract Reference')"
                />

                <v-text-field
                  v-model="contract.original_amount"
                  class="custom"
                  disabled
                  :label="$t('Original Contract Amount')"
                />

                <v-text-field
                  v-model="contract.amount"
                  class="custom"
                  disabled
                  :label="$t('Current Paid Amount')"
                />

                <v-text-field
                  v-model="contract.new_amount"
                  v-validate="
                    `required|decimal:3|max_value:${contract.original_amount}`
                  "
                  data-vv-name="new_amount"
                  class="custom"
                  required
                  :label="$t('New Paid Amount')"
                  :error-messages="errors.collect('new_amount')"
                />
              </v-form>
            </v-card-text>
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
      <v-btn dark class="re-orangtbtn" :disabled="isLoading" @click="saveData">
        {{ $t("Save") }}
      </v-btn>
      <v-btn dark :disabled="isLoading" @click="$router.go(-1)">{{
        $t("Cancel")
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import { ContractEnums } from "../enums";
import contractService from "../services/plugins/contract";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "modify_payment",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      isLoading: false,
      contract: {
        property: {},
        tenant: {},
        unit: {}
      }
    };
  },
  async created() {
    this.initializeData();
    this.$validator.localize("en", this.dictionary);
  },
  computed: {
    dictionary() {
      return {
        custom: {
          new_amount: {
            required: () => this.$t("New contract amount is required"),
            max_value: () =>
              this.$t(
                "New paid amount cannot be greater than original contract amount"
              )
          }
        }
      };
    }
  },
  watch: {
    "$i18n.locale": function() {
      this.initializeData();
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  methods: {
    async initializeData() {
      this.isLoading = true;
      const params = this.$route.params;
      await this.fetchContractById(params.contract_id);
      this.isLoading = false;
    },

    async saveData() {
      if (await this.$validator.validateAll()) {
        try {
          this.isLoading = true;
          const data = {
            ...this.contract,
            new_amount: this.contract.new_amount,
            leave_notice_date: undefined,
            attachment: undefined,
            insurance_amount: this.contract.insurance_amount || undefined,
            reference: this.contract.reference || undefined,
            updated_by: undefined,
            tenant: this.contract.tenant.id,
            property: this.contract.property.id,
            unit: this.contract.unit.id,
            reason: ContractEnums.MODIFY_CONTRACT_AMOUNT
          };
          await this.$processReq(
            contractService.updateContract(data, this.contract.id)
          );
          this.isLoading = false;
          this.$router.go(-1);
        } catch (error) {
          this.isLoading = false;
          console.log("Error: Unable to modify payment - ", error);
        }
      }
    },

    async fetchContractById(contract_id) {
      try {
        const res = await this.$processReq(
          contractService.fetchContractById(contract_id),
          false
        );

        const result = res.data.body;
        this.contract = {
          ...this.contract,
          ...result,
          property: result.property,
          tenant: result.tenant,
          unit: result.unit,
          amount: parseFloat(result.amount).toFixed(3),
          new_amount: parseFloat(result.amount).toFixed(3)
        };
      } catch (err) {
        console.log("Error: Unable to fetch contract by ID - ", err);
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

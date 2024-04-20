<template>
  <v-dialog v-model="dialog" width="1200">
    <v-card>
      <v-tabs v-model="tab">
        <v-layout>
          <v-layout>
            <v-tab>
              <v-card-title primary-title>{{ label }}</v-card-title>
            </v-tab>
            <v-tab>
              <v-card-title primary-title>{{
                $t("Contract Invoices")
              }}</v-card-title>
            </v-tab>
          </v-layout>
          <v-icon
            class="d-flex justify-end cross-icon-position"
            @click="closeDialoge"
          >
            close
          </v-icon>
        </v-layout>
        <v-tab-item>
          <slot name="contract"></slot>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text class="dialog-table">
              <modal-table-loader v-if="isDialogLoading" />
              <div v-show="!isDialogLoading">
                <v-data-table
                  :headers="headers"
                  :items="selectedInvoices"
                  class="re-table"
                  hide-actions
                  :no-data-text="$t('No data available')"
                >
                  <template v-slot:items="props">
                    <tr>
                      <td class="d-flex">
                        <v-checkbox
                          v-model="props.item.is_paid"
                          disabled
                          class="justify-center"
                        />
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.payment_month }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.payment_year }}
                      </td>
                      <td class="text-xs-center">
                        {{
                          props.item.original_amount
                            ? props.item.original_amount
                            : "-"
                        }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.paid_amount }}
                      </td>
                      <td class="text-xs-center">
                        {{ props.item.amount ? props.item.amount : "-" }}
                      </td>
                      <td class="">
                        <v-checkbox
                          v-model="props.item.is_manual_payment"
                          disabled
                          class="justify-center"
                        />
                      </td>
                      <td class="">
                        <v-checkbox
                          v-model="props.item.is_suspended"
                          disabled
                          class="justify-center"
                        />
                      </td>
                      <td class="text-xs-center">
                        {{ getReferenceVoucher(props.item) }}
                      </td>
                      <td class="text-xs-center">
                        {{ getPaymentDate(props.item) }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <div class="overflow-hidden text-xs-center pt-4">
                  <v-pagination
                    v-model="pagination.page"
                    :length="pages"
                    :total-visible="6"
                    class="re-pagination"
                    @input="$emit('refetch')"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
import { defaultFormat } from "../../helper";
import colorMixin from "../../mixins/colorMixin";
import ModalTableLoader from "../../views/loaders/ModalTableLoader";

export default {
  name: "contract-dialog",
  components: { ModalTableLoader },
  mixins: [colorMixin],
  props: {
    showDialog: Boolean,
    selectedContract: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: "Label"
    },
    filterType: {
      default: "new_contract",
      type: String
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    title: String,
    selectedInvoices: {
      type: Array,
      default: () => []
    },
    isDialogLoading: Boolean,
    isRenew: Boolean
  },
  data() {
    return {
      dialog: this.showDialog,
      contract: {
        tenant: {},
        unit: {},
        property: {}
      },
      tab: null
    };
  },
  computed: {
    isSuspended() {
      return this.filterType === "is_suspended";
    },
    invoicePagination: {
      get() {
        return this.pagination;
      },
      set(value) {
        this.$emit("updatePagination", value);
      }
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

    headers() {
      return [
        {
          text: this.$t("IS PAID"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Payment Month"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Payment Year"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Original Amount"), align: "center", sortable: false },
        { text: this.$t("Amount"), align: "center", sortable: false },
        {
          text: this.$t("Actual Paid Amount"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Is Manual"), align: "center", sortable: false },
        {
          text: this.$t("Is Suspended"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Receipt Voucher"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Payment Date"),
          align: "center",
          sortable: false
        }
      ];
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$emit("closeDialog");
      }
    },
    showDialog(value) {
      this.dialog = value;
    },
    selectedContract() {
      this.contract = this.selectedContract;
    }
  },
  methods: {
    formatDates(value, containsTime) {
      return defaultFormat(value, containsTime);
    },
    closeDialoge() {
      this.tab = 0;
      this.$emit("closeDialog");
    },
    getReferenceVoucher(item) {
      if (
        item.paid_month_year &&
        item.paid_month_year[0].receipt_voucher_reference
      ) {
        return item.paid_month_year[0].receipt_voucher_reference;
      }
      if (item.receipt_voucher_reference) {
        return item.receipt_voucher_reference;
      }
      return "-";
    },
    getPaymentDate(item) {
      if (item.paid_month_year && item.paid_month_year[0].payment_date) {
        return this.formatDates(item.paid_month_year[0].payment_date);
      }

      if (item.payment_date) {
        return this.formatDates(item.payment_date);
      }

      return "-";
    }
  }
};
</script>

<style scoped>
.headline {
  padding: 0px 25px !important;
  padding-top: 15px !important;
}
.v-list__tile__content {
  flex: 1 1 50% !important;
}
.p-5 {
  padding: 5px;
}
.cross-icon-position {
  padding: 0px 20px 0px;
}

/* ::v-deep .highlight-text-open-balance input {
  color: white;
} */
/* ::v-deep .highlight-text-open-balance:hover {
  background-color: #0a82be !important;
  color: white;
} */
/* ::v-deep .highlight-text-is-suspended input {
  color: white;
}
::v-deep .highlight-text-is-suspended:hover {
  background-color: #f0252b !important;
  color: white;
} */
/* ::v-deep .highlight-text-is-missed input {
  color: white;
}
::v-deep .highlight-text-is-missed:hover {
  background-color: #302f37 !important;
  color: white;
} */

::v-deep .higlight-text-is-grace:hover {
  background-color: #f77d1a !important;
}
::v-deep .higlight-text-is-grace input {
  color: white !important;
}
</style>

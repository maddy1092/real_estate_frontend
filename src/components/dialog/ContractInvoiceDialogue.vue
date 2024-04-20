<template>
  <v-dialog v-model="dialogue" width="50%" class="re-dialog">
    <v-card class="pb-3">
      <v-card-title class="headline re-card-title ">
        {{ $t(title) }}
      </v-card-title>
      <v-card-text class="dialog-table">
        <modal-table-loader v-if="isDialogLoading" />
        <div v-if="!isDialogLoading">
          <v-data-table
            :headers="headers"
            :items="selectedInvoices"
            class="re-table"
            hide-actions
            :no-data-text="$t('No data available')"
          >
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-center">
                  {{ props.item.id }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.amount }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.payment_month }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.payment_year }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.status }}
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
  </v-dialog>
</template>

<script>
import ModalTableLoader from "../../views/loaders/ModalTableLoader";

export default {
  name: "invoices-dialog",
  components: { ModalTableLoader },

  props: {
    value: Boolean,
    pagination: {
      type: Object,
      default: () => {}
    },
    title: String,
    selectedInvoices: {
      type: Array,
      default: () => []
    },
    isDialogLoading: Boolean
  },
  computed: {
    invoicePagination: {
      get() {
        return this.pagination;
      },
      set(value) {
        this.$emit("updatePagination", value);
      }
    },
    dialogue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
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
          text: this.$t("Id"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Original Amount"), align: "center", sortable: false },
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
        { text: this.$t("Status"), align: "center", sortable: false }
      ];
    }
  }
};
</script>

<style lang="css" scoped>
.text-xs-center >>> .v-text-field__details {
  margin-bottom: 0px !important;
  min-height: unset !important;
}

.re-card-title {
  max-width: 100% !important;
  padding: 0px 23px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.dialog-table {
  padding: 16px 0px;
}
</style>

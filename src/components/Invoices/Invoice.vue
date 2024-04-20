<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="selectedInvoices"
      hide-actions
      :no-data-text="$t('No data available')"
    >
      <template v-slot:headers="props">
        <tr>
          <th class="d-flex select-all">
            <v-checkbox
              v-model="selectAll"
              primary
              hide-details
              @click.stop="toggleAll"
            />
            {{ $t("Is Paid") }}
          </th>
          <th v-for="header in props.headers" :key="header.text">
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr
          :class="
            getRowColor(
              props.item,
              null,
              selectedInvoices[props.index - 1],
              isRenew
            )
          "
        >
          <td>
            <v-checkbox
              v-model="props.item.is_paid"
              class="justify-start"
              :disabled="
                props.item.is_grace_period ||
                  (!checkPreviousIndex(props.index - 1) &&
                    !props.item.is_paid) ||
                  props.item.is_generated
              "
              @change="toggleSelectbutton(props.index)"
            />
          </td>
          <td class="re-width-70 text-xs-center div">
            {{ props.item.payment_month }}
          </td>
          <td class="re-width-70 text-xs-center div">
            {{ props.item.payment_year }}
          </td>
          <td class="text-xs-center">
            {{
              parseInt(
                isAction ? props.item.amount : props.item.original_amount
              ).toFixed(3)
            }}
          </td>
          <td class="text-xs-center">
            {{ parseInt(props.item.paid_amount).toFixed(3) }}
          </td>
          <td class="re-width-115 justify-center div">
            <v-text-field
              v-model="
                props.item[`${isAction ? 'actual_paid_amount' : 'amount'}`]
              "
              required
              v-validate="
                `required|max_value: ${
                  isAction ? props.item.amount : props.item.original_amount
                }`
              "
              :name="`actual_paid_amount_${props.index}`"
              :data-vv-name="`actual_paid_amount_${props.index}`"
              :disabled="props.item.is_grace_period || props.item.is_generated"
            />
            <span class="red-text">{{
              errors.collect(`actual_paid_amount_${props.index}`).length
                ? $t(
                    "Actual paid amount should be less than or equal to the original amount"
                  )
                : ""
            }}</span>
          </td>
          <td>
            <v-checkbox
              v-model="props.item.is_suspended"
              class="justify-center"
              :disabled="props.item.is_grace_period || props.item.is_generated"
            />
          </td>
          <td>
            <v-checkbox
              v-model="props.item.is_manual_payment"
              class="justify-center"
              :disabled="props.item.is_grace_period || props.item.is_generated"
            />
          </td>
          <td class="re-width-115 div">
            <v-text-field
              v-model="props.item.receipt_voucher_reference"
              :disabled="props.item.is_grace_period || props.item.is_generated"
            />
          </td>
          <td
            class="re-width-145 div datePickerWidth"
            :class="{ datePickerWidthEn: $i18n.locale === 'en' }"
          >
            <date-picker
              v-model="props.item.payment_date"
              :disabled="props.item.is_grace_period || props.item.is_generated"
              :allowed-dates="
                $event => dateExistBetween($event, props.item.allowed_date)
              "
              :defaultValue="props.item.payment_date"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
    <color-details />
  </div>
</template>

<script>
import moment from "moment";

import ColorDetails from "../../components/ColorDetails";
import DatePicker from "../../components/picker/DatePicker.vue";
import colorMixin from "../../mixins/colorMixin";
import date_mixins from "../../mixins/date_mixins";

export default {
  name: "invoice-table",
  mixins: [date_mixins, colorMixin],
  props: {
    selectedInvoices: {
      type: Array,
      default: () => []
    },
    isRenew: Boolean,
    isAction: Boolean
  },
  components: { DatePicker, ColorDetails },
  data() {
    return {
      selectAll: this.selectedInvoices.every(invoice => invoice.is_paid)
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Month"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Year"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Original Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Paid Amount"),
          align: "center",
          sortable: false
        },
        {
          text: this.$t("Actual Paid Amount"),
          align: "center",
          sortable: false
        },
        { text: this.$t("Is Suspended"), align: "center", sortable: false },
        { text: this.$t("Is Manual"), align: "center", sortable: false },
        {
          text: this.$t("Receipt No"),
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
  methods: {
    checkPreviousIndex(index) {
      if (index >= 0) return this.selectedInvoices[index].is_paid;
      return true;
    },
    toggleAll() {
      this.selectAll = !this.selectAll;
      this.selectedInvoices.forEach(invoice => {
        if (
          !invoice.is_grace_period &&
          (invoice.is_missed || invoice.is_open_balance || invoice.is_suspended)
        ) {
          invoice.is_paid = this.selectAll;
        }
      });
    },
    toggleSelectbutton(index) {
      if (this.selectedInvoices.some(invoice => !invoice.is_paid)) {
        this.selectAll = false;
      }
      this.selectedInvoices.forEach((invoice, idx) => {
        if (
          idx > index &&
          (invoice.is_missed || invoice.is_open_balance || invoice.is_suspended)
        )
          invoice.is_paid = false;
      });
    },
    numToMonth(month, date) {
      if (month) {
        return moment(month, "MM").format("MMMM");
      } else if (date) {
        return moment(date, "YYYY/MM/DD").format("MMMM");
      }
      return "-";
    },
    getYear(year, date) {
      if (year) {
        return year;
      } else if (date) {
        return moment(date, "YYYY/MM/DD").format("YYYY");
      }
      return "-";
    }
  }
};
</script>

<style scoped>
.select-all {
  align-items: center;
  margin-top: 15px;
}

::v-deep .datePickerWidth .v-input__icon {
  justify-content: end;
}
::v-deep .datePickerWidthEn input {
  text-align: left;
}
::v-deep .highlight-text-open-balance input {
  color: white !important;
}
::v-deep .highlight-text-is-missed input {
  color: white !important;
}
::v-deep .highlight-text-is-missed:hover {
  background-color: #302f37 !important;
}

::v-deep .higlight-text-is-grace:hover {
  background-color: #f77d1a !important;
}
::v-deep .higlight-text-is-grace input {
  color: white !important;
}
</style>

<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    :top="openOnTop"
    max-width="290px"
    min-width="290px"
    :class="{ datePickerSelector: dateFormatted }"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        :name="name"
        :input="$emit('input', date)"
        :label="label"
        :required="required"
        :error-messages="errorMessages"
        @blur="date = parseDate(dateFormatted)"
        :prepend-icon="prependIcon ? 'event' : ''"
        readonly
        :disabled="disabled"
        class="re-datepicker"
        :class="classes"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
      :class="type"
      :allowed-dates="allowedDates"
      color="#f57829"
      :type="type"
      no-title
      scrollable
    >
      <v-spacer />
      <v-btn flat @click="menu = false">{{ $t("Cancel") }}</v-btn>
      <v-btn flat @click="$refs.menu.save(date)">{{ $t("Ok") }}</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";
export default {
  name: "DatePicker",
  props: {
    label: String,
    name: String,
    changed: String,
    allowedDates: Boolean,
    openOnTop: Boolean,
    required: Boolean,
    classes: String,
    errorMessages: Array,
    default_date: Object,
    type: String,
    initialValue: String,
    defaultValue: String,
    prependIcon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      date: undefined,
      dateFormatted: undefined,
      isUpdated: false
    };
  },
  mounted() {
    if (this.defaultValue) {
      this.date = this.defaultValue;
      this.dateFormatted = this.defaultValue;
    }
  },
  watch: {
    initialValue(value) {
      if (!this.date && value && !this.isUpdated) {
        this.isUpdated = true;
        this.date = value;
        this.dateFormatted = value;
        this.$refs.menu.save(value);
      }
    },
    changed(value) {
      if (!value && this.date) {
        this.date = "";
      }
      if (value && this.date) {
        this.date = value;
      }
    },
    default_date(value) {
      this.date = value || "";
      this.dateFormatted = value || "";
      this.$refs.menu.save(value || "");
    },
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      if (day) {
        return `${day}-${month}-${year}`;
      }

      return moment(date).format("MMMM");
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");

      if (!month) {
        return;
      }

      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style scoped>
.month >>> .v-date-picker-header {
  display: none;
}
.filter-width {
  margin-right: 10px;
  width: 300px;
}
</style>

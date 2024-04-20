<template>
  <v-menu
    v-model="menu"
    ref="menu"
    lazy
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    :close-on-content-click="false"
    :return-value.sync="date"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        v-on="on"
        class="re-datepicker"
        readonly
        :disabled="disabled"
        :error-messages="errorMessages"
        :input="$emit('input', dateFormatted)"
        :label="label"
        clearable
      />
    </template>

    <v-date-picker
      ref="picker"
      v-model="date"
      :max="getMaxYear()"
      min="1950-01-01"
      reactive
      no-title
      @input="save"
    />
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  name: "year-picker",
  props: {
    errorMessages: Array,
    label: String,
    initialValue: String,
    disabled: Boolean,
    changed: String,
    maxYear: {
      default: 10,
      type: Number
    }
  },
  data() {
    return {
      menu: false,
      dateFormatted: "",
      date: null,
      isUpdated: false
    };
  },
  watch: {
    initialValue(val) {
      if (val && !this.date && !this.isUpdated) {
        this.isUpdated = true;
        this.date = moment()
          .year(val)
          .format("YYYY-MM-DD");
      }
    },
    changed(value) {
      if (!value && this.date) {
        this.date = null;
        this.dateFormatted = "";
      }
    },
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    date(val) {
      if (val) {
        this.dateFormatted = moment(this.date).format("YYYY");
      }
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
      if (this.$refs.picker) this.$refs.picker.activePicker = "YEAR";
      this.menu = false;
    },
    getMaxYear() {
      const date = moment(new Date()).add(this.maxYear, "year");
      return new Date(date).toISOString().substr(0, 10);
    }
  }
};
</script>

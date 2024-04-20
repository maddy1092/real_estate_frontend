<template>
  <v-layout>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      :return-value.sync="date"
      top="openOnTop"
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="datetime"
          :input="$emit('input', datetime)"
          :label="label"
          :required="required"
          :error-messages="errorMessages"
          readonly
          class="re-datepicker"
          v-on="on"
        />
      </template>
      <template>
        <v-card class="pa-0">
          <v-tabs grow v-model="activeTab" class="fixed-height">
            <v-tab key="calendar">
              <v-icon>event</v-icon>
            </v-tab>
            <v-tab key="timer">
              <v-icon>access_time</v-icon>
            </v-tab>
            <v-tab-item key="calendar">
              <v-date-picker
                v-model="date"
                @input="activeTab = 1"
                class="elevation-0"
              />
            </v-tab-item>
            <v-tab-item key="timer">
              <v-time-picker class="elevation-0" v-model="time" />
            </v-tab-item>
          </v-tabs>
          <v-card-actions>
            <v-spacer />
            <v-btn flat @click="cancel">{{ $t("Cancel") }}</v-btn>
            <v-btn flat @click="saveDateTime">{{ $t("OK") }}</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-menu>
  </v-layout>
</template>

<script>
import moment from "moment";

const DEFAULT_DATE = moment(new Date()).format("YYYY-MM-DD");
const DEFAULT_TIME = moment(new Date()).format("hh:mm:ss");
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
const DEFAULT_TIME_FORMAT = "hh:mm:ss";

export default {
  name: "DatePicker",
  props: {
    dateFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    timeFormat: {
      type: String,
      default: "hh:mm:ss"
    },
    label: String,
    changed: String,
    required: Boolean,
    errorMessages: Array,
    default_date: Object,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    menu: false,
    display: false,
    activeTab: 0,
    date: DEFAULT_DATE,
    time: DEFAULT_TIME,
    datetime: undefined
  }),
  watch: {
    changed(value) {
      this.datetime = value;
      this.$refs.menu.save(this.value);
    },
    default_date(value) {
      this.datetime = value;
      this.$refs.menu.save(this.datetime);
    },
    date() {
      this.date = this.date.slice(0, 10);
    }
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + " " + this.timeFormat;
    },
    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + " " + DEFAULT_TIME_FORMAT;
    },
    selectedDateTime() {
      if (this.date && this.time) {
        let datetimeString = this.date + " " + this.time;
        if (this.time.length === 5) {
          datetimeString += ":00";
        }
        return moment(datetimeString).format(this.defaultDateTimeFormat);
      } else {
        return null;
      }
    }
  },
  methods: {
    saveDateTime() {
      this.datetime = this.selectedDateTime;
      this.$refs.menu.save(this.selectedDateTime);
    },
    cancel() {
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.menu = false;
    }
  }
};
</script>

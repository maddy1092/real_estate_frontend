<template>
  <div class="status-position" :style="{ color: color }">
    <v-icon v-if="showIcon" class="inline-icon" :color="color"
      >brightness_1</v-icon
    >
    {{ status }}
  </div>
</template>

<script>
const colorsMap = {
  Created: "#0a82be !important",
  Active: "#0a82be !important",
  Pending: "#f77c1a !important",
  Paid: "#06BE00 !important",
  Expired: "#f0252b !important",
  Late: "#f0252b !important",
  "Waiting for activation": "#f77c1a !important",
  "Waiting for deactivation": "#f77c1a !important",
  "Waiting for termination": "#f77c1a !important"

};
export default {
  name: "Status",
  props: {
    showIcon: {
      type: Boolean,
      default: true
    },
    status: String
  },
  computed: {
    color() {
      return colorsMap[this.status] || "black";
    }
  }
};
</script>

<style scoped>
.inline-icon {
  font-size: 13px;
  line-height: 1.5;
  margin-right: 2px;
}
</style>

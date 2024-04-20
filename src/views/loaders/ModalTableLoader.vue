<template>
  <div class="mt-4">
    <v-layout row wrap class="row-loader">
      <vue-skeleton-loader rounded :height="40" animation="fade" />
    </v-layout>
    <v-layout row wrap class="row-loader">
      <vue-skeleton-loader rounded :height="40" animation="fade" />
    </v-layout>
    <v-layout row wrap class="row-loader">
      <vue-skeleton-loader rounded :height="40" animation="fade" />
    </v-layout>
    <v-layout row wrap class="row-loader">
      <vue-skeleton-loader rounded :height="40" animation="fade" />
    </v-layout>
    <v-layout row wrap class="row-loader">
      <vue-skeleton-loader rounded :height="40" animation="fade" />
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "TableLoader",
  inject: {
    theme: {
      default: { isDark: false }
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    }
  }
};
</script>

<style scoped>
.row-loader > .loader {
  width: 100% !important;
  margin-bottom: 0.7rem;
}
</style>

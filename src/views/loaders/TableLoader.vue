<template>
  <div class="mt-4">
    <v-layout row wrap class="mb-4" v-if="windowWidth > '935'">
      <template>
        <vue-skeleton-loader
          rounded
          :width="103"
          :height="36"
          animation="fade"
        />
        <div class="d-flex radio-btn-loader ml-4">
          <vue-skeleton-loader
            rounded
            type="circle"
            :width="34"
            :height="34"
            animation="fade"
          />
          <div class="ml-2">
            <vue-skeleton-loader
              rounded
              type="circle"
              :width="34"
              :height="34"
              animation="fade"
            />
          </div>
        </div>
        <v-spacer></v-spacer>
        <!--Full-text search -->
        <vue-skeleton-loader
          rounded
          :width="283"
          :height="36"
          animation="fade"
        />
        <v-spacer></v-spacer>
        <!-- Actions -->
        <div class="mr-2">
          <vue-skeleton-loader
            rounded
            :width="93"
            :height="36"
            animation="fade"
          />
        </div>
        <!-- Export popup -->
        <div class="mr-2">
          <vue-skeleton-loader
            rounded
            :width="195"
            :height="36"
            animation="fade"
          />
        </div>
        <vue-skeleton-loader
          rounded
          :width="113"
          :height="36"
          animation="fade"
        />
      </template>
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

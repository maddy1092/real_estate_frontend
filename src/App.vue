<template>
  <v-app class="navbarShow p-b-50 p-t-90" id="app_estate">
    <router-view></router-view>
    <SnackBar />
  </v-app>
</template>
<script>
import SnackBar from "@/components/SnackBar";
export default {
  components: {
    SnackBar
  }
};
</script>

<style scoped>
  .p-b-50 {
    padding-bottom: 50px;
  }
  .p-t-90 {
    padding-top: 90px;
  }
  .navbarShow {
    padding-left: 300px;
  }

  .application--is-rtl.navbarShow {
    padding-left: 0px;
    padding-right: 300px;
  }
  @media screen and (max-width: 1263px) {
    .navbarShow {
      padding-left: 100px;
    }
    .application--is-rtl.navbarShow{
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  div >>> .v-text-field__details {
    padding-bottom: 5px;
  }
  </style>

  <style>
  .red-text {
    color: #ff5252 !important;
    caret-color: #ff5252 !important;
  }
  div >>> .v-btn.v-btn--disabled {
    background-color: rgba(0, 0, 0, 0.12) !important;
  }
</style>

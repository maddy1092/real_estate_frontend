<template>
  <v-snackbar v-model="show" :color="color" :multi-line="multiline">
    {{ text }}
    <v-btn dark flat @click="show = false">{{ $t("Close") }}</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  data: () => ({
    show: false,
    text: "",
    color: "info",
    multiline: false
  }),
  created() {
    this.$root.$on("snackbar", ({ text, color = "info", multiline }) => {
      this.text = text;
      this.color = color;
      this.show = true;
      this.multiline = multiline;
    });
  }
};
</script>

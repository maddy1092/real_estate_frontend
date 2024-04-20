<template>
  <v-layout justify-left>
    <div class="color-group">
      <div class="bg-is-grace color-box"></div>
      <p>{{ $t("Grace Period") }}</p>
    </div>
    <div class="color-group">
      <div class="bg-open-balance color-box"></div>
      <p>{{ $t("Open Balance") }}</p>
    </div>
    <div class="color-group">
      <div class="bg-is-missed color-box"></div>
      <p>{{ $t("Missed") }}</p>
    </div>
    <div class="color-group">
      <div class="default-color color-box"></div>
      <p>{{ $t("Normal") }}</p>
    </div>
    <div class="color-group">
      <div class="bg-is-suspended color-box"></div>
      <p>{{ $t("Not Paid/Is Suspended") }}</p>
    </div>
  </v-layout>
</template>

<script>
export default {
  name: "ColorDetails"
};
</script>

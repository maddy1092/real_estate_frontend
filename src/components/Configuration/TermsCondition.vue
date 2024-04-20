<template>
  <v-card-text>
    <v-checkbox
      v-model="show_terms"
      class="re-gray-color"
      color="grey darken-1"
      :label="`${this.$t('Terms & conditions')} [En]`"
    ></v-checkbox>
    <p class="re-margin-t40 re-gray-color re-padding-start7 text-start">
      {{ this.$t("Terms & conditions") }} [En]
    </p>
    <CKeditor v-model="terms_text_en" />
    <p class="re-margin-t40 re-gray-color re-padding-start7 text-start">
      {{ this.$t("Terms & conditions") }} [Ar]
    </p>
    <CKeditor v-model="terms_text_ar" />
  </v-card-text>
</template>

<script>
import CKeditor from "../Ckeditor.vue";
export default {
  name: "terms-condition",
  emits: ["input"],
  props: {
    value: Object
  },
  components: { CKeditor },
  computed: {
    show_terms: {
      get() {
        return this.value.show_terms;
      },
      set(value) {
        this.$emit("input", { ...this.value, show_terms: value });
      }
    },
    terms_text_en: {
      get() {
        return this.value.terms_text_en;
      },
      set(value) {
        this.$emit("input", { ...this.value, terms_text_en: value });
      }
    },
    terms_text_ar: {
      get() {
        return this.value.terms_text_ar;
      },
      set(value) {
        this.$emit("input", { ...this.value, terms_text_ar: value });
      }
    }
  }
};
</script>

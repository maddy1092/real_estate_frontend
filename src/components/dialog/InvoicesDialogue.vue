<template>
  <v-dialog v-model="dialogue" persistent width="75%" class="re-dialog">
    <v-card class="pb-3">
      <v-card-title class="headline re-card-title ">
        {{ $t(title) }}
      </v-card-title>
      <v-card-text class="dialog-table">
        <modal-table-loader v-if="isDialogLoading" />
        <invoice
          v-show="!isDialogLoading"
          :selectedInvoices="selectedInvoices"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-layout row>
          <v-flex sm7 md5 class="mr-5">
            <v-btn
              dark
              class="re-orangtbtn"
              :loading="isUpdatingInvices"
              :disabled="isDialogLoading"
              @click="saveData"
            >
              {{ $t("Save and Return") }}
            </v-btn>
            <v-btn dark :disabled="isDialogLoading" @click="closeDialoge">
              {{ $t("Close") }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ModalTableLoader from "../../views/loaders/ModalTableLoader";
import Invoice from "../Invoices/Invoice.vue";

export default {
  name: "invoices-dialog",
  components: { ModalTableLoader, Invoice },

  props: {
    value: Boolean,
    title: String,
    isUpdatingInvices: Boolean,
    selectedInvoices: {
      type: Array,
      default: () => []
    },
    isDialogLoading: Boolean
  },
  computed: {
    dialogue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    saveData() {
      // this.dialogue = false;
      this.$emit("updateInvoices");
    },
    closeDialoge() {
      this.dialogue = false;
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="css" scoped>
.text-xs-center >>> .v-text-field__details {
  margin-bottom: 0px !important;
  min-height: unset !important;
}

.re-card-title {
  max-width: 100% !important;
  padding: 0px 23px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.dialog-table {
  padding: 16px 0px;
}
</style>

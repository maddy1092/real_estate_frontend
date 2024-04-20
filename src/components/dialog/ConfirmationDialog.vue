<template>
  <div>
    <v-dialog
      v-model="showDialog"
      width="518"
      persistent
      class="refund"
      margin="auto"
    >
      <v-card class="text-center">
        <v-card-title
          class="oo-dialog-title justify-center headline"
          style="text-transform: capitalize;"
        >
          {{ $t(label) }}
        </v-card-title>
        <v-card-text class="dialog-title">
          {{ $t(message) }}
        </v-card-text>
        <v-card-actions class="justify-center dialog-buttons text-capitalize">
          <v-btn
            class="confirm-btn btn-refund"
            color="refund-btn"
            text
            @click="acceptAction"
          >
            {{ saveMessage ? saveMessage : $t("Accept") }}
          </v-btn>
          <v-btn class="cancel-btn" @click="showDialog = false">
            {{ cancelMessage ? cancelMessage : $t("Cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "confirmation_dialog",
  emit: ["acceptDialog"],
  props: {
    value: Boolean,
    label: String,
    message: String,
    saveMessage: String,
    cancelMessage: String
  },
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    acceptAction() {
      this.showDialog = false;
      this.$emit("acceptDialog");
    }
  }
};
</script>

<style scoped>
.v-dialog .headline {
  max-width: 100% !important;
}
.oo-dialog-title {
  background: #e97c18;
  color: white;
}
.refund-btn {
  background: #e97c18 !important;
  color: white !important;
}
.dialog-title {
  font-size: 14px;
  font-weight: 400;
  color: black;
}
.btn-refund {
  height: 36px !important;
  padding: 0 !important;
}
</style>

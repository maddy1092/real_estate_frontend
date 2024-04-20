<template>
  <v-flex>
    <v-layout class="pt-5" wrap>
      <v-flex grow pa-1 xs10 md8>
        <v-layout align-start wrap>
          <v-flex xs12 md4>
            <h2 class="display-2">{{ $t("Rent Management") }}</h2>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex shrink pa-1 xs2 md4 class="re-rel-pos text-xs-right">
        <v-btn fab small outline v-on="on" class="re-abs-pos">
          <v-icon>history</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-breadcrumbs :items="breadItemsSetLang()">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "header",
  props: {
    value: Object
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      items: [
        { label: this.$t("All"), value: "" },
        { label: this.$t("Paid"), value: "paid" },
        { label: this.$t("Pending"), value: "pending" },
        { label: this.$t("Late"), value: "late" }
      ]
    };
  },
  computed: {
    filter: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

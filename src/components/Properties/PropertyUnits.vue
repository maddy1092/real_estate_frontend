<template>
  <v-menu
    :v-model="menu1"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn dark v-on="on" class="re-show">
        {{ unit.unit_type }}
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-data-table
          :headers="headers2"
          :items="unit.unittype_unit_details"
          class="re-table"
          hide-actions
        >
          <template v-slot:items="data">
            <td
              class="d-sm-table-cell"
              :class="{
                'text-xs-left': !$vuetify.rtl,
                'text-xs-right': $vuetify.rtl
              }"
            >
              <div
                v-if="!unit.unittype_unit_details.length"
                class="text-xs-center"
              >
                -----
              </div>
              <property-contracts :unit="data.item" />
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ data.item.invoice_amount }} {{ $t("KWD") }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{
                $t(
                  `${data.item.status.charAt(0).toUpperCase() +
                    data.item.status.slice(1)}`
                )
              }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">more_vert</v-icon>
                </template>
                <v-list>
                  <span v-for="(action, index) in actions" :key="index">
                    <v-list-tile
                      :disabled="disableList(action.value, data.item)"
                      @click="
                        $emit('handleNavigation', { action, data, property })
                      "
                    >
                      <v-list-tile-title style="cursor:pointer;">{{
                        action.title
                      }}</v-list-tile-title>
                    </v-list-tile>
                  </span>
                </v-list>
              </v-menu>
            </td>
          </template>
        </v-data-table>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import PropertyContracts from "../../components/Properties/PropertyContracts.vue";
export default {
  components: { PropertyContracts },
  name: "property-units",
  props: ["on", "property", "isLoading", "unit", "is_cash_payment_allowed"],
  data() {
    return {
      menu1: false,
      actions: [
        { title: this.$t("Edit Unit"), value: "edit_unit", route: "edit_unit" },
        {
          id: 1,
          title: this.$t("New Contract"),
          value: "new_contract",
          route: "add_contract"
        },
        {
          id: 2,
          title: this.$t("Renew Contract"),
          value: "renew",
          route: "renew_contract"
        },
        {
          id: 3,
          title: this.$t("Terminate Contract"),
          value: "terminate",
          route: "terminate_contract"
        },
        { title: this.$t("Change Price"), route: "edit_price" },
        {
          title: this.$t("Manual Payment"),
          value: "manual",
          route: "manual_payment"
        }
      ]
    };
  },
  computed: {
    headers2() {
      return [
        {
          text: this.$t("Unit Number"),
          align: !this.$vuetify.rtl ? "left" : "right",
          sortable: false
        },
        { text: this.$t("Price"), align: "center", sortable: false },
        { text: this.$t("Status"), align: "center", sortable: false },
        { text: this.$t("Action"), align: "center", sortable: false }
      ];
    }
  },
  methods: {
    disableList(value, item) {
      const isVacant = item.status === "vacant";
      if ((!this.is_cash_payment_allowed || isVacant) && value === "manual") {
        return true;
      }
      if (isVacant && (value === "renew" || value === "terminate")) {
        return true;
      }

      return false;
    }
  }
};
</script>

<style lang="css" scoped>
.re-show:after {
  right: -20px;
}
div[role="listitem"]:hover {
  background: #dcdcdc;
  color: orange;
}
</style>

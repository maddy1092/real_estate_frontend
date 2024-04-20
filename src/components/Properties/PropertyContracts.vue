<template>
  <v-menu
    :v-model="contractDialog"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn dark v-on="on" class="re-show">
        {{ unit.unit_number }}
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-data-table
          :items="unit.contracts"
          :headers="headers"
          class="re-table"
          hide-actions
        >
          <template v-slot:items="data">
            <td class="text-xs-center d-sm-table-cell">
              {{ data.item.id }}
            </td>
            <td
              class="text-xs-center d-sm-table-cell ongoing"
              :class="{
                expired:
                  data.item.status.includes('terminat') ||
                  data.item.status.includes('deactivat')
              }"
            >
              {{ data.item.status }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ defaultFormat(data.item.contract_start_date) }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ defaultFormat(data.item.contract_end_date) }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{
                data.item.termination_date
                  ? defaultFormat(data.item.termination_date)
                  : "-"
              }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ data.item.tenant_name }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ data.item.tenant_phone_number }}
            </td>
            <td class="text-xs-center d-sm-table-cell">
              {{ data.item.tenant_email }}
            </td>
          </template>
        </v-data-table>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { defaultFormat } from "../../helper";
export default {
  name: "property-contracts",
  props: ["on", "unit"],
  data() {
    return {
      contractDialog: false
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("Contract Number"),
          sortable: false
        },
        {
          text: this.$t("Contract status"),
          sortable: false
        },
        {
          text: this.$t("Contract Start Date"),
          sortable: false
        },
        {
          text: this.$t("Contract End Date"),
          sortable: false
        },
        {
          text: this.$t("Termination Date"),
          sortable: false
        },
        { text: this.$t("Tenant Name"), align: "center", sortable: false },
        { text: this.$t("Phone"), align: "center", sortable: false },
        { text: this.$t("Email"), align: "center", sortable: false }
      ];
    }
  },
  methods: {
    defaultFormat(value) {
      return defaultFormat(value);
    }
  }
};
</script>

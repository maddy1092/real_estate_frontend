<template>
  <v-layout row>
    <v-layout column>
      <v-card>
        <v-card-title>
          <!-- HEAD BUTTONS -->
          <slot name="header"><v-spacer></v-spacer></slot>

          <!-- FILTERS MENU -->
          <v-menu
            offset-y
            v-if="enableFilters"
            :close-on-content-click="false"
            v-model="filters_expanded"
          >
            <template v-slot:activator="{ on }">
              <v-btn dark color="primary" v-on="on">
                {{ $t("Filter") }}<v-icon right>filter_list</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="pa-0">
                <v-spacer></v-spacer>
                <v-btn icon @click="filters_expanded = false"
                  ><v-icon>clear</v-icon></v-btn
                >
              </v-card-title>
              <v-card-text class="pa-3">
                <slot name="filters"><!-- Filters --></slot>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <slot><!-- Table --></slot>
      </v-card>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: "FilteredTableWrap",
  data: () => ({
    filters_expanded: false
  }),
  props: {
    enableFilters: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped></style>

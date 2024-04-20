<template>
  <div class="edit-unit-type">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Properties") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn dark class="mt-4 r-m-end" :disabled="isLoading" @click="goBack()"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="flex-wrap  " xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()" class="pl-4">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-form>
      <v-layout row wrap justify-center>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 lg9>
            <vue-skeleton-loader
              rounded
              class="w-full"
              type="rect"
              v-if="isLoading"
              :height="'358px'"
              :width="'100%'"
              animation="fade"
            />
            <v-card v-if="!isLoading">
              <v-card-title>
                <h3>
                  {{ isEdit ? $t("Edit") : $t("Add") }} {{ $t("Unit Type") }}
                </h3>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="unitType.unit_type_name_en"
                  v-validate="'required'"
                  :label="$t('Unit Type Name (EN)')"
                  required
                  class="mb-2 pb-2"
                  data-vv-name="unit_type_name_en"
                  :error-messages="errors.collect('unit_type_name_en')"
                />

                <v-text-field
                  v-model="unitType.unit_type_name_ar"
                  v-validate="'required'"
                  :label="$t('Unit Type Name (AR)')"
                  required
                  class="mb-2 pb-2"
                  data-vv-name="unit_type_name_ar"
                  :error-messages="errors.collect('unit_type_name_ar')"
                />

                <v-text-field
                  v-model="unitType.description"
                  v-validate="'required'"
                  :label="$t('Unit Type Description')"
                  required
                  color="grey darken-1"
                  data-vv-name="unit_type_description"
                  :error-messages="errors.collect('unit_type_description')"
                />
                <v-checkbox
                  v-model="unitType.is_commercial"
                  :label="$t('Is Commercial')"
                />
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-layout>
      <div class="text-xs-center mt-4">
        <v-btn
          dark
          class="re-orangtbtn"
          :disabled="isLoading"
          @click="storeData"
          >{{ $t("Save") }}</v-btn
        >
        <v-btn dark :disabled="isLoading" @click="goBack()">{{
          $t("Cancel")
        }}</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import unitTypeService from "../../services/plugins/unit_type";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "add-unit-type",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  async mounted() {
    let isEdit = false;
    this.$validator.localize("en", this.dictionary);

    if (this.$route.params.id) {
      await this.fetchContract(this.$route.params.id);
      isEdit = true;
    }

    this.isEdit = isEdit;
  },
  data() {
    return {
      isLoading: false,
      unitType: {},
      isEdit: false,
      breadCrumbs: [],
      prevRoute: "",
    };
  },
  watch:{
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    },
  },
  computed: {
    ...mapGetters("property", ["getProperty", "getIndex"]),
    dictionary() {
      return{
        custom: {
          unit_type_name_en: {
            required: () => this.$t("Unit Type Name can not be empty")
          },
          unit_type_description: {
            required: () => this.$t("Unit Type Description can not be empty")
          },
          unit_type_name_ar: {
            required: () => this.$t("Unit Type Name(AR) can not be empty")
          }
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions("property", ["setProperty"]),
    async fetchContract(id) {
      try {
        this.isLoading = true;
        const resp = await this.$processReq(
          unitTypeService.getUnitTypeById(id),
          false
        );
        this.unitType = resp.data.body;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to get unit by ID - ", error);
      }
    },
    async storeData() {
      if (await this.$validator.validateAll()) {
        const response = {
          ...this.unitType,
          unit_type_name: this.unitType.unit_type_name_en
        };

        this.isLoading = true;
        try {
          if (this.isEdit) {
            await this.$processReq(
              unitTypeService.updateUnitType(response, response.id),
              true
            );
            this.isLoading = false;
            this.$router.go(-1);
          } else {
            const resp = await this.$processReq(
              unitTypeService.addNewUnitType(response),
              true
            );
            this.isLoading = false;
            this.goBack(resp.data.body.id);
          }
        } catch (err) {
          this.isLoading = false;
          console.log('Error: Unable to update or add new unit - ', err);
        }
      }
    },
    goBack(id) {
      if (this.prevRoute && this.prevRoute.path.includes("property")) {
        let property = this.getProperty;

        if (id) {
          property.unit_types[this.getIndex] = {
            ...property.unit_types[this.getIndex],
            unit_type_id: id
          };
        }

        this.setProperty(property);

        this.$router.push({
          name: this.prevRoute.name,
          params: {
            id: this.prevRoute.params.id
          }
        });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

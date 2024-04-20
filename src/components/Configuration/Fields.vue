<template>
  <v-card-text>
    <v-layout wrap>
      <v-flex sm12>
        <v-select
          v-model="type"
          item-text="display_name"
          item-value="value"
          :label="$t('Field Type')"
          :items="typeOption"
        />
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex sm4>
        <v-checkbox
          v-model="required"
          class="re-gray-color justify-start"
          color="grey darken-1"
          :label="$t('Required')"
        />
        <span class="re-chec__p" v-if="options.required">{{
          $t(options.required.help_text)
        }}</span>
      </v-flex>
      <v-flex sm4>
        <v-checkbox
          v-model="itinerary_display"
          class="re-gray-color justify-start"
          color="grey darken-1"
          :label="$t('Itinerary display')"
        />
        <p class="re-chec__p" v-if="options.itinerary_display">
          {{ $t(options.itinerary_display.help_text) }}
        </p>
      </v-flex>
      <v-flex sm4>
        <v-checkbox
          v-model="is_active"
          class="re-gray-color"
          color="grey darken-1"
          :label="$t('Is active')"
        />
        <p class="re-chec__p" v-if="options.is_active">
          {{ $t(options.is_active.help_text) }}
        </p>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-select
        v-model="display_section"
        item-text="display_name"
        item-value="value"
        clearable
        :label="$t('Display Section')"
        :items="displaySectionOptions"
      />
    </v-layout>
    <v-layout>
      <v-select
        v-model="validator"
        item-text="display_name"
        item-value="value"
        clearable
        :label="$t('Validator')"
        :items="validatorOptions"
      />
    </v-layout>
    <!-- <v-layout wrap>
      <v-flex sm4>
        <v-checkbox
          label="Is Unit Type"
          v-model="is_unit"
          class="re-gray-color justify-start"
          color="grey darken-1"
        />
        <p class="re-chec__p" v-if="options.is_active">{{ options.is_active.help_text }}</p>
      </v-flex>
      <v-flex sm4>
        <div class="justify-center">
          <v-checkbox
            label="Is Property"
            v-model="is_property"
            class="re-gray-color"
            color="grey darken-1"
          />
        </div>
      </v-flex>
      <v-flex sm4>
        <div class="re-c-style">
          <v-checkbox
            label="Is Tenant"
            v-model="is_tenant"
            class="re-gray-color"
            color="grey darken-1"
          />
        </div>
      </v-flex>
    </v-layout> -->
    <v-layout>
      <v-select
        v-model="field"
        v-validate="'required'"
        v-if="!isCustom"
        item-text="display_name"
        item-value="value"
        :label="$t('Field')"
        :items="fieldOption"
        :data-vv-name="`field_${index}`"
        :error-messages="
          errors.collect(`field_${index}`).length > 0
            ? 'Either select a field from dropdown or add your custom one.'
            : ''
        "
      />
    </v-layout>
    <v-layout>
      <v-text-field v-model="order" type="number" :label="$t('Order')" />
    </v-layout>
    <span v-if="isCustom">
      <v-layout>
        <v-text-field v-model="label_en" :label="$t('Label(EN)')" />
      </v-layout>
      <v-layout>
        <v-text-field v-model="label_ar" :label="$t('Label(AR)')" />
      </v-layout>
      <v-layout>
        <v-text-field v-model="name" :label="$t('Name')" />
      </v-layout>
    </span>
    <v-layout>
      <v-btn class="re-del-btn" @click="$emit('onDelete')">
        {{ $t("Delete Field") }}
      </v-btn>
    </v-layout>
  </v-card-text>
</template>

<script>
import { isEmpty } from "lodash";

export default {
  name: "fields",
  emits: ["addNew", "onUpdate", "onDelete"],
  props: {
    index: Number,
    value: Object,
    options: {
      default: () => {},
      type: Object
    }
  },
  inject: ["parentValidator"],
  data() {
    return {
      items1: ["item1", "item2"],
      fieldOption: [],
      typeOption: [],
      validatorOptions: [],
      displaySectionOptions: []
    };
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.loadOptions();
      }
    }
  },
  created() {
    this.$validator = this.parentValidator;
    this.loadOptions();
  },
  computed: {
    isCustom() {
      return this.type === "custom";
    },
    type: {
      get() {
        return this.value.type;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, type: val });
      }
    },
    label_en: {
      get() {
        return this.value.label_en;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, label_en: val, label: val });
      }
    },
    label_ar: {
      get() {
        return this.value.label_ar;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, label_ar: val });
      }
    },
    name: {
      get() {
        return this.value.name;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, name: val });
      }
    },
    required: {
      get() {
        return this.value.required;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, required: val });
      }
    },
    itinerary_display: {
      get() {
        return this.value.itinerary_display;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, itinerary_display: val });
      }
    },
    display_section: {
      get() {
        return this.value.display_section;
      },
      set(val) {
        this.$emit("onUpdate", {
          ...this.value,
          display_section: val || ""
        });
      }
    },
    validator: {
      get() {
        return this.value.validator;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, validator: val });
      }
    },
    is_active: {
      get() {
        return this.value.is_active;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, is_active: val });
      }
    },
    order: {
      get() {
        return this.value.order;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, order: val });
      }
    },
    field: {
      get() {
        return this.value.field;
      },
      set(val) {
        this.$emit("onUpdate", { ...this.value, field: val });
      }
    }
  },
  methods: {
    loadOptions() {
      if (!isEmpty(this.options)) {
        this.typeOption = this.options.type.choices;
        this.fieldOption = this.options.field.choices;
        this.validatorOptions = this.options.validator.choices;
        this.displaySectionOptions = this.options.display_section.choices;
      }
    }
  }
};
</script>

<template>
  <div class="add-tenant">
    <v-layout class="pt-5">
      <v-flex grow pa-1 xs6>
        <h2 class="display-2 pl-4">{{ $t("Edit Tenant") }}</h2>
      </v-flex>
      <v-flex shrink pa-1 xs6 text-xs-right>
        <v-btn @click="$router.go(-1)" dark class="mt-4 r-m-end"
          >← {{ $t("Back") }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout class="r-p-24px">
      <v-flex class="flex-wrap" xs12 pa-1>
        <v-breadcrumbs :items="breadItemsSetLang()">
          <template v-slot:divider>
            <v-icon>fiber_manual_record</v-icon>
          </template>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm12 lg9>
          <v-card class="pb-4" v-if="!isLoading">
            <v-card-title>
              <h3>{{ $t("Edit Tenant") }}</h3>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="tenant.tenant_name_en"
                  v-validate="'required|alpha_spaces'"
                  :label="$t('Tenant Name (EN)')"
                  required
                  class="mb-2"
                  data-vv-name="tenant_name"
                  :error-messages="errors.collect('tenant_name')"
                />

                <v-text-field
                  v-model="tenant.tenant_name_ar"
                  v-validate="'required'"
                  :label="$t('Tenant Name (AR)')"
                  required
                  class="mb-2"
                  data-vv-name="tenant_name_ar"
                  :error-messages="errors.collect('tenant_name_ar')"
                />

                <v-text-field
                  v-model="tenant.tenant_info.civil_id_number"
                  v-validate="
                    `required|alpha_num|${
                      tenant.tenant_info.nationality === 'Kuwait'
                        ? 'length:12'
                        : ''
                    }`
                  "
                  :label="$t('Civil ID Number')"
                  required
                  class="mb-4"
                  data-vv-name="civil_id_number"
                  :error-messages="errors.collect('civil_id_number')"
                />

                <v-layout class="align-center mb-3">
                  <span class="re-upload__span">{{
                    $t("Upload Civil ID (Front)")
                  }}</span>
                  <input
                    type="file"
                    id="uploadCivilIdFront"
                    style="display: none"
                    ref="uploadCivilIdFront"
                    accept="image/*"
                    @change="
                      event => uploadImage(event, 'civil_id_front', true)
                    "
                  />
                  <v-btn
                    @click="$refs.uploadCivilIdFront.click()"
                    class="re-custom-file-input"
                    >{{ $t("Upload") }}</v-btn
                  >
                  <span
                    v-if="!tenant.tenant_info.civil_id_front && showError"
                    style="color: #ff0000"
                    >{{ $t("This field is required") }}</span
                  >
                  <span
                    v-if="
                      tenant.tenant_info.civil_id_front &&
                        tenant.tenant_info.civil_id_front.tenant_image
                    "
                  >
                    {{
                      getImageName(
                        tenant.tenant_info.civil_id_front.tenant_image
                      )
                    }}
                    <v-btn
                      flat
                      icon
                      color="blue"
                      @click="downloadImage(tenant.tenant_info.civil_id_front)"
                    >
                      <v-icon>download</v-icon>
                    </v-btn>
                  </span>
                </v-layout>

                <v-layout class="align-center">
                  <span class="re-upload__span">{{
                    $t("Upload Civil ID (Back)")
                  }}</span>
                  <input
                    type="file"
                    id="uploadCivilIdBack"
                    style="display: none"
                    ref="uploadCivilIdBack"
                    accept="image/*"
                    @change="event => uploadImage(event, 'civil_id_back', true)"
                  />
                  <v-btn
                    @click="$refs.uploadCivilIdBack.click()"
                    class="re-custom-file-input"
                    >{{ $t("Upload") }}</v-btn
                  >
                  <span
                    v-if="!tenant.tenant_info.civil_id_back && showError"
                    style="color: #ff0000"
                    >{{ $t("This field is required") }}</span
                  >
                  <span
                    v-if="
                      tenant.tenant_info.civil_id_back &&
                        tenant.tenant_info.civil_id_back.tenant_image
                    "
                  >
                    {{
                      getImageName(
                        tenant.tenant_info.civil_id_back.tenant_image
                      )
                    }}
                    <v-btn
                      flat
                      icon
                      color="blue"
                      @click="downloadImage(tenant.tenant_info.civil_id_back)"
                    >
                      <v-icon>download</v-icon>
                    </v-btn>
                  </span>
                </v-layout>

                <v-text-field
                  v-model="tenant.tenant_info.passport_number"
                  v-validate="'alpha_num'"
                  :label="$t('Passport Number')"
                  required
                  class="mb-4"
                  data-vv-name="tenant_passport_number"
                  :error-messages="errors.collect('tenant_passport_number')"
                />

                <v-layout class="align-center">
                  <span class="re-upload__span">{{
                    $t("Upload Passport")
                  }}</span>
                  <input
                    type="file"
                    id="uploadPassport"
                    style="display: none"
                    ref="uploadPassport"
                    accept="image/*"
                    @change="event => uploadImage(event, 'passport', true)"
                  />
                  <v-btn
                    class="re-custom-file-input"
                    @click="$refs.uploadPassport.click()"
                    >{{ $t("Upload") }}</v-btn
                  >
                  <span
                    v-if="
                      tenant.tenant_info.passport &&
                        tenant.tenant_info.passport.tenant_image
                    "
                  >
                    {{ getImageName(tenant.tenant_info.passport.tenant_image) }}
                    <v-btn
                      flat
                      icon
                      color="blue"
                      @click="downloadImage(tenant.tenant_info.passport)"
                    >
                      <v-icon>download</v-icon>
                    </v-btn>
                  </span>
                </v-layout>

                <v-autocomplete
                  v-model="tenant.tenant_info.nationality"
                  v-validate="'required'"
                  :label="$t('Nationality')"
                  class="mb-4"
                  item-text="name"
                  item-value="name"
                  data-vv-name="nationality"
                  :items="countries"
                  :error-messages="errors.collect('nationality')"
                />

                <vue-phone-number-input
                  v-model="tenant.phone"
                  name="tenat_phone_number"
                  :translations="translations"
                  :default-country-code="
                    tenant.tenant_info.country_code
                      ? tenant.tenant_info.country_code.replace(/[0-9]/g, '')
                      : 'KW'
                  "
                  required
                  :error="!isValid"
                  :error-message="$t('This field is required')"
                  @update="updateCountryCode($event, true)"
                  @phone-number-focused="isTouched = true"
                />
                <span
                  v-if="!tenant.phone && isTouched"
                  class="red-text"
                  style="display: flex"
                  >{{ $t("Phone number is required") }}</span
                >
                <v-text-field
                  v-model="tenant.tenant_info.email"
                  v-validate="'required|email'"
                  :label="$t('Email Address')"
                  required
                  class="mb-2"
                  data-vv-name="email"
                  :error-messages="errors.collect('email')"
                />

                <v-select
                  v-model="tenant.preferred_language"
                  :label="$t('Select Notification Language')"
                  class="mb-4"
                  item-value="value"
                  item-text="label"
                  :items="language"
                />

                <!-- Married -->
                <v-checkbox
                  :label="$t('Married?')"
                  v-model="isMarried"
                  color="grey darken-1"
                />

                <div class="pl-4 re-married" v-if="isMarried">
                  <v-text-field
                    v-model="tenant.spouse_info.civil_id_number"
                    v-validate="
                      `required|alpha_num|${
                        tenant.spouse_info.nationality === 'Kuwait'
                          ? 'length:12'
                          : ''
                      }`
                    "
                    :label="$t('Civil ID Number')"
                    required
                    class="mb-4"
                    data-vv-name="spouse.civil_id_number"
                    :error-messages="errors.collect('spouse.civil_id_number')"
                  />

                  <v-layout class="align-center mb-2 ml-3">
                    <span class="re-upload__span">{{
                      $t("Upload Civil ID (Front)")
                    }}</span>
                    <input
                      type="file"
                      id="myUpload"
                      style="display: none"
                      ref="uploadSpouseCivilIdFront"
                      accept="image/*"
                      @change="event => uploadImage(event, 'civil_id_front')"
                    />
                    <v-btn
                      @click="$refs.uploadSpouseCivilIdFront.click()"
                      class="re-custom-file-input"
                      >{{ $t("Upload") }}</v-btn
                    >
                    <span
                      v-if="!tenant.spouse_info.civil_id_front && showError"
                      style="color: #ff0000"
                      >{{ $t("This field is required") }}</span
                    >
                    <span
                      v-if="
                        tenant.spouse_info.civil_id_front &&
                          tenant.spouse_info.civil_id_front.tenant_image
                      "
                    >
                      {{
                        getImageName(
                          tenant.spouse_info.civil_id_front.tenant_image
                        )
                      }}
                      <v-btn
                        flat
                        icon
                        color="blue"
                        @click="
                          downloadImage(tenant.spouse_info.civil_id_front)
                        "
                      >
                        <v-icon>download</v-icon>
                      </v-btn>
                    </span>
                  </v-layout>

                  <v-layout class="align-center mb-2 ml-3">
                    <span class="re-upload__span">{{
                      $t("Upload Civil ID (Back)")
                    }}</span>
                    <input
                      type="file"
                      id="myUpload"
                      style="display: none"
                      ref="uploadSpouseCivilIdBack"
                      accept="image/*"
                      @change="event => uploadImage(event, 'civil_id_back')"
                    />
                    <v-btn
                      class="re-custom-file-input"
                      @click="$refs.uploadSpouseCivilIdBack.click()"
                      >{{ $t("Upload") }}</v-btn
                    >
                    <span
                      v-if="!tenant.spouse_info.civil_id_back && showError"
                      style="color: #ff0000"
                      >{{ $t("This field is required") }}</span
                    >
                    <span
                      v-if="
                        tenant.spouse_info.civil_id_back &&
                          tenant.spouse_info.civil_id_back.tenant_image
                      "
                    >
                      {{
                        getImageName(
                          tenant.spouse_info.civil_id_back.tenant_image
                        )
                      }}
                      <v-btn
                        flat
                        icon
                        color="blue"
                        @click="downloadImage(tenant.spouse_info.civil_id_back)"
                      >
                        <v-icon>download</v-icon>
                      </v-btn>
                    </span>
                  </v-layout>

                  <v-text-field
                    v-model="tenant.spouse_info.passport_number"
                    v-validate="'alpha_num'"
                    :label="$t('Passport Number')"
                    required
                    class="mb-4"
                    data-vv-name="spouse.passport_number"
                    :error-messages="errors.collect('spouse.passport_number')"
                  />

                  <v-layout class="align-center mb-3 ml-3">
                    <span class="re-upload__span">{{
                      $t("Upload Passport")
                    }}</span>
                    <input
                      type="file"
                      id="myUpload"
                      style="display: none"
                      ref="uploadSpousePassport"
                      accept="image/*"
                      @change="event => uploadImage(event, 'passport')"
                    />
                    <v-btn
                      @click="$refs.uploadSpousePassport.click()"
                      class="re-custom-file-input re-ml-55"
                    >
                      {{ $t("Upload") }}</v-btn
                    >
                    <span
                      v-if="
                        tenant.spouse_info.passport &&
                          tenant.spouse_info.passport.tenant_image
                      "
                    >
                      {{
                        getImageName(tenant.spouse_info.passport.tenant_image)
                      }}
                      <v-btn
                        flat
                        icon
                        color="blue"
                        @click="downloadImage(tenant.spouse_info.passport)"
                      >
                        <v-icon>download</v-icon>
                      </v-btn>
                    </span>
                  </v-layout>

                  <v-autocomplete
                    v-model="tenant.spouse_info.nationality"
                    v-validate="'required'"
                    :label="$t('Nationality')"
                    class="mb-4"
                    item-text="name"
                    item-value="name"
                    data-vv-name="spouse.nationality"
                    :items="countries"
                    :error-messages="errors.collect('spouse.nationality')"
                  />
                  <vue-phone-number-input
                    v-model="tenant.spouse_phone"
                    required
                    :translations="translations"
                    :error="!isValidSpouse"
                    :error-message="$t('This field is required')"
                    :default-country-code="
                      tenant.spouse_info.country_code
                        ? tenant.spouse_info.country_code.replace(/[0-9]/g, '')
                        : 'KW'
                    "
                    @update="updateCountryCode($event, false)"
                    @phone-number-focused="spousePhone = true"
                  />

                  <v-text-field
                    v-model="tenant.spouse_info.email"
                    v-validate="'email'"
                    :label="$t('Email Address')"
                    required
                    class="mb-2"
                    data-vv-name="spouse_email"
                    :error-messages="errors.collect('spouse_email')"
                  />
                  <v-layout class="align-center mb-3 ml-3">
                    <span class="re-upload__span">{{
                      $t("Upload Mariage Certificate")
                    }}</span>
                    <input
                      type="file"
                      id="myUpload"
                      style="display: none"
                      ref="uploadMariageCertificate"
                      accept="image/*"
                      @change="
                        event => uploadImage(event, 'marriage_certificate')
                      "
                    />
                    <v-btn
                      @click="$refs.uploadMariageCertificate.click()"
                      class="re-custom-file-input re-ml-55"
                    >
                      {{ $t("Upload") }}</v-btn
                    >
                    <span
                      v-if="
                        tenant.spouse_info.marriage_certificate &&
                          tenant.spouse_info.marriage_certificate.tenant_image
                      "
                    >
                      {{
                        getImageName(
                          tenant.spouse_info.marriage_certificate.tenant_image
                        )
                      }}
                      <v-btn
                        flat
                        icon
                        color="blue"
                        @click="
                          downloadImage(tenant.spouse_info.marriage_certificate)
                        "
                      >
                        <v-icon>download</v-icon>
                      </v-btn>
                    </span>
                  </v-layout>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
          <vue-skeleton-loader
            rounded
            class="width100"
            type="rect"
            v-if="isLoading"
            :width="'100%'"
            :height="'800px'"
            animation="fade"
          />
        </v-flex>
      </v-layout>
    </v-layout>
    <div class="text-xs-center mt-4">
      <v-btn
        dark
        class="re-orangtbtn"
        :disabled="isUploadingFile"
        @click="saveTenantDetails"
        >{{ $t("Save") }}</v-btn
      >
      <v-btn @click="$router.push({ name: 'tenant_management' })" dark>{{
        $t("Cancel")
      }}</v-btn>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import cloneDeep from "lodash/cloneDeep";

import countries from "../../helper/countries";
import tenantService from "../../services/plugins/tenant";
import tenant from "../../services/plugins/tenant";

import breadItemsSetLang from "@/mixins/breadItemsSetLang";

export default {
  name: "edit-tenant",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [breadItemsSetLang],
  data() {
    return {
      isMarried: false,
      countries,
      isEdit: false,
      isTouched: false,
      spousePhone: false,
      isLoading: false,
      isUploadingFile: false,
      tenant: {
        preferred_language: "ar",
        tenant_info: {},
        spouse_info: {}
      },
      isValid: true,
      isValidSpouse: true,
      showError: false
    };
  },
  async created() {
    const params = this.$route.params;
    this.$validator.localize("en", this.dictionary);
    if (params.id) {
      this.isEdit = true;

      await this.fetchTenatDetails(params.id);
    }
  },
  computed: {
    language() {
      return [
        {
          label: "Arabic",
          value: "ar"
        },
        {
          label: "English",
          value: "en"
        }
      ];
    },
    dictionary() {
      return {
        custom: {
          tenant_name: {
            required: () => this.$t("Tenant name is Required")
          },
          tenant_name_ar: {
            required: () => this.$t("Tenant name(AR) is required")
          },
          civil_id_number: {
            required: () => this.$t("Tenant civil id is required")
          },
          nationality: {
            required: () => this.$t("Tenant nationality is required")
          },
          "spouse.civil_id_number": {
            required: () => this.$t("Spouse civil id is required")
          },
          "spouse.nationality": {
            required: () => this.$t("Spouse nationality is required")
          },
          email: {
            required: () => this.$t("The email field is required")
          }
        }
      };
    },
    translations() {
      return {
        countrySelectorLabel: this.$t("Country code"),
        countrySelectorError: "Country Code Not Found",
        phoneNumberLabel: this.$t("Phone number"),
        example: "Example :"
      };
    }
  },
  watch: {
    isMarried() {
      if (!this.isMarried) {
        this.tenant.spouse_info = {};
      }
    },
    "$i18n.locale": function() {
      this.$validator.localize(this.$i18n.locale, this.dictionary);
    }
  },
  methods: {
    upload() {
      this.$refs.myUpload.click();
    },
    getImageName(imageUrl) {
      if (imageUrl) {
        let url = new URL(imageUrl);

        // eslint-disable-next-line no-useless-escape
        url = url.pathname.replace(/^.*(\\|\/|\:)/, "");
        return url;
      }

      return "";
    },
    async saveTenantDetails() {
      try {
        const tenant_info = this.tenant.tenant_info;
        const spouse_info = this.tenant.spouse_info;

        if (
          !isEmpty(tenant_info.civil_id_front) &&
          !isEmpty(tenant_info.civil_id_back)
        ) {
          if (!isEmpty(spouse_info)) {
            if (
              !isEmpty(spouse_info.civil_id_front) &&
              !isEmpty(spouse_info.civil_id_back)
            ) {
              this.showError = false;
            }
          } else {
            this.showError = false;
          }
        }

        if (!this.tenant.phone) {
          this.isTouched = true;
        } else {
          this.isTouched = false;
        }

        if (!this.tenant.spouse_phone) {
          this.spousePhone = true;
        } else {
          this.spousePhone = false;
        }

        if (
          (await this.$validator.validateAll()) &&
          !this.showError &&
          this.isValid
        ) {
          this.isLoading = true;
          const formData = this.transformRequest(this.tenant);

          if (this.isEdit) {
            await this.$processReq(
              tenantService.updateTenants(formData, this.tenant.id),
              true
            );
          } else {
            await this.$processReq(tenantService.saveTenants(formData), true);
          }

          this.$router.push({ name: "tenant_management" });
          this.isLoading = false;
        } else {
          this.showError = true;
        }
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to update and save tenant - ", err);
      }
    },
    async fetchTenatDetails(id) {
      try {
        this.isLoading = true;
        const response = await this.$processReq(
          tenantService.fetchTenantById(id),
          false
        );

        let res = cloneDeep(response.data.body);
        if (res.spouse_info) {
          this.isMarried = true;
          res = {
            ...res,
            spouse_phone: res.spouse_info.phone_number
          };
        } else {
          res.spouse_info = {};
        }

        res = {
          ...res,
          phone: res.tenant_info.phone_number
        };
        this.tenant = res;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("Error: Unable to fetch tenant by ID - ", err);
      }
    },
    async uploadImage(e, name, isTenant) {
      try {
        this.isUploadingFile = true;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("tenant_image", file);

        const response = await this.$processReq(
          tenantService.uploadImages(formData),
          false
        );
        this.$root.$emit("snackbar", {
          text: this.$t("File Uploaded Successfully"),
          color: "success"
        });
        this.isUploadingFile = false;

        const tenant = cloneDeep(this.tenant);

        if (isTenant) {
          tenant.tenant_info = {
            ...tenant.tenant_info,
            [name]: response.data.body
          };
        } else {
          tenant.spouse_info = {
            ...tenant.spouse_info,
            [name]: response.data.body
          };
        }

        this.tenant = tenant;
        const tenant_info = this.tenant.tenant_info;
        const spouse_info = this.tenant.spouse_info;

        if (
          !isEmpty(tenant_info.civil_id_front) &&
          !isEmpty(tenant_info.civil_id_back) &&
          !isEmpty(tenant_info.passport)
        ) {
          if (!isEmpty(spouse_info)) {
            if (
              !isEmpty(spouse_info.civil_id_front) &&
              !isEmpty(spouse_info.civil_id_back) &&
              !isEmpty(spouse_info.passport)
            ) {
              this.showError = false;
            }
          } else {
            this.showError = false;
          }
        }
      } catch (err) {
        this.isUploadingFile = false;
        this.$root.$emit("snackbar", {
          text: this.$t("Something went wrong while uploading file"),
          color: "error"
        });
        console.log("Error: Unable to Upload image - ", err);
      }
    },
    updateCountryCode(event, isTenant) {
      if (isTenant) {
        const tenant_info = this.tenant.tenant_info;

        tenant_info.country_code = event.countryCode;
        tenant_info.phone_number = event.formattedNumber;

        this.tenant = {
          ...this.tenant,
          tenant_info
        };
        this.isValid = event.isValid;
      } else {
        const spouse_info = this.tenant.spouse_info;

        spouse_info.country_code = event.countryCode;
        spouse_info.phone_number = event.formattedNumber;

        this.tenant = {
          ...this.tenant,
          spouse_info
        };
        this.tenant.spouse_info.country_code = event.countryCode;
        if (event.formattedNumber) {
          this.isValidSpouse = event.isValid;
        } else {
          this.isValidSpouse = true;
        }
      }
    },
    transformRequest(tenant) {
      const formData = new FormData();

      formData.append("tenant_name", tenant.tenant_name_en);
      formData.append("tenant_name_ar", tenant.tenant_name_ar);
      formData.append("tenant_name_en", tenant.tenant_name_en);
      formData.append("is_married", this.isMarried);
      formData.append("preferred_language", tenant.preferred_language);

      formData.append(
        "tenant_civil_id_number",
        tenant.tenant_info.civil_id_number
      );
      formData.append(
        "tenant_civil_id_front",
        tenant.tenant_info.civil_id_front.id
      );
      formData.append(
        "tenant_civil_id_back",
        tenant.tenant_info.civil_id_back.id
      );
      formData.append(
        "tenant_passport",
        tenant.tenant_info.passport ? tenant.tenant_info.passport.id : ""
      );
      formData.append(
        "tenant_passport_number",
        tenant.tenant_info.passport_number || ""
      );
      formData.append("tenant_nationality", tenant.tenant_info.nationality);
      if (tenant.tenant_info.phone_number) {
        formData.append("tenant_country_code", tenant.tenant_info.country_code);
        formData.append("tenant_phone_number", tenant.tenant_info.phone_number);
      }
      formData.append("tenant_email", tenant.tenant_info.email || "");

      if (!isEmpty(tenant.spouse_info)) {
        formData.append(
          "spouse_civil_id_number",
          tenant.spouse_info.civil_id_number
        );
        formData.append(
          "spouse_civil_id_front",
          tenant.spouse_info.civil_id_front.id
        );
        formData.append(
          "spouse_marriage_certificate",
          tenant.spouse_info.marriage_certificate.id
        );
        formData.append(
          "spouse_civil_id_back",
          tenant.spouse_info.civil_id_back.id
        );
        formData.append(
          "spouse_passport",
          tenant.spouse_info.passport ? tenant.spouse_info.passport.id : ""
        );
        formData.append(
          "spouse_passport_number",
          tenant.spouse_info.passport_number || ""
        );
        formData.append("spouse_nationality", tenant.spouse_info.nationality);
        if (tenant.spouse_info.phone_number) {
          formData.append(
            "spouse_country_code",
            tenant.spouse_info.country_code
          );
          formData.append(
            "spouse_phone_number",
            tenant.spouse_info.phone_number
          );
        }
        formData.append("spouse_email", tenant.spouse_info.email || "");
      }

      return formData;
    },
    async downloadImage(image) {
      try {
        this.isLoading = true;
        var link = document.createElement("a");

        const resp = await tenant.downloadImage(image.id);

        var blob = new Blob([resp.data], { type: "image/*" });
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";

        // eslint-disable-next-line no-useless-escape
        link.download = image.tenant_image.replace(/^.*(\\|\/|\:)/, "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("Error: Unable to download image - ", error);
      }
    }
  }
};
</script>

<style scoped>
.phone-input-error-message {
  color: #ff4500;
  font-size: 12px;
}
.phone-error {
  min-height: 21px;
}
.vue-phone-number-input {
  direction: ltr;
}
div >>> .v-text-field__details {
  padding-bottom: 5px;
}
a {
  color: white;
}
</style>

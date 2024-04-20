import { PluginService } from "./index";

const tenantServices = PluginService("/tenant");

export default {
  getTenantsList(params) {
    return tenantServices({
      method: "GET",
      url: "/",
      params
    });
  },
  fetchTenantById(id) {
    return tenantServices({
      method: "GET",
      url: `/${id}`
    });
  },
  exportTenants(params) {
    return tenantServices({
      method: "GET",
      url: "/",
      params
    });
  },
  printTenantContracts(params) {
    return tenantServices({
      method: "GET",
      url: "",
      params
    });
  },
  uploadImages(data) {
    return tenantServices({
      method: "POST",
      url: "/image/upload/",
      data
    });
  },
  saveTenants(data) {
    return tenantServices({
      method: "POST",
      url: "/",
      data
    });
  },
  updateTenants(data, id) {
    return tenantServices({
      method: "PUT",
      url: `/${id}/`,
      data
    });
  },
  downloadImage(id) {
    return tenantServices({
      method: "GET",
      url: `/image/download/${id}/`,
      responseType: "blob"
    });
  }
};

import { PluginService } from "./index";

const contractServices = PluginService("/contract");

export default {
  fetchContractValidation(params) {
    return contractServices({
      method: "GET",
      url: "/unit/validate",
      params
    });
  },
  fetchContractList(params) {
    return contractServices({
      method: "GET",
      url: "/",
      params
    });
  },
  fetchContractById(id) {
    return contractServices({
      method: "GET",
      url: `/${id}/`
    });
  },
  saveContract(data) {
    return contractServices({
      method: "POST",
      url: "/",
      data
    });
  },
  updateContract(data, id) {
    return contractServices({
      method: "PUT",
      url: `/${id}/`,
      data
    });
  },
  validateUnit(id) {
    return contractServices({
      method: "GET",
      url: `/unit/validate/?unit=${id}`
    });
  },
  uploadImages(data) {
    return contractServices({
      method: "POST",
      url: "/image/upload",
      data
    });
  },
  downloadImage(id) {
    return contractServices({
      method: "GET",
      url: `/image/download/${id}/`,
      responseType: "blob"
    });
  }
};

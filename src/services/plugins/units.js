import { PluginService } from "./index";

const unitServices = PluginService("/unit");

export default {
  fetchUnitDetails(params) {
    return unitServices({
      method: "GET",
      url: "/",
      params
    });
  },
  fetchUnitByID(id) {
    return unitServices({
      method: "GET",
      url: `/${id}`
    });
  },
  updateUnit(id, data) {
    return unitServices({
      method: "POST",
      url: `/`,
      data
    });
  }
};

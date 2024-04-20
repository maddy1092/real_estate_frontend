import { PluginService } from "./index";

const unitTypeService = PluginService("/unittype");

export default {
  getUnitTypeList(params) {
    return unitTypeService({
      method: "GET",
      url: "/",
      params
    });
  },
  getUnitTypeById(id) {
    return unitTypeService({
      method: "GET",
      url: `/${id}/`
    });
  },
  addNewUnitType(params) {
    return unitTypeService({
      method: "POST",
      url: "/",
      data: params
    });
  },
  updateUnitType(params, id) {
    return unitTypeService({
      method: "PUT",
      url: `/${id}/`,
      data: params
    });
  }
};

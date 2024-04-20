import { PluginService } from "./index";

const propertyService = PluginService("/properties");

export default {
  getPropertiesList(params) {
    return propertyService({
      method: "GET",
      url: "/",
      params
    });
  },
  getPropertyDetails(id) {
    return propertyService({
      method: "GET",
      url: `/${id}`
    });
  },
  addNewProperty(data) {
    return propertyService({
      method: "POST",
      url: "/",
      data
    });
  },
  updateProperty(data, id) {
    return propertyService({
      method: "PUT",
      url: `/${id}/`,
      data
    });
  }
};

import { PluginService } from "./index";

const users = PluginService("/user");

export default {
  getUserList(params) {
    return users({
      method: "GET",
      url: "/",
      params
    });
  }
};

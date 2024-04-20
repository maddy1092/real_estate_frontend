import { AuthorizedService } from "../index";

const baseTicket = "/reports/";
const BaseGeneratedServcie = url => AuthorizedService(url);
class GeneratedReports {
  constructor() {
    this.baseGeneratedServcie = BaseGeneratedServcie(baseTicket);
  }
  getDetails(id) {
    return this.baseGeneratedServcie.get(`/${id}`);
  }
  getList(params) {
    return this.baseGeneratedServcie({
      method: "GET",
      params
    });
  }
  getListMetadata() {
    return this.baseGeneratedServcie({
      method: "OPTIONS"
    });
  }
  CallAction(url, payload) {
    return this.baseGeneratedServcie({
      baseURL: url,
      method: "Post",
      data: payload
    });
  }
  exportShortlyExpiredContracts(payload) {
    return this.baseGeneratedServcie({
      url: "/shortly-expired-contracts/",
      method: "POST",
      data: payload
    });
  }
  printShortlyExpiredContracts(payload) {
    return this.baseGeneratedServcie({
      url: "/shortly-expired-contracts-pdf/",
      method: "POST",
      data: payload
    });
  }
  exportRent(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/rent-details/",
      data: payload
    });
  }
  printTenant(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/contracts-pdf/",
      data: payload
    });
  }
  printRent(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/rent-details-pdf/",
      data: payload
    });
  }
  exportUnitTypeToCSV(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/properties-units/",
      data: payload
    });
  }
  exportProperties(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/properties-units/",
      data: payload
    });
  }
  printProperties(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/properties-units-pdf/",
      data: payload
    });
  }
  printPayments(payload) {
    return this.baseGeneratedServcie({
      method: "POST",
      url: "/generated-not-generated-payments-pdf/",
      data: payload
    });
  }
}

export default new GeneratedReports();

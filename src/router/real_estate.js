import AdvancePayment from "../views/AdvancePayment";
import AdvancePaymentList from "../views/AdvancePaymentList";
import Configuration from "../views/Configuration";
import ContractList from "../views/contracts/ContractList";
import NewContract from "../views/contracts/NewContract";
import RenewContract from "../views/contracts/RenewContract";
import ShortlyExpired from "../views/contracts/ShortlyExpired";
import TerminateContract from "../views/contracts/TerminateContract";
import TerminateContractList from "../views/contracts/TerminateContractList";
import EditPrice from "../views/EditPrice";
import EditPriceList from "../views/EditPriceList";
import EditUnit from "../views/EditUnit";
import InvoiceList from "../views/InvoiceList";
import ManualGeneratingPayments from "../views/ManualGeneratingPayments.vue";
import ManualPayment from "../views/ManualPayment";
import ManualPaymentList from "../views/ManualPaymentList";
import ModifiedContract from "../views/ModifiedContract";
import ModifyPayment from "../views/ModifyPayment";
import Properties from "../views/Properties/Properties";
import PropertyDetail from "../views/Properties/PropertyDetail";
import RenewContractList from "../views/RenewContractList";
import RentManagement from "../views/RentManagement/List";
import SuspendedResumedContract from "../views/SuspendedResumedContract";
import EditTenant from "../views/Tenants/EditTenant";
import TenantManagement from "../views/Tenants/TenantManagement";
import EditUnitType from "../views/UnitType/EditUnitType";
import UnitTypeList from "../views/UnitType/UnitTypeList";

export default {
  path: "real_estate",
  component: { template: "<router-view />" },
  meta: {
    requiresAuth: true,
    page_title: "Dashboard"
  },
  children: [
    {
      path: "unit_types",
      name: "unit_type_list",
      component: UnitTypeList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Unit Type", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "edit_unit/:id",
      name: "edit_unit",
      component: EditUnit,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Properties", disabled: true, href: "#" },
          { text: "Edit Property", disabled: true, href: "#" },
          { text: "Edit Unit", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "unit_type/:id",
      name: "edit_unit_type",
      component: EditUnitType,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Edit Unit Type", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "unit_type",
      name: "add_unit_type",
      component: EditUnitType,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Add Unit Type", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "tenant_management",
      name: "tenant_management",
      component: TenantManagement,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Main Listing", disabled: true, href: "#" },
          { text: "Tenant Management", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "properties",
      name: "properties",
      component: Properties,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Properties", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "property/:id",
      name: "edit_property",
      component: PropertyDetail,
      meta: {
        page_title: "Property Detail",
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Properties", disabled: true, href: "#" },
          { text: "Edit Property", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "property",
      name: "add_property",
      component: PropertyDetail,
      meta: {
        page_title: "Property Detail",
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Properties", disabled: true, href: "#" },
          { text: "Add Property", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "tenant/:id",
      name: "edit_tenant",
      component: EditTenant,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Edit Tenant", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "tenant",
      name: "add_tenant",
      component: EditTenant,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Edit Tenant", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "contract",
      name: "add_contract",
      component: NewContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "New Contract", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "modify_payment/:contract_id",
      name: "modify_payment",
      component: ModifyPayment,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Modify Payment", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "edit_price",
      name: "edit_price",
      component: EditPrice,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Edit Price", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "renew_contract/:contract_id",
      name: "renew_contract",
      component: RenewContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Renew Contract", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "renew_contract",
      name: "renew_contract_without_contract",
      component: RenewContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Renew Contract", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "rent_management",
      name: "rent_management",
      component: RentManagement,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Real estate", disabled: true, href: "#" },
          { text: "Rent management", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "terminate_contract",
      name: "terminate_contract_without_contract",
      component: TerminateContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Terminate Contract Transaction", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "terminate_contract/:contract_id",
      name: "terminate_contract",
      component: TerminateContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Terminate Contract Transaction", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "new_contract_list",
      name: "new_contract_list",
      component: ContractList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "New contract list", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "renew_contract_list",
      name: "renew_contract_list",
      component: RenewContractList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Renew contract list", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "terminate_contract_list",
      name: "terminate_contract_list",
      component: TerminateContractList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Terminate contract list", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "invoice_list",
      name: "invoice_list",
      component: InvoiceList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Invoice List", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "advance_payment",
      name: "advance_payment",
      component: AdvancePayment,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Advance Payment Request", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "advance_payment_list",
      name: "advance_payment_list",
      component: AdvancePaymentList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Unit Type", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "edit_price_list",
      name: "edit_price_list",
      component: EditPriceList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Edit Price list", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "manual_payment",
      name: "manual_payment",
      component: ManualPayment,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Manual Payment", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "manual_payment_list",
      name: "manual_payment_list",
      component: ManualPaymentList,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Manual payment list", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "manual_generating_payments",
      name: "manual_generating_payments",
      component: ManualGeneratingPayments,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Manual Generating Payments", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "suspended_resumed_contract",
      name: "suspended_resumed_contract",
      component: SuspendedResumedContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Suspended Contract", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "modified_contract",
      name: "modified_contract",
      component: ModifiedContract,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Action listings", disabled: true, href: "#" },
          { text: "Modified Contract", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "",
      name: "configuration",
      component: Configuration,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Property Management", disabled: true, href: "#" },
          { text: "Configuration", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "shortly_expired_contracts",
      name: "shortly_expired_contracts",
      component: ShortlyExpired,
      meta: {
        bread_items: [
          { text: "Dashboard", disabled: false, href: "#" },
          { text: "Shortly Expired Contracts", disabled: true, href: "#" }
        ]
      }
    },
    {
      path: "generated_reports",
      component: () =>
        import("../views/generated_reports/generatedReportList.vue"),
      name: "generated-reports",
      meta: {
        page_title: "Generated Reports",
        is_wrapper: true
      }
    },
    {
      path: "generated_reports/:id",
      component: () =>
        import("../views/generated_reports/generatedReportList.vue"),
      name: "generated-reports",
      meta: {
        page_title: "Generated Reports",
        is_wrapper: true
      }
    }
  ]
};

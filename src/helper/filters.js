import moment from "moment";

const transformContractFilter = (filter, isUnit, isModified, isSuspended) => {
  return {
    property: filter.property || null,
    unit_property: isUnit ? filter.property : null,
    contract__property: isUnit ? filter.property : null,
    contract__tenant: isUnit ? filter.tenant : null,
    unit: filter.unit || null,
    initiator: filter.initiator || null,
    tenant: filter.tenant || null,
    status: filter.status || null,
    unittype: filter.unittype || null,
    ...(!isModified && {
      created_after: filter.createdFrom || null,
      created_before: filter.createdTo || null
    }),
    ...(isModified && {
      modified_after: filter.createdFrom || null,
      modified_before: filter.createdTo || null
    }),
    contract_start_date_after: filter.startFrom || null,
    contract_start_date_before: filter.startTo || null,
    contract_end_date_after: filter.endFrom || null,
    contract_end_date_before: filter.endTo || null,
    new_contract_start_date_after: filter.newStartFrom || null,
    new_contract_start_date_before: filter.newStartTo || null,
    new_contract_end_date_after: filter.newEndFrom || null,
    new_contract_end_date_before: filter.newEndTo || null,
    termination_date_after: filter.terminateFrom || null,
    termination_date_before: filter.terminateTo || null,
    payment_month: filter.paymentMonth
      ? moment()
          .month(filter.paymentMonth)
          .format("M")
      : null,
    payment_year: filter.paymentYear || null,
    is_suspended: filter.is_suspended || null,
    ...(isSuspended && {
      suspended_resumed:
        filter.suspended_resumed === "all"
          ? "all"
          : filter.suspended_resumed
          ? true
          : false
    }),
    is_resumed: filter.is_resumed || null,
    reference: filter.reference || null
  };
};

export { transformContractFilter };

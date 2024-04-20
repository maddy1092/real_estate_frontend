const state = {
  contract: {},
  tenants: []
};

const getters = {
  getContract: state => {
    return state.contract;
  },
  getTenants: state => {
    return state.tenants;
  }
};

const actions = {
  setContract({ commit }, value) {
    commit("setContract", value);
  },
  setAmount({ commit }, value) {
    commit("setAmount", value);
  },
  setTenant({ commit }, value) {
    commit("setTenant", value);
  }
};

const mutations = {
  setContract(state, value) {
    state.contract = value;
  },
  setTenant(state, value) {
    state.tenants = value;
  },
  setAmount(state, value) {
    state.contract = {
      ...state.contract,
      new_amount: value,
      new_original_amount: value
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

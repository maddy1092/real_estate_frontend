const state = {
  index: 0,
  unit_index: 0,
  property: {}
};

const getters = {
  getProperty: state => {
    return state.property;
  },
  getIndex: state => {
    return state.index;
  },
  getUnitIndex: state => {
    return state.unit_index;
  }
};

const actions = {
  setProperty({ commit }, value) {
    commit("setProperty", value);
  },
  setIndex({ commit }, value) {
    commit("setIndex", value);
  },
  setUnitIndex({ commit }, value) {
    commit("setUnitIndex", value);
  }
};

const mutations = {
  setProperty(state, value) {
    state.property = value;
  },
  setIndex(state, value) {
    state.index = value;
  },
  setUnitIndex(state, value) {
    state.unit_index = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

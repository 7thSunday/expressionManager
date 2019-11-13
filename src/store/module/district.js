export default {
  namespaced: true,
  state: {
    districtTree: [],
    districtList: []
  },
  getters: {
    // 获取选中状态的节点
    getSelectedNodeList: (state, getters) => (districtTree) => {
      if (!districtTree) return [];
      return districtTree.reduce((selectedNodeList, curNode) => {
        if (curNode.selected) selectedNodeList.push(curNode);
        return selectedNodeList.concat(getters.getSelectedNodeList(curNode.children));
      }, []);
    }
  },
  mutations: {
    setDistrictTree(state, districtTree) {
      state.districtTree = districtTree;
    }
  }
}

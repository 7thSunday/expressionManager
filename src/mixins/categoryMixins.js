import api from '@/api/index.js';
export default {
  methods: {
    fetchCategorysTree() {
      api.fetchAllCategorys().then(res=>{
        let temp = res.filter(item=>!item.parent);
        this.treeData = this.fixTree(temp);
        if(this.data.categoryId) {
          for(let node of this.flatTree) {
            if(node.id == this.data.categoryId) {
              this.data.categoryName = node.text;
              break;
            }
          }
        }
      });
    },
    /**
     * @description 树节点的key名修正：text => label
     * @param {any} list 某深度树节点列表
     */
    fixTree(list) {
      return list.reduce((prev,cur)=>{
        if(cur.children) {
          cur.children = this.fixTree(cur.children);
        }
        this.flatTree.push(cur);
        let temp = cur.label || null;
        cur.label = cur.text;
        temp && (cur.text = temp);
        prev.push(cur)
        return prev;
      },[]);
    },
    /**
     * @description 类型树的点击事件
     * @param {any} l 意义？
     * @param {any} node 节点信息
     */
    handleSelectNode() {
      let node = arguments[1];// 选中的节点信息
      this.$set(this.data, 'categoryId', node.id);
      this.$set(this.data, 'categoryName', node.text);
      this.showCatalogTree = false;
    }
  }
}

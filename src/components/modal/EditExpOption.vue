<template>
  <div class="edit-option-body">
    <div class="field required">
      <span class="label">标题：</span>
      <div class="val">
        <sg-input v-model="data.globalTitle"></sg-input>
      </div>
    </div>
    <div class="field required">
      <span class="label">方法名：</span>
      <div class="val">
        <sg-input v-model="data.globalName"></sg-input>
      </div>
    </div>
    <div class="field required">
      <span class="label">分类：</span>
      <div class="val">
        <sg-input @on-focus="showCatalogTree=true" v-model="data.categoryName"></sg-input>
        <div class="tree" v-show="showCatalogTree">
          <sg-tree filter :data="treeData" @on-node-click="handleSelectNode"></sg-tree>
        </div>
      </div>
    </div>
    <div class="field required">
      <span class="label">类型：</span>
      <div class="val">
        <sg-select v-model="data.globalType">
          <sg-option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</sg-option>
        </sg-select>
      </div>
    </div>
    <div class="field exp-str required">
      <span class="label">表达式：</span>
      <div class="val">
        <sg-input v-model="data.globalOpertion"></sg-input>
        <sg-button @click="handleClickEditCode">编辑</sg-button>
      </div>
    </div>
    <div class="field required">
      <span class="label">样例：</span>
      <div class="val">
        <sg-input v-model="data.globalExample"></sg-input>
      </div>
    </div>
    <div class="field">
      <span class="label">描述：</span>
      <div class="val">
        <sg-input v-model="data.globalDescription"></sg-input>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 编辑表达式
 */
import emitter from '@/mixins/emitter';
import categoryMixins from '@/mixins/categoryMixins.js';
export default {
  name: 'editExpOption',
  mixins:[emitter, categoryMixins],
  props: {
    option: {
      type: Object,
      default() {
        return null;
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * @description 观测prop的option，同步到data的val
     * 是否多余，prop的数据应该会自动同步到data？
     * @param {any} val
     */
    option(val) {
      this.$set(this, 'data', val);
    },
    /**
     * @description 观测模态框的显隐，加载类型树数据
     * @param {any} val
     */
    visible(val) {
      if(val) {
        this.fetchAllCategorys();
        this.showCatalogTree = false;
      }
    }
  },
  data() {
    return {
      typeList: [{
        label: '前端脚本',
        value: 4
      },{
        label: '后端脚本',
        value: 2
      }],
      data: this.option,
      treeData: [],
      flatTree: [],
      showCatalogTree: false
    }
  },
  methods: {
    /**
     * @description 更新类型树
     * then里第一段过滤可以用filter，更加直观
     * then后半段逻辑是数据的逐步处理，但可读性较差，是否有更好的方式声明数据的流向？
     * 没有返回数据，命名上调整？
     */
    fetchAllCategorys() {
      if(!this.data.categoryId) {
        this.data.categoryId = 'notDefinition2';
        this.data.categoryName = '未分类';
      }
      this.fetchCategorysTree();
    },
    /**
     * @description 树节点的key名修正：text => label
     * 现有写法是在原始树上扩key，但可能出现后台给的树节点key预占用的情况
     * 可以用reduce写递归，返回一颗全新的树，保证节点内同一意义只有一个key
     * @param {any} list 某深度树节点列表
     */
    // fixTree(list) {
    //   for(let node of list) {
    //     node.label = node.text;
    //     this.flatTree.push(node);
    //     if(node.children&&node.children.length>0) {
    //       this.fixTree(node.children);
    //     }
    //   }
    // },
    /**
     * @description 调起表达式编辑器
     */
    handleClickEditCode() {
      this.dispatch('index','openCodeEditor',this.data.globalOpertion);
    }
  }
}
</script>

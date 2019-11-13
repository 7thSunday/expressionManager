<template>
  <div class="add-direct-body">
    <div class="field">
      <span class="label">目录名称：</span>
      <div class="val">
        <sg-input v-model="nameTxt"></sg-input>
      </div>
    </div>
    <div class="field">
      <span class="label">目录分类：</span>
      <div class="val">
        <sg-input @on-focus="showCatalogTree=true" v-model="data.categoryName"></sg-input>
        <div class="tree" v-show="showCatalogTree">
          <sg-tree filter :data="treeData" @on-node-click="handleSelectNode"></sg-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 添加目录
 */
import categoryMixins from '@/mixins/categoryMixins.js';
export default {
  name: 'addDirect',
  mixins: [categoryMixins],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * @description 观测模态框的显隐，加载类型树数据
     * @param {any} val
     */
    visible(val) {
      if(val) {
        this.getAllCategorys();
        this.showCatalogTree = false;
      }
    }
  },
  data() {
    return {
      showCatalogTree: false,
      data: {
        categoryName: '',
        categoryId: ''
      },
      flatTree: [],
      treeData: [],
      nameTxt: ''
    }
  },
  methods: {
    /**
     * @description 更新分类树
     */
    getAllCategorys() {
      this.data.categoryName = '所有分类';
      this.data.categoryId = 'notDefinition1';
      this.nameTxt = '';
      this.fetchCategorysTree();
    }
  }
}
</script>

<template>
  <sg-tree
    ref="tree"
    show-checkbox
    @on-check-change="handleCheckChange"
    :data="fileData"
    :render="renderTree"
    :empty-text="emptyText"
  ></sg-tree>
</template>

<script>
/**
 * 表达式树组件
 */
// import axios from "axios";
import api from "@/api/index.js";
import emitter from '@/mixins/emitter';
export default {
  mixins:[emitter],
  data() {
    return {
      // urlMap: {
      //   findMapLinkTree:
      //     "/mainWeb/support/listGlobalExpressionTree"
      // },
      emptyText: "数据获取中",
      fileData: [],
      flatTree: [],
      flatState: [],
      showTree: true,
      stamp: new Date().getTime()
    };
  },
  methods: {
    /**
     * @description 树的渲染
     * @param {any} h
     * @param {any} { data }
     * @returns {any}
     */
    renderTree(h, { data }) {
      /* eslint no-extra-parens: ["error", "all", { ignoreJSX: "all" }] */
      let iconDir = (
        <svg
          id="iconwenjianjia"
          viewBox="0 0 1024 1024"
          style="height: 16px; width: 16px; margin: 0px 8px 0px 5px"
        >
          <path
            d="M884.72 166.04H405.41c0-29.41-23.84-53.27-53.26-53.27H139.13c-29.41 0-53.27 23.84-53.27 53.27v159.77c0 29.43 23.84 53.27 53.27 53.27h745.61c29.41 0 53.27-23.84 53.27-53.27V219.3c-0.02-29.43-23.87-53.26-53.29-53.26z m0 0"
            fill="#CCA352"
          ></path>
          <path
            d="M831.47 219.29H192.38c-29.41 0-53.27 23.84-53.27 53.26v53.27c0 29.43 23.84 53.27 53.27 53.27h639.08c29.41 0 53.26-23.84 53.26-53.27v-53.27c0-29.41-23.83-53.26-53.25-53.26z m0 0"
            fill="#FFFFFF"
          ></path>
          <path
            d="M884.72 272.55H139.13c-29.41 0-53.27 23.84-53.27 53.27v532.6c0 29.38 23.84 53.26 53.27 53.26h745.61c29.41 0 53.27-23.87 53.27-53.26V325.79c-0.02-29.4-23.87-53.24-53.29-53.24z m0 0"
            fill="#FFCC66"
          ></path>
        </svg>
      );
      let iconDirOpen = (
        <svg
          id="iconwenjianjiadakai"
          viewBox="0 0 1024 1024"
          style="height: 16px; width: 16px; margin: 0px 8px 0px 5px"
        >
          <path
            d="M800.58 172.58H323.8c0-29.25-23.71-52.98-52.98-52.98H58.92c-29.25 0-52.98 23.72-52.98 52.98V861.3c0 29.28 23.72 52.99 52.98 52.99h741.67c29.25 0 52.98-23.72 52.98-52.99V225.56c-0.01-29.27-23.73-52.98-52.99-52.98z"
            fill="#CCA352"
          ></path>
          <path
            d="M747.61 225.54H111.89c-29.26 0-52.98 23.71-52.98 52.98v533.23c0 29.28 23.72 52.99 52.98 52.99H747.6c29.25 0 52.98-23.72 52.98-52.99V278.52c0-29.25-23.71-52.98-52.97-52.98z"
            fill="#FFFFFF"
          ></path>
          <path
            d="M225.44 385.86c-29.27 0-52.98 23.72-53 52.97L5.94 861.3c0 29.24 23.73 52.98 52.98 52.98h741.67c29.27 0 52.98-23.75 52.98-52.98l166.5-422.46c0-29.27-23.73-52.98-52.98-52.98H225.44z"
            fill="#FFCC66"
          ></path>
        </svg>
      );
      let iconFile = (
        <svg
          id="iconwenjian"
          viewBox="0 0 1024 1024"
          style="height: 16px; width: 16px; margin: 0px 8px 0px 5px"
        >
          <path
            d="M830.73 116.68H194.74c-29.27 0-53.01 23.73-53.01 53.02v688.95c0 29.27 23.73 53 53.01 53h450.49l238.48-238.48V169.71c0-29.3-23.72-53.03-52.98-53.03z"
            fill="#CCCCCC"
          ></path>
          <path
            d="M804.23 169.71H221.24c-14.65 0-26.5 11.85-26.5 26.47v635.97c0 14.65 11.85 26.5 26.5 26.5h397.49l211.98-211.98V196.18c0.02-14.62-11.86-26.47-26.48-26.47z"
            fill="#FFFFFF"
          ></path>
          <path
            d="M698.23 673.17c-29.27 0-53.01 23.73-53.01 53.01v185.5l238.49-238.49H698.23v-0.02z"
            fill="#999999"
          ></path>
          <path
            d="M698.23 487.69h-371c-14.65 0-26.51 11.86-26.51 26.48 0 14.64 11.86 26.5 26.51 26.5h370.98c14.62 0 26.5-11.86 26.5-26.5 0.01-14.62-11.86-26.48-26.48-26.48z m-370.99-53.01h212c14.62 0 26.51-11.86 26.51-26.5 0-14.61-11.89-26.5-26.51-26.5h-212c-14.65 0-26.51 11.89-26.51 26.5 0.02 14.64 11.85 26.5 26.51 26.5z m0-106h370.98c14.62 0 26.5-11.86 26.5-26.48 0-14.65-11.88-26.53-26.5-26.53H327.24c-14.65 0-26.51 11.88-26.51 26.53 0.02 14.62 11.85 26.48 26.51 26.48z"
            fill="#CCCCCC"
          ></path>
        </svg>
      );
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            cursor: "pointer"
          },
          class: ['tree-label'],
          on: {
            click: () => {
              this.dispatch('index','getExplist',data);
            }
          }
        },
        [
          h("span", [
            !data.iconCls ? iconFile : data.expanded ? iconDirOpen : iconDir,
            h(
              "span",
              {
                style: {
                  backgroundColor: data.selected ? "#EBEDF0" : "transparent"
                }
              },
              data.text
            )
          ])
        ]
      );
    },
    /**
     * @description 获取树数据
     * @param {any} init=false 是否更新列表
     */
    getTreeData(init=false) {
      // axios.post(this.urlMap.findMapLinkTree).then(response => {
      //   console.log(response)
      //   this.fileData=response.data;
      // });
      api.fetchGlobalExpressionTree().then(res => {
        this.fileData = res;
        this.backup = JSON.stringify(res);
        this.flatState = [];
        this.generateFlatTree(this.fileData);
        if(init) {
          this.dispatch('index','getExplist',res[0]);
        }
      });
    },
    /**
     * @description 多选变更，同步数据到主页面
     * @param {any} list
     */
    handleCheckChange(list) {
      this.dispatch('index','setTreeCheckList',{list});
    },
    /**
     * @description 向树插入节点
     * @param {any} id 节点id
     * @param {any} data 节点数据
     * @param {any} isExp 为真表示插入的节点为表达式节点
     */
    insertNode(id, data, isExp) {
      for(let node of this.flatState) {
        let pField = isExp?'categoryId':'parentId',
          txtField = isExp?'globalName':'text';
        if(node.id == data[pField]) {
          let temp = {
            children: [],
            id: id,
            sort: 0,
            text: data[txtField]
          }
          if(!isExp) {
            temp.iconCls = 'tree-folder';
          }
          node.children.push(temp);
          break;
        }
      }
    },
    /**
     * @description 树搜索实现
     * 内部的变量语义化可以友好些
     * 现有逻辑：找到目标节点列表，对列表去重，找到跟节点挂到树
     * flatTree是拍平树，修正拍平树的孩子指针意义是？
     * @param {any} txt 搜索文本
     */
    searchTree(txt) {
      this.flatTree.length = 0;
      this.generateTreeMap(JSON.parse(this.backup), "#");
      if (!txt) this.clearSearch();
      let collection = [];// 将要挂到搜索结果树上节点的集合
      let targetNode = this.getTargetNode(txt);// 搜索结果节点列表，包含表达式节点和分类节点
      for (let item of targetNode) {
        let currentNode = item;
        do {// 从该节点往父级组装树结构
          let i = 0;
          for (; i < collection.length; i++) {
            if (collection[i].id == currentNode.id) break;
          }
          if (i >= collection.length) {// 判断当前目标节点是否在集合中
            collection.push(currentNode);// 若不在集合中，则加入到集合中，并进行寻找父节点的处理
          } else {
            break;// 若在集合中，则不需要再处理该节点
          }
          for (let flatNode of this.flatTree) {
            if (flatNode.id == currentNode.$pid) {// 找到当前节点的父节点，把当前节点插入到父节点的子节点列表中
              if (flatNode.children && flatNode.children.length > 0) {
                flatNode.children.push(currentNode);
              } else {
                flatNode.children = [currentNode];
              }
              currentNode = flatNode;// 替换当前节点，继续寻找父节点
              break;
            }
          }
        } while (currentNode.$pid);// 直到没有$pid，则已经到达根节点
      }
      let root = [];// 搜索结果树
      for (let item of collection) {// 从集合中过滤出父节点为根节点的节点，插入到搜索结果树
        if (item.$pid == "#") {
          root.push(item);
        }
      }
      this.fileData = root;
    },
    /**
     * @description 从拍平的树列表获取搜索文本匹配的节点
     * @param {any} txt 搜索文本
     * @returns {any} 匹配的节点列表
     */
    getTargetNode(txt) {
      let res = [];
      for (let item of this.flatTree) {
        if (item.text && item.text.indexOf(txt) > -1) {
          res.push(item);
        }
      }
      return res;
    },
    /**
     * @description 拍平树，用于搜索
     * 可以用reduce拍，可读性高
     * @param {any} list 原始树某深度
     * @param {any} pid 当前深度的父id
     */
    generateTreeMap(list, pid) {
      for (let item of list) {
        item["$pid"] = pid;
        item.expanded = true;
        this.flatTree.push(item);
        if (item.children && item.children.length > 0) {
          this.generateTreeMap(item.children, item.id);
          /**
           * 在生成搜索结果树时，会往children里push匹配的子节点
           * 所以在这里先进行清空
           */
          item.children.length = 0;
        }
      }
    },
    /**
     * @description 清空搜索树
     */
    clearSearch() {
      this.fileData = JSON.parse(this.backup);
    },
    /**
     * @description 拍平树，用于插入节点
     */
    generateFlatTree(list) {
      for(let node of list) {
        this.flatState.push(node);
        if(node.children) {
          this.generateFlatTree(node.children);
        }
      }
    }
  },
  mounted() {
    this.getTreeData(true);
  }
};
</script>

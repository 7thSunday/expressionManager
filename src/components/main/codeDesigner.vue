<template>
  <div id="code-designer" :style="{width:cWidth,height:cHeight}">
    <p>表达式编辑器</p>
    <codemirror v-model="code" :options="cmOptions"></codemirror>
    <div class="b">
      <div class="control-bar">
        <sg-button @click="handleClickSaveCode">保存</sg-button>
        <sg-button>选择系统字段</sg-button>
      </div>
      <div class="support">
        <div class="support-tree">
          <sg-tree :render="renderTree" :data="expJson"></sg-tree>
        </div>
        <div class="support-tips" v-html="descHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 表达式编辑器
 */
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript.js'
import expJson from '@/api/expJson.json'
import emitter from '@/mixins/emitter';
export default {
  name: "code-designer",
  mixins:[emitter],
  components:{codemirror},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * @description 观测本modal是否调起
     * @param {any} val modal显隐
     */
    visible(val) {
      if(!val) {
        this.code = '';
      }
    }
  },
  data() {
    return {
      expJson: [],
      cWidth: '1000px',
      cHeight: '500px',
      code: '',
      descHtml: '',
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: 'text/javascript',
        // theme: 'solarized light',
        theme: 'base16-light',
        // theme: 'cobalt',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  methods: {
    /**
     * @description 表达式树的jsx
     * @param {any} h
     * @param {any} { data }
     * @returns {any}
     */
    renderTree(h, { data }) {
      /* eslint no-extra-parens: ["error", "all", { ignoreJSX: "all" }] */
      let iconDir = (
        <svg
          class="icon"
          aria-hidden="true"
          style="height: 14px; width: 15px; margin: 0px 8px 0px 5px"
        >
          <use xlinkHref="#iconwenjianjia" />
        </svg>
      );
      let iconDirOpen = (
        <svg
          class="icon"
          aria-hidden="true"
          style="height: 14px; width: 15px; margin: 0px 8px 0px 5px"
        >
          <use xlinkHref="#iconwenjianjiadakai" />
        </svg>
      );
      let iconFile = (
        <svg
          class="icon"
          aria-hidden="true"
          style="height: 14px; width: 15px; margin: 0px 8px 0px 5px"
        >
          <use xlinkHref="#iconwenjian" />
        </svg>
      );
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            cursor: "pointer"
          },
          on: {
            click: () => {
              this.handleNodeClick(data);
            }
          }
        },
        [
          h("span", [
            !data.children ? iconFile : data.expanded ? iconDirOpen : iconDir,
            h("span", {
              style: {
                backgroundColor: data.selected ? "#EBEDF0" : "transparent"
              }
            }, data.text)
          ])
        ]
      );
    },
    /**
     * @description 选中表达式树节点，渲染详细信息
     * @param {any} node 节点信息
     */
    handleNodeClick(node) {
      if(node.decripHtml) {
        this.descHtml = node.decripHtml;
        this.code += node.id;
      } else {
        this.descHtml = '';
      }
    },
    /**
     * @description 页面设置code
     * 直接prop更好？
     * @param {any} code
     */
    setCode(code) {
      this.code = code || '';
    },
    /**
     * @description 保存表达式修改信息
     */
    handleClickSaveCode() {
      this.dispatch('index','setEditingObject',['globalOpertion',this.code]);
    }
  },
  mounted(){
    this.cHeight=window.innerHeight-100+'px'
    this.cWidth=window.innerWidth-100+'px'
    this.expJson = expJson;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/codeDesigner.scss';
</style>

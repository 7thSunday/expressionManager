<template>
  <div class="index">
    <div style="height: 100vh;" class="_sg-layout">
      <div class="_sg-layout-north">
        <sg-input placeholder="请输入搜索内容" inside class="search_input" v-model="searchListTxt">
          <sg-icon slot="append" type="icon-search" size="16" class="search_icon" @click.native="handleClickSearchList"></sg-icon>
        </sg-input>
        <sg-button type="text" class="icon-button btn-add">
          <span class="iconfont icontianjia"></span>添加
          <div class="add-menu">
            <div class="option-list">
              <div class="option-item" @click="showAddDirect=true">目录</div>
              <div class="option-item" @click="handleClickCreateExp">表达式</div>
            </div>
          </div>
        </sg-button>
        <sg-button type="text" class="icon-button" @click="handleClickDelete">
          <span class="iconfont iconshanchu1"></span>删除
        </sg-button>
        <sg-button type="text" class="icon-button" @click="handleClickRefresh">
          <span class="iconfont iconshuaxin"></span>刷新
        </sg-button>
        <!-- <sg-button type="text" class="icon-button">
          <span class="icon-img icon-save"></span>保存
        </sg-button> -->
        <sg-button type="text" class="icon-button" @click="showImport=true">
          <span class="iconfont icondaoru"></span>导入
        </sg-button>
        <sg-button type="text" class="icon-button" @click="handleClickExport">
          <span class="iconfont icondaochu"></span>导出
        </sg-button>
        <!-- <sg-button type="text" class="icon-button" @click="openCode">
          <span class="iconfont iconxinjian"></span>测试表达式编辑器
        </sg-button> -->
      </div>
      <div class="_sg-layout-content">
        <div class="_sg-layout-west" :size="250">
          <div class="district-tree">
            <span class="district-tree-title">
              <b>表达式库</b>
            </span>
            <sg-input placeholder="请输入搜索内容" inside class="search_input" v-model="searchTreeTxt"  @on-clear="handleClickClearSearchTree">
              <sg-icon slot="append" type="icon-search" size="16" class="search_icon" @click.native="handleClickSearchTree"></sg-icon>
            </sg-input>
            <div class="district-tree-content">
              <exp-tree ref="expTree"></exp-tree>
            </div>
          </div>
        </div>
        <div class="_sg-layout-center">
          <div class="district-list">
            <span class="district-list-title">
              <b>{{rightTitle}}</b>
            </span>
            <div class="district-list-content">
              <sg-table ref="selection" 
                :columns="columns" 
                :data="expList"
                @on-selection-change="handleSelectChange">
              </sg-table>
            </div>
            <div class="district-list-foot">
              <sg-page
                v-if="expList.length>0"
                :total="total"
                :show-elevator="true"
                show-sizer
                placement="top"
                :page-size-opts="[10, 20, 50]"
                @on-change="handleChangePage"
                :page-size="pageSize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <sg-modal v-model="showCode"
      class="code-modal"
      :footer-hide="true"
      :closable="true"
      in-turn
    >
      <code-designer ref="codeDesigner" :visible="showCode"></code-designer>
    </sg-modal>
    <sg-modal v-model="showEditOption"
      :closable="true"
      :title="editingObj.rid?'编辑表达式':'新建表达式'"
    >
      <edit-exp-option ref="editExpOption" :option="editingObj" :visible="showEditOption"></edit-exp-option>
      <div class="footer" slot="footer">
        <sg-button type="primary" @click="handleClickSaveOption">保存</sg-button>
        <sg-button @click="showEditOption=false">取消</sg-button>
      </div>
    </sg-modal>
    <sg-modal v-model="showAddDirect"
      :closable="true"
      title="新建目录"
    >
      <add-direct ref="addDirect" :visible="showAddDirect"></add-direct>
      <div class="footer" slot="footer">
        <sg-button type="primary" @click="handleClickCreateCatalog">创建</sg-button>
        <sg-button @click="showAddDirect=false">取消</sg-button>
      </div>
    </sg-modal>
    <sg-modal v-model="showImport"
      class="import"
      :closable="true"
      title="提示">
      <import-exp ref="importExp" :visible="showImport"></import-exp>
      <div class="footer" slot="footer">
        <sg-button @click="showImport=false">取消</sg-button>
        <sg-button type="primary" @click="handleClickImport">确认</sg-button>
      </div>
    </sg-modal>
  </div>
</template>

<script>
/**
 * 表达式主页面
 */
import api from '@/api/index.js';
import expTree from "./expTree.vue";
import codeDesigner from './codeDesigner';
import editExpOption from '../modal/EditExpOption';
import addDirect from '../modal/addDirectory';
import importExp from '../modal/importExp';
export default {
  name: "index",
  components: {
    expTree,codeDesigner,editExpOption,addDirect,importExp
  },
  data() {
    return {
      rightTitle: '表达式',
      pageSize: 10,
      treeCheck: [],
      backupNode: null,
      showImport: false,
      total: 0,
      operation: '',
      editingObj: {
        rid: '',
        globalTitle: '',
        globalName: '',
        globalType: '',
        globalOpertion: '',
        globalExample: '',
        globalDescription: ''
      },
      showEditOption: false,
      showAddDirect: false,
      cityList: [
        {
          value: "1",
          label: "候选值1"
        },
        {
          value: "2",
          label: "候选值2"
        },
        {
          value: "3",
          label: "候选值3"
        }
      ],
      columns: [
        {
          title: "",
          key: "",
          align: "center",
          width: 48,
          render: (h, params) => {
            return h(
              "span",
              {
                on: {
                  click: () => {
                    console.log(params);
                  }
                }
              },
              params.index + 1
            );
          }
        },
        {
          type: "selection",
          width: 45
        },
        {
          title: "标题",
          key: "globalTitle"
        },
        {
          title: "方法名",
          key: "globalName"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "表达式",
          key: "globalOpertion"
        },
        {
          title: "样例",
          key: "globalExample"
        },
        {
          title: "描述",
          key: "globalDescription"
        },
        {
          title: "操作",
          align: "center",
          render: (h, param) => {
            return h("div", [
              <sg-button type="text" class="icon-button" onClick={this.handleClickItemEdit.bind(null,param)}>
                <span style="font-size:16px;" class="iconfont iconbianji" />
              </sg-button>,
              <sg-button type="text" class="icon-button" onClick={this.handleClickItemDelete.bind(null,param)}>
                <span style="font-size:16px;" class="iconfont iconshanchu1" />
              </sg-button>
            ]);
          }
        }
      ],
      expList: [],
      showCode:false,
      selectionList: [],
      searchTreeTxt: '',
      searchListTxt: ''
    };
  },
  computed: {
    addDirectModal() {
      return this.$refs.addDirect;
    }
  },
  methods: {
    /**
     * @description 编辑或新建表达式模态框的显示
     */
    showOptionModal() {
      this.showEditOption = true;
    },
    /**
     * @description 编辑或新建表达式模态框的隐藏
     */
    hideOptionModal() {
      this.showEditOption = false;
    },
    /**
     * @description 打开表达式编辑器
     * @param {any} code 表达式身份key
     */
    openCode(code){
      this.showCode = true;
      this.$refs.codeDesigner.setCode(code);
    },
    /**
     * @description 列表操作图标：编辑操作
     */
    handleClickItemEdit(param) {
      let row = param.row;
      this.handleEditRow(row);
    },
    /**
     * @description 列表操作图标：删除操作
     */
    handleClickItemDelete(param) {
      let row = param.row,
        i = param.index;
      this.$modal.confirm({
        title: '提示',
        content:'确定删除该表达式?',
        closable: true,
        onOk: () => {
          this.$modal.remove()
          this.expList.splice(i,1);
          if(row.rid) {
            this.deleteNodeRemote(row.rid);
          }
        },
        onCancel: () => {
          // this.$msg.warning('点击了取消')
        }
      });
    },
    /**
     * @description 编辑表达式的数据初始化，并调起模态框
     * @param {any} row 表达式信息 
     */
    handleEditRow(row) {
      this.editingObj.rid = row.rid;
      this.editingObj.globalTitle = row.globalTitle;
      this.editingObj.globalName = row.globalName;
      this.editingObj.globalType = row.globalType;
      this.editingObj.globalOpertion = row.globalOpertion;
      this.editingObj.globalExample = row.globalExample;
      this.editingObj.globalDescription = row.globalDescription;
      this.editingObj.categoryId = row.categoryId;
      this.showEditOption = true;
    },
    /**
     * @description 创建表达式的数据初始化，并调起模态框
     */
    handleClickCreateExp() {
      this.editingObj.rid = '';
      this.editingObj.globalTitle = '';
      this.editingObj.globalName = '';
      this.editingObj.globalType = '';
      this.editingObj.globalOpertion = '';
      this.editingObj.globalExample = '';
      this.editingObj.globalDescription = '';
      this.editingObj.categoryId = '';
      this.showEditOption = true;
    },
    /**
     * @description 异步删除表达式
     * @param {any} expRids='' 表达式身份key值
     * @param {any} cateRids='' 表达式分类
     */
    deleteNodeRemote(expRids='',cateRids='') {
      let data = {
        expressionIds: expRids,
        categoryIds: cateRids
      }
      api.deleteGlobalExpressionTreeNode(data).then(()=>{
        this.$msg.success('删除成功');
        this.handleClickRefresh();
      })
    },
    /**
     * @description 更新列表选中的行
     * @param {any} list 被选中的行
     */
    handleSelectChange(list) {
      this.selectionList = list;
    },
    /**
     * @description 删除表达式操作的前置本地判断
     * 这里的逻辑分叉判断比较硬？分开写会好些？
     */
    handleClickDelete() {
      if(this.selectionList.length==0&&this.treeCheck.length==0) {
        this.$msg.warning('请先选择节点');
        return;
      }
      if(this.selectionList.length>0) {
        this.$modal.confirm({
          title: '提示',
          content:'确定删除'+this.selectionList.length+'条表达式?',
          closable: true,
          onOk: () => {
            this.$modal.remove()
            let temp = [];
            for(let item of this.selectionList) {
              temp.push(item.rid);
            }
            this.deleteNodeRemote(temp.join(','));
          },
          onCancel: () => {
            // this.$msg.warning('点击了取消')
          }
        });
        return;
      }
      this.$modal.confirm({
        title: '提示',
        content:'确定删除选中的分类?',
        closable: true,
        onOk: () => {
          this.$modal.remove()
          let temp = [];
          for(let item of this.treeCheck) {
            if(item.iconCls=='tree-folder') {
              temp.push(item.id);
            }
          }
          this.deleteNodeRemote('',temp.join(','));
        },
        onCancel: () => {
          // this.$msg.warning('点击了取消')
        }
      });
    },
    /**
     * @description 保存表达式新建或编辑信息
     * 这里的$delete是清除提交对象的categoryName键，放在组件内的computed实现会更好？
     */
    handleClickSaveOption() {
      let data = this.$refs.editExpOption.data;
      if(!this.checkExpOption(data)) {
        this.$msg.warning({
          content: '存在未填写的必填项',
          duration: 4
        });
        return;
      }
      this.$delete(data, 'categoryName');
      api.saveGlobalExpression(data).then(res=>{
        this.showEditOption = false;
        this.showAddDirect = false;
        this.fetchGlobalExpList(this.backupNode);
        if(data.rid!=res) {
          this.$refs.expTree.insertNode(res, data, true);
        }
      })
    },
    /**
     * @description 创建表达式操作的前置本地判断
     */
    handleClickCreateCatalog() {
      let data = {
        id: '',
        parentId: this.addDirectModal.data.categoryId,
        text: this.addDirectModal.data.nameTxt
      }
      for(let key in data) {
        if(key!='id'&&!data[key]) {
          this.$msg.warning({
            content: '存在未填写的必填项',
            duration: 4
          });
          return;
        }
      }
      api.saveGlobalExpressionCategory({params: data}).then(res=>{
        this.$msg.success('创建成功');
        this.showAddDirect = false;
        this.$refs.expTree.insertNode(res, data);
      })
    },
    /**
     * @description 导出表达式操作的前置本地判断
     */
    handleClickExport() {
      if(this.selectionList.length==0&&this.treeCheck.length==0) {
        this.$msg.warning('请先选择表达式');
        return;
      }
      let temp = [];
      for(let item of this.selectionList) {
        temp.push(item.rid);
      }
      for(let item of this.treeCheck) {
        if(item.iconCls == 'tree-folder' || temp.indexOf(item.id)>-1) continue;
        temp.push(item.id);
      }
      api.exportGlobalExpression({params: {rids:temp.join(',')}}).then(res=>{
        let str = JSON.stringify(res),
          fileName = '导出' + new Date().getTime() + '.json',
          urlObject = window.URL || window.webkitURL || window;
        let export_blob = new Blob([str]);
        let save_link = document.createElement("a");
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = fileName;
        save_link.click();
      })
    },
    /**
     * @description 导入表达式
     */
    handleClickImport() {
      let param = this.$refs.importExp.getImportData();
      if(!param) return;
      api.importGlobalExpression(param,{
        headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
      }).then(res=>{
        if(res.code==500) {
          // 炸了
          this.$modal.alert({
            content: res.error.split(':')[1],
            okText:'知道了',
            onOk: () => {
              this.$modal.remove()
            }
          });
          return;
        }
        let contentHtml = `<span>成功：${res.success}</span><span style="margin: 0 20px;">失败：${res.error}</span><span>总计：${res.total}</span>`
        this.$modal.alert({
          content: contentHtml,
          okText:'确定',
          onOk: () => {
            this.$modal.remove()
          }
        });
        this.$refs.expTree.getTreeData();
      });
      this.showImport = false;
    },
    /**
     * @description 刷新操作
     * 应该是相关的区域内重载数据会好些？
     */
    handleClickRefresh() {
      // 刷新表达式列表
      this.fetchGlobalExpList(this.backupNode);
    },
    /**
     * @description 树的搜索
     */
    handleClickSearchTree() {
      this.$refs.expTree.searchTree(this.searchTreeTxt);
    },
    /**
     * @description 树的搜索文本清空
     */
    handleClickClearSearchTree() {
      this.$refs.expTree.clearSearch();
    },
    /**
     * @description 分页加载
     * @param {any} p
     */
    handleChangePage(p) {
      this.fetchGlobalExpList(this.backupNode,p)
    },
    /**
     * @description 列表的搜索
     */
    handleClickSearchList() {
      this.fetchGlobalExpList(this.backupNode);
    },
    /**
     * @description 更新表达式列表
     * 命名并没有返回东西，约定函数命名语义规范？
     * @param {any} node 分类信息
     * @param {any} p=1 分页
     * @param {any} r=10 页大小
     */
    fetchGlobalExpList(node,p=1,r=10) {
      if(!node||!node.id) return;
      this.rightTitle = node.text;
      if(node.iconCls!='tree-folder') {
        let data = {
          rid: node.id
        }
        api.fetchGlobalExpressionById({params: data}).then(res=>{
          this.handleEditRow(res);
        })
        return;
      } else {
        this.backupNode = node;
      }
      let param = {
        page: p,
        rows: r,
        categoryId: node.id,
        searchTxt: this.searchListTxt
      };
      api.fetchGlobalExpression({params:param}).then(res=>{
        this.expList = res.rows;
        this.total = res.total;
      }).catch(err=>{
        console.log(err);
      })
    },
    /**
     * @description 设置树多选
     * @param {any} list 多选的树列表
     */
    setTreeCheck(list) {
      this.treeCheck = list;
    },
    /**
     * @description 校验表达式
     * @param {any} item 表达式对象
     * @returns {any} 格式是否正确
     */
    checkExpOption(item) {
      let flag = true;
      for(let key in item) {
        if(key!='globalDescription'&&key!='rid'&&!item[key]) {
          flag = false;
        }
      }
      return flag;
    }
  },
  mounted() {
    // 打开编辑器
    this.$on('openCodeEditor', code=>{
      this.openCode(code);
    });
    // 设置属性
    this.$on('setEditingObject', (key, value)=>{
      this.$set(this.editingObj, key, value);
      this.showCode = false;
    });
    // 获取表达式列表
    this.$on('getExplist', data=>{
      this.fetchGlobalExpList(data);
    });
    // 设置树勾选
    this.$on('setTreeCheckList', param=>{
      this.setTreeCheck(param.list);
    })
  }
};
</script>

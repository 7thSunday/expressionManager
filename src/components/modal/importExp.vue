<template>
  <div class="import-exp">
    <div class="field">
      <span class="label">选择文件：</span>
      <div class="val">
        <input class="hidden" type="file" ref="importFile" @change="fileInputChange">
        <sg-button type="primary" @click="selectFile">选择文件</sg-button>
        <span class="filename" :title="filename">{{filename}}</span>
      </div>
    </div>
    <div class="field">
      <span class="label">导入类型：</span>
      <div class="val">
        <sg-radio-group v-model="type">
          <sg-radio label="新建"></sg-radio>
          <sg-radio label="覆盖"></sg-radio>
        </sg-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 导入表达式
 */
export default {
  name: 'importExp',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * @description 观测模态框的显隐，清空所选文件
     * @param {Boolean} val 
     */
    visible(val) {
      if(val) {
        this.$refs.importFile.value = '';
        this.filename = '未选择任何文件';
      }
    }
  },
  data() {
    return {
      type: '新建',
      filename: '未选择任何文件'
    }
  },
  methods: {
    /**
     * @description 获取上传文件的formData
     * @returns {FormData} null或者formData对象 
     */
    getImportData() {
      let file = this.$refs.importFile.files[0];
      if(!file) {
        this.$msg.warning({
          content: '请选择一个文件',
          duration: 4
        });
        return null;
      }
      let data = new FormData();
      data.append('file', file);
      data.append('importType', this.type=='覆盖'?1:0);
      return data;
    },
    /**
     * @description 按钮事件，触发输入框的选择文件事件
     */
    selectFile() {
      this.$refs.importFile.click();
    },
    /**
     * @description 将最新的文件名同步到filename变量
     */
    fileInputChange() {
      this.filename = this.$refs.importFile.files[0].name;
    }
  }
}
</script>

<template>
  <div class="editable-cell">
    <div
      v-if="editable"
      class="editable-cell-input-wrapper"
      @click.stop="(e) => e.stopPropagation()"
    >
      <el-input
        v-if="input"
        v-model="value"
        class="e-c-i-w-input"
        @input="onInput"
        @pressEnter.stop="check"
      />
      <el-input
        v-if="number"
        onkeyup="value=value.replace(/[^\d]/g,'')"
        v-model="value"
        class="e-c-i-w-input"
        @input="onInput"
        @pressEnter.stop="check"
      />
      <el-radio-group class="e-c-i-w-input" v-if="radioGroup" v-model="value">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
      <i class="el-icon-thumb e-c-i-w-check" title="保存" @click.stop="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper" :title="text">
      <div class="e-c-t-w-text" v-if="radioGroup">
        {{ text == 0 ? "否" : "是" }}
      </div>
      <div class="e-c-t-w-text" v-else>{{ text }}</div>
      <div class="e-c-t-w-icon" title="编辑" @click.stop="edit">
        <i class="el-icon-edit-outline" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: [String, Number, Array],
    callType: String,
    onChange: Function,
    onClick: Function,
    editable: Boolean,
    input: Boolean,
    number: Boolean,
    radioGroup: Boolean,
    active: Number,
  },
  data() {
    return {
      value: this.text,
      list: [],
    };
  },
  computed: {
    visible() {
      return !!this.list.length;
    },
  },
  watch: {
    editable() {
      this.value = this.text;
      this.list = [];
    },
  },
  methods: {
    hide() {
      this.list = [];
    },
    handleChange(e) {
      this.value = e.target.value;
      this.list = [];
    },
    dateChange(e) {
      console.log(e);
    },
    onInput() {
      if (this.active === 0) {
      }
      if (this.active === 1) {
      }
      if (this.active === 2) {
      }
    },
    check() {
      // if (!this.value) {
      //   return this.$notify({
      //     title: "提示",
      //     message: "输入不能为空",
      //     type: "warning",
      //     duration: 1500,
      //   });
      // }
      this.$emit("onChange", this.value);
    },
    edit() {
      this.value = this.text;
      this.$emit("onClick");
    },
  },
};
</script>
<style lang="scss" scoped>
.editable-cell {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: 100%;

  .editable-cell-text-wrapper {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    > .e-c-t-w-text {
      flex: 1;
      max-width: calc(100% - 40px);
      overflow: hidden;
      padding: 0 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > .e-c-t-w-icon {
      cursor: pointer;
      visibility: hidden;
      color: #3c77fe;
      position: absolute;
      right: 10px;
      font-size: 16px;
    }
    &:hover {
      .e-c-t-w-icon {
        visibility: visible;
      }
    }
  }
  .editable-cell-input-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    ::v-deep .e-c-i-w-input {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
      border-radius: 0;
      border-color: #3c77fe;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ::v-deep .el-input__inner {
      height: 100%;
      width: 100%;
      padding-right: 40px;
    }
    .e-c-i-w-check {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3c77fe;
      font-size: 16px;
    }
    ::v-deep .ant-select {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;

      .ant-select-selection {
        line-height: 1;
        width: 100%;
        height: 100%;
        border-radius: 0;
        border-color: #3c77fe;
      }
      .ant-select-selection__rendered {
        // line-height: 40px;
        // margin-right: 40px;
      }
    }
    ::v-deep .el-select {
      height: 100%;
    }
    ::v-deep .el-date-editor {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
}
</style>

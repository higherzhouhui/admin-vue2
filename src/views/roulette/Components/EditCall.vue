<template>
  <div class="editable-cell">
    <div
      v-if="editable"
      class="editable-cell-input-wrapper"
      @click.stop="(e) => e.stopPropagation()"
    >
      <el-input
        v-model="value"
        class="e-c-i-w-input"
        @input="onInput"
        @pressEnter.stop="check"
      />
      <i class="el-icon-thumb e-c-i-w-check" title="保存" @click.stop="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper" :title="text">
      <div class="e-c-t-w-text">{{ text }}</div>
      <div class="e-c-t-w-icon" @click.stop="edit">
        <i class="el-icon-edit-outline" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    text: [String, Number, Array],
    callType: String,
    onChange: Function,
    onClick: Function,
    editable: Boolean,
    select: Boolean,
    date: Boolean,
    dateGroup: Boolean,
    selectValue: [String, Number],
    active: Number,
    isExpired: Boolean,
  },
  data() {
    const pty = [
      { name: "typeName" },
      { name: "specName" },
      {
        name: "measureUnitName",
      },
    ][this.active];
    return {
      value: this.text,

      selectV: undefined,
      list: [],
      isHide: false,
      pty,
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
        // delay(this.onSearchType.bind(this))
      }
      if (this.active === 1) {
        // delay(this.onSearchSpec.bind(this))
      }
      if (this.active === 2) {
        // delay(this.onSearchUnit.bind(this))
      }
    },
    // async onSearchType() {
    //   const result = await electricalAdmin.typeQueryList({
    //     typeName: this.value
    //   })
    //   this.list = result
    // },
    // async onSearchSpec() {
    //   const result = await electricalAdmin.specQueryList({
    //     name: this.value
    //   })
    //   this.list = result.records
    // },
    // async onSearchUnit() {
    //   const result = await electricalAdmin.unitQueryList({
    //     name: this.value
    //   })
    //   this.list = result
    // },
    check() {
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

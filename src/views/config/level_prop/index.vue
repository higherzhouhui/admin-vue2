<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showCreateDialogClick()">添加道具</el-button>
      <span style="margin-right: 10px;"></span> -->
      <!-- 种类 -->
      <!--   <el-select size="medium" v-model="listQuery.type" placeholder="请选择道具类型" clearable @change="handleSearchFilter">
        <el-option v-for="item in typeOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select> -->
      <!-- 是否显示 -->
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加特效</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-s-promotion" @click="updateLiveClick()">更新到直播间</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <!-- 展开 -->
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
           <el-form-item label="小动画数">
              <span>{{ props.row.simgs }}</span>
            </el-form-item>
            <el-form-item label="大动画数">
              <span>{{ props.row.bimgs }}</span>
            </el-form-item>
            <el-form-item label="离子数">
              <span>{{ props.row.pimgs }}</span>
            </el-form-item> -->
      <!--   <el-form-item label="展示时间">
              <span>{{ props.row.duration }}</span>
            </el-form-item>
            <el-form-item label="资源地址">
              <a target="_blank" :href="props.row.resourceUrlHref">
                <el-link type="primary">{{ props.row.resourceUrl }}</el-link>
              </a>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->

      <el-table-column type="index" width="60" label="序号" class-name="tb-font" />
      <el-table-column label="封面" width="80">
        <template slot-scope="scope">
          <el-image class="vue-img-preview" :src="scope.row.cover" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="gname" label="名称" min-width="50" class-name="tb-font" />
      <el-table-column prop="level" label="等级" min-width="20" class-name="tb-font" />
      <el-table-column prop="resourceUrl" label="资源地址" min-width="120" class-name="tb-font">
        <template slot-scope="{row}">
          <div style="min-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{
            row.resourceUrl
          }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="videoUrl" label="视频地址" min-width="120" class-name="tb-font">
        <template slot-scope="{row}">
          <div style="min-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.videoUrl
          }}</div>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="特效" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.playType | playFilter">{{
            row.playTypeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <!--    <el-button plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 道具 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :inline="true" :model="createModel" :rules="rules" label-position="top" label-width="80px"
          size="medium">
          <el-form-item label="道具名称" prop="gname">
            <el-input v-model="createModel.gname" clearable placeholder="请输入道具名称" maxlength="128" show-word-limit />
          </el-form-item>
          <el-form-item label="等级" prop="level"><el-input v-model.number="createModel.level" clearable placeholder="请输入等级"
              maxlength="10" /></el-form-item>
          <el-form-item style="width: 100%" label="封面图">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'cover', 'level')
                ">
              <img v-if="createModel.cover" :src="createModel.cover" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('level', true)" />
            <el-input v-model="createModel.cover" type="textarea" placeholder="上传图片自动生产资源地址"
              :autosize="{ minRows: 3, maxRows: 4 }" style="width: 526px" />
          </el-form-item>
          <el-form-item label="资源地址">
            <div style="width: 526px">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'resourceUrl', 'level')
                  ">
                <img v-if="createModel.resourceUrl" :src="createModel.resourceUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="uploadFileDesc" v-html="getImageLibary('level', true)" />
              <el-input v-model="createModel.resourceUrl" type="textarea" placeholder="上传图片自动生产资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>
          <el-form-item label="视频地址">
            <div style="width: 526px">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'videoUrl', 'level')
                  ">
                <video v-if="createModel.videoUrl" :src="createModel.videoUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <el-input v-model="createModel.videoUrl" type="textarea" placeholder="上传视频自动生产资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>
          <el-form-item label="Json文件地址">
            <div style="width: 526px">
              <el-upload accept=".json,.JSON" action="" :show-file-list="false" :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'videoJson', 'level')
                  ">
                  <el-button type="primary">添加Json文件</el-button>
              </el-upload>
              <el-input style="margin-top: 10px;" v-model="createModel.videoJson" type="textarea" placeholder="上传Json文件自动生产资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>
          <el-form-item label="道具类型">
            <el-select v-model="createModel.type" placeholder="请选择道具类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="特效类型">
            <el-select v-model="createModel.playType" placeholder="请选择特效类型">
              <el-option v-for="item in playTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="展示时间" prop="duration"><el-input v-model.number="createModel.duration" clearable
              placeholder="请输入展示时间" maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPropList,
  createProp,
  updateProp,
  deleteProp,
  updateLiveProp,
} from "@/api/config/level_prop";
import {
  getImageLibary,
  nullS,
  beforeUploadImage,
  uploadResourceFiles,
} from "@/utils/tools";

export default {
  name: "ConfigPropPage",
  filters: {
    typeFilter(status) {
      const map = { 0: "", 1: "success", 2: "warning" };
      return map[status];
    },
    playFilter(status) {
      const map = { 0: "", 1: "success", 2: "warning" };
      return map[status];
    },
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("数值不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        type: null,
      },
      getImageLibary: getImageLibary,
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加道具",
        update: "编辑道具",
      },

      // 表单模型
      createModel: {
        id: 0,
        gname: null,
        resourceUrl: null,
        cover: null,
        duration: 0,
        type: 0,
        playType: 0,
        level: 0,
        videoUrl: null,
        videoJson: null
      },
      typeOptions: [
        { value: 0, label: "等级" },
        { value: 1, label: "贵族" },
      ],
      playTypeOptions: [
        { value: 0, label: "连送" },
        { value: 1, label: "全屏" },
        { value: 2, label: "半屏" },
      ],

      // 验证规则
      rules: {
        gname: [{ required: true, message: "请输入道具名称" }],

        duration: [{ validator: checkNumber, trigger: "change" }],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        gname: null,
        resourceUrl: null,
        cover: null,
        duration: 0,
        type: 0,
        playType: 0,
        level: 0,
        videoUrl: null,
        videoJson: null
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getPropList({
        pageSize: this.listQuery.limit,
        pageNum: this.listQuery.page,
        type: this.listQuery.type,
      })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            // 道具标签
            //
            var playTypeStr = "";
            if (item.playType == 0) {
              playTypeStr = "连送";
            } else if (item.playType == 1) {
              playTypeStr = "全屏";
            } else if (item.playType == 2) {
              playTypeStr = "半屏";
            }
            this.$set(item, "playTypeString", playTypeStr);
            //
            var typeStr = "";
            if (item.type == 0) {
              typeStr = "等级特效";
            } else if (item.type == 1) {
              typeStr = "贵族特效";
            }
            this.$set(item, "typeString", typeStr);
            //
            var resourceUrlHref = "";
            if (
              `${item.resourceUrl}` === "" ||
              typeof item.resourceUrl === undefined
            ) {
              resourceUrlHref = "";
            } else if (
              `${item.resourceUrl}`.indexOf("http") === -1 &&
              `${item.resourceUrl}`.indexOf("https") === -1
            ) {
              resourceUrlHref = `http://${item.resourceUrl}`;
            } else {
              resourceUrlHref = `${item.resourceUrl}`;
            }
            this.$set(item, "resourceUrlHref", resourceUrlHref);
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    updateLiveClick() {
      this.listLoading = false;
      this.$confirm("是否更新等级特效？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          updateLiveProp(this.listQuery)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "更新道具成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.gid == null || row.gid < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该道具？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteProp([row.gid])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除道具成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          this.dialogCreateLoading = true;
          // 处理参数
          var tags = formDic.tags;
          var tagStr = "";
          if (Array.isArray(tags) && tags.length > 0) {
            tags = tags.filter((item) => item.value === true);
            var tagList = tags.map((item) => item.key);
            tagStr = tagList.join(",");
          }
          const params = {
            gname: nullS(formDic.gname),
            resourceUrl: nullS(formDic.resourceUrl),
            videoUrl: nullS(formDic.videoUrl),
            videoJson: nullS(formDic.videoJson),
            cover: nullS(formDic.cover),
            duration: formDic.duration || 0,
            playType: formDic.playType || 0,
            type: formDic.type || 0,
            level: formDic.level || 0,
          };

          // 请求服务器
          if (this.dialogStatus === "create") {
            createProp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建道具成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          } else {
            params["gid"] = formDic.gid || 0;
            updateProp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改道具成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
      });
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
    },

    // 上传图片

    beforeImgUpload(file) {
      console.log("-----------上传之前------------");
      const { can, msg } = beforeUploadImage(file.type, file.size);
      if (!can) {
        this.$message.error(msg);
      } else {
        this.dialogCreateLoading = true;
      }
      return can;
    },

    uploadImgRequest(option, content) {
      console.log("-----------自定义上传方法------------");
      this.$store
        .dispatch("oss/getOSSInfos")
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: "level",
          });
        })
        .then((url) => {
          this.$set(this.createModel, content, url);
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
        });
    },
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
</style>

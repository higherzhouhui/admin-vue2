<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="success"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >新增</el-button
        >
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.videoName"
          size="small"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.videoStatus"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        />
        <el-button size="small" icon="el-icon-refresh" @click="resets" />
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="videoName"
        label="标题"
        min-width="80"
         
      />
      <el-table-column label="内容" width="180"  >
        <template slot-scope="scope">
          <el-image
            class="vue-img-preview"
            :src="scope.row.livePicUrl"
            fit="contain"
            lazy
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="playTypeString"
        label="状态"
        min-width="80"
         
      />
      <!--  <el-table-column prop="videoPath" label="视频地址" show-overflow-tooltip min-width="80"   /> -->
      <el-table-column
        prop="startTimeString"
        label="开始时间"
        min-width="140"
         
      />
      <el-table-column
        prop="operator"
        label="结束时间"
        min-width="140"
         
      />
      <el-table-column
        prop="remark"
        label="发布时间"
        min-width="140"
         
      />
      <el-table-column
        prop="createTimeString"
        label="操作人"
        width="100"
         
      />
      <el-table-column label="操作" width="240"  >
        <template slot-scope="{ row }">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >详情</el-button
          >
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</el-button
          >
          <el-button plain type="danger" size="mini" @click="demos(row)"
            >开服</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
       
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <!--   <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="200" /></el-form-item> -->
          <el-form-item label="标题" prop="videoName"
            ><el-input
              v-model="createModel.videoName"
              clearable
              placeholder="请输入标题"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="createModel.demo1"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="width: 100%" label="结束时间" prop="livePicUrl">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'livePicUrl')"
            >
              <img
                v-if="createModel.livePicUrl"
                :src="createModel.livePicUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="内容" prop="videoPath"> </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVideoList,
  createVideo,
  updateVideo,
  deleteVideo,
  updateVideoStatus,
} from "@/api/config/video";
import {
  emptyS,
  nullS,
  beforeUploadImage,
  uploadFile,
  formatUnixTime,
} from "@/utils/tools";

export default {
  name: "LiveVideoController",
  filters: {
    statusFilter(status) {
      const map = { 1: "info", 0: "success", 2: "danger" };
      return map[status];
    },
    typeFilter(status) {
      const map = { 0: "info", 1: "warning", 2: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        videoName: null,
        livePicUrl: null,
        type: null,
        videoStatus: null,
        pickerValue: [],
        state: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加视频",
        update: "编辑视频",
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        videoName: null,
        livePicUrl: null,
        remark: null,
        videoStatus: 1,
        sort: 1,
      },
      typeOptions1: [{ label: "正常播放", value: 1 }],
      typeOptions: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 },
      ],
      typeOString: [
        { label: "广告视频", value: 1 },
        { label: "足球", value: 2 },
        { label: "篮球", value: 3 },
      ],
      // 验证规则
      rules: {
        videoName: [
          { required: true, message: "请输入视频名称", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
        videoPath: [
          { required: true, message: "请输入视频地址", trigger: "change" },
          { min: 1, max: 500, message: "最多为500个字符", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
        livePicUrl: [
          { required: true, message: "请上传视频封面图", trigger: "change" },
        ],
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
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
        id: null,
        uid: null,
        videoName: null,
        livePicUrl: null,
        videoPath: null,
        videoStatus: null,
        sort: 1,
      };
    },
    // 重置
    resets() {
      this.refreshData();
      this.resetCreateModel();
    },
    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        videoName: null,
        livePicUrl: null,
        videoStatus: null,
        pickerValue: [],
        state: null,
      };
      this.fetchData();
    },

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
        .then(async (res) => {
          let url = await uploadFile(
            res,
            'ainfo',
            option.file.name,
            option.file
          );
          this.$set(this.createModel, content, url);
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
        });
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getVideoList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
            );
            this.$set(
              item,
              "updateTimeString",
              formatUnixTime(item.updateTime)
            );
            this.$set(
              item,
              "startTimeString",
              formatUnixTime(item.startTime * 1000)
            );
            var playTypeStr = "";
            /*  if (item.type == 0) {
                playTypeStr = '连送'
              } else if (item.type == 1) {
                playTypeStr = '广告视频'
              } else if (item.type == 2) {
                playTypeStr = '足球视频'
              }else if (item.type == 3) {
                playTypeStr = '篮球视频'
              }else if (item.type == 2) {
                playTypeStr = '台球视频'
              }else if (item.type == 7) {
                playTypeStr = '橄榄球'
              } */

            if (item.type == 0) {
              playTypeStr = "连送";
            } else if (item.type == 1) {
              playTypeStr = "广告视频";
            } else if (item.type == 2) {
              playTypeStr = "足球";
            } else if (item.type == 3) {
              playTypeStr = "篮球";
            } else if (item.type == 4) {
              playTypeStr = "网球";
            } else if (item.type == 5) {
              playTypeStr = "棒球";
            } else if (item.type == 6) {
              playTypeStr = "排球";
            } else if (item.type == 7) {
              playTypeStr = "橄榄球";
            } else if (item.type == 8) {
              playTypeStr = "台球视频";
            } else if (item.type == 9) {
              playTypeStr = "台球";
            } else if (item.type == 10) {
              playTypeStr = "乒乓球";
            } else if (item.type == 11) {
              playTypeStr = "台球视频";
            } else if (item.type == 12) {
              playTypeStr = "台球/斯诺克";
            } else if (item.type == 13) {
              playTypeStr = "美式足球";
            } else if (item.type == 16) {
              playTypeStr = "羽毛球";
            } else if (item.type == 40) {
              playTypeStr = "电竞";
            } else if (item.type == 41) {
              playTypeStr = "高尔夫";
            }

            this.$set(item, "playTypeString", playTypeStr);

            return item;
          });
          this.listLoading = false;
          this.listQuery.total = res.data.total;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
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
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除视频？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteVideo([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除视频成功",
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
        .catch(() => {});
    },

    // 更改用户超管状态
    updateStatus(row) {
      this.listLoading = true;
      const id = row.id;
      const videoStatus = row.videoStatus;
      // 请求网络
      updateVideoStatus(id, videoStatus)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "更新视频状态成功",
            type: "success",
            duration: 1000,
          });
          setTimeout((_) => {
            this.fetchData();
          }, 200);
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.manage = !mgr;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            type: formDic.type || 0,
            videoName: formDic.videoName,
            livePicUrl: formDic.livePicUrl,
            videoPath: formDic.videoPath,
            remark: formDic.remark,
            videoStatus: formDic.videoStatus,
            sort: formDic.sort,
          };
          if (this.dialogStatus === "create") {
            createVideo(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建视频成功",
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
            params["id"] = formDic.id || 0;
            updateVideo(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改视频成功",
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
</style>

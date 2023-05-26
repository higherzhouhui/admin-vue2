<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 类别 -->
      <el-form-item>
        <el-select
          v-model="listQuery.pids"
          size="small"
          multiple
          clearable
          placeholder="请选择广告类别"
          @clear="handleSearchFilter"
        >
          <el-option
            v-for="item in advertTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <el-button size="small" icon="el-icon-refresh" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加广告</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="refreshList"> 手动刷新列表 </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="广告类别" min-width="110">
        <template slot-scope="{ row }">
          <el-tag size="medium" type="">{{ row.typeString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="标题" min-width="110" />
      <el-table-column label="文字或图片" min-width="120">
        <template slot-scope="{ row }">
          <span
            v-if="
              row.content.indexOf('http://') != -1 ||
              row.content.indexOf('https://') != -1
            "
          >
            <el-image
              class="vue-img-preview"
              fit="contain"
              lazy
              :src="row.content"
              :preview-src-list="[row.content]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </span>
          <span v-else>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="PC文字或图片" min-width="120">
        <template slot-scope="{ row }">
          <span
            v-if="
              row.content.indexOf('http://') != -1 ||
              row.content.indexOf('https://') != -1
            "
          >
            <el-image
              class="vue-img-preview"
              fit="contain"
              lazy
              :src="row.pcContent"
              :preview-src-list="[row.pcContent]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </span>
          <span v-else>{{ row.pcContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template slot-scope="{ row }">
          <a target="_blank" :href="row.jumpUrlHref" style="color: blue">
            {{ row.jumpUrl }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="PC跳转链接" min-width="120">
        <template slot-scope="{ row }">
          <a target="_blank" :href="row.pcJumpUrlHref">
            <el-link type="primary">{{ row.pcJumpUrl }}</el-link>
          </a>
        </template>
      </el-table-column>

      <el-table-column prop="remake" label="备注" min-width="120" />
      <el-table-column label="打开方式" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.openWay | openWayFilter">{{
            row.openWay == 1 ? "站外" : "站内"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="1"
            inactive-text="停用"
            :inactive-value="0"
            @change="changeSwitchClick(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</span
          >
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="100px"
          size="medium"
        >
          <el-form-item label="排序" prop="sort"
            ><el-input
              v-model.number="createModel.sort"
              clearable
              placeholder="请输入排序号"
              maxlength="5"
          /></el-form-item>
          <el-form-item label="标题" prop="name"
            ><el-input
              v-model="createModel.name"
              clearable
              placeholder="请输入标题"
              maxlength="20"
              show-word-limit
          /></el-form-item>
          <el-form-item label="类别" prop="pid">
            <el-select v-model="createModel.pid" placeholder="请选择广告类别">
              <el-option
                v-for="item in advertTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="打开方式">
            <el-switch
              v-model="createModel.openWay"
              active-text="站外"
              :active-value="1"
              inactive-text="站内"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="请选择"
            ><el-switch
              v-model="createModel.isImg"
              active-text="图片"
              inactive-text="文字"
          /></el-form-item>
          <span v-if="createModel.isImg === true">
            <el-form-item label="广告图片">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'content')"
              >
                <img
                  v-if="createModel.content"
                  :src="createModel.content"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </span>
          <span v-else>
            <el-form-item label="文字内容">
              <el-input
                v-model="createModel.content"
                type="textarea"
                placeholder="请输入文字内容"
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </span>
          <span v-if="createModel.isImg === true">
            <el-form-item label="PC广告图片">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeImgUpload"
                :http-request="
                  (params) => uploadImgRequest(params, 'pcContent')
                "
              >
                <img
                  v-if="createModel.pcContent"
                  :src="createModel.pcContent"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </span>
          <span v-else>
            <el-form-item label="PC文字内容">
              <el-input
                v-model="createModel.pcContent"
                type="textarea"
                placeholder="请输入文字内容"
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </span>
          <el-form-item label="跳转链接">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'jumpUrl')"
            >
              <img
                v-if="createModel.jumpUrl"
                :src="createModel.jumpUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div
              class="uploadFileDesc"
              v-html="getImageLibary('banner', true)"
            />
            <el-input
              v-model="createModel.jumpUrl"
              type="textarea"
              placeholder="上传图片之后自动生成跳转链接"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="PC跳转链接">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'pcJumpUrl')"
            >
              <img
                v-if="createModel.pcJumpUrl"
                :src="createModel.pcJumpUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div
              class="uploadFileDesc"
              v-html="getImageLibary('banner', true)"
            />
            <el-input
              v-model="createModel.pcJumpUrl"
              type="textarea"
              placeholder="上传图片之后自动生成跳转链接"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input
              v-model="createModel.remake"
              type="textarea"
              placeholder="请输入备注信息"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
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
import { getAdvertTypeList } from "@/api/config/advert_type";
import {
  getAdvertList,
  createAdvert,
  updateAdvert,
  deleteAdvert,
  refreshAdvertList,
} from "@/api/config/advert";
import {
  getImageLibary,
  nullS,
  beforeUploadImage,
  uploadResourceFiles,
} from "@/utils/tools";

export default {
  name: "ConfigAdvertPage",
  filters: {
    openWayFilter(status) {
      const map = { 0: "", 1: "warning" };
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
        status: null,
        pids: null,
      },
      getImageLibary: getImageLibary,
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加广告配置",
        update: "编辑广告配置",
      },
      activityType: [],
      // 表单模型
      createModel: {
        id: 0,
        sort: 0,
        name: null,
        isImg: false,
        content: null,
        jumpUrl: null,
        pcContent: null,
        pcJumpUrl: null,
        remake: null,
        pid: null,
        openWay: null,
      },
      statusOptions: [
        { value: 0, label: "停用" },
        { value: 1, label: "启用" },
      ],
      advertTypeOptions: [],

      // 验证规则
      rules: {
        name: [
          { required: true, message: "请输入标题" },
          ,
          { min: 1, max: 20, message: "最多为20个字符", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请输入排序号" },
          { type: "number", message: "请输入正确的排序号" },
        ],
        pid: [{ required: true, message: "请选择广告类别" }],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        limit: 20,
        page: 1,
      };
      this.fetchData();
    },
    refreshList() {
      this.$confirm("是否确定清除缓存，刷新列表？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then((res) => {
          refreshAdvertList().then((res) => {
            if (res.code === 200) {
              this.$notify({
                title: "提示",
                message: "操作成功",
                type: "success",
              });
            } else {
              this.$notify({
                title: "提示",
                message: "操作失败",
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        sort: 0,
        name: null,
        isImg: false,
        content: null,
        jumpUrl: null,
        pcContent: null,
        pcJumpUrl: null,
        remake: null,
        pid: null,
        openWay: null,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.advertTypeOptions = [];
      var advertTypes = [];
      getAdvertTypeList(50, 1)
        .then((res) => {
          advertTypes = res.data.list || [];
          this.advertTypeOptions = advertTypes.map((item) => {
            return {
              value: item.id || 0,
              label: nullS(item.name),
            };
          });
          this.activityType = advertTypes.map((item) => {
            return {
              value: item.type,
              label: item.name,
            };
          });
          console.log("这是什么活动数据", this.activityType);

          return getAdvertList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery.status,
            this.listQuery.pids
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = `${item.pid}`;
            for (const type of advertTypes) {
              if (type.id == item.pid) {
                typeString = nullS(type.name);
                break;
              }
            }
            this.$set(item, "typeString", typeString);
            var jumpUrlHref = "";
            if (`${item.jumpUrl}` === "" || typeof item.jumpUrl === undefined) {
              jumpUrlHref = "";
            } else if (
              `${item.jumpUrl}`.indexOf("http") === -1 &&
              `${item.jumpUrl}`.indexOf("https") === -1
            ) {
              jumpUrlHref = `http://${item.jumpUrl}`;
            } else {
              jumpUrlHref = `${item.jumpUrl}`;
            }

            var pcJumpUrlHref = "";
            if (`${item.jumpUrl}` === "" || typeof item.jumpUrl === undefined) {
              pcJumpUrlHref = "";
            } else if (
              `${item.jumpUrl}`.indexOf("http") === -1 &&
              `${item.jumpUrl}`.indexOf("https") === -1
            ) {
              pcJumpUrlHref = `http://${item.jumpUrl}`;
            } else {
              pcJumpUrlHref = `${item.jumpUrl}`;
            }
            this.$set(item, "pcJumpUrlHref", pcJumpUrlHref);
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
      const rowCopy = Object.assign({}, row); // 浅 copy
      var isImg = false;
      if (
        rowCopy.content.indexOf("http://") != -1 ||
        rowCopy.content.indexOf("https://") != -1
      ) {
        isImg = true;
      }
      this.createModel = {
        id: rowCopy.id || 0,
        pid: rowCopy.pid || 0,
        sort: rowCopy.sort || 0,
        openWay: rowCopy.openWay || 0,
        isImg: isImg,
        name: nullS(rowCopy.name),
        content: nullS(rowCopy.content),
        jumpUrl: nullS(rowCopy.jumpUrl),
        pcContent: nullS(rowCopy.pcContent),
        pcJumpUrl: nullS(rowCopy.pcJumpUrl),
        remake: nullS(rowCopy.remake),
      };
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
      this.$confirm("是否删除该广告配置？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteAdvert([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除广告配置成功",
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

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            content: nullS(formDic.content),
            jumpUrl: nullS(formDic.jumpUrl),
            pcContent: nullS(formDic.pcContent),
            pcJumpUrl: nullS(formDic.pcJumpUrl),
            name: nullS(formDic.name),
            remake: nullS(formDic.remake),
            sort: formDic.sort || 0,
            pid: formDic.pid || 0,
            openWay: formDic.openWay || 0,
          };
          if (this.dialogStatus === "create") {
            params["status"] = 1; // 给个默认状态
            createAdvert(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建广告配置成功",
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
            console.error(JSON.stringify(params));
            updateAdvert(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改广告配置成功",
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

    changeSwitchClick(row) {
      this.listLoading = true;
      const rowDic = Object.assign({}, row);
      // 请求网络
      updateAdvert({
        id: rowDic.id,
        status: rowDic.status,
      })
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !row.status;
          this.listLoading = false;
          this.$message.error(err);
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
            dir: "banner",
            fileName: option.file.name,
            file: option.file,
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
  width: 100px;
  height: 100px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
</style>

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
      <el-form-item>
        <el-select
          v-model="listQuery.parentId"
          size="small"
          placeholder="请选择游戏类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in parentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 	  <el-input
        size="medium"
        v-model="listQuery.gameId"
        class="input-with-select"
        placeholder="请输入对应游戏id"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
        >
    </el-input> -->
      <el-form-item>
        <el-input
          v-model="listQuery.name"
          size="small"
          placeholder="请输入游戏名"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.detail"
          size="small"
          placeholder="请输入对应游戏描述"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item class="nowrap">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
        >添加游戏</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          @click="changeStart()"
        >充值后不清空流水可提现</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          @click="changeStop()"
        >充值后清空流水不能提现</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          @click="refreshList"
        >手动刷新列表</el-button>
      </el-form-item>

    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" min-width="60" />
      <!--   <el-table-column label="父级id" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.parentId | parentList">{{ label }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="parentId"
        label="父级ID"
        min-width="60"
      />
      <el-table-column
        prop="level"
        label="级别"
        min-width="60"
      />
      <el-table-column
        prop="name"
        label="游戏名"
        min-width="120"
      />
      <el-table-column
        prop="nameCn"
        label="中文名"
        min-width="120"
      />
      <el-table-column
        prop="nameYn"
        label="越南名"
        min-width="120"
      />
      <el-table-column
        prop="detail"
        label="描述"
        min-width="200"
      />
      <el-table-column label="热门" width="100">
        <template slot-scope="{ row }">
          {{ row.hotFlag == 1 ? "热门" : "非热门" }}
        </template>
      </el-table-column>
      <el-table-column label="官方推荐" width="100">
        <template slot-scope="{ row }">
          {{ row.official == 1 ? "官方推荐" : "非官方推荐" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="0"
            inactive-text="禁用"
            :inactive-value="1"
            @change="switchStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        label="图标"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <img :src="row.icon" alt="icon" style="height: 80px; object-fit: contain;" />
        </template>
      </el-table-column>
      <el-table-column
        prop="bgUrl"
        label="背景图片"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <img v-if="row.bgUrl" :src="row.bgUrl" alt="icon" style="height: 80px; object-fit: contain;" />
        </template>
      </el-table-column>
      <el-table-column
        prop="gameId"
        label="对应游戏id"
        min-width="140"
      />

      <el-table-column label="类别" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" style="width: 100px; text-align: center;" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="120" />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="150"
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="150"
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >编辑</span>
          <span
            class="operation_btn"
            plain
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
          >删除</span>
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
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item label="父级id">
            <el-select
              v-model="createModel.parentId"
              placeholder="请选择父级id"
            >
              <el-option
                v-for="item in parentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="游戏名"
            prop="name"
          ><el-input
            v-model="createModel.name"
            clearable
            placeholder="请输入游戏名"
            maxlength="200"
          /></el-form-item>
          <el-form-item
            label="中文名"
            prop="nameCn"
          ><el-input
            v-model="createModel.nameCn"
            clearable
            placeholder="请输入中文名"
            maxlength="200"
          /></el-form-item>
          <el-form-item
            label="越南名"
            prop="nameYn"
          ><el-input
            v-model="createModel.nameYn"
            clearable
            placeholder="请输入越南名"
            maxlength="200"
          /></el-form-item>
          <el-form-item
            label="描述"
            prop="detail"
          ><el-input
            v-model="createModel.detail"
            clearable
            placeholder="请输入游戏名"
            maxlength="200"
          /></el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'icon', 'gicon')"
            >
              <img
                v-if="createModel.icon"
                :src="createModel.icon"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('gicon', true)" />
            <el-input
              v-model="createModel.icon"
              clearable
              placeholder="上传图片之后自动生成图标链接（不上传图片可手动输入文字）"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="背景图片" prop="bgUrl">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'bgUrl', 'gtype')"
            >
              <img
                v-if="createModel.bgUrl"
                :src="createModel.bgUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('gtype', true)" />
            <el-input
              v-model="createModel.bgUrl"
              clearable
              placeholder="上传图片之后自动生成图标链接（不上传图片可手动输入文字）"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item
            label="对应游戏id"
            prop="gameId"
          ><el-input
            v-model="createModel.gameId"
            clearable
            placeholder="请输入对应游戏id"
            maxlength="200"
          /></el-form-item>
          <el-form-item
            label="级别"
            prop="level"
          ><el-input
            v-model="createModel.level"
            clearable
            placeholder="请输入级别"
            maxlength="200"
          /></el-form-item>
          <el-form-item label="游戏类型">
            <el-select v-model="createModel.type" placeholder="请选择游戏类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          ><el-input
            v-model="createModel.sort"
            clearable
            placeholder="请输入排序等级"
            maxlength="200"
          /></el-form-item>
          <el-form-item label="0非热门 1热门">
            <el-switch
              v-model="createModel.hotFlag"
              active-text="热门"
              :active-value="1"
              inactive-text="非热门"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="0非官方推荐 1官方推荐">
            <el-switch
              v-model="createModel.official"
              active-text="官方推荐"
              :active-value="1"
              inactive-text="非官方推荐"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="0启用 1禁用">
            <el-switch
              v-model="createModel.status"
              active-text="启用"
              :active-value="0"
              inactive-text="禁用"
              :inactive-value="1"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogCreateVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGameList,
  createGame,
  updateGame,
  deleteGame,
  startOk,
  startNo,
  getParentList,
  refreshGameList
} from '@/api/game/config'
import {
  getImageLibary,
  nullS,
  formatUnixTime,
  beforeUploadImage,
  uploadResourceFiles
} from '@/utils/tools'

export default {
  name: 'KyGameConfigController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
      return map[status]
    },
    typeFilter(type) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[type]
    },
    parentIdFilter(parentId) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[parentId]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        type: null,
        gameId: null,
        name: null,
        detail: null,
        parentId: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加游戏',
        update: '编辑游戏'
      },

      // 表单模型
      createModel: {
        parentId: 1,
        level: 0,
        name: null,
        icon: null,
        bgUrl: null,
        gameId: null,
        type: 1,
        status: 0,
        detail: null,
        sort: 0,
        hotFlag: 0,
        official: 0,
        nameCn: '',
        nameYn: ''
      },
      parentList: null,
      statusOptions: [
        { value: 0, label: '启用' },
        { value: 1, label: '禁用' }
      ],
      typeOptions: [
        { label: '所有游戏', value: 10 },
        { label: '开元', value: 1 },
        { label: '彩票', value: 8 },
        { label: '热门', value: 9 },
        { label: 'BG视讯', value: 5 },
        { label: 'BG捕鱼', value: 6 },
        { label: 'CMD体育', value: 7 },
        { label: '沙巴游戏', value: 11 },
        { label: 'BTI游戏', value: 12 },
        { label: 'AWC游戏', value: 13 },
        { label: 'FB游戏', value: 14 }
      ],
      // parentOptions: [{ label: '主目录', value: 0 },  { label: '开元', value: 2 },  { label: '热门', value: 4 } , { label: '首页游戏', value: 5 },{ label: 'BG游戏', value: 13},{ label: '体育游戏', value: 13}],

      // 验证规则
      rules: {
        gameId: [
          { required: true, message: '请输入对应游戏id', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }
        ],
        // icon: [{ required: true, message: '请输入图标', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        name: [
          { required: true, message: '请输入游戏名', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        parentId: 1,
        level: 0,
        name: null,
        icon: null,
        bgUrl: null,
        gameId: null,
        type: 1,
        status: 0,
        detail: null,
        sort: 0,
        hotFlag: 0,
        official: 0,
        nameCn: '',
        nameYn: ''
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        type: null,
        gameId: null,
        name: null,
        detail: null,
        parentId: null
      }
      this.fetchData()
    },

    refreshList() {
      this.$confirm('是否确定清除缓存，刷新列表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(res => {
        refreshGameList().then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '提示',
              message: '操作失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.parentList = null

      // 获取所有座驾配置列表
      getParentList({ parentId: 0 })
        .then((res) => {
          this.parentList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name)
            }
          })
          return getGameList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 0) {
              statusString = '启用'
            } else if (item.status == 1) {
              statusString = '禁用'
            }
            var typeString = ''
            if (item.type == 1) {
              typeString = '开元'
            } else if (item.type == 0) {
              typeString = '至尊'
            } else if (item.type == 2) {
              typeString = 'AG'
            } else if (item.type == 3) {
              typeString = '彩票'
            } else if (item.type == 4) {
              typeString = '大富翁'
            } else if (item.type == 5) {
              typeString = 'BG视讯'
            } else if (item.type == 6) {
              typeString = 'BG捕鱼'
            } else if (item.type == 8) {
              typeString = '彩票游戏'
            } else if (item.type == 9) {
              typeString = '热门游戏'
            } else if (item.type == 10) {
              typeString = '所有游戏'
            } else if (item.type == 7) {
              typeString = 'CMD体育'
            } else if (item.type == 11) {
              typeString = '沙巴游戏'
            } else if (item.type == 12) {
              typeString = 'BTI游戏'
            } else if (item.type == 13) {
              typeString = 'AWC游戏'
            } else if (item.type == 19) {
              typeString = 'OB真人'
            } else if (item.type == 22) {
              typeString = 'PP电子'
            }
            // var parentIdString = '';
            // if (item.parentId == 0) {
            //   parentIdString = '主目录';
            // } else if (item.parentId == 1) {
            //   parentIdString = '推荐';
            // } else if (item.parentId == 2) {
            //   parentIdString = '开元';
            // } else if (item.parentId == 3) {
            //   parentIdString = '至尊';
            // } else if (item.parentId == 4) {
            //   parentIdString = '热门';
            // } else if (item.parentId == 5) {
            //   parentIdString = '首页游戏';
            // } else if (item.parentId == 6) {
            //   parentIdString = 'AG视讯';
            // } else if (item.parentId == 7) {
            //   parentIdString = 'AG電子';
            // } else if (item.parentId == 8) {
            //   parentIdString = 'XIN電子';
            // } else if (item.parentId == 9) {
            //   parentIdString = '捕魚王';
            // } else if (item.parentId == 10) {
            //   parentIdString = 'Yoplay電子';
            // } else if (item.parentId == 11) {
            //   parentIdString = '彩票';
            // } else if (item.parentId == 12) {
            //   parentIdString = '大富翁';
            // }else if (item.parentId == 13) {
            //   parentIdString = 'BG游戏';
            // }
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'typeString', typeString)
            //  this.$set(item, 'parentIdString', parentIdString);
            this.$set(
              item,
              'createTimeString',
              formatUnixTime(item.createTime)
            )
            this.$set(
              item,
              'updateTimeString',
              formatUnixTime(item.updateTime)
            )
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.parentList = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      updateGame({
        id: rowDic.id || 0,
        status: rowDic.status
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !row.status

          this.listLoading = false

          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    changeStart() {
      this.$confirm('是否设置不清空流水？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startOk()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    changeStop() {
      this.$confirm('是否清空流水？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startNo()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该游戏？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteGame([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除游戏成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            parentId: formDic.parentId || 0,
            level: formDic.level || 0,
            name: nullS(formDic.name),
            icon: nullS(formDic.icon),
            bgUrl: nullS(formDic.bgUrl),
            gameId: nullS(formDic.gameId),
            type: formDic.type || 0,
            status: formDic.status || 0,
            detail: nullS(formDic.detail),
            sort: formDic.sort || 0,

            hotFlag: formDic.hotFlag || 0,
            official: formDic.official || 0,
            nameCn: formDic.nameCn,
            nameYn: formDic.nameYn
          }
          if (this.dialogStatus === 'create') {
            createGame(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建游戏成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          } else {
            params['id'] = formDic.id || 0
            updateGame(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改游戏成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },
    // 上传图片

    beforeImgUpload(file) {
      console.log('-----------上传之前------------')
      const { can, msg } = beforeUploadImage(file.type, file.size)
      if (!can) {
        this.$message.error(msg)
      } else {
        this.dialogCreateLoading = true
      }
      return can
    },

    uploadImgRequest(option, content, dir) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: dir
          })
        })
        .then((url) => {
          this.$set(this.createModel, content, url)
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
        })
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    }
  }
}
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

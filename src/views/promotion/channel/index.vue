<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 筛选状态 -->
        <el-select
          v-model="listQuery.flagDelete"
          size="small"
          placeholder="请选择启禁状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in flagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.channel"
          size="small"
          style="width: 240px"
          placeholder="请输入渠道名"
          clearable
          maxlength="20"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <!-- <span style="margin-right: 10px;"></span> -->
      <el-form-item>
        <el-input
          v-model="listQuery.url"
          size="small"
          style="width: 240px"
          placeholder="请输入渠道链接url"
          clearable
          maxlength="100"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <!--    <span style="margin-right: 10px;"></span> -->
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <!-- <span style="margin-right: 10px;"></span> -->
      <el-form-item class="nowrap">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
      <!-- <span style="margin-right: 10px;"></span> -->
      <!-- <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showUpdateUrlClick()">修改渠道url</el-button> -->
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showUpdateUrlClick()"
        >
          新建渠道
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
      />
      <el-table-column
        prop="channel"
        label="渠道名"
        min-width="80"
      />
      <el-table-column
        prop="promoteName"
        label="链接名称"
        min-width="80"
      />
      <el-table-column
        prop="promoteUrl"
        label="链接地址"
        min-width="80"
      />
      <el-table-column
        prop="puid"
        label="渠道号"
        min-width="80"
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="160"
      />
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.flagDelete"
            :width="30"
            active-text="启用"
            :active-value="0"
            inactive-text="禁用"
            :inactive-value="1"
            @change="switchChangeFlag(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            plain
            type="warning"
            size="mini"
            @click="resetChannelPwdClick(row)"
          >重置密码</span>
          <span
            class="operation_btn"
            plain
            type="success"
            size="mini"
            @click="showChannelUrlClick(row)"
          >查看链接</span>
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
          <el-form-item label="渠道名称" prop="channel">
            <el-input
              v-model="createModel.channel"
              clearable
              placeholder="请输入完整渠道名称"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="链接名称" prop="channel">
            <el-input
              v-model="createModel.urlName"
              clearable
              placeholder="请输入完整链接名称"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="落地页url" prop="url">
            <el-input
              v-model="createModel.url"
              clearable
              placeholder="请输入落地页url"
              maxlength="200"
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

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 渠道链接 -->
    <el-drawer
      :title="channelUrlDrawerTitle"
      :visible.sync="channelUrlDrawerVisible"
      direction="rtl"
      size="80%"
      :destroy-on-close="true"
      :wrapper-closable="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      :close-on-press-escape="true"
      :show-close="true"
    >
      <!--     <div class="channel-drawer-nav">
        <el-button
          plain
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="createChannelUrlClick()"
        >新建渠道链接</el-button>
      </div> -->
      <!-- <div class="channel-drawer-nav"  ><el-button size="small" type="primary" icon="el-icon-edit-outline" @click="showCreateUrlClick()">创建渠道链接</el-button></div> -->
      <div class="channel-drawer-container">
        <el-table
          v-cloading="channelUrlDrawerLoading"
          :data="channelUrlDrawerList"
          size="mini"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column
            prop="channel"
            label="链接名"
            min-width="60"
          />
          <el-table-column label="推广链接" min-width="100">
            <template slot-scope="{ row }">
              <el-link  :underline="false">{{ row.url }}</el-link>
            </template>
          </el-table-column>

          <el-table-column label="绑定概率" width="220">
            <template slot-scope="{ row }">
              <div v-if="row.edit">
                <el-input-number
                  v-model="row.bindRate"
                  :step="1"
                  :min="0"
                  :max="100"
                  step-strictly
                  controls-position="right"
                  size="mini"
                />
                <span style="margin-left: 5px" />
                <span
                  class="operation_btn"
                  plain
                  type="success"
                  size="mini"
                  @click="editChannelUrlRateClick(row)"
                >确认</span>
              </div>
              <div v-else style="display: flex; justify-content: center">
                <div class="bindRate-box">{{ row.bindRate }}</div>
                <span style="margin-left: 10px" />
                <span
                  class="operation_btn"
                  plain
                  type="primary"
                  size="mini"
                  @click="row.edit = true"
                >修改</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="过滤IP" width="120">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.filterIp"
                :width="30"
                active-text="是"
                :active-value="1"
                inactive-text="否"
                :inactive-value="0"
                @change="drawerSwitchChange(row, 'filterIp')"
              />
            </template>
          </el-table-column>
          <el-table-column label="过滤UDID" width="120">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.filterUdid"
                :width="30"
                active-text="是"
                :active-value="1"
                inactive-text="否"
                :inactive-value="0"
                @change="drawerSwitchChange(row, 'filterUdid')"
              />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80">
            <template slot-scope="{ row }">
              <span
                class="operation_btn"
                type="danger"
                size="mini"
                @click="showDeleteUrlClick(row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          class="vue-pagination"
          background
          :current-page="channelUrlDrawerListQuery.page"
          :page-sizes="[10, 20, 50]"
          :page-size="channelUrlDrawerListQuery.limit"
          layout="total, sizes, prev, pager, next"
          :total="channelUrlDrawerListQuery.total"
          @size-change="handleDrawerSizeChange"
          @current-change="handleDrawerCurrentChange"
        />
      </div>
    </el-drawer>

    <!-- 新建/编辑 消息公告   等等-->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateUrlVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateUrlLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createUrlModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <!--  <el-form-item label="推广链接" prop="url"><el-input v-model="createUrlModel.url" clearable placeholder="请输入推广链接" maxlength="200" /></el-form-item> -->
          <el-form-item label="绑定推广链接">
            <el-select v-model="createUrlModel.url" placeholder="请--选--择 ">
              <el-option
                v-for="item in urlList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :v-model="createUrlModel.url"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogCreateUrlVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="createChannelUrlClick(createUrlModel.url)"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPromotionChannelUrl,
  createChannelWithName,
  updateChannelFlagdelete,
  resetChannelPwd,
  deletePromotionBase,
  createChannel
} from '@/api/promotion/channel_base'
import {
  getPromotionChannelUrlList,
  createChannelUrl,
  updateChannelUrlInfos,
  deletePromotionUrl,
  getPromoteUrlList
} from '@/api/promotion/channel_url'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'PromotionChannelController',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        channel: null,
        flagDelete: null,
        url: null
      },
      flagOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogCreateUrlVisible: false,
      dialogCreateUrlLoading: false,

      dialogStatus: '',
      dialogTitleMap: {
        create: '新增单一渠道URL',
        update: '修改所有渠道URL',
        createUrl: '新建渠道链接'
      },

      // 表单模型
      createModel: {
        channel: null,
        url: null,
        urlName: null
      },

      // 表单模型
      createUrlModel: {
        channel_id: null,
        url: null
      },

      // 渠道链接侧边栏
      channelUrlDrawerTitle: '渠道链接列表',
      channelUrlDrawerVisible: false,
      channelUrlDrawerId: null,
      channelUrlDrawerList: null,
      channelUrlDrawerLoading: true,
      channelUrlDrawerListQuery: {
        page: 1,
        limit: 10,
        total: 0
      },
      urlList: null,
      rules: {
        url: [
          { required: true, message: '请输入落地页URL', trigger: 'change' },
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
        limit: 1
      }
      this.fetchData()
    },
    resetCreateModel() {
      this.createModel = {
        channel: null,
        url: null
      }
    },

    resetCreateUrlModel() {
      this.createUrlModel = {
        channel_id: null,
        url: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.urlList = null
      getPromoteUrlList()
        .then((res) => {
          this.urlList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.urlName)
            }
          })
          return getPromotionChannelUrl(this.listQuery)
          console.log(
            '数据类型' + this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        //  getPromotionChannelUrl(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
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
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showUpdateUrlClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    showClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示创建弹出窗
    showCreateUrlClick() {
      this.resetCreateUrlModel()
      this.dialogCreateUrlVisible = true
      this.dialogStatus = 'createUrl'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          if (formDic.url == null) {
            this.$message.error('参数错误')
            return
          }
          const params = {
            channel: formDic.channel,
            promoteUrl: formDic.url,
            urlName: formDic.urlName
          }
          this.$confirm('是否创建渠道？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            // 请求网络
            // this.listLoading = true;
            createChannel(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                // this.$notify({
                //   title: "提示",
                //   message: "创建渠道成功",
                //   type: "success",
                //   duration: 1500,
                // });
                this.$alert(nullS('密码为：' + res.data.pwd), '创建渠道成功', {
                  confirmButtonText: '确定',
                  showClose: false,
                  callback: (action) => {}
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          })
        }
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
    },

    // 更改渠道状态
    switchChangeFlag(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      updateChannelFlagdelete(rowDic.id, rowDic.flagDelete)
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
          row.flagDelete = !row.flagDelete
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 新建渠道
    createChannelClick() {
      this.$prompt('渠道名', '新增渠道', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        inputPlaceholder: '请输入渠道名'
      })
        .then(({ value }) => {
          if (emptyS(value)) {
            this.$message({
              message: '渠道名不能为空',
              type: 'warning'
            })
            return
          }

          var valueString = nullS(value)
          const lastStr = valueString.charAt(valueString.length - 1)
          if (!isNaN(lastStr)) {
            this.$message({
              message: '渠道名不能以数字结尾',
              type: 'warning'
            })
            return
          }

          // 请求网络创建
          this.listLoading = true
          createChannelWithName(valueString)
            .then((res) => {
              this.listLoading = false
              const pwd = res.data.pwd || ''
              // 显示密码弹窗
              this.$alert(nullS(pwd), '新增渠道的密码为', {
                confirmButtonText: '确定',
                showClose: false,
                callback: (action) => {
                  this.fetchData()
                }
              })
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 重置渠道密码
    resetChannelPwdClick(row) {
      const rowDic = Object.assign({}, row)
      if (rowDic.id == null || rowDic.id < 0) {
        this.$message.error('参数错误')
        return
      }

      this.$confirm('是否重置该渠道密码？', '提示', {
        confirmButtonText: '重置',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络重置
          this.listLoading = true
          resetChannelPwd(rowDic.id)
            .then((res) => {
              this.listLoading = false
              const pwd = res.data.pwd || ''
              // 显示密码弹窗
              this.$alert(nullS(pwd), '重置后的密码为', {
                confirmButtonText: '确定',
                showClose: false,
                callback: (action) => {}
              })
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // ===========================================================================

    // 显示渠道链接列表
    showChannelUrlClick(row) {
      const rowDic = Object.assign({}, row)
      if (rowDic.id == null || rowDic.id < 0) {
        this.$message.error('参数错误')
        return
      }

      this.channelUrlDrawerTitle = `渠道【${rowDic.channel}】链接列表`
      this.channelUrlDrawerList = null
      this.channelUrlDrawerVisible = true
      this.channelUrlDrawerId = rowDic.id
      this.fetchChannelData()
    },

    // 加载渠道链接列表
    fetchChannelData() {
      if (this.channelUrlDrawerId > 0) {
        this.channelUrlDrawerLoading = true
        // 请求网络

        getPromoteUrlList()
          .then((res) => {
            this.urlList = (res.data.list || []).map((item) => {
              return {
                value: item.id,
                label: nullS(item.urlName)
              }
            })
            return getPromotionChannelUrlList({
              pageSize: this.channelUrlDrawerListQuery.limit,
              pageNum: this.channelUrlDrawerListQuery.page,
              channelId: this.channelUrlDrawerId
            })
            console.log(
              '数据类型' + this.listQuery.limit,
              this.listQuery.page,
              this.listQuery
            )
          })

          .then((res) => {
            this.channelUrlDrawerList = (res.data.list || []).map((item) => {
              this.$set(item, 'edit', false)
              return item
            })
            this.channelUrlDrawerListQuery.total = res.data.total
            this.channelUrlDrawerLoading = false
          })
          .catch((err) => {
            this.channelUrlDrawerList = null
            this.channelUrlDrawerListQuery.total = 0
            this.channelUrlDrawerLoading = false
            this.$message.error(err)
          })
      }
    },

    // 渠道链接每页的条数改变
    handleDrawerSizeChange(val) {
      this.channelUrlDrawerListQuery.limit = val
      this.channelUrlDrawerListQuery.page = 1
      this.fetchChannelData()
    },

    // 渠道链接当前页改变
    handleDrawerCurrentChange(val) {
      this.channelUrlDrawerListQuery.page = val
      this.fetchChannelData()
    },

    // 创建渠道链接
    createChannelUrlClick(val) {
      console.log('数据url' + val)
      if (this.channelUrlDrawerId > 0) {
        this.channelUrlDrawerLoading = true
        createChannelUrl(this.channelUrlDrawerId, val)
          .then((res) => {
            this.$message({
              message: '新增渠道链接成功',
              type: 'success'
            })
            this.channelUrlDrawerLoading = false
            // 刷新数据
            this.dialogCreateUrlVisible = false
            this.dialogCreateUrlLoading = false
            this.channelUrlDrawerListQuery.page = 1
            setTimeout((_) => {
              this.fetchChannelData()
            }, 200)
          })
          .catch((err) => {
            this.channelUrlDrawerLoading = false
            this.dialogCreateUrlLoading = false
            this.$message.error(err)
          })
      } else {
        this.$message({
          message: '参数错误！',
          type: 'warning'
        })
      }
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该渠道？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deletePromotionBase(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除渠道成功',
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
    showDeleteUrlClick(row) {
      const rowDic = Object.assign({}, row)
      if (rowDic.id == null || rowDic.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该Url？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deletePromotionUrl(rowDic.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除Url成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchChannelData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 修改渠道状态
    drawerSwitchChange(row, tag) {
      const rowDic = Object.assign({}, row)
      this.channelUrlDrawerLoading = true
      var params = { id: rowDic.id }
      if (tag === 'filterIp') {
        params['filterIp'] = rowDic.filterIp
      } else if (tag === 'filterUdid') {
        params['filterUdid'] = rowDic.filterUdid
      }

      // 请求网络修改
      updateChannelUrlInfos(params)
        .then((res) => {
          this.channelUrlDrawerLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          if (tag === 'filterIp') {
            row.filterIp = !row.filterIp
          } else if (tag === 'filterUdid') {
            row.filterUdid = !row.filterUdid
          }
          this.channelUrlDrawerLoading = false
          this.$message.error(err)
        })
    },

    // 修改绑定概率
    editChannelUrlRateClick(row) {
      const rowDic = Object.assign({}, row)
      if (rowDic.id == null || rowDic.id < 0) {
        row.edit = false // 恢复原型
        this.$message.error('参数错误')
        return
      }
      this.channelUrlDrawerLoading = true
      // 请求网络修改
      updateChannelUrlInfos({
        id: rowDic.id,
        bindRate: rowDic.bindRate
      })
        .then((res) => {
          row.edit = false
          this.channelUrlDrawerLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch((err) => {
          row.edit = false
          this.channelUrlDrawerLoading = false
          this.$message.error(err)
        })
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
  margin: 20px 0px;
  padding: 0px;
}

.channel-drawer-nav {
  margin: 0px 0px 20px 20px;
}

.channel-drawer-container {
  padding: 0px 20px 0px 20px;
}

.bindRate-box {
  max-width: 80px;
  min-width: 80px;
  padding: 2px 0px;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: #909399;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.span_primary {
  margin-right: 10px;
  color: #FC708B;
  cursor: pointer;
}
</style>

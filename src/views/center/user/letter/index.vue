<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">发送时间:</span>
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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 200px"
          placeholder="请输入发送人ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.destUid"
          size="small"
          style="width: 200px"
          placeholder="请输入接收人ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.content"
          size="small"
          style="width: 200px"
          placeholder="请输入发送内容"
          clearable
          maxlength="1000"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          clearable
          size="small"
          style="width: 150px"
          placeholder="请选择私信类型"
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in logstypeOptions"
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
          @click="fetchData()"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-position"
          type="primary"
          @click="showCreateDialogClick()"
        >发送私信</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="发送人ID" min-width="40">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="发送人信息" min-width="40">
        <template slot-scope="{ row }">
          <span>{{ `${row.uidLevel}级(${row.uidLive}主播)` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收人ID" min-width="40">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.destUid" />
        </template>
      </el-table-column>
      <el-table-column label="接收人信息" min-width="40">
        <template slot-scope="{ row }">
          <span>{{ `${row.destUidLevel}级(${row.destUidLive}主播)` }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="私信类型"
        min-width="40"
      />
      <el-table-column
        prop="content"
        label="发送内容"
        min-width="100"
      />
      <el-table-column
        prop="sendTimeString"
        label="发送时间"
        width="160"
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
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
          <el-form-item label="私信类型">
            <el-col :span="9">
              <el-select
                v-model="createModel.type"
                placeholder="请选择私信类型"
              >
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col v-if="createModel.type === 4" :span="15">
              <!-- 多选家族搜索 -->
              <el-form-item prop="familyId">
                <el-select
                  v-model="createModel.familyId"
                  style="width: 100%"
                  filterable
                  clearable
                  placeholder="请输入或选择家族"
                >
                  <el-option
                    v-for="item in familyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            v-if="createModel.type === 3"
            label="用户ID"
            prop="uid"
          ><el-input
            v-model="createModel.uid"
            clearable
            placeholder="请输入用户ID"
            maxlength="200"
          /></el-form-item>
          <el-form-item label="私信内容" prop="content">
            <el-input
              v-model="createModel.content"
              type="textarea"
              placeholder="请输入私信内容"
              :autosize="{ minRows: 3, maxRows: 8 }"
              maxlength="1000"
              show-word-limit
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
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  getUserLetterList,
  deleteLetter,
  sendLetter
} from '@/api/center/user/letter'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
import { getUserFamilyList } from '@/api/center/user/anchor'
let {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterUserLetterPage',
  filters: {},
  components: {
    UserDrawer
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        destUid: null,
        type: null,
        content: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
        familyId: ''
      },
      logstypeOptions: [
        { value: 1, label: '系统通知' },
        { value: 2, label: '私信' },
        { value: 3, label: '单个用户' },
        { value: 4, label: '单个家族' },
        { value: 5, label: '全部主播' }
      ],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '发送私信'
      },

      // 表单模型
      createModel: {
        uid: 0
      },

      rules: {
        uid: [
          { required: true, message: '请输入用户ID', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入私信内容', trigger: 'change' },
          { min: 1, max: 1000, message: '最多为1000个字符', trigger: 'change' }
        ],
        familyId: [
          {
            required: true,
            message: '请选择需要发送的家族',
            trigger: 'change'
          }
        ]
      },
      types: [
        {
          value: 3,
          label: '单个用户'
        },
        {
          value: 4,
          label: '单个家族'
        },
        {
          value: 5,
          label: '全部主播'
        }
      ],
      familyList: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
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
        limit: 20,
        pickerValue: [NOW_TIME_START, NOW_TIME_END]
      }
      this.fetchData()
    },
    resetCreateModel() {
      this.createModel = {
        uid: 0,
        type: 3,
        content: null
      }
      // 获取家族
      getUserFamilyList().then((res) => {
        this.familyList = (res.data.list || []).map((item) => {
          return {
            value: item.bossId || 0,
            label: nullS(item.familyName)
          }
        })
      })
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true

      getUserLetterList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            let typeName = ''
            if (item.type == '1') {
              typeName = '系统通知'
            } else if (item.type == '2') {
              typeName = '私信'
            } else if (item.type == '3') {
              typeName = '单个用户'
            } else if (item.type == '4') {
              typeName = '单个家族'
            } else if (item.type == '5') {
              typeName = '全部主播'
            }
            this.$set(item, 'typeName', typeName)
            this.$set(item, 'sendTimeString', formatUnixTime(item.sendTime))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
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

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          if (formDic.uid == null || formDic.uid < 0) {
            this.$message.error('参数错误')
            return
          }
          if (formDic.content == null) {
            this.$message.error('参数错误')
            return
          }
          this.$confirm('是否发送私信？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            // 请求网络
            const params = {
              uid: formDic.uid,
              type: formDic.type,
              content: formDic.content
            }
            if (formDic.type === 4) {
              params.uid = formDic.familyId
            }
            sendLetter(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '发送私信成功',
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
          })
        }
      })
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该私信？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteLetter(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除私信成功',
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

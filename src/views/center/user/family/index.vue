<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 家族长ID -->
        <el-input v-model="listQuery.bossId" size="small" style="width: 240px" clearable placeholder="请输入家族长ID"
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <!-- 家族名称 -->
      <el-form-item>
        <el-input v-model="listQuery.familyName" size="small" style="width: 240px" clearable placeholder="请输入家族名称"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>

    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加家族</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="家族长ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.bossId" />
        </template>
      </el-table-column>
      <el-table-column prop="familyName" label="家族名称" min-width="120" />
      <el-table-column prop="bossGiftProfit" label="族长礼物分成" min-width="120" sortable />
      <!--   <el-table-column prop="bossGuardProfit" label="族长守护分成" min-width="80"  ></el-table-column> -->
      <el-table-column prop="anchorGiftProfit" label="主播礼物分成" min-width="120" sortable />
      <!--  <el-table-column prop="anchorGuardProfit" label="主播守护分成" min-width="80"  ></el-table-column> -->
      <el-table-column prop="bossCpProfit" label="族长彩票分成" min-width="120" sortable />
      <el-table-column prop="anchorCpProfit" label="主播彩票分成" min-width="120" sortable />
      <el-table-column prop="anchorPayProfit" label="主播付费分成" min-width="120" sortable />
      <el-table-column prop="bossPayProfit" label="族长付费分成" min-width="120" sortable />
      <el-table-column prop="familyWages" label="家族长分成最低打赏金额" min-width="180" sortable />
      <el-table-column prop="remark" label="备注" min-width="80" />
      <el-table-column prop="createBy" label="创建人" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <span v-if="dialogStatus === 'create'">
            <el-form-item label="家族长ID" prop="bossId">
              <el-input v-model.number="createModel.bossId" clearable placeholder="请输入家族长ID" maxlength="20"
                show-word-limit />
            </el-form-item>
          </span>
          <el-form-item label="家族名称" prop="familyName">
            <el-input v-model="createModel.familyName" clearable placeholder="请输入家族名称" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="族长礼物分成" prop="bossGiftProfit">
            <el-input v-model="createModel.bossGiftProfit" clearable placeholder="请输入族长礼物分成(0.000~1.000)"
              maxlength="5" />
          </el-form-item>
          <el-form-item label="族长彩票分成" prop="bossCpProfit">
            <el-input v-model="createModel.bossCpProfit" clearable placeholder="请输入族长彩票分成(0.0000~0.005)"
              maxlength="10" />
          </el-form-item>
          <el-form-item label="族长付费分成" prop="bossPayProfit">
            <el-input v-model="createModel.bossPayProfit" clearable placeholder="请输入族长付费分成(0.000~1.000)"
              maxlength="5" />
          </el-form-item>

          <el-form-item label="家族长分成最低收到礼物打赏金额，未达到不分成" prop="familyWages">
            <el-input v-model.number="createModel.familyWages" clearable placeholder="请输入家族长分成最低收到礼物打赏金额"
              maxlength="10" />
          </el-form-item>
          <!-- <el-form-item label="族长守护分成" prop="bossGuardProfit">
            <el-input v-model="createModel.bossGuardProfit" clearable placeholder="请输入族长守护分成(0.000~1.000)" maxlength="5" />
          </el-form-item> -->
          <el-form-item label="主播礼物分成" prop="anchorGiftProfit">
            <el-input v-model="createModel.anchorGiftProfit" clearable placeholder="请输入主播礼物分成(0.000~1.000)"
              maxlength="5" />
          </el-form-item>
          <!--  <el-form-item label="主播守护分成" prop="anchorGuardProfit">
            <el-input v-model="createModel.anchorGuardProfit" clearable placeholder="请输入主播守护分成(0.000~1.000)" maxlength="5" />
          </el-form-item> -->
         
          <el-form-item label="主播彩票分成" prop="anchorCpProfit">
            <el-input v-model="createModel.anchorCpProfit" clearable placeholder="请输入主播彩票分成(0.0000~0.005)"
              maxlength="10" />
          </el-form-item>
          <el-form-item label="主播付费分成" prop="anchorPayProfit">
            <el-input v-model="createModel.anchorPayProfit" clearable placeholder="请输入主播付费分成(0.000~1.000)"
              maxlength="5" />
          </el-form-item>
          
          <el-form-item label="备注">
            <el-input v-model="createModel.remark" type="textarea" placeholder="请输入备注说明" maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
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
  getUserFamilyList,
  createUserFamily,
  updateUserFamily,
  deleteUserFamily,
} from '@/api/center/user/family'
import { emptyS, nullS, isFloatAndNumber, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserFamilyPage',
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    var checkProfit = (rule, value, callback) => {
      if (value == null || value == undefined || emptyS(`${value}`)) {
        return callback(new Error('数值不能为空'))
      }
      if (!isFloatAndNumber(`${value}`)) {
        callback(new Error('请输入正确的数值'))
      } else {
        if (parseFloat(`${value}`) >= 0 && parseFloat(`${value}`) <= 1) {
          callback()
        } else {
          callback(new Error('数值在0.000~1.000之间'))
        }
      }
    }
    var checkCpProfit = (rule, value, callback) => {
      if (value == null || value == undefined || emptyS(`${value}`)) {
        return callback(new Error('数值不能为空'))
      }
      if (!isFloatAndNumber(`${value}`)) {
        callback(new Error('请输入正确的数值'))
      } else {
        if (parseFloat(`${value}`) >= 0 && parseFloat(`${value}`) <= 0.005) {
          callback()
        } else {
          callback(new Error('数值在0.0000~0.005之间'))
        }
      }
    }
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        bossId: null,
        familyName: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加家族',
        update: '编辑家族',
      },

      // 表单模型
      createModel: {
        bossId: 0,
        familyName: null,
        remark: null,
        bossGiftProfit: 0.0,
        anchorGiftProfit: 0.0,
        bossGuardProfit: 0.0,
        anchorGuardProfit: 0.0,
        anchorPayProfit: 0.0,
        bossPayProfit: 0.0,
        familyWages: 0.0
      },

      // 验证规则
      rules: {
        bossId: [
          { required: true, message: '请输入家族长ID' },
          { type: 'number', message: '请输入正确的数值' },
        ],
        familyName: [
          { required: true, message: '请输入家族名称', trigger: 'change' },
          { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' },
        ],
        familyWages: [{ type: 'number', message: '请输入正确的数值' }],
        bossGiftProfit: [{ validator: checkProfit, trigger: 'change' }],
        // bossGuardProfit: [{ validator: checkProfit, trigger: 'change' }],
        anchorGiftProfit: [{ validator: checkProfit, trigger: 'change' }],
        // anchorGuardProfit: [{ validator: checkProfit, trigger: 'change' }],
        bossCpProfit: [{ validator: checkCpProfit, trigger: 'change' }],
        anchorCpProfit: [{ validator: checkCpProfit, trigger: 'change' }],
        anchorPayProfit: [{ validator: checkProfit, trigger: 'change' }],
        bossPayProfit: [{ validator: checkProfit, trigger: 'change' }],
      },
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
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        bossId: 0,
        familyName: null,
        remark: null,
        bossGiftProfit: 0.0,
        anchorGiftProfit: 0.0,
        bossGuardProfit: 0.0,
        anchorGuardProfit: 0.0,
        bossCpProfit: 0.0,
        anchorCpProfit: 0.0,
        anchorPayProfit: 0.0,
        bossPayProfit: 0.0,
        familyWages: 0.0
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getUserFamilyList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery.bossId,
        this.listQuery.familyName
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.gmtCreate))
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

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.bossId == null || row.bossId < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该家族？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteUserFamily(row.bossId)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除家族成功',
                type: 'success',
                duration: 1500,
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
          const anchorGiftProfit = formDic.anchorGiftProfit || 0
          const anchorGuardProfit = formDic.anchorGuardProfit || 0
          const bossGiftProfit = formDic.bossGiftProfit || 0
          const bossGuardProfit = formDic.bossGuardProfit || 0
          const bossCpProfit = formDic.bossCpProfit || 0
          const anchorCpProfit = formDic.anchorCpProfit || 0
          const anchorPayProfit = formDic.anchorPayProfit || 0
          const bossPayProfit = formDic.bossPayProfit || 0
          const familyWages = formDic.familyWages || 0
          // 分成做校验，不能超过1
          if (anchorGiftProfit + bossGiftProfit > 1) {
            this.$message({
              message: '礼物分成总和不能超过1',
              type: 'warning',
            })
            return
          }
          if (anchorGuardProfit + bossGuardProfit > 1) {
            this.$message({
              message: '守护分成总和不能超过1',
              type: 'warning',
            })
            return
          }
          if (anchorPayProfit + bossPayProfit > 1) {
            this.$message({
              message: '付费分成总和不能超过1',
              type: 'warning',
            })
            return
          }

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            bossId: formDic.bossId || 0,
            familyName: nullS(formDic.familyName),
            remark: nullS(formDic.remark),
            anchorGiftProfit: anchorGiftProfit,
            anchorGuardProfit: anchorGuardProfit,
            bossGiftProfit: bossGiftProfit,
            bossGuardProfit: bossGuardProfit,
            bossCpProfit: bossCpProfit,
            anchorCpProfit: anchorCpProfit,
            anchorPayProfit: anchorPayProfit,
            bossPayProfit: bossPayProfit,
            familyWages
          }
          if (this.dialogStatus === 'create') {
            createUserFamily(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建家族成功',
                  type: 'success',
                  duration: 1500,
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
            updateUserFamily(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改家族成功',
                  type: 'success',
                  duration: 1500,
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
  },
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
  margin: 20px 0px 20px 0px;
  padding: 0px;
}
</style>

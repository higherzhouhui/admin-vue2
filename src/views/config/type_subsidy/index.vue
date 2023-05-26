<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.anchorType"
          size="small"
          placeholder="请选择主播类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 筛选状态 -->
      <!-- <span style="margin-right: 10px;"></span> -->
      <el-form-item>
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
      <!-- <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showUpdateUrlClick()">修改渠道url</el-button> -->
    </el-form>
    <el-form>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
        >新增类型工资</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="typeName"
        label="主播类型"
        min-width="120"
      />
      <el-table-column
        prop="subsidy"
        label="工资"
        min-width="80"

        sortable
      />
      <el-table-column
        prop="normalTime"
        label="主播每日要求时长(小时)"
        min-width="160"
      />
      <el-table-column
        prop="lessGiftGold"
        label="最低打赏金额"
        min-width="120"

        sortable
      />
      <el-table-column
        prop="familyAgencyFee"
        label="家族长中介费"
        min-width="120"

        sortable
      />
      <el-table-column
        prop="dayRank"
        label="是否参与日榜补贴"
        min-width="130"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.dayRank == 1 ? 'success' : 'info'">
            {{ row.dayRank == 1 ? "参与" : "不参与" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
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
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >编辑</span>
          <span
            class="operation_btn"
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
          <el-form-item label="主播类型">
            <el-select
              v-model="createModel.anchorType"
              placeholder="请--选--择 "
            >
              <el-option
                v-for="item in typeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :v-model="createModel.anchorType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工资(THB)" prop="subsidy">
            <el-input
              v-model="createModel.subsidy"
              clearable
              placeholder="请输入工资"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="主播每日要求时长(小时)" prop="normalTime">
            <el-input
              v-model="createModel.normalTime"
              clearable
              placeholder="请输入时长"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item
            label="最低收到礼物打赏金额（未达到工资不发放）"
            prop="lessGiftGold"
          >
            <el-input
              v-model="createModel.lessGiftGold"
              clearable
              placeholder="请输入最低打赏金额"
              maxlength="200"
            />
          </el-form-item>
          <el-form-item label="家族长中介费设置" prop="familyAgencyFee">
            <el-input
              v-model="createModel.familyAgencyFee"
              clearable
              placeholder="请输入中介费金额"
            />
          </el-form-item>
          <el-form-item label="是否参与日榜补贴" prop="dayRank">
            <el-switch
              v-model="createModel.dayRank"
              active-text="参与"
              inactive-text="不参与"
              :active-value="1"
              :inactive-value="0"
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
  </div>
</template>

<script>
import {
  getTypeSubsidyList,
  updateTypeSubsidy,
  deleteTypeSubsidy,
  createTypeSubsidy,
  getTypeList
} from '@/api/config/type_subsidy'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'AnchorTypeSubsidyController',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        anchorType: null,
        subsidy: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogStatus: '',
      dialogTitleMap: {
        create: '新增主播类型工资配置',
        update: '修改主播类型工资配置'
      },

      // 表单模型
      createModel: {},

      typeList: null,
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
        limit: 20,
        page: 1
      }
      this.fetchData()
    },
    resetCreateModel() {
      this.createModel = {
        anchorType: null,
        subsidy: null,
        normalTime: null,
        lessGiftGold: null,
        familyAgencyFee: null,
        dayRank: 0
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.typeList = null
      getTypeList()
        .then((res) => {
          this.typeList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.typeName)
            }
          })
          return getTypeSubsidyList(this.listQuery)
          console.log(
            '数据类型' + this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.gmtCreate))
            this.$set(item, 'updateTimeString', formatUnixTime(item.gmtUpdate))
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

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          if (formDic.anchorType == null) {
            this.$message.error('参数错误')
            return
          }
          const params = {
            anchorType: formDic.anchorType,
            subsidy: formDic.subsidy,
            normalTime: formDic.normalTime,
            lessGiftGold: formDic.lessGiftGold,
            familyAgencyFee: formDic.familyAgencyFee,
            dayRank: formDic.dayRank
          }

          if (this.dialogStatus === 'create') {
            this.$confirm('是否创建主播类型工资配置？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false
            }).then(() => {
              // 请求网络
              // this.listLoading = true;
              createTypeSubsidy(params)
                .then((res) => {
                  this.dialogCreateLoading = false
                  this.dialogCreateVisible = false
                  this.$notify({
                    title: '提示',
                    message: '创建主播类型工资配置成功',
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
          } else {
            params['id'] = formDic.id || 0
            updateTypeSubsidy(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改主播类型工资成功',
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

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该类型工资的配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteTypeSubsidy(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除类型工资配置成功',
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
</style>

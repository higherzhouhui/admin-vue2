<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加排序</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="fetchData"
        >刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="种类" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{ row.type == 1 ? '置底' : '排序' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" min-width="120" />
      <el-table-column label="用户头像" width="120">
        <template slot-scope="{ row }">
          <el-avatar size="medium" shape="square" :src="row.avatar" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建 弹窗 -->
    <el-dialog title="新建房间排序" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="用户ID" prop="uid"><el-input v-model.number="createModel.uid" clearable placeholder="请输入用户ID" maxlength="20" /></el-form-item>
          <el-form-item label="排序种类">
            <el-switch v-model="createModel.type" active-text="置底" :active-value="1" inactive-text="排序" :inactive-value="0" />
          </el-form-item>
          <span v-if="createModel.type === 0">
            <el-form-item label="排序号" prop="sort"><el-input v-model.number="createModel.sort" clearable placeholder="请输入排序号" maxlength="4" /></el-form-item>
          </span>
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
import { getLiveRoomSortList, createLiveRoomSort, deleteLiveRoomSort } from '@/api/live/room_sort'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'LiveRoomSortController',
  filters: {
    typeFilter(status) {
      const map = { 0: '', 1: 'warning' }
      return map[status]
    }
  },
  components: {
    UserDrawer
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        uid: null,
        type: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      // 表单模型
      createModel: {
        uid: 0,
        sort: 1,
        type: 0
      },
      // 验证规则
      rules: {
        uid: [{ required: true, message: '请输入用户ID' }, { type: 'number', message: '请输入正确的用户ID' }],
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getLiveRoomSortList(this.listQuery.uid, this.listQuery.type)
        .then(res => {
          const list = res.data
          this.list = Array.isArray(list) ? list : []
          this.listLoading = false
        })
        .catch(err => {
          this.list = null
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.createModel = {
        uid: 0,
        sort: 1,
        type: 0
      }
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.uid == null || row.uid < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该排序？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteLiveRoomSort({
            uid: row.uid,
            type: row.type
          })
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
              setTimeout(_ => {
                this.fetchData()
              }, 200)
            })
            .catch(err => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(_ => {})
    },

    // 创建 数据
    handleDataClick() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          var params = {
            uid: formDic.uid || 0,
            type: formDic.type
          }
          if (formDic.type == 0) {
            params['sort'] = formDic.sort
          }
          console.error(JSON.stringify(params))
          createLiveRoomSort(params)
            .then(res => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '创建排序成功',
                type: 'success',
                duration: 1500
              })
              setTimeout(_ => {
                this.fetchData()
              }, 200)
            })
            .catch(err => {
              this.dialogCreateLoading = false
              this.$message.error(err)
            })
        }
      })
    },

    // 过滤
    handleSearchFilter() {
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
  margin: 20px 0px;
  padding: 0px;
}
</style>

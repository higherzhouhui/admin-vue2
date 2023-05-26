<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            @click="update()"
          >
            全部更新
          </el-button>
        </el-form-item>
        <el-form-item>
          <a v-if="jsonUrl" :href="jsonUrl" download>下载JSON文件</a>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      ref="multipleTable"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="80" />
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="resLabel" label="资源类型" min-width="100" />
      <el-table-column prop="label" label="子类型" min-width="100" />
      <el-table-column prop="" label="操作" width="80">
        <template slot-scope="{ row }">
          <span class="operation_btn" @click="update(row)">更新</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { updateResourceVersion } from '@/api/versionManage/index'
export default {
  name: 'VersionManage',
  data() {
    return {
      list: [
        { resourceType: 1, detailType: 1, resLabel: '非实时数据', label: '游戏列表' },
        { resourceType: 1, detailType: 2, resLabel: '非实时数据', label: '活动列表' },
        { resourceType: 1, detailType: 3, resLabel: '非实时数据', label: '广告列表' },
        { resourceType: 1, detailType: 4, resLabel: '非实时数据', label: '直播间快捷评论' },
        { resourceType: 2, detailType: 1, resLabel: '静态资源', label: '游戏图标' },
        { resourceType: 2, detailType: 2, resLabel: '静态资源', label: '徽章图标' },
        { resourceType: 2, detailType: 3, resLabel: '静态资源', label: '礼物文件' },
        // { resourceType: 2, detailType: 4, resLabel: '静态资源', label: '座驾文件' },
        { resourceType: 2, detailType: 5, resLabel: '静态资源', label: '活动图片' },
        { resourceType: 2, detailType: 6, resLabel: '静态资源', label: '游戏列表' },
        { resourceType: 2, detailType: 7, resLabel: '静态资源', label: '道具图片' },
        { resourceType: 2, detailType: 8, resLabel: '静态资源', label: '等级特效列表' },
        { resourceType: 2, detailType: 9, resLabel: '静态资源', label: 'banner图片' }
      ],
      listLoading: false,
      multipleSelection: [],
      jsonUrl: ''
    }
  },
  created() {
  },
  methods: {
    // 获取列表数据
    async update(row) {
      console.log(this.multipleSelection)
      if (!row && !this.multipleSelection.length) {
        this.$message.warning('请选择要更新的资源!')
        return
      }
      this.$confirm('将通知客户端获取最新资源', '确认更新版本文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(async() => {
          this.listLoading = true
          if (row) {
            const updateObj = {
              resourceType: row.resourceType,
              detailType: row.detailType
            }
            updateResourceVersion(updateObj).then(res => {
              this.listLoading = false
              if (res.code === 200) {
                this.jsonUrl = res.data
                this.$notify({
                  title: '提示',
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              this.$message.error(err)
              this.listLoading = false
            })
          } else {
            const updateObj1 = {
              resourceType: 1,
              detailType: []
            }
            const updateObj2 = {
              resourceType: 2,
              detailType: []
            }
            this.multipleSelection.forEach(item => {
              if (item.resourceType === 1) {
                updateObj1.detailType.push(item.detailType)
              } else {
                updateObj2.detailType.push(item.detailType)
              }
            })
            try {
              if (updateObj1.detailType.length) {
                await updateResourceVersion({
                  resourceType: 1,
                  detailType: updateObj1.detailType.join(',')
                })
              }
              if (updateObj2.detailType.length) {
                await updateResourceVersion({
                  resourceType: 2,
                  detailType: updateObj2.detailType.join(',')
                })
              }
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success'
              })
            } catch (err) {
              this.$message.error(err)
              this.listLoading = false
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消更新'
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
}
</script>

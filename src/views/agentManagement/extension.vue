<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-tag type="info">代理ID:</el-tag> -->
        <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
          maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">代理账号:</el-tag> -->
        <el-input v-model="listQuery.agentAccount" size="small" class="input-with-select" placeholder="请输入代理账号"
          clearable maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">状态:</el-tag> -->
        <el-select v-model="listQuery.domainStatus" clearable placeholder="请选状态" class="input-with-select" size="small"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.parentAccount" size="small" class="input-with-select" placeholder="请输入上级账号"
          clearable maxlength="50" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit
      highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <el-table-column prop="agentIdX" label="代理ID">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" />
      <el-table-column prop="agentLevel" label="代理级别" :formatter="formatterType" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="parentAccount" label="上级代理">
        <template slot-scope="{ row }">
          {{
            row.parentAccount == null || row.parentAccount == undefined
              ? "总代"
              : row.parentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column prop="defaultAgentName" label="通用推广链接" min-width="200">
        <template slot-scope="{ row }">
          <div>
            <p v-for="(item, index) in (row.otherDomain || '').split('|')" :key="index">
              {{ item }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="defaultCname" label="绑定网关IP/cname域名" width="200">
        <template slot-scope="{ row }">
          <div>
            <p v-for="(item, index) in (row.otherCname || '').split('|')" :key="index">
              {{ item }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="privateDomains" label="绑定私有域名" min-width="200">
        <template slot-scope="{ row }">
          <div>
            <!-- <div style="color: #ff0000">{{ row.defaultAgentName }}(平台)</div> -->
            <!-- <div v-if="row.privateDomainsDemo[0] !== undefined">
              <div
                v-for="(item, index) in row.privateDomainsDemo"
                :key="index"
                style="color: #00cc00"
              >
                {{ item }}(私有)
              </div>
            </div> -->
            <p v-for="(item, index) in row.privateDomainList" :key="index" style="color: #00cc00">
              {{ item }}
            </p>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" width="80"  >
        <template slot-scope="{ row }">
          <el-tag
            v-if="row.domainStatus"
            size="medium"
            :type="row.domainStatus == 1 ? 'success' : 'danger'"
            >{{ row.domainStatus == 1 ? "正常" : "禁用" }}</el-tag
          >
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="success" plain size="mini" @click="showUpdateDindingClick(row)">绑定域名</span>
          <!-- <el-button
            v-if="row.domainStatus && row.domainStatus == 1"
            @click="showUpdateDialogClick(row, 0)"
            type="danger"
            plain
            size="mini"
            >禁用</el-button
          >
          <el-button
            v-if="row.domainStatus && row.domainStatus == 0"
            @click="showUpdateDialogClick(row, 1)"
            type="danger"
            plain
            size="mini"
            >启用</el-button
          > -->
          <!-- <el-button
            @click="showUpdateDialogClick(row)"
            type="primary"
            plain
            size="mini"
            >分享二维码</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <!-- 绑定 -->
    <el-dialog title="域名绑定" :visible.sync="extension" :close-on-click-modal="false" :destroy-on-close="true" top="5vh"
      width="550px">
      <div v-cloading="actionLoading" style="width: 100%; max-height: 400px; overflow: auto; padding-right: 15px;">
        <div style="color: red; margin-bottom: 15px">
          请把您要绑定的域名在DNS服务后台先做域名解析到该IP或CNAME到该域名
        </div>
        <el-form ref="dataForm2" label-position="top" label-width="150px" size="medium">
          <el-form-item prop="defaultCname" label="网关IP/cname域名:">
            <el-select v-model="cnameId" placeholder="请选择域名" @change="onselectChange">
              <el-option v-for="(item, index) in cnameOptions || []" :key="index" :label="item.cname"
                :value="item.cnameId" />
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, index) in privatesObj[cnameId]" :key="index" prop="privateDomain" label="绑定私有域名:">
            <div style="display: flex; align-items: center">
              <el-input v-model="item.privateDomain" clearable placeholder="请输入私有域名" maxlength="30" />
              <el-button icon="el-icon-plus" style="margin-left: 10px" @click="adds" />
              <el-button v-if="privatesObj[cnameId].length > 1" icon="el-icon-minus" style="margin-left: 10px"
                @click="deletes(index)" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="extension = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="actionLoading" @click="handleDataClick2()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  promotionDoMainList,
  promotionDoMainDind,
  getCnameIpInfo,
  getPrivateDomainByCname,
} from '@/api/agentManagement/extension'

export default {
  name: 'AgentManagementExtension',
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      extension: false,
      dialogCreateLoading: false,
      extensionData: {},
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
        }
      },
      privatesObj: {},
      agentId: null,
      cnameId: null,
      cname: null,
      cnameOptions: [],
      createModelFut() {
        this.privatesObj = {}
        this.agentId = ''
        this.cnameId = ''
        this.cname = ''
        this.cnameOptions = ''
      },
      operator: this.$store.state.user.name,
      actionLoading: true,
    }
  },
  created() {
    this.fetchData()
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name;
    //   }
    // });
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === '商户名称') {
        return 'color:#42b983'
      }
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      promotionDoMainList(this.listQuery)
        .then((item) => {
          const result = item.rows || []
          result.map((ritem) => {
            ritem.privateDomainList = []
            if (ritem.privateDomains) {
              ;(ritem.privateDomains || '').split('|').map((pitem) => {
                if (pitem && ritem.bindCname) {
                  ritem['privateDomainList'].push(
                    `${pitem}(${ritem.bindCname})`
                  )
                }
              })
            }
          })
          // 将相同agentId数据合并
          const newResult = []
          const idsArray = []
          for (let i = 0; i < result.length; i++) {
            const idx = idsArray.indexOf(result[i].agentId)
            if (idx === -1) {
              idsArray.push(result[i].agentId)
              newResult.push(result[i])
            } else {
              newResult[idx].privateDomainList = newResult[
                idx
              ].privateDomainList.concat(result[i].privateDomainList)
            }
          }
          this.todayListLoading = false
          this.listLoading = false
          this.list = newResult
          this.listQuery.total = item.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 新增私有域名框
    adds() {
      this.privatesObj[this.cnameId] = [
        ...this.privatesObj[this.cnameId],
        { canme: this.cname, cnameId: this.cnameId, privateDomain: '' },
      ]
      this.privatesObj = { ...this.privatesObj }
    },
    // 删除
    deletes(cindex) {
      // 为防止空全删除了，按照下标删除
      const newContent = this.privatesObj[this.cnameId].filter(
        (_item, index) => {
          return index !== cindex
        }
      )
      this.privatesObj[this.cnameId] = newContent
      this.privatesObj = { ...this.privatesObj }
    },
    // 绑定确认
    handleDataClick2() {
      let privateDomainArray = []
      this.actionLoading = true
      Object.keys(this.privatesObj).map((key) => {
        const list = this.privatesObj[key]
        const havePrivateArray = list.filter((item) => {
          return item.privateDomain !== ''
        })
        if (havePrivateArray.length > 0) {
          privateDomainArray = privateDomainArray.concat(havePrivateArray)
        } else {
          privateDomainArray.push(list[0])
        }
      })
      privateDomainArray.map((item) => {
        item.operator = this.operator
        item.agentId = this.agentId
      })
      try {
        promotionDoMainDind(privateDomainArray)
          .then((item) => {
            this.actionLoading = false
            if (item.code === 200) {
              this.$message({
                type: 'success',
                message: '绑定成功',
              })
              this.extension = false
              this.fetchData()
              this.createModelFut()
            }
          })
          .catch((err) => {
            this.actionLoading = false
            this.$message({
              type: 'error',
              message: err.msg,
            })
          })
      } catch (err) {
        this.actionLoading = false
        this.$message({
          type: 'error',
          message: err.msg,
        })
      }
    },
    onselectChange(cnameId) {
      let isExistence = false
      Object.keys(this.privatesObj).map((key) => {
        // eslint-disable-next-line eqeqeq
        if (key == cnameId) {
          this.cname = this.privatesObj[key][0].cname
          isExistence = true
        }
      })
      if (!isExistence) {
        this.actionLoading = true
        this.privatesObj[cnameId] = [
          { cname: this.cname, cnameId, privateDomain: '' },
        ]
        this.privatesObj = { ...this.privatesObj }
        getPrivateDomainByCname({ agentId: this.agentId, cnameId: cnameId })
          .then((cres) => {
            this.actionLoading = false
            if (cres.data && cres.data.length) {
              this.cname = cres.data[0].cname
              this.privatesObj[cnameId] = cres.data
              this.privatesObj = { ...this.privatesObj }
            }
          })
          .catch(() => {
            this.actionLoading = false
          })
      }
    },
    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchData()
    },

    // 绑定
    showUpdateDindingClick(row) {
      this.agentId = row.agentId
      this.privatesObj = {}
      this.privatesObj = { ...this.privatesObj }
      this.cnameOptions = []
      this.cnameId = ''
      this.extension = true
      this.actionLoading = true
      getCnameIpInfo(row.groupId).then((res) => {
        this.actionLoading = false
        if (res.data) {
          this.cnameOptions = res.data || []
          if (this.cnameOptions.length) {
            this.cname = res.data[0].cname
            const cnameId = res.data[0].cnameId
            this.cnameId = cnameId
            this.privatesObj[this.cnameId] = [
              { cname: this.cname, cnameId, privateDomain: '' },
            ]
            this.privatesObj = { ...this.privatesObj }
            this.actionLoading = true
            getPrivateDomainByCname({ agentId: row.agentId, cnameId: cnameId })
              .then((cres) => {
                this.actionLoading = false
                if (cres.data && cres.data.length) {
                  this.privatesObj[this.cnameId] = cres.data || []
                  this.privatesObj = { ...this.privatesObj }
                }
              })
              .catch(() => {
                this.actionLoading = false
              })
          }
        }
      })
    },
    // 更改状态
    showUpdateDialogClick(row) {},
    formatterType(row) {
      if (row.agentLevel === 1) {
        return '总代'
      } else if (row.agentLevel === 2) {
        return '一级代理'
      } else if (row.agentLevel === 3) {
        return '二级代理'
      } else if (row.agentLevel === 4) {
        return '三级代理'
      } else if (row.agentLevel === 5) {
        return '四级代理'
      }
    },
  },
}
</script>
<style scoped>
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
.input-with-select {
  background-color: #fff;
  width: auto;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>

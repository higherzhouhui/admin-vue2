<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 主播类型 -->
      <el-form-item>
        <el-select
          v-model="listQuery.goldMedal"
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

      <!-- <el-select size="medium" v-model="listQuery.goldMedal" placeholder="请选择主播类型" clearable @change="handleSearchFilter">
          <el-option v-for="item in goldOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select> -->
      <el-form-item>
        <!-- 搜索主播ID框 -->
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入主播ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- 多选家族搜索 -->
      <el-form-item>
        <el-select
          v-model="listQuery.familyId"
          size="small"
          style="width: 300px"
          multiple
          filterable
          clearable
          placeholder="请输入或选择家族"
          @clear="handleSearchFilter"
        >
          <el-option
            v-for="item in familyList"
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
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reloadData()"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="主播ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="主播昵称"
        min-width="110"
      />
      <!--     <el-table-column label="主播类型" width="120"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.goldMedal | goldMedalFilter">{{ row.goldMedalString }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="goldMedalString"
        label="主播类型"
        min-width="120"
      />
      <el-table-column label="主播状态" width="140">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.playStatus"
            :width="30"
            active-text="正式"
            :active-value="1"
            inactive-text="试播"
            :inactive-value="0"
            @change="changeAnchorPlayStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="主播标签" min-width="200">
        <template slot-scope="{ row }">
          <span v-if="row.tagList.length > 0">
            <el-tag
              v-for="tag in row.tagList"
              :key="tag.key"
              style="margin: 5px 5px 0px 0px"
              size="small"
              :closable="false"
              :disable-transitions="false"
            >{{ tag.label }}</el-tag>
          </span>
          <span v-else>暂无标签</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="liveRoomLabel"
        label="直播间标签"
        min-width="80"
      />
      <el-table-column
        prop="familyName"
        label="家族名称"
        min-width="80"
      />
      <el-table-column
        prop="gmtUpdateString"
        label="更新时间"
        width="140"
      />
      <el-table-column
        label="操作"
        width="70"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="changeGoldMedalClick(row)">修改类型</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="changeFamilyClick(row)">修改家族</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="changeTagClick(row)">修改标签</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="changeLiveLableClick(row)">修改直播间标签</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="cancelAuthClick(row)">
                  取消认证
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button-group>
            <span
              class="operation_btn"
              type="primary"
              size="mini"
              @click="changeGoldMedalClick(row)"
            >类型</span>
            <span
              class="operation_btn"
              type="primary"
              size="mini"
              @click="changeFamilyClick(row)"
            >家族</span>
            <span
              class="operation_btn"
              type="primary"
              size="mini"
              @click="changeTagClick(row)"
            >标签</span>
            <span
              class="operation_btn"
              type="primary"
              size="mini"
              @click="changeLiveLableClick(row)"
            >直播间标签</span>
            <span
              class="operation_btn"
              type="danger"
              size="mini"
              @click="cancelAuthClick(row)"
            >取消认证</span>
          </el-button-group> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 更改主播标签 弹窗 -->
    <el-dialog
      title="更改主播标签"
      :visible.sync="dialogTagVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogTagLoading" style="width: 100%; height: 100%">
        <el-select
          v-model="dialogTagValue"
          style="width: 100%"
          filterable
          clearable
          multiple
          placeholder="请输入或选择标签(可不选)"
        >
          <el-option
            v-for="item in dialogTagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogTagVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="commitEditAnchorTagClick()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 更改主播家族 弹窗 -->
    <el-dialog
      title="更改主播家族"
      :visible.sync="dialogFamilyVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogFamilyLoading" style="width: 100%; height: 100%">
        <el-select
          v-model="dialogFamilyValue"
          style="width: 100%"
          filterable
          placeholder="请输入或选择一个家族"
        >
          <el-option
            v-for="item in dialogFamilyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogFamilyVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="commitEditAnchorFamilyClick()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 更改主播类型 弹窗 -->
    <el-dialog
      title="更改主播类型"
      :visible.sync="dialogGoldVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogGoldLoading" style="width: 100%; height: 100%">
        <!--  <el-select v-model="dialogGoldValue" style="width: 100%;" placeholder="请选择一个状态">
          <el-option v-for="item in goldOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select> -->

        <el-select v-model="dialogGoldValue" placeholder="请--选--择 ">
          <el-option
            v-for="item in typeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
            :v-model="dialogGoldValue"
          />
        </el-select>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogGoldVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="commitEditAnchorGoldClick()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 更改直播间标签 弹窗 -->
    <el-dialog
      title="更改直播间标签"
      :visible.sync="dialogLiveLabelVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogLiveLableLoading" style="width: 100%; height: 100%">
        <el-input v-model="liveRoomLabel" placeholder="请输入直播间标签 " />
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogLiveLabelVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="commitLiveRoomLabelClick()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserAnchorList,
  updateUserAnchor,
  updateUserAnchorTags,
  getUserAnchorAuthList,
  cancelAnchorAuth,
  getUserFamilyList,
  getTypeList,
  updateAnchor
} from '@/api/center/user/anchor'
import { getAnchorTagList } from '@/api/config/tag'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserAnchorPage',
  filters: {
    goldMedalFilter(status) {
      const map = { 0: 'info', 1: 'warning', 2: '' }
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
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        goldMedal: null,
        familyId: null
      },
      familyList: null,
      goldOptions: [
        { label: '普通主播', value: 0 },
        { label: '金牌主播', value: 1 },
        { label: '纯提成主播', value: 2 }
      ],

      typeList: null,

      // 弹窗数值
      dialogId: null,
      // 标签
      dialogTagVisible: false,
      dialogTagLoading: false,
      dialogTagValue: [],
      dialogTagOptions: [],
      // 家族
      dialogFamilyVisible: false,
      dialogFamilyLoading: false,
      dialogFamilyValue: null,
      dialogFamilyOptions: [],
      // 类型
      dialogGoldVisible: false,
      dialogGoldLoading: false,
      dialogGoldValue: null,
      // 直播间标签
      liveRoomLabel: '',
      dialogLiveLabelVisible: false,
      dialogLiveLableLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = null
      this.familyList = null
      this.typeList = null
      this.listLoading = true
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        goldMedal: null,
        familyId: null
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      var anchorTags = []
      // 获取主播标签
      getAnchorTagList()
        .then((res) => {
          const customTags = (res.data.list || []).filter(
            (item) => item.type != 1 && item.type != 2
          )
          anchorTags = customTags.map((item) => {
            return {
              id: item.id || 0,
              type: item.type || 0,
              name: nullS(item.name)
            }
          })

          // 获取家族列表
          return getUserFamilyList()
        })
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName)
            }
          })

          return getTypeList()
        })
        .then((res) => {
          this.typeList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.typeName)
            }
          })
          return getUserAnchorList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery.goldMedal,
            this.listQuery.uid,
            this.listQuery.familyId
          )
        })

      // 获取已认证的主播列表

        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var familyName = '暂无家族'
            for (const family of this.familyList) {
              if (family.value == item.familyId) {
                familyName = family.label
                break
              }
            }
            var goldMedalString = ''

            for (const anchorType of this.typeList) {
              if (anchorType.value == item.goldMedal) {
                goldMedalString = anchorType.label
                break
              }
            }

            // switch (item.goldMedal) {
            //   case 0:
            //     goldMedalString = '普通主播';
            //     break;
            //   case 1:
            //     goldMedalString = '金牌主播';
            //     break;
            //   case 2:
            //     goldMedalString = '纯提成主播';
            //     break;
            //   default:
            //     break;
            // }
            this.$set(item, 'familyName', familyName)
            this.$set(item, 'goldMedalString', goldMedalString)
            this.$set(
              item,
              'tagList',
              this.handeAnchorTags(item.tag, anchorTags)
            )
            this.$set(item, 'gmtUpdateString', formatUnixTime(item.gmtUpdate))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.familyList = null
          this.$message.error(err)
        })
    },

    // 处理标签(为了获取实时数据，所以不直接从data中赋值读取)
    handeAnchorTags(tags, anchorTags) {
      var tagKVList = []
      if (
        !emptyS(`${tags}`) &&
        anchorTags != null &&
        Array.isArray(anchorTags)
      ) {
        const tagArray = nullS(`${tags}`).split(',')
        if (Array.isArray(tagArray)) {
          // eg: 1,2,3
          for (const tag of tagArray) {
            if (tag > 0 && tag != 1 && tag != 2) {
              // 拼数组 eg: [{k:v},{k:v},{k:v}]
              for (const item of anchorTags) {
                if (item.type == tag) {
                  tagKVList.push({ key: item.type, label: item.name })
                }
              }
            }
          }
        }
      }
      return tagKVList
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

    // 取消认证
    cancelAuthClick(row) {
      const id = row.id || 0
      if (id == null || id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否取消该主播认证', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          this.listLoading = true
          // cancelAnchorAuth([id])
          cancelAnchorAuth(id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '取消认证成功',
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

    // 更改主播试播状态
    changeAnchorPlayStatus(row) {
      this.listLoading = true
      // 请求网络
      updateUserAnchor({
        id: row.id,
        playStatus: row.playStatus
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
          row.playStatus = !row.playStatus
          this.listLoading = false
          this.$message.error(err)
        })
    },

    /**
     * ----------------------- 弹窗 -----------------------
     */

    // 更改标签
    changeTagClick(row) {
      this.dialogTagLoading = true
      this.dialogTagVisible = true
      this.dialogTagValue = []
      this.dialogTagOptions = []
      this.dialogId = row.id || 0

      // 网络请求
      getAnchorTagList()
        .then((res) => {
          for (const item of res.data.list || []) {
            for (const rowTag of row.tagList || []) {
              if (rowTag.key == item.type) {
                this.dialogTagValue.push(item.type)
                break
              }
            }

            if (item.type != 1 && item.type != 2) {
              this.dialogTagOptions.push({
                value: item.type || 0,
                label: nullS(item.name)
              })
            }
          }
          this.dialogTagLoading = false
        })
        .catch((err) => {
          this.dialogTagLoading = false
          this.$message.error(err)
        })
    },
    changeLiveLableClick(row) {
      this.dialogLiveLabelLoading = true
      this.dialogLiveLabelVisible = true
      this.dialogId = row.id || 0
      this.liveRoomLabel = row.liveRoomLabel
    },
    commitLiveRoomLabelClick() {
      // if (this.liveRoomLabel == null || this.liveRoomLabel == "") {
      //   this.$message.error("参数错误");
      //   return;
      // }
      this.dialogLiveLabelLoading = true
      // 请求网络
      updateAnchor({
        id: this.dialogId,
        liveRoomLabel: this.liveRoomLabel
      })
        .then((res) => {
          this.dialogLiveLabelLoading = false
          this.dialogLiveLabelVisible = false
          this.$notify({
            title: '提示',
            message: '修改直播间标签成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.dialogLiveLabelLoading = false
          this.$message.error(err)
        })
    },

    // 提交更改主播标签
    commitEditAnchorTagClick() {
      if (this.dialogId == null || this.dialogId < 0) {
        this.$message.error('参数错误')
        return
      }
      this.dialogTagLoading = true
      // 请求网络
      updateUserAnchorTags(this.dialogId, this.dialogTagValue)
        .then((res) => {
          this.dialogTagLoading = false
          this.dialogTagVisible = false
          this.$notify({
            title: '提示',
            message: '修改主播标签成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.dialogTagLoading = false
          this.$message.error(err)
        })
    },

    // 更改家族
    changeFamilyClick(row) {
      this.dialogFamilyLoading = true
      this.dialogFamilyVisible = true
      this.dialogFamilyValue = null
      this.dialogFamilyOptions = []
      this.dialogId = row.id || 0

      // 网络请求
      getUserFamilyList()
        .then((res) => {
          for (const item of res.data.list || []) {
            if (item.bossId == row.familyId) {
              this.dialogFamilyValue = item.bossId
            }
            this.dialogFamilyOptions.push({
              value: item.bossId || 0,
              label: nullS(item.familyName)
            })
          }
          this.dialogFamilyLoading = false
        })
        .catch((err) => {
          this.dialogFamilyLoading = false
          this.$message.error(err)
        })
    },

    // 提交更改主播家族
    commitEditAnchorFamilyClick() {
      if (this.dialogId == null || this.dialogId < 0) {
        this.$message.error('参数错误')
        return
      }
      this.dialogFamilyLoading = true
      // 请求网络
      updateUserAnchor({
        id: this.dialogId,
        familyId: this.dialogFamilyValue
      })
        .then((res) => {
          this.dialogFamilyLoading = false
          this.dialogFamilyVisible = false
          this.$notify({
            title: '提示',
            message: '修改主播家族成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.dialogFamilyLoading = false
          this.$message.error(err)
        })
    },

    // 更改类型
    changeGoldMedalClick(row) {
      const rowDic = Object.assign({}, row)
      this.dialogId = rowDic.id || 0
      this.dialogGoldValue = rowDic.goldMedal
      this.dialogGoldVisible = true
    },

    // 提交更改主播类型
    commitEditAnchorGoldClick() {
      if (this.dialogId == null || this.dialogId < 0) {
        this.$message.error('参数错误')
        return
      }
      this.dialogGoldLoading = true
      // 请求网络
      updateUserAnchor({
        id: this.dialogId,
        goldMedal: this.dialogGoldValue
      })
        .then((res) => {
          this.dialogGoldLoading = false
          this.dialogGoldVisible = false
          this.$notify({
            title: '提示',
            message: '修改主播类型成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.dialogGoldLoading = false
          this.$message.error(err)
        })
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 220px;
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

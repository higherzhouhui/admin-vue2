<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" class="input-with-select" placeholder="请输入主播ID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.anchorName" size="small" class="input-with-select" placeholder="请输入主播昵称" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.joinType" size="small" placeholder="请选择参与类型" clearable
          @change="handleSearchFilter">
          <el-option :label="item.chLan" :value="item.code" :key="item.code"
            v-for="item in giftGgetJoinTypeConfigD.joinTypes" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">发放类型:</el-tag> -->
        <el-select v-model="listQuery.openType" size="small" placeholder="请选择发放类型" clearable
          @change="handleSearchFilter">
          <el-option label="平台" :value="1" />
          <el-option label="主播" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">
          添加</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="luckBagDetailId" label="ID" min-width="100" />
      <el-table-column prop="uid" label="主播ID" min-width="100" />
      <el-table-column prop="openType" label="发放类型" min-width="100">
        <template slot-scope="{ row }">
          {{ row.openType == 1 ? "平台" : "主播" }}
        </template>
      </el-table-column>
      <el-table-column prop="anchorName" label="主播昵称" min-width="100" />
      <el-table-column prop="trn" label="订单号" min-width="200" />
      <el-table-column prop="joinType" label="参与类型" min-width="120">
        <template slot-scope="{ row }">
          {{ joinTypeD(row.joinType) }}
        </template>
      </el-table-column>
      <el-table-column prop="joinCase" label="参与条件" min-width="120" />
      <el-table-column prop="averageGold" label="福袋金额" min-width="120" sortable />
      <el-table-column prop="peopleNum" label="福袋数量" min-width="120" sortable />
      <el-table-column prop="countDown" label="倒计时(分钟)" min-width="120" sortable />
      <el-table-column prop="joinNum" label="参与人数" min-width="120" sortable />
      <el-table-column prop="awardNum" label="中奖人数" min-width="120" sortable />
      <el-table-column prop="orderStatus" label="状态" min-width="80">
        <template slot-scope="{ row }">
          <div>
            {{
              row.orderStatus == 0
                ? "未开始"
                : row.orderStatus == 1
                ? "进行中"
                : "结束"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="100" />
      <el-table-column :label="'操作'" width="80" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-button plain size="mini" @click="closeClick(row)">{{
            "编辑"
          }}</el-button>
          <el-button
            v-if="row.state == 1"
            plain
            type="danger"
            size="mini"
            @click="deleteClick(row, 0)"
            >{{ "禁用" }}</el-button
          >
          <el-button
            v-if="row.state == 0"
            plain
            type="success"
            size="mini"
            @click="deleteClick(row, 1)"
            >{{ "启用" }}</el-button
          > -->
          <span class="operation_btn" plain type="primary" size="mini" @click="detailsClick(row)">{{ "中奖明细" }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建/编辑  -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="2vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :inline="true" :model="createModel" label-position="top" label-width="130px"
          size="medium" :rules="rules">
          <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            ">
            <el-form-item label="福袋类型" prop="joinType">
              <!-- <el-input
                  style="width: 526px"
                  v-model="createModel.month"
                  clearable
                  placeholder="请输入活动月份"
                  maxlength="128"
                  show-word-limit
                /> -->

              <!-- size="small" -->
              <!-- @change="handleSearchFilter" -->
              <el-select v-model="createModel.joinType" placeholder="请选择福袋参与类型" style="width: 300px">
                <el-option :label="item.chLan" :value="item.code" :key="item.code"
                  v-for="item in giftGgetJoinTypeConfigD.joinTypes" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="createModel.joinType.length > 0" label="参与条件" prop="joinCase">
              <el-input v-if="createModel.joinType != 20 && createModel.joinType != 30" style="width: 300px"
                v-model="createModel.joinCase" clearable :placeholder="
                  createModel.joinType == 10
                    ? '请输入口令'
                    : createModel.joinType == 40
                    ? '请输入累计发送礼物金额'
                    : ''
                " />
              <div style="width: 300px">
                {{
                  createModel.joinType == 20
                    ? "关注主播即可参与"
                    : createModel.joinType == 30
                    ? "用户进入直播间即可直接参与"
                    : ""
                }}
              </div>
            </el-form-item>

            <el-form-item label="选择直播间" prop="liveRecordId">
              <el-select v-model="createModel.liveRecordId" placeholder="请选择发放的直播间" style="width: 300px"
                @visible-change="visibleChange" filterable :filter-method="filterMethod" :loading="loadingZb"
                @change="liveRecordIdChange">
                <el-option :label="item.anchorName" :value="item.liveId" v-for="item in giftListInAnchorD"
                  :key="item.liveId" />
              </el-select>
              <!-- show-word-limit -->
            </el-form-item>
            <el-form-item label="人均可得金币" prop="averageGold">
              <el-select v-model="createModel.averageGold" placeholder="请选择人均可得金币" style="width: 300px">
                <el-option :label="item" :value="item" :key="item"
                  v-for="item in giftGgetJoinTypeConfigD.averageNums" />
              </el-select>
            </el-form-item>
            <el-form-item label="可中奖人数" prop="peopleNum">
              <el-select v-model="createModel.peopleNum" placeholder="请选择可中奖人数" style="width: 300px">
                <el-option :label="item" :value="item" :key="item" v-for="item in giftGgetJoinTypeConfigD.peopleNums" />
              </el-select>
            </el-form-item>
            <el-form-item label="倒计时" prop="countDown">
              <el-select v-model="createModel.countDown" placeholder="请选择倒计时" style="width: 300px">
                <el-option :label="item" :value="item" :key="item" v-for="item in giftGgetJoinTypeConfigD.countdowns" />
              </el-select>
            </el-form-item>
            <el-form-item label="期数" prop="numberNum">
              <el-select v-model="createModel.numberNum" placeholder="请选期数" style="width: 300px">
                <el-option :label="item" :value="item" :key="item" v-for="item in giftGgetJoinTypeConfigD.numbers" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 中奖名单 -->
    <el-dialog title="中奖名单" :visible.sync="dialogCreateVisible2" :close-on-click-modal="false" :destroy-on-close="true"
      top="2vh" width="70%">
      <div v-cloading="dialogCreateLoading2" style="width: 100%; height: 100%">
        <!-- <el-form :inline="true">
          <el-form-item>
            <el-tag type="info">用户ID:</el-tag>
            <el-input
              v-model="listQuery2.uid"
              size="small"
              class="input-with-select"
              placeholder="请输入用户ID"
              clearable
              @keyup.enter.native="handleSearchFilter2"
              @clear="handleSearchFilter2"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearchFilter2"
            />
            <el-button size="small" icon="el-icon-refresh" @click="resets2" />
          </el-form-item>
        </el-form> -->
        <el-table v-cloading="listLoading2" :data="list2" size="mini" fit highlight-current-row>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="uid" label="用户ID" min-width="100" />
          <el-table-column prop="awardGold" label="中奖金额" min-width="100" sortable />
          <!-- <el-table-column
            prop="totalEpositAmt"
            label="累计存款金额"
            min-width="100"
             
          /> -->

          <!-- <el-table-column
            prop="status"
            label="状态"
            min-width="80"
             
          >
            <template slot-scope="{ row }">
              <div>
                {{
                  row.status == 0 ? "待发放" : row.status == 1 ? "已发放" : ""
                }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="createTime" label="参与时间" min-width="100" />
          <!-- <el-table-column :label="'操作'"   width="120">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.status == 0"
                plain
                type="success"
                size="mini"
                @click="deleteClick2(row)"
                >{{ "奖励发放" }}</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick2()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  giftLuckBagList,
  giftAddLuckBag,
  giftGgetJoinTypeConfig,
  giftListInAnchor,
  giftLuckBagUserList,
} from '@/api/center/BlessingBag/BlessingBag'

import { emptyS, nullS, beforeUploadImage, uploadFile } from '@/utils/tools'
export default {
  name: 'centerBlessingBagIndex',
  data() {
    return {
      list: [],
      list2: [],
      listLoading: true,
      listLoading2: true,
      loadingZb: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      listQuery2: {},
      // 弹窗数值
      // 弹窗数值
      rules: {
        joinType: [
          { required: true, message: '请选择福袋类型', trigger: 'change' },
        ],
        liveRecordId: [
          {
            required: true,
            message: '请选择直播间',
            trigger: 'change',
          },
        ],
        averageGold: [
          {
            required: true,
            message: '请选择人均可得金币',
            trigger: 'change',
          },
        ],
        peopleNum: [
          {
            required: true,
            message: '请选择可中奖人数',
            trigger: 'change',
          },
        ],
        countDown: [
          {
            required: true,
            message: '请选择倒计时',
            trigger: 'change',
          },
        ],
        numberNum: [
          {
            required: true,
            message: '请选择期数',
            trigger: 'change',
          },
        ],
      },
      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogCreateLoading2: false,
      dialogCreateVisible2: false,

      dialogStatus: '',
      dialogTitleMap: {
        create: '新增',
        update: '编辑',
      },
      // 表单模型
      createModel: {
        joinType: '',
        liveRecordId: '',
        averageGold: '',
        peopleNum: '',
        countDown: '',
        numberNum: '',
        joinTypes: '',
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          joinType: '',
          liveRecordId: '',
          averageGold: '',
          peopleNum: '',
          countDown: '',
          numberNum: '',
          joinTypes: '',
        }
      },

      //   配置
      giftGgetJoinTypeConfigD: {
        agreement: '',
        averageNums: [],
        countdowns: [],
        joinTypes: [],
        numbers: [],
        peopleNums: [],
      },
      //   正在直播中的主播
      giftListInAnchorD: [],
      liveRecordIdChangeD: [],
    }
  },
  created() {
    this.listQuery.uid = this.$route.query.uid
    this.listQuery.openType = this.$route.query.openType

    this.giftGgetJoinTypeConfigs()
    this.giftListInAnchors()
    this.fetchData()
  },
  methods: {
    // 参数配置
    giftGgetJoinTypeConfigs() {
      giftGgetJoinTypeConfig().then((item) => {
        console.log('参数配置', item)
        this.giftGgetJoinTypeConfigD = item.data
      })
    },
    // 正在直播中的主播
    giftListInAnchors(a) {
      this.loadingZb = true
      giftListInAnchor(a).then((item) => {
        // console.log("正在直播中的主播", item);
        this.loadingZb = false
        this.giftListInAnchorD = item.data
      })
    },
    // 直播选中
    liveRecordIdChange(e) {
      this.liveRecordIdChangeD = this.giftListInAnchorD.filter(
        (value, index, array) => {
          return value.liveId == e
        }
      )
      console.log('选中数据', e)
    },
    // 直播搜索
    filterMethod(e) {
      this.giftListInAnchors(e)
    },
    // 参与类型
    joinTypeD(a) {
      let text = ''
      this.giftGgetJoinTypeConfigD.joinTypes.forEach((value, index, array) => {
        if (value.code == a) {
          text = value.chLan
        }
      })
      return text
    },

    // 直播下拉框
    visibleChange(e) {
      if (e) {
        this.giftListInAnchors()
      }
    },
    // 重置
    resets() {
      this.reloadData()
      this.resetCreateModel()
    },
    // 重置2
    resets2() {
      this.listQuery2 = {}
      this.fetchData2()
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      this.giftGgetJoinTypeConfigs()
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
          var datas = true
          console.log()
          if (
            this.createModel.joinType == 10 ||
            this.createModel.joinType == 40
          ) {
            if (
              this.createModel.joinCase !== undefined &&
              this.createModel.joinCase.length > 0
            ) {
              datas = true
            } else {
              this.$message({
                message: '请把参与条件填写完整',
                type: 'warning',
              })
              datas = false
            }
          }
          // 判断是否通过
          if (datas) {
            // this.liveRecordIdChangeD   直播选中
            const formDic = Object.assign({}, this.createModel)
            // this.dialogCreateLoading = true;
            const params = {
              uid: this.liveRecordIdChangeD[0].uid,
              anchorName: this.liveRecordIdChangeD[0].anchorName,
              liveRecordId: formDic.liveRecordId,
              joinType: formDic.joinType,
              averageGold: formDic.averageGold,
              peopleNum: formDic.peopleNum,
              countDown: formDic.countDown,
              numberNum: formDic.numberNum,
              joinCase: formDic.joinCase,
            }
            // console.log("这是多少数据2", formDic, params);
            // 请求服务器  新增
            if (this.dialogStatus === 'create') {
              giftAddLuckBag(params)
                .then((res) => {
                  this.dialogCreateLoading = false
                  this.dialogCreateVisible = false
                  this.liveRecordIdChangeD = []
                  this.$notify({
                    title: '提示',
                    message: '新增成功',
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
            // else {
            //   console.log("编辑2", formDic);
            //   updateActivityRoulette(formDic)
            //     .then((res) => {
            //       this.dialogCreateLoading = false;
            //       this.dialogCreateVisible = false;
            //       this.$notify({
            //         title: "提示",
            //         message: "修改成功",
            //         type: "success",
            //         duration: 1500,
            //       });
            //       this.fetchData();
            //     })
            //     .catch((err) => {
            //       this.dialogCreateLoading = false;
            //       this.$message.error(err);
            //     });
            // }
          }
        }
      })
    },
    // 确认按钮
    handleDataClick2() {
      this.dialogCreateVisible2 = false
    },
    // 中奖明细
    detailsClick(row) {
      console.log('这是多少行数据', row)
      this.listQuery2 = { ...row, pageNum: 1, pageSize: 10000000 }
      this.fetchData2()
      this.dialogCreateVisible2 = true
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = []
      this.listLoading = true
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },
    // 获取列表数据
    fetchData() {
      console.log(this.listQuery)
      this.listLoading = true
      let data = {
        ...this.listQuery,
        joinType:
          this.listQuery.joinType !== undefined &&
          this.listQuery.joinType.toString().length > 0
            ? this.listQuery.joinType
            : null,
        openType:
          this.listQuery.openType !== undefined &&
          this.listQuery.openType.toString().length > 0
            ? this.listQuery.openType
            : null,
      }
      console.log('这是请求数据', data)
      // 请求服务器
      giftLuckBagList(data)
        .then((res) => {
          console.log('这是多少', res)
          this.list = res.data.list || []
          this.listQuery.total = res.data.total || 0
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 获取列表数据
    fetchData2() {
      this.listLoading2 = true
      // 请求服务器
      giftLuckBagUserList({
        pageSize: this.listQuery2.pageSize,
        pageNum: this.listQuery2.pageNum,
        luckBagConfigId: this.listQuery2.id,
        luckBagDetailId: this.listQuery2.luckBagDetailId,
      })
        .then((res) => {
          console.log(res)
          this.list2 = res.data.list
          this.listLoading2 = false
        })
        .catch((err) => {
          this.list2 = null
          this.listLoading2 = false
          this.$message.error(err)
        })
    },
    // 过滤
    handleSearchFilter() {
      console.log(this.listQuery)
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    // 过滤2
    handleSearchFilter2() {
      this.fetchData2()
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
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;

  /* .el-input-group__prepend {
      background-color: #fff;
    } */
}

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
</style>

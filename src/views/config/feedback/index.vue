<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-tag type="info">日期</el-tag>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入反馈用户ID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.typeId" size="small" placeholder="请选择反馈类别" clearable @change="handleSearchFilter">
          <el-option v-for="item in typeListD" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择反馈类型" clearable @change="handleSearchFilter">
          <el-option label="未处理" value="0" />
          <el-option label="已处理" value="1" />
          <el-option label="用户已读" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" plain icon="el-icon-refresh" @click="resets()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <!-- <el-table-column
        prop="showTime"
        label="时间"
        min-width="120"

      /> -->
      <el-table-column prop="uid" label="反馈用户ID" min-width="125" />
      <el-table-column prop="nickname" label="反馈用户昵称" min-width="120" sortable />
      <el-table-column prop="name" label="反馈类型" min-width="100" />
      <el-table-column prop="content" label="反馈内容" min-width="200" />
      <el-table-column prop="createTime2" label="反馈时间" width="160" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.status == 1 ? "已处理" : row.status == 2 ? "用户已读" : "未处理"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">详细</span>
          <!-- <el-button
            plain
            type="danger"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 查看明细 -->
    <el-dialog title="查看详情" :visible.sync="dialogCreateVisible2" :close-on-click-modal="false" :destroy-on-close="true"
      width="700px">
      <div v-cloading="dialogCreateLoading2" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :inline="true" :model="createModel" label-position="top" label-width="130px"
          size="medium">
          <div style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
            ">
            <el-form-item label="反馈账号ID" prop="uid">
              <el-input v-model.number="createModel.uid" clearable style="width: 400px" disabled />
              <!-- show-word-limit -->
            </el-form-item>
            <el-form-item label="反馈者用户昵称" prop="nickname">
              <el-input v-model.number="createModel.nickname" clearable style="width: 400px" disabled />
            </el-form-item>
            <el-form-item label="反馈类型" prop="name">
              <el-input v-model.number="createModel.name" clearable style="width: 400px" disabled />
            </el-form-item>
            <el-form-item label="反馈时间" prop="createTime2">
              <el-input v-model.number="createModel.createTime2" clearable style="width: 400px" disabled />
            </el-form-item>
            <el-form-item label="反馈内容" prop="content">
              <el-input v-model.number="createModel.content" clearable style="width: 400px" :rows="5" type="textarea"
                disabled />

              <div v-if="
                  createModel.photoAlbum != undefined &&
                    createModel.photoAlbum.length != 0
                " style="
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  height: 150px;
                  grid-gap: 8px;
                  margin-top: 10px;
                ">
                <div v-for="(item, index) in createModel.photoAlbum2" :key="`${item}_${index}`" @click="
                    VisibleImgs = true;
                    photoAlbum2s = item;
                  ">
                  <img :src="item" alt="" style="height: 150px; width: 100%; object-fit: contain">
                </div>
              </div>
            </el-form-item>
            <el-form-item label="当前状态" prop="status">
              <el-select v-model="createModel.status" size="small" placeholder="请选择当前状态" clearable style="width: 400px"
                disabled>
                <el-option label="未处理" :value="0" />
                <el-option label="已处理" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="意见回复" prop="replyContent">
              <el-input v-model="createModel.replyContent" clearable placeholder="请输入意见回复" style="width: 400px"
                :rows="5" type="textarea" :disabled="createModel.status == 1 || createModel.status == 2" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 查看图片 -->
      <el-dialog width="650px" title="图片详细" :visible.sync="VisibleImgs" append-to-body>
        <img style="width: 100%; height: 650px; object-fit: contain" :src="photoAlbum2s" alt="">
      </el-dialog>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false">取消</el-button>
        <el-button v-if="createModel.status != 1 && createModel.status != 2" size="medium" type="primary"
          @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryFamilyAgencyFeeList,
  queryFamilyAgencyFeeDetailList,
  queryTotalFamilyAgencyFeeDetailList,
} from '@/api/live/FamilyLeader'
import { feedbackList, replyFeedback, typeList } from '@/api/config/feedback'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigFeedbackIndex',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    },
  },
  data() {
    return {
      list: null,
      list2: null,
      data3: {},
      listLoading: true,
      listLoading2: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        status: null,
        typeId: null,
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

      dialogCreateVisible2: false,
      dialogCreateLoading2: false,
      queryFamilyAgencyFeeDetailListFData: {},

      VisibleImgs: false,

      typeListD: [],
      photoAlbum2s: '',
    }
  },
  created() {
    this.typeListF()
    this.fetchData()
  },
  methods: {
    // 获取意见反馈类型
    typeListF() {
      typeList().then((item) => {
        console.log('类型', item.data)
        this.typeListD = item.data || []
      })
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      feedbackList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            if (item.createTime.toString().length > 0) {
              item.createTime2 = formatUnixTime(item.createTime)
            }
            if (
              item.photoAlbum != null &&
              item.photoAlbum != undefined &&
              item.photoAlbum.length > 0
            ) {
              // item.photoAlbum=
              const data = []
              item.photoAlbum.split(',').forEach((value, index) => {
                if (value != '') {
                  data.push(value)
                }
              })
              item.photoAlbum2 = data
            }
            return item
          })
          console.log(this.list)
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
    // 开起
    showUpdateDialogClick(res) {
      this.createModel = res
      //   this.queryFamilyAgencyFeeDetailListF(res);
      console.log('详细', res)
      this.dialogCreateVisible2 = true
    },

    // 中介费明细
    queryFamilyAgencyFeeDetailListF(res) {
      this.listLoading2 = true
      queryFamilyAgencyFeeDetailList({
        bossId: res.bossId,
        startTime: res.startTime,
        endTime: res.endTime,
        ...this.listQuery2,
      })
        .then((res_2) => {
          this.list2 = (res_2.data.list || []).map((item) => {
            // var statusString = "";
            // if (item.status == 1) {
            //   statusString = "已发放";
            // } else if (item.status == 0) {
            //   statusString = "未发放";
            // }
            // if (item.createTime.toString().length > 0) {
            //   item.createTime2 = formatUnixTime(item.createTime);
            // }
            // this.$set(item, "statusString", statusString);
            return item
          })
          this.listLoading2 = false

          queryTotalFamilyAgencyFeeDetailList({
            bossId: res.bossId,
            startTime: res.startTime,
            endTime: res.endTime,
            ...this.listQuery2,
          }).then((item) => {
            console.log('获取统计', item)
            this.data3 = item.data || {}
          })
        })
        .catch((err) => {
          this.list2 = null
          this.listLoading2 = false
          this.$message.error(err)
        })
    },
    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var datas = true
          if (datas) {
            if (
              this.createModel.replyContent == null ||
              this.createModel.replyContent == undefined ||
              this.createModel.replyContent.length == 0
            ) {
              this.$message({
                message: '请输入意见回复',
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
              id: formDic.id,
              replyContent: formDic.replyContent,
            }
            console.log('这是多少数据2', params)
            // 请求服务器  回复
            replyFeedback(params)
              .then((res) => {
                this.dialogCreateLoading2 = false
                this.dialogCreateVisible2 = false
                this.$notify({
                  title: '提示',
                  message: '回复成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading2 = false
                this.$message.error(err)
              })

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

    // 尾部合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (columns != undefined && data != undefined) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '当前页合计'
            return
          }
          if (index === 1) {
            sums[index] = '--'
            return
          }
          if (index === 2) {
            sums[index] = '--'
            return
          }
          if (index === 3) {
            sums[index] = '--'
            return
          }
          if (index === 4) {
            sums[index] = '--'
            return
          }
          if (index === 5) {
            sums[index] = this.data3.activeTime || '0小时0分'
            return
          }
          if (index === 6) {
            sums[index] = this.data3.subsidy || '0'
            return
          }
          if (index === 7) {
            sums[index] = this.data3.familyAgencyFee || '0'
            return
          }
          //   const values = data.map((item) => Number(item[column.property]));
          //   if (!values.every((value) => isNaN(value))) {
          //     sums[index] = values.reduce((prev, curr) => {
          //       const value = Number(curr);
          //       if (!isNaN(value)) {
          //         return prev + curr;
          //       } else {
          //         return prev;
          //       }
          //     }, 0);
          //     sums[index] += " 元";
          //   } else {
          //     sums[index] = "N/A";
          //   }
        })
        return sums
      }
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      //   if (this.listQuery.pickerValue != null) {
      //     this.listQuery.startTime =
      //       this.listQuery.pickerValue[0] != undefined
      //         ? this.listQuery.pickerValue[0]
      //         : null;
      //     this.listQuery.endTime =
      //       this.listQuery.pickerValue[0] != undefined
      //         ? this.listQuery.pickerValue[1]
      //         : null;
      //   } else {
      //     this.listQuery.startTime = null;
      //     this.listQuery.endTime = null;
      //   }
      this.fetchData()
    },
    // 过滤
    handleSearchFilter2() {
      this.queryFamilyAgencyFeeDetailListF(
        this.queryFamilyAgencyFeeDetailListFData
      )
    },
    // 重置
    resets() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        status: null,
        typeId: null,
      }
      this.fetchData()
    },
    // 重置2
    resets2() {
      this.listQuery2.uid = ''
      this.queryFamilyAgencyFeeDetailListF(
        this.queryFamilyAgencyFeeDetailListFData
      )
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
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>

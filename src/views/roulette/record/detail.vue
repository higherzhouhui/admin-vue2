<template>
  <div class="app-container" style="padding: 50px" v-cloading="loading">
    <el-form ref="activityForm" :model="record" label-width="160px">
      <div class="goback" @click="goBack">
        <span class="el-icon-arrow-left"></span> 返回
      </div>
      <el-descriptions title="用户信息"></el-descriptions>
      <el-form-item label="">
        <el-descriptions title="">
          <el-descriptions-item label="用户ID">{{
            record.uid
          }}</el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{
            record.nickName
          }}</el-descriptions-item>
          <el-descriptions-item label="用户姓名">{{
            record.trueName
          }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ record.sex == 1 ? "男" : record.sex == 2 ? "女" : "未知" }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">{{
            record.phone
          }}</el-descriptions-item>

          <el-descriptions-item label="注册时间">
            {{ $moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </el-descriptions-item>
          <el-descriptions-item label="封禁状态">
            {{ record.lock == 0 ? "未封禁" : "已封禁" }}
          </el-descriptions-item>
        </el-descriptions>
      </el-form-item>
      <el-descriptions title="历史中奖记录"></el-descriptions>
      <el-form-item label="">
        <el-table
          :data="record.recordList"
          size="mini"
             >
          <el-table-column
            prop="activityId"
            :label="$t('活动ID')"
             
          />
          <el-table-column
            prop="rouletteName"
            :label="$t('活动标题')"
             
          />
          <el-table-column prop="prizeLevel" label="中奖等级"  >
            <template slot-scope="{ row }">
              {{ numberToUpperCase(row.prizeLevel) }}等奖
            </template>
          </el-table-column>
          <el-table-column
            prop="rouletteMsg"
            :label="$t('中奖码')"
             
          >
          </el-table-column>
          <el-table-column :label="$t('中奖时间')"  >
            <template slot-scope="{ row }">
              {{ $moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('中奖状态')"  >
            <template slot-scope="{ row }">
              <el-tag size="medium" v-if="row.status == 0">未兑奖</el-tag>
              <el-tag size="medium" type="info" v-else-if="row.status == 1"
                >已兑奖</el-tag
              >
              <el-tag size="medium" type="info" v-else>已派发完毕</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { detailRecord } from "@/api/roulette/record";
import { numberToUpperCase } from "@/utils/tools";

export default {
  name: "",
  components: {},
  data() {
    return {
      loading: false,
      numberToUpperCase,
      id: null,
      list: [],
      record: {
        activityId: "",
        uid: "",
        activityId: "",
      },
      listQuery: {
        page: 1,
        total: 0,
      },
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetailRecord();
    }
  },
  methods: {
    getDetailRecord() {
      this.loading = true;
      detailRecord(this.id)
        .then((res) => {
          console.log(res, "res");
          this.record = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    fetchData() {},
    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      this.fetchData();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
    },
  },
};
</script>
<style scoped>
.goback {
  cursor: pointer;
  margin-bottom: 20px;
}
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>

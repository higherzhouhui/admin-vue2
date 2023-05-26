<template>
  <div class="app-container">
      <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" @click="addClick()"
          >添加活动</el-button
        >
        <el-button size="small" @click="goldClick()"
          >领取金币列表</el-button
        >
        <el-button size="small" icon="el-icon-refresh" @click="fetchData()"
          >刷新</el-button
        >
       
      </el-form-item>
    </el-form>   
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column label="序号"   type="index" />
      <el-table-column :label="'活动ID'"   prop="id" />
      <el-table-column :label="'活动标题'"   prop="title">
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间"  >
        <template slot-scope="{ row }">
          {{ $moment(row.startTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间"  >
        <template slot-scope="{ row }">
          {{ $moment(row.endTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="状态"  >
        <template slot-scope="{ row }">
          <el-tag :type="row.status == 0 ? 'info' : 'success'" size="medium">{{
            row.status == 0 ? "关闭" : "开启"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTimeString" label="操作" width="100" >
        <template slot-scope="{ row }">
          <span class="operation_btn"
            v-if="row.status == 1"
            plain
            size="mini"
            @click="closeClick(row)"
            >关闭</span>
          <span class="operation_btn" plain type="primary" size="mini" @click="detailsClick(row)"
            >详情</span>
          <span class="operation_btn" plain type="danger" v-if="row.status == 0" size="mini" @click="deleteClick(row)"
            >删除</span>
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
  </div>
</template>

<script>
import { listSignIn, updateStateSignIn,delActivity } from "@/api/center/signin";

export default {
  name: "",
  filters: {
    sexFilter(status) {
      const map = { 0: "info", 1: "", 2: "danger" };
      return map[status];
    },
  },
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    addClick() {
      this.$router.push({
        path: "/center/center/signin/add",
      });
    },
    goldClick() {
      this.$router.push({
        path: "/center/center/signin/gold",
      });
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = null;
      this.listLoading = true;
      this.listQuery = {
        page: 1,
        limit: 20,
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      // 请求服务器
      listSignIn(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          console.log(res, "res");
          this.list = res.data.list || [];
          this.listQuery.total = res.data.total || 0;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    detailsClick({ id }) {
      this.$router.push({
        path: "/center/center/signin/add",
        query: { id },
      });
    },
    deleteClick(row) {
      this.$confirm("确认删除后不可逆,请谨慎操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          delActivity(row.id)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除活动成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
    closeClick(row) {
      this.$confirm("是否确认关闭该活动？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          updateStateSignIn(row.id)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "关闭活动成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
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
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;
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
  color: #FC708B;
  cursor: pointer;
}
</style>

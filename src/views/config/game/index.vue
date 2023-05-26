<template>
  <div class="app-container">
    <div style="margin-bottom: 20px;">
      <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showCreateDialogClick()">添加游戏</el-button>
      <span style="margin-right: 10px;"></span>
      <!-- 状态 -->
      <span style="margin-right: 10px;"></span>
      <el-select size="small" v-model="listQuery.status" placeholder="请选择状态" clearable @change="handleSearchFilter">
        <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select>

      <el-button plain circle size="medium" slot="suffix" icon="el-icon-search" @click="handleSearchFilter"></el-button>
      <el-button style="margin: 10px" type="primary" @click="changeStart()">开启游戏弹窗</el-button>
      <el-button style="margin: 10px" type="primary" @click="changeStop()">关闭游戏弹窗</el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60"  ></el-table-column>
      <el-table-column prop="gameId" label="第三方游戏id" min-width="80"  ></el-table-column>
      <el-table-column prop="gameName" label="第三方游戏名称" min-width="80"  ></el-table-column>
     <el-table-column label="状态" width="80"  >
       <template slot-scope="{ row }">
         <el-tag size="medium" :type="row.status | statusFilter">{{ row.statusString }}</el-tag>
       </template>
     </el-table-column>
      <el-table-column prop="image" label="第三方游戏显示图片" min-width="80"  ></el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80"  ></el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160"  ></el-table-column>
      <el-table-column prop="updateTimeString" label="更新时间" width="160"  ></el-table-column>
      <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button>
          <el-button plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
    ></el-pagination>

    <!-- 新建/编辑 消息公告 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible"   :close-on-click-modal="false" :destroy-on-close="true" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="第三方游戏id" prop="gameId"><el-input v-model.number="createModel.gameId" clearable placeholder="请输入第三方游戏id" maxlength="200" /></el-form-item>
          <el-form-item label="第三方游戏名称" prop="gameName"><el-input v-model.number="createModel.gameName" clearable placeholder="请输入第三方游戏名称" maxlength="200" /></el-form-item>
          <el-form-item label="第三方游戏显示图片" prop="image"><el-input v-model.number="createModel.image" clearable placeholder="请输入第三方游戏显示图片" maxlength="200" /></el-form-item>
          <el-form-item label="1启用 0禁用">
            <el-switch v-model="createModel.status" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0"></el-switch>
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
import { getGameList, createGame, updateGame, deleteGame, startGame, stopGame } from '@/api/config/game';
import { emptyS, nullS, formatUnixTime } from '@/utils/tools';

export default {
  name: 'ConfigGameBaseController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' };
      return map[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加游戏',
        update: '编辑游戏'
      },

      // 表单模型
      createModel: {
        id: 0,
        gameName: 0,
        status: 0,
        gameId: null,
        image: null
      },
      statusOptions: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }],

      // 验证规则
      rules: {
        gameId: [{ required: true, message: '请输入第三方游戏id', trigger: 'change' }],
        image: [{ required: true, message: '请输入第三方游戏显示图片', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        gameName: [{ required: true, message: '请输入第三方游戏名称', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        gameName: 0,
        status: 0,
        gameId: null,
        image: null
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getGameList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            var statusString = '';
            if (item.status == 1) {
              statusString = '启用';
            } else if (item.status == 0) {
              statusString = '禁用';
            }
            this.$set(item, 'statusString', statusString);
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime));
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime));
            return item;
          });
          this.listLoading = false;
          this.listQuery.total = res.data.total;
        })
        .catch(err => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = 'create';
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = 'update';
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误');
        return;
      }
      this.$confirm('是否删除该游戏？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteGame([row.id])
            .then(res => {
              this.listLoading = false;
              this.$notify({
                title: '提示',
                message: '删除游戏成功',
                type: 'success',
                duration: 1500
              });
              setTimeout(_ => {
                this.fetchData();
              }, 200);
            })
            .catch(err => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },

    changeStart(){
      this.$confirm('是否开启游戏弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          startGame()
            .then(res => {
              this.listLoading = false;
              this.$notify({
                title: '提示',
                message: '开启成功',
                type: 'success',
                duration: 1500
              });
              setTimeout(_ => {
                this.fetchData();
              }, 200);
            })
            .catch(err => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },

    changeStop(){
      this.$confirm('是否关闭游戏弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          stopGame()
            .then(res => {
              this.listLoading = false;
              this.$notify({
                title: '提示',
                message: '开启成功',
                type: 'success',
                duration: 1500
              });
              setTimeout(_ => {
                this.fetchData();
              }, 200);
            })
            .catch(err => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            gameName: nullS(formDic.gameName),
            status: formDic.status || 0,
            gameId: nullS(formDic.gameId),
            image: nullS(formDic.image)
          };
          if (this.dialogStatus === 'create') {
            createGame(params)
              .then(res => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: '提示',
                  message: '创建游戏成功',
                  type: 'success',
                  duration: 1500
                });
                setTimeout(_ => {
                  this.fetchData();
                }, 200);
              })
              .catch(err => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          } else {
            params['id'] = formDic.id || 0;
            updateGame(params)
              .then(res => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: '提示',
                  message: '修改游戏成功',
                  type: 'success',
                  duration: 1500
                });
                setTimeout(_ => {
                  this.fetchData();
                }, 200);
              })
              .catch(err => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
      });
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      this.fetchData();
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
    }
  }
};
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
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>

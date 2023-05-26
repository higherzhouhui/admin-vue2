<template>
  <div v-cloading="loading" class="app-container">
    <el-form ref="configForm" :model="configModel" :rules="rules" style="width: 640px;margin: auto" label-position="top" size="medium">

      <el-form-item label="周榜第一奖励的金币">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekFirstCoin"
            :disabled="configModel.weekFirstCoinState === 0 ? true : false"
            placeholder="请输入周榜第一奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekFirstCoinState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="周榜第二、三奖励的金币">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekSecondCoin"
            :disabled="configModel.weekSecondCoinState === 0 ? true : false"
            placeholder="请输入周榜第二、三奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekSecondCoinState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="周榜第4-10奖励的金币">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekTenCoin"
            :disabled="configModel.weekTenCoinState === 0 ? true : false"
            placeholder="请输入周榜第4-10奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekTenCoinState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="周榜第11-20奖励的金币">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekTwentyCoin"
            :disabled="configModel.weekTwentyCoinState === 0 ? true : false"
            placeholder="请输入周榜第11-20奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekTwentyCoinState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="周榜第21-50奖励的金币">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekFiftyCoin"
            :disabled="configModel.weekFiftyCoinState === 0 ? true : false"
            placeholder="请输入周榜第21-50奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekFiftyCoinState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="周榜第一奖励需要的流水" prop="weekFirstRank">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekFirstRank"
            :disabled="configModel.weekFirstRankState === 0 ? true : false"
            placeholder="请输入周榜第一奖励需要的流水"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekFirstRankState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="周榜第二、三奖励需要的流水">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekSecondRank"
            :disabled="configModel.weekSecondRankState === 0 ? true : false"
            placeholder="请输入周榜第二、三奖励需要的流水"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekSecondRankState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="周榜第4-10奖励需要的流水">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekTenRank"
            :disabled="configModel.weekTenRankState === 0 ? true : false"
            placeholder="请输入周榜第4-10奖励需要的流水"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekTenRankState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="周榜第11-20奖励需要的流水">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekTwentyRank"
            :disabled="configModel.weekTwentyRankState === 0 ? true : false"
            placeholder="请输入周榜第11-20奖励需要的流水"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekTwentyRankState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="周榜第21-50奖励需要的流水">
        <div style="display: flex;">
          <el-input
            v-model="configModel.weekFiftyRank"
            :disabled="configModel.weekFiftyRankState === 0 ? true : false"
            placeholder="请输入周榜第21-50奖励需要的流水"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.weekFiftyRankState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label=" "  ><el-button type="primary" @click="submitForm()">保存配置</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateWeekRank, getWeekRank } from '@/api/config/weekcoin'
import { emptyS, nullS } from '@/utils/tools'

export default {
  name: 'CoinJobController',
  data() {
    return {
      loading: false,
      // 表单数据
      configModel: {},
      // 验证规则
      rules: {
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true
      getWeekRank()
        .then(res => {
          const formDic = res.data || {}
          this.configModel = {
            weekFirstRank: nullS(formDic.weekFirstRank),
            weekFirstRankState: 0,
            weekSecondRank: nullS(formDic.weekSecondRank),
            weekSecondRankState: 0,
            weekTenRank: nullS(formDic.weekTenRank),
            weekTenRankState: 0,
            weekTwentyRank: nullS(formDic.weekTwentyRank),
            weekTwentyRankState: 0,
            weekFiftyRank: nullS(formDic.weekFiftyRank),
            weekFiftyRankState: 0,
            weekFirstCoin: nullS(formDic.weekFirstCoin),
            weekFirstCoinState: 0,
            weekSecondCoin: nullS(formDic.weekSecondCoin),
            weekSecondCoinState: 0,
            weekTenCoin: nullS(formDic.weekTenCoin),
            weekTenCoinState: 0,
            weekTwentyCoin: nullS(formDic.weekTwentyCoin),
            weekTwentyCoinState: 0,
            weekFiftyCoin: nullS(formDic.weekFiftyCoin),
            weekFiftyCoinState: 0
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err)
        })
    },

    // 提交表单
    submitForm() {
      this.$refs['configForm'].validate(valid => {
        if (valid) {
          this.$confirm('确定使用该配置吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          })
            .then(() => {
              const formDic = Object.assign({}, this.configModel) // copy obj
              this.loading = true
              // 请求服务器
              var params = {}
              if (formDic.weekFirstRankState === 1) {
                params['weekFirstRank'] = nullS(formDic.weekFirstRank)
              }
              if (formDic.weekSecondRankState === 1) {
                params['weekSecondRank'] = nullS(formDic.weekSecondRank)
              }
              if (formDic.weekTenRankState === 1) {
                params['weekTenRank'] = nullS(formDic.weekTenRank)
              }
              if (formDic.weekTwentyRankState === 1) {
                params['weekTwentyRank'] = nullS(formDic.weekTwentyRank)
              }
              if (formDic.weekFiftyRankState === 1) {
                params['weekFiftyRank'] = nullS(formDic.weekFiftyRank)
              }
              if (formDic.weekFirstCoinState === 1) {
                params['weekFirstCoin'] = nullS(formDic.weekFirstCoin)
              }
              if (formDic.weekSecondCoinState === 1) {
                params['weekSecondCoin'] = nullS(formDic.weekSecondCoin)
              }
              if (formDic.weekTenCoinState === 1) {
                params['weekTenCoin'] = nullS(formDic.weekTenCoin)
              }
              if (formDic.weekTwentyCoinState === 1) {
                params['weekTwentyCoin'] = nullS(formDic.weekTwentyCoin)
              }
              if (formDic.weekFiftyCoinState === 1) {
                params['weekFiftyCoin'] = nullS(formDic.weekFiftyCoin)
              }

              updateWeekRank(params)
                .then(() => {
                  this.loading = false
                  this.$notify({
                    title: '成功',
                    message: '修改配置成功',
                    type: 'success',
                    duration: 1500
                  })

                  setTimeout(_ => {
                    this.fetchData()
                  }, 200)
                })
                .catch(err => {
                  this.loading = false
                  this.$message.error(err)
                })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    }
  }
}
</script>

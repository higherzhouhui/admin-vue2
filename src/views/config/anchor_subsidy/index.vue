<template>
  <div v-cloading="loading" class="app-container">
    <el-form ref="configForm" :model="configModel" style="width: 640px;margin: auto" label-position="top" size="medium">
      <el-form-item label="银牌主播每日补贴金额(VND)">
        <div style="display: flex;">
          <el-input
            v-model="configModel.normalSubsidy"
            :disabled="configModel.normalSubsidyState === 0 ? true : false"
            placeholder="请输入补贴金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.normalSubsidyState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="银牌主播每日要求时长(小时)">
        <div style="display: flex;">
          <el-input
            v-model="configModel.normalTime"
            :disabled="configModel.normalTimeState === 0 ? true : false"
            placeholder="请输入要求时长"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.normalTimeState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="金牌主播每日补贴金额(VND)">
        <div style="display: flex;">
          <el-input
            v-model="configModel.subsidy"
            :disabled="configModel.subsidyState === 0 ? true : false"
            placeholder="请输入补贴金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.subsidyState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="金牌银牌主播每日要求时长(小时)">
        <div style="display: flex;">
          <el-input
            v-model="configModel.time"
            :disabled="configModel.timeState === 0 ? true : false"
            placeholder="请输入要求时长"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.timeState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="官方id(给主播推送消息)">
        <div style="display: flex;">
          <el-input
            v-model="configModel.sysUid"
            :disabled="configModel.sysuidState === 0 ? true : false"
            placeholder="请输入正确的id"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.sysuidState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label=" "  ><el-button type="primary" @click="submitForm()">保存配置</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAnchorSubsidy, updateAnchorSubsidy } from '@/api/config/anchor_subsidy'
import { emptyS, nullS } from '@/utils/tools'

export default {
  name: 'ConfigAnchorSubsidyController',
  data() {
    return {
      loading: false,
      // 表单数据
      configModel: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true
      getAnchorSubsidy()
        .then(res => {
          const formDic = res.data || {}
          this.configModel = {
            normalSubsidy: nullS(`${formDic.normalSubsidy}`),
            normalSubsidyState: 0,
            normalTime: nullS(`${formDic.normalTime}`),
            normalTimeState: 0,
            subsidy: nullS(`${formDic.subsidy}`),
            subsidyState: 0,
            time: nullS(`${formDic.time}`),
            timeState: 0,
            sysUid: nullS(`${formDic.sysUid}`),
            sysuidState: 0
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
              // 请求服务器
              var params = {}
              if (formDic.normalTimeState === 1) {
                if (parseInt(`${formDic.normalTime}`) > 24) {
                  this.$message({
                    message: '时间不能大于24小时',
                    type: 'warning'
                  })
                  return
                }
                params['normalTime'] = nullS(formDic.normalTime)
              }
              if (formDic.timeState === 1) {
                if (parseInt(`${formDic.time}`) > 24) {
                  this.$message({
                    message: '时间不能大于24小时',
                    type: 'warning'
                  })
                  return
                }
                params['time'] = nullS(formDic.time)
              }
              if (formDic.normalSubsidyState === 1) {
                params['normalSubsidy'] = nullS(formDic.normalSubsidy)
              }
              if (formDic.subsidyState === 1) {
                params['subsidy'] = nullS(formDic.subsidy)
              }
              if (formDic.sysuidState === 1) {
                params['sysUid'] = nullS(formDic.sysUid)
              }

              this.loading = true
              updateAnchorSubsidy(params)
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

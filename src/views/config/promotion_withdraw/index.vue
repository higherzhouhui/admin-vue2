<template>
  <div v-cloading="loading" class="app-container">
    <el-button type="primary" size="small" icon="el-icon-refresh" @click="fetchData">刷新</el-button>
    <el-form ref="configForm" :model="configModel" style="margin: 10px" label-position="top" size="small" :hide-required-asterisk="true">
      <div class="wrapper">
        <el-form-item
          v-for="(item, index) in configModel.items"
          :key="item.id"
          :prop="'items.' + index + '.value'"
          :label="item.label"
          :rules="[{ required: true, validator: item.rule, trigger: ['blur', 'change'] }]"
        >
          <div style="display: flex;">
            <el-input
              v-model="item.value"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              clearable
              maxlength="20"
              show-word-limit
            />
            <el-button plain style="margin-left: 20px;" type="primary" @click="item.disabled = false">编辑</el-button>
          </div>
        </el-form-item>
      </div>
      <el-form-item label=" " style="text-align: center"><el-button type="primary" @click="submitForm()">保存配置</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPromotionWithdraw, updatePromotionWithdraw } from '@/api/config/promotion_withdraw'
import { nullS } from '@/utils/tools'

export default {
  name: 'ConfigPromotionWithdrawController',
  data() {
    var checkNumber = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数值不能为空'))
      }
      if (isNaN(`${value}`)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 0 || value > 100) {
          callback(new Error('请输入0-100的数值'))
        } else {
          callback()
        }
      }
    }
    var checkNormal = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('数值不能为空'))
      }
      if (isNaN(`${value}`)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      // 表单数据
      configModel: {
        items: [
          {
            id: 1,
            label: '魅力值兑换金币手续费（%）',
            placeholder: '请输入手续费',
            value: null,
            disabled: true,
            key: 'anchorTopupFee',
            rule: checkNumber
          },
          {
            id: 2,
            label: '主播魅力提现手续费（%）',
            placeholder: '请输入手续费',
            value: null,
            disabled: true,
            key: 'anchorWithdrawFee',
            rule: checkNumber
          },
          {
            id: 3,
            label: '用户金币提现手续费（%）',
            placeholder: '请输入手续费',
            value: null,
            disabled: true,
            key: 'userWithdrawFee',
            rule: checkNumber
          },
          {
            id: 4,
            label: '金币或魅力提现最小值（VND）',
            placeholder: '请输入最小值',
            value: null,
            disabled: true,
            key: 'userWithdrawMin',
            rule: checkNormal
          },
          {
            id: 5,
            label: '分享收益兑换金币手续费（%）',
            placeholder: '请输入手续费',
            value: null,
            disabled: true,
            key: 'promotionTopupFee',
            rule: checkNumber
          },
          {
            id: 6,
            label: '分享收益兑换金币最小值（VND）',
            placeholder: '请输入最小值',
            value: null,
            disabled: true,
            key: 'promotionTopupMin',
            rule: checkNormal
          },
          {
            id: 7,
            label: '分享收益提现手续费（%）',
            placeholder: '请输入手续费',
            value: null,
            disabled: true,
            key: 'promotionWithdrawFee',
            rule: checkNumber
          },
          {
            id: 8,
            label: '分享收益提现最小值（VND）',
            placeholder: '请输入最小值',
            value: null,
            disabled: true,
            key: 'promotionWithdrawMin',
            rule: checkNormal
          },
          {
            id: 9,
            label: '用户分享绑定率（%）',
            placeholder: '请输入绑定率',
            value: null,
            disabled: true,
            key: 'promotionBindRate',
            rule: checkNormal
          },
          {
            id: 10,
            label: '用户分享一人获得收益(VND)',
            placeholder: '请输入最小值',
            value: null,
            disabled: true,
            key: 'promotionShareProfit',
            rule: checkNormal
          },
          {
            id: 11,
            label: '用户充值返利比例（%）',
            placeholder: '请输入比例',
            value: null,
            disabled: true,
            key: 'promotionRebateFee',
            rule: checkNormal
          },
          {
            id: 12,
            label: '用户分享一人彩票流水收益（%）',
            placeholder: '请输入彩票流水收益',
            value: null,
            disabled: true,
            key: 'promotionLotteryFee',
            rule: checkNormal
          },
          {
            id: 13,
            label: '用户分享一人打赏提成（%）',
            placeholder: '请输入打赏提成',
            value: null,
            disabled: true,
            key: 'promotionGiftFee',
            rule: checkNormal
          }
        ]
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
      getPromotionWithdraw()
        .then(res => {
          const formDic = res.data || {}
          for (var item of this.configModel.items) {
            item.disabled = true // 重置不能修改
            item.value = formDic[item.key]
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
              // 请求服务器
              const params = {}
              this.configModel.items.map(item => {
                params[item.key] = nullS(item.value)
              })

              this.loading = true
              updatePromotionWithdraw(params)
                .then(_ => {
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

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 50px;
}
</style>

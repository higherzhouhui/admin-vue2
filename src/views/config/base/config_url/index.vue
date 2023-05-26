<template>
  <div v-cloading="loading" class="app-container">
    <el-button type="primary" icon="el-icon-refresh" size="mini" @click="fetchData()">刷新</el-button>
    <el-form ref="configForm" :model="configModel" :rules="rules" class="formContainer" label-position="top" size="medium">
      <el-form-item label="接口服务URL" prop="appServiceUrl">
        <div style="display: flex;">
          <el-input
            v-model="configModel.appServiceUrl"
            :disabled="configModel.appServiceUrlState === 0 ? true : false"
            placeholder="请输入接口服务URL"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.appServiceUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="多线路网关地址" prop="lineGatewayUrls">
        <div style="display: flex;">
          <el-input
            v-model="configModel.lineGatewayUrls"
            :disabled="configModel.lineGatewayUrlsState === 0 ? true : false"
            placeholder="请输入多线路网关地址"
            clearable
            type="textarea"
            maxlength="300"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.lineGatewayUrlsState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="自定义域名(基础资源) ">
        <div style="display: flex;">
          <el-input
            v-model="configModel.domain"
            :disabled="configModel.domainState === 0 ? true : false"
            placeholder="请输入基础资源域名"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.domainState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="自定义域名2">
        <div style="display: flex;">
          <el-input
            v-model="configModel.domainTwo"
            :disabled="configModel.domainTwoState === 0 ? true : false"
            placeholder="请输入自定义域名"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.domainTwoState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="自定义域名3">
        <div style="display: flex;">
          <el-input
            v-model="configModel.domainThree"
            :disabled="configModel.domainThreeState === 0 ? true : false"
            placeholder="请输入自定义域名"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.domainThreeState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="H5根URL">
        <div style="display: flex;">
          <el-input
            v-model="configModel.h5Url"
            :disabled="configModel.h5UrlState === 0 ? true : false"
            placeholder="请输入H5根URL"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.h5UrlState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="分享文案">
        <div style="display: flex;">
          <el-input
            v-model="configModel.shareContent"
            :disabled="configModel.shareContentState === 0 ? true : false"
            placeholder="请输入分享文案"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.shareContentState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="渠道前缀URL">
        <div style="display: flex;">
          <el-input
            v-model="configModel.promotionUrl"
            :disabled="configModel.promotionUrlState === 0 ? true : false"
            placeholder="请输入渠道前缀URL"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.promotionUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="登录页URL">
        <div style="display: flex;">
          <el-input
            v-model="configModel.loginUrl"
            :disabled="configModel.loginUrlState === 0 ? true : false"
            placeholder="请输入登录页URL"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.loginUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="落地页URL">
        <div style="display: flex;">
          <el-input
            v-model="configModel.floorUrl"
            :disabled="configModel.floorUrlState === 0 ? true : false"
            placeholder="请输入落地页URL"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.floorUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="im_identifier">
        <div style="display: flex;">
          <el-input
            v-model="configModel.identifier"
            :disabled="configModel.identifierState === 0 ? true : false"
            placeholder="请输入identifier"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.identifierState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="im_sdkappid">
        <div style="display: flex;">
          <el-input
            v-model="configModel.sdkappid"
            :disabled="configModel.sdkappidState === 0 ? true : false"
            placeholder="请输入sdkappid"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.sdkappidState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="im_imkey">
        <div style="display: flex;">
          <el-input
            v-model="configModel.imkey"
            :disabled="configModel.imkeyState === 0 ? true : false"
            placeholder="请输入imkey"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.imkeyState = 1">编辑</el-button>
        </div>
      </el-form-item>

      <el-form-item label="iosTpnsAccessId">
        <div style="display: flex;">
          <el-input
            v-model="configModel.iosTpnsAccessId"
            :disabled="configModel.iosTpnsAccessIdState === 0 ? true : false"
            placeholder="请输入iosTpnsAccessId"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.iosTpnsAccessIdState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="iosTpnsAccessKey">
        <div style="display: flex;">
          <el-input
            v-model="configModel.iosTpnsAccessKey"
            :disabled="configModel.iosTpnsAccessKeyState === 0 ? true : false"
            placeholder="请输入iosTpnsAccessKey"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.iosTpnsAccessKeyState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="androidTpnsAccessId">
        <div style="display: flex;">
          <el-input
            v-model="configModel.androidTpnsAccessId"
            :disabled="configModel.androidTpnsAccessIdState === 0 ? true : false"
            placeholder="请输入androidTpnsAccessId"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.androidTpnsAccessIdState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="androidTpnsAccessKeyId">
        <div style="display: flex;">
          <el-input
            v-model="configModel.androidTpnsAccessKey"
            :disabled="configModel.androidTpnsAccessKeyState === 0 ? true : false"
            placeholder="请输入androidTpnsAccessKey"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.androidTpnsAccessKeyState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="googleKey">
        <div style="display: flex;">
          <el-input
            v-model="configModel.googleKey"
            :disabled="configModel.googleKeyState === 0 ? true : false"
            placeholder="请输入googleKey"
            clearable
            maxlength="200"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.googleKeyState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="代理系统url">
        <div style="display: flex;">
          <el-input
            v-model="configModel.agentUrl"
            :disabled="configModel.agentUrlState === 0 ? true : false"
            placeholder="请输入代理系统url"
            clearable
            maxlength="200"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.agentUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="websocket服务Url">
        <div style="display: flex;">
          <el-input
            v-model="configModel.wsServiceUrl"
            :disabled="configModel.wsServiceUrlState === 0 ? true : false"
            placeholder="请输入websocket服务Url"
            clearable
            maxlength="200"
            show-word-limit
          />
          <el-button plain style="margin-left: 20px;" type="primary" @click="configModel.wsServiceUrlState = 1">编辑</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="subBtn">
      <el-button type="primary" @click="submitForm()">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import { getBaseConfigUrl, updateBaseConfigUrl } from '@/api/config/base'
import { emptyS, nullS } from '@/utils/tools'

export default {
  name: 'ConfigBaseConfigUrlPage',
  data() {
    return {
      loading: false,
      // 表单数据
      configModel: {},
      // 验证规则
      rules: {
        appServiceUrl: [{ required: true, message: '请输入接口服务URL', trigger: 'change' }, { min: 1, max: 100, message: '最多为100个字符', trigger: 'change' }]
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
      getBaseConfigUrl()
        .then(res => {
          const formDic = res.data || {}
          this.configModel = {
            appServiceUrl: nullS(formDic.appServiceUrl),
            appServiceUrlState: 0,
            domain: nullS(formDic.domain),
            domainState: 0,
            domainTwo: nullS(formDic.domainTwo),
            domainTwoState: 0,
            domainThree: nullS(formDic.domainThree),
            domainThreeState: 0,
            h5Url: nullS(formDic.h5Url),
            h5UrlState: 0,
            promotionUrl: nullS(formDic.promotionUrl),
            promotionUrlState: 0,
            shareContent: nullS(formDic.shareContent),
            shareContentState: 0,
            lineGatewayUrlsState: 0,
            lineGatewayUrls: nullS(formDic.lineGatewayUrls),
            identifier: nullS(formDic.identifier),
            identifierState: 0,
            sdkappid: nullS(formDic.sdkappid),
            sdkappidState: 0,
            imkey: nullS(formDic.imkey),
            imkeyState: 0,
            iosTpnsAccessId: nullS(formDic.iosTpnsAccessId),
            iosTpnsAccessIdState: 0,
            iosTpnsAccessKey: nullS(formDic.iosTpnsAccessKey),
            iosTpnsAccessKeyState: 0,
            androidTpnsAccessId: nullS(formDic.androidTpnsAccessId),
            androidTpnsAccessIdState: 0,
            androidTpnsAccessKey: nullS(formDic.androidTpnsAccessKey),
            androidTpnsAccessKeyState: 0,
            loginUrl: nullS(formDic.loginUrl),
            loginUrlState: 0,
            floorUrl: nullS(formDic.floorUrl),
            floorUrlState: 0,
            googleKey: nullS(formDic.googleKey),
            googleKeyState: 0,
            agentUrl: nullS(formDic.agentUrl),
            agentUrlState: 0,
            wsServiceUrl: nullS(formDic.wsServiceUrl),
            wsServiceUrlState: 0,
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
              if (formDic.appServiceUrlState === 1) {
                params['appServiceUrl'] = nullS(formDic.appServiceUrl)
              }
              if (formDic.domainState === 1) {
                params['domain'] = nullS(formDic.domain)
              }
              if (formDic.domainTwoState === 1) {
                params['domainTwo'] = nullS(formDic.domainTwo)
              }
              if (formDic.domainThreeState === 1) {
                params['domainThree'] = nullS(formDic.domainThree)
              }
              if (formDic.h5UrlState === 1) {
                params['h5Url'] = nullS(formDic.h5Url)
              }
              if (formDic.shareContentState === 1) {
                params['shareContent'] = nullS(formDic.shareContent)
              }
              if (formDic.promotionUrlState === 1) {
                params['promotionUrl'] = nullS(formDic.promotionUrl)
              }

              if (formDic.identifierState === 1) {
                params['identifier'] = nullS(formDic.identifier)
              }

              if (formDic.sdkappidState === 1) {
                params['sdkappid'] = nullS(formDic.sdkappid)
              }
              if (formDic.imkeyState === 1) {
                params['imkey'] = nullS(formDic.imkey)
              }

              if (formDic.androidTpnsAccessIdState === 1) {
                params['androidTpnsAccessId'] = nullS(formDic.androidTpnsAccessId)
              }
              if (formDic.androidTpnsAccessKeyState === 1) {
                params['androidTpnsAccessKey'] = nullS(formDic.androidTpnsAccessKey)
              }
              if (formDic.iosTpnsAccessIdState === 1) {
                params['iosTpnsAccessId'] = nullS(formDic.iosTpnsAccessId)
              }
              if (formDic.iosTpnsAccessKeyState === 1) {
                params['iosTpnsAccessKey'] = nullS(formDic.iosTpnsAccessKey)
              }
              if (formDic.loginUrlState === 1) {
                params['loginUrl'] = nullS(formDic.loginUrl)
              }
              if (formDic.floorUrlState === 1) {
                params['floorUrl'] = nullS(formDic.floorUrl)
              }
              if (formDic.lineGatewayUrlsState === 1) {
                params['lineGatewayUrls'] = nullS(formDic.lineGatewayUrls)
              }
              if (formDic.googleKeyState === 1) {
                params['googleKey'] = nullS(formDic.googleKey)
              }
              if (formDic.agentUrlState === 1) {
                params['agentUrl'] = nullS(formDic.agentUrl)
              }
              if (formDic.wsServiceUrlState === 1) {
                params['wsServiceUrl'] = nullS(formDic.wsServiceUrl)
              }
              updateBaseConfigUrl(params)
                .then(() => {
                  this.loading = false
                  this.$notify({
                    title: '成功',
                    message: '操作成功！',
                    type: 'success'
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
.formContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 30px;
}
.subBtn {
  text-align: center;
}
</style>

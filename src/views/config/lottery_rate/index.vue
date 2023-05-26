<template>
  <div v-cloading="loading" class="app-container">
    <el-button
      size="small"
      icon="el-icon-refresh"
      @click="fetchData"
    >刷新</el-button>
    <el-form
      ref="configForm"
      :model="configModel"
      style="width: 640px; margin: auto"
      label-position="top"
      size="medium"
    >
      <!-- <el-form-item label="快三目标额度(元)"> -->
      <el-form-item label="jsks目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.jsksQuota"
            :disabled="configModel.jsksQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.jsksQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <!-- <el-form-item label="鱼虾蟹目标额度"> -->
      <el-form-item label="yuxx目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.yuxxQuota"
            :disabled="configModel.yuxxQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.yuxxQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="txss目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.txsscQuota"
            :disabled="configModel.txsscQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.txsscQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <!-- <el-form-item label="北京赛车目标额度"> -->
      <el-form-item label="pk10目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.pk10Quota"
            :disabled="configModel.pk10QuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.pk10QuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <!-- <el-form-item label="六合彩目标额度"> -->
      <el-form-item label="yflhc目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.yflhcQuota"
            :disabled="configModel.yflhcQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.yflhcQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <!-- <el-form-item label="越南河内目标额度"> -->
      <el-form-item label="yn_hncp目标额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.hncpQuota"
            :disabled="configModel.hncpQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g,'')"
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.hncpQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="负盈利额度">
        <div style="display: flex">
          <el-input
            v-model="configModel.commontQuota"
            :disabled="configModel.commontQuotaState === 0 ? true : false"
            placeholder="请输入额度金额"
            clearable
            maxlength="20"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.commontQuotaState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label=" "  
        ><el-button type="primary" @click="submitForm()"
          >保存配置</el-button
        ></el-form-item
      >
    </el-form>
  </div>
</template>

<script>
import { getLotteryRate, updateLotteryRate } from "@/api/config/lottery_rate";
import { emptyS, nullS } from "@/utils/tools";

export default {
  name: "LotteryRateController",
  data() {
    return {
      loading: false,
      // 表单数据
      configModel: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      getLotteryRate()
        .then((res) => {
          const formDic = res.data || {};
          this.configModel = {
            txsscQuota: nullS(`${formDic.txsscQuota}`),
            txsscQuotaState: 0,
            jsksQuota: nullS(`${formDic.jsksQuota}`),
            jsksQuotaState: 0,
            pk10Quota: nullS(`${formDic.pk10Quota}`),
            pk10QuotaState: 0,
            yflhcQuota: nullS(`${formDic.yflhcQuota}`),
            yflhcQuotaState: 0,
            hncpQuota: nullS(`${formDic.hncpQuota}`),
            hncpQuotaState: 0,
            yuxxQuota: nullS(`${formDic.yuxxQuota}`),
            yuxxQuotaState: 0,
            commontQuota: nullS(`${formDic.commontQuota}`),
            commontQuotaState: 0,
          };
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
        });
    },

    // 提交表单
    submitForm() {
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          this.$confirm("确定使用该配置吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            showClose: false,
          })
            .then(() => {
              const formDic = Object.assign({}, this.configModel); // copy obj
              // 请求服务器
              var params = {};
              if (formDic.jsksQuotaState === 1) {
                params["jsksQuota"] = nullS(formDic.jsksQuota);
              }
              if (formDic.txsscQuotaState === 1) {
                params["txsscQuota"] = nullS(formDic.txsscQuota);
              }
              if (formDic.yuxxQuotaState === 1) {
                params["yuxxQuota"] = nullS(formDic.yuxxQuota);
              }
              if (formDic.pk10QuotaState === 1) {
                params["pk10Quota"] = nullS(formDic.pk10Quota);
              }
              if (formDic.yflhcQuotaState === 1) {
                params["yflhcQuota"] = nullS(formDic.yflhcQuota);
              }
              if (formDic.hncpQuotaState === 1) {
                params["hncpQuota"] = nullS(formDic.hncpQuota);
              }
              if (formDic.commontQuotaState === 1) {
                if (parseInt(`${formDic.commontQuota}`) > 0) {
                  this.$message({
                    message: "负盈利额度不能大于0",
                    type: "warning",
                  });
                  return;
                }
                params["commontQuota"] = nullS(formDic.commontQuota);
              }

              this.loading = true;
              updateLotteryRate(params)
                .then(() => {
                  this.loading = false;
                  this.$notify({
                    title: "成功",
                    message: "修改配置成功",
                    type: "success",
                    duration: 1500,
                  });

                  setTimeout((_) => {
                    this.fetchData();
                  }, 200);
                })
                .catch((err) => {
                  this.loading = false;
                  this.$message.error(err);
                });
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

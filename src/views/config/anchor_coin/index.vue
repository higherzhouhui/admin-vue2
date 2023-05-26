<template>
  <div v-cloading="loading" class="app-container">
    <el-form
      ref="configForm"
      :model="configModel"
      :rules="rules"
      style="width: 640px; margin: auto"
      label-position="top"
      size="medium"
    >
      <el-form-item label="日榜第一奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayFirstCoin"
            :disabled="configModel.dayFirstCoinState === 0 ? true : false"
            placeholder="请输入日榜第一奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayFirstCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第二奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.daySecondCoin"
            :disabled="configModel.daySecondCoinState === 0 ? true : false"
            placeholder="请输入日榜第二奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.daySecondCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第三奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayThirdCoin"
            :disabled="configModel.dayThirdCoinState === 0 ? true : false"
            placeholder="请输入日榜第三奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayThirdCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第4-10奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayTenCoin"
            :disabled="configModel.dayTenCoinState === 0 ? true : false"
            placeholder="请输入日榜第4-10奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayTenCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第11-20奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayTwentyCoin"
            :disabled="configModel.dayTwentyCoinState === 0 ? true : false"
            placeholder="请输入日榜第11-20奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayTwentyCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第21-50奖励的金币">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayFiftyCoin"
            :disabled="configModel.dayFiftyCoinState === 0 ? true : false"
            placeholder="请输入日榜第21-50奖励的金币"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayFiftyCoinState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="日榜第一奖励需要的累计打赏金额" prop="dayFirstRank">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayFirstRank"
            :disabled="configModel.dayFirstRankState === 0 ? true : false"
            placeholder="请输入日榜第一奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayFirstRankState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="日榜第二奖励需要的累计打赏金额">
        <div style="display: flex">
          <el-input
            v-model="configModel.daySecondRank"
            :disabled="configModel.daySecondRankState === 0 ? true : false"
            placeholder="请输入日榜第二奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.daySecondRankState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="日榜第三奖励需要的累计打赏金额">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayThirdRank"
            :disabled="configModel.dayThirdRankState === 0 ? true : false"
            placeholder="请输入日榜第三奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayThirdRankState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="日榜第4-10奖励需要的累计打赏金额">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayTenRank"
            :disabled="configModel.dayTenRankState === 0 ? true : false"
            placeholder="请输入日榜第4-10奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayTenRankState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="日榜第11-20奖励需要的累计打赏金额">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayTwentyRank"
            :disabled="configModel.dayTwentyRankState === 0 ? true : false"
            placeholder="请输入日榜第11-20奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayTwentyRankState = 1"
            >编辑</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="日榜第21-50奖励需要的累计打赏金额">
        <div style="display: flex">
          <el-input
            v-model="configModel.dayFiftyRank"
            :disabled="configModel.dayFiftyRankState === 0 ? true : false"
            placeholder="请输入日榜第21-50奖励需要的累计打赏金额"
            clearable
            maxlength="100"
            show-word-limit
          />
          <el-button
            plain
            style="margin-left: 20px"
            type="primary"
            @click="configModel.dayFiftyRankState = 1"
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
import { updateDayRank, getDayRank } from "@/api/config/anchor_coin";
import { emptyS, nullS } from "@/utils/tools";

export default {
  name: "CoinJobController",
  data() {
    return {
      loading: false,
      // 表单数据
      configModel: {},
      // 验证规则
      rules: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      getDayRank()
        .then((res) => {
          const formDic = res.data || {};
          this.configModel = {
            dayFirstRank: nullS(formDic.dayFirstRank),
            dayFirstRankState: 0,
            daySecondRank: nullS(formDic.daySecondRank),
            daySecondRankState: 0,
            dayThirdRank: nullS(formDic.dayThirdRank),
            dayThirdRankState: 0,
            dayTenRank: nullS(formDic.dayTenRank),
            dayTenRankState: 0,
            dayTwentyRank: nullS(formDic.dayTwentyRank),
            dayTwentyRankState: 0,
            dayFiftyRank: nullS(formDic.dayFiftyRank),
            dayFiftyRankState: 0,
            dayFirstCoin: nullS(formDic.dayFirstCoin),
            dayFirstCoinState: 0,
            daySecondCoin: nullS(formDic.daySecondCoin),
            daySecondCoinState: 0,
            dayThirdCoin: nullS(formDic.dayThirdCoin),
            dayThirdCoinState: 0,
            dayTenCoin: nullS(formDic.dayTenCoin),
            dayTenCoinState: 0,
            dayTwentyCoin: nullS(formDic.dayTwentyCoin),
            dayTwentyCoinState: 0,
            dayFiftyCoin: nullS(formDic.dayFiftyCoin),
            dayFiftyCoinState: 0,
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
              this.loading = true;
              // 请求服务器
              var params = {};
              if (formDic.dayFirstRankState === 1) {
                params["dayFirstRank"] = nullS(formDic.dayFirstRank);
              }
              if (formDic.daySecondRankState === 1) {
                params["daySecondRank"] = nullS(formDic.daySecondRank);
              }
              if (formDic.dayThirdRankState === 1) {
                params["dayThirdRank"] = nullS(formDic.dayThirdRank);
              }
              if (formDic.dayTenRankState === 1) {
                params["dayTenRank"] = nullS(formDic.dayTenRank);
              }
              if (formDic.dayTwentyRankState === 1) {
                params["dayTwentyRank"] = nullS(formDic.dayTwentyRank);
              }
              if (formDic.dayFiftyRankState === 1) {
                params["dayFiftyRank"] = nullS(formDic.dayFiftyRank);
              }
              if (formDic.dayFirstCoinState === 1) {
                params["dayFirstCoin"] = nullS(formDic.dayFirstCoin);
              }
              if (formDic.daySecondCoinState === 1) {
                params["daySecondCoin"] = nullS(formDic.daySecondCoin);
              }
              if (formDic.dayThirdCoinState === 1) {
                params["dayThirdCoin"] = nullS(formDic.dayThirdCoin);
              }
              if (formDic.dayTenCoinState === 1) {
                params["dayTenCoin"] = nullS(formDic.dayTenCoin);
              }
              if (formDic.dayTwentyCoinState === 1) {
                params["dayTwentyCoin"] = nullS(formDic.dayTwentyCoin);
              }
              if (formDic.dayFiftyCoinState === 1) {
                params["dayFiftyCoin"] = nullS(formDic.dayFiftyCoin);
              }

              updateDayRank(params)
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

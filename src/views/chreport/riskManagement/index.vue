<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 220px" placeholder="请输入用户ID" clearable
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-form-item>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" plain icon="el-icon-refresh" @click="reset()">重置</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <div
          style="display: flex; align-items: center; justify-content: center"
        >
          <div
            v-for="(item, index) in timeDatas"
            :key="index"
            :class="`timeDatas ${indexs == index ? 'timeDatas2' : ''}`"
            @click="timeDatasF(item, index)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-form-item> -->
    </el-form>

    <el-table v-cloading="listLoading" :data="list" border highlight-current-row size="mini">
      <el-table-column v-for="(item, index) in listD1" :key="`${item}_${index}`" :prop="item" :label="item"
        min-width="160" sortable />
    </el-table>

    <div v-if="list != null && list[0] != undefined" style="
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        padding: 10px;
        color: #606266;
        margin: 10px 0;
      ">
      <div>当前页合计:</div>
      <div>存款金额：{{ totalData.depositAmt }}</div>
      ,
      <div>取款金额：{{ totalData.withdrawAmt }}</div>
      ,
      <div>取存差值：{{ totalData.difference }}</div>
      ,
      <div>优惠金额：{{ totalData.boundAmt }}</div>
      ,
      <div>
        是否绑定银行卡：{{ totalData.bindCard == 1 ? "绑定" : "未绑定" }}
      </div>
      ,
      <div style="display: flex; align-items: center">
        账号类型：
        <div :class="`${getLabelName(totalData.userType).class}`">
          {{ getLabelName(totalData.userType).name }}
        </div>
      </div>
    </div>

    <!-- <el-table
      v-cloading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="trn"
        label="订单号"
        min-width="160"
         
      />
      <el-table-column
        prop="gname"
        label="用户ID"
        min-width="100"
         
      />
      <el-table-column
        prop="hours"
        label="昵称"
        min-width="100"
         
      />
      <el-table-column
        prop="goldCoin"
        label="是否绑定银行卡"
        min-width="110"
         
      />
      <el-table-column
        prop="statusString"
        label="数据类型"
        min-width="100"
         
      />
      <el-table-column
        prop="operator"
        label="金额"
        min-width="100"
         
        sortable
      />
      <el-table-column
        prop="gmtCreateString"
        label="操作后金额"
        width="160"
         
        sortable
      />
      <el-table-column
        prop="gmtendTimeString"
        label="操作类型"
        width="160"
         
      />
      <el-table-column
        prop="gmtendTimeString"
        label="收款方式"
        width="100"
         
      />
      <el-table-column
        prop="gmtendTimeString"
        label="状态"
        width="100"
         
      />
      <el-table-column
        prop="gmtendTimeString"
        label="订单时间"
        width="100"
         
      />
      <el-table-column
        prop="gmtendTimeString"
        label="备注"
        width="100"
         
      />
    </el-table> -->

    <el-table v-if="list != null && list[0] != undefined" v-cloading="listLoading" :data="list2" size="mini">
      <el-table-column type="index" label="序号" width="60">
        <template slot-scope="{ row }">
          {{ row.cIndex + (listQuery.page - 1) * listQuery.limit }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="oldCoin" label="变更前金币" sortable min-width="150" />
      <el-table-column prop="goldCoin" label="变更金币" sortable min-width="150" />
      <el-table-column prop="endCoin" label="变更后金币" sortable min-width="150" />
      <el-table-column label="类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.isIncrease ? 'info' : 'primary'">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来源" width="200">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.isIncrease ? 'info' : 'success'">{{ row.stringString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="trn" label="订单号" min-width="80" />
      <el-table-column prop="gmtCreateString" label="订单创建时间" width="140" />
      <!-- <el-table-column
        prop="gmtUpdateString"
        label="更新时间"
        width="140"
         
      /> -->
    </el-table>

    <!-- 分页 -->
    <el-pagination v-if="list != null && list[0] != undefined" class="vue-pagination" background
      :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  userProfitStatis
} from "@/api/chreport/riskManagement";
import {
  userProfitStatisInfo
} from "@/api/report/riskManagement";
import { getAssetsPlusList, getAssetsPlus } from "@/api/center/assets/plus";
import { getTypeOfFunds } from "@/api/center/user/assets_log";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";

import { getUserCategoryList } from "@/api/center/assets/assets";
import UserDrawer from "@/components/UserDrawer";
import moment from "moment";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "ChReportRiskManagementIndex",
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      list2: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        uid: null,
        gid: null,
        trn: null,
        pickerValue: [],
      },
      listD1: [],
      indexs: 0,
      timeDatas: [
        { name: "今天", times: [new Date().getTime(), new Date().getTime()] },
        { name: "昨天", times: [new Date().getTime(), new Date().getTime()] },
        { name: "上周", times: [new Date().getTime(), new Date().getTime()] },
        { name: "本月", times: [new Date().getTime(), new Date().getTime()] },
        { name: "上月", times: [new Date().getTime(), new Date().getTime()] },
        {
          name: "最近七天",
          times: 1,
        },
      ],

      carOptions: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = moment(moment().format("YYYY-MM-DD")).toDate();
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const start = moment(moment().format("YYYY-MM-DD")).toDate();
              const end = moment(moment().format("YYYY-MM-DD")).toDate();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上周",
            onClick(picker) {
              const start = moment()
                .week(moment().week() - 1)
                .startOf("week")
                .add(1, "days")
                .toDate();
              const end = moment()
                .week(moment().week() - 1)
                .endOf("week")
                .add(1, "days")
                .toDate();
              start.setTime(start.getTime());
              end.setTime(end.getTime() - 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上周",
            onClick(picker) {
              const start = moment()
                .month(moment().month() - 1)
                .startOf("month")
                .toDate();
              const end = moment()
                .month(moment().month() - 1)
                .endOf("month")
                .toDate();
              start.setTime(start.getTime());
              end.setTime(end.getTime() - 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },

      typeOptions: [],

      totalData: {},

      labelOptionList: [],
    };
  },
  // created() {
  //   this.fetchData();
  // },
  methods: {
    getLabelName(type) {
      const flist = this.labelOptionList.filter((item) => {
        return item.code == type;
      });
      const obj = {
        name: "普通",
        class: "mkeyi",
      };
      if (flist.length) {
        obj.name = flist[0].categoryName;
        if (type == 1) {
          obj.class = "mputong";
        }
        if (type == 9) {
          obj.class = "mdaili";
        }
        if (type == 10) {
          obj.class = "mteyao";
        }
        if (type == 11) {
          obj.class = "myouzhi";
        }
      }
      return obj;
    },

    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        uid: this.listQuery.uid,
      };
      this.fetchData();

      this.fetchData2();
    },
    // 获取列表数据
    fetchData() {
      if (!this.listQuery.uid) {
        this.$message({
          type: "warning",
          message: "请输入用户ID查询",
        });
        return;
      }
      this.getUserCategoryListF();

      this.listLoading = true;
      // 获取所有座驾配置列表
      userProfitStatis(this.listQuery)
        .then((res) => {
          let data = res.data || [];
          // title
          let data2 = ["平台"];

          // 数据
          let demo1 = { 平台: "投注金额" };
          // let demo2 = { 平台: "投注人数" };

          let demo2 = { 平台: "派彩金额" };
          let demo3 = { 平台: "有效投注" };
          let demo4 = { 平台: "输赢金额" };
          let data3 = [];
          data.forEach((value, index) => {
            data2.push(value.gameName);
            //投注金额
            demo1[value.gameName] = value.betCoin;
            //投注人数
            // demo2[value.gameName] = value.betUserNo;
            //派彩金额
            demo2[value.gameName] = value.payment;
            //有效投注
            demo3[value.gameName] = value.validBetCoin;
            //输赢金额
            demo4[value.gameName] = value.winLoseCoin;
          });

          data3 = [demo1, demo2, demo3, demo4];
          // console.log("data3", demo1, demo2, demo3, demo4, data3);
          // title
          this.listD1 = data2;
          // 数据
          this.list = data3;
          this.listLoading = false;
          // this.listQuery.total = res.data.total;

          userProfitStatisInfo(this.listQuery).then((item_2) => {
            console.log("items", item_2);

            this.totalData = item_2.data;
          });
        })
        .catch((err) => {
          this.list = null;
          // this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 获取列表数据
    async fetchData2() {
      this.listLoading = true;
      this.todayListLoading = true;
      getAssetsPlus(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        var totallist = [];
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != "{}"
        ) {
          totallist.push(res.data);
        }
        this.todayList = totallist;
      });
      if (!this.typeOptions.length) {
        const itemsArray = [];
        const moneyTypeRes = await getTypeOfFunds();
        if (moneyTypeRes.code === 200 && moneyTypeRes.data.all) {
          moneyTypeRes.data.all.map((item) => {
            const citem = {
              label: item.assetsName,
              value: item.assetsType,
            };
            itemsArray.push(citem);
          });
        }
        this.typeOptions = itemsArray;
      }

      getAssetsPlusList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          console.log(res, "23222");
          this.list2 = (res.data.list || []).map((item, index) => {
            var typeString = "";
            if (item.isIncrease === 0) {
              typeString = "增加资产";
            } else if (item.isIncrease === 1) {
              typeString = "减少资产";
            }
            item.cIndex = index + 1;
            var stringString = item.type;
            const fliterArray = this.typeOptions.filter((citem) => {
              return citem.value === item.type;
            });
            if (fliterArray.length) {
              stringString = fliterArray[0].label;
            }
            // if (item.type == 0) {
            //   stringString = '关播付费收益'
            // } else if (item.type == 1) {
            //   stringString = '送礼收益'
            // } else if (item.type == 2) {
            //   stringString = '充值收益'
            // } else if (item.type == 3) {
            //   stringString = '用户付费扣费'
            // } else if (item.type == 4) {
            //   stringString = '用户送礼扣费'
            // } else if (item.type == 5) {
            //   stringString = '用户守护扣费'
            // } else if (item.type == 6) {
            //   stringString = '主播守护收益'
            // } else if (item.type == 7) {
            //   stringString = '金牌主播保底收益发放'
            // } else if (item.type == 8) {
            //   stringString = '金币提现'
            // } else if (item.type == 9) {
            //   stringString = '魅力提现'
            // } else if (item.type == 10) {
            //   stringString = '游戏代入金币'
            // } else if (item.type == 11) {
            //   stringString = '游戏代出金币'
            // } else if (item.type == 12) {
            //   stringString = '后台修改资产'
            // } else if (item.type == 13) {
            //   stringString = '魅力值转换成金币'
            // } else if (item.type == 14) {
            //   stringString = '分享收益兑换金币'
            // } /* else if (item.type == 15) {
            //     stringString = '代理账户给用户充值金币'
            //   } */ else if (item.type == 16) {
            //   stringString = '开元游戏上分变换金币'
            // } else if (item.type == 17) {
            //   stringString = '开元游戏下分变换金币'
            // } else if (item.type == 18) {
            //   stringString = '彩票投注扣费'
            // } else if (item.type == 19) {
            //   stringString = '彩票投注失败退回金币'
            // } else if (item.type == 20) {
            //   stringString = '彩票开奖结算金币'
            // } else if (item.type == 22) {
            //   stringString = 'job添加用户资产'
            // } else if (item.type == 23) {
            //   stringString = '用户购买座驾'
            // } else if (item.type == 24) {
            //   stringString = '日榜彩金发送'
            // } else if (item.type == 25) {
            //   stringString = '周榜彩金发送'
            // } else if (item.type == 26) {
            //   stringString = '金币提现被驳回'
            // } else if (item.type == 27) {
            //   stringString = '魅力提现被驳回'
            // } else if (item.type == 28) {
            //   stringString = '银行卡充值收益'
            // } else if (item.type == 29) {
            //   stringString = 'ag游戏上分变换金币'
            // } else if (item.type == 30) {
            //   stringString = 'ag游戏下分变换金币'
            // } /* else if (item.type == 31) {
            //     stringString = '大富翁游戏上分变换金币'
            //   } else if (item.type == 32) {
            //     stringString = '大富翁游戏下分变换金币'
            //   } */ else if (item.type == 33) {
            //   stringString = '用户购买贵族'
            // } else if (item.type == 34) {
            //   stringString = '用户续费贵族'
            // } else if (item.type == 35) {
            //   stringString = '用户升级贵族'
            // } else if (item.type == 36) {
            //   stringString = '彩票补偿金币'
            // } else if (item.type == 37) {
            //   stringString = '资产变更-彩票补偿金币'
            // } else if (item.type == 40) {
            //   stringString = '今存明送彩票彩金'
            // } else if (item.type == 42) {
            //   stringString = '神秘活动彩金'
            // } else if (item.type == 41) {
            //   stringString = '工资等级彩金'
            // } else if (item.type == 43) {
            //   stringString = '现金回馈彩金'
            // } else if (item.type == 44) {
            //   stringString = '彩票得意彩金'
            // } else if (item.type == 45) {
            //   stringString = '红包彩金'
            // } else if (item.type == 47) {
            //   stringString = '每日盈亏'
            // } else if (item.type == 51) {
            //   stringString = '金牛报春'
            // } else if (item.type == 52) {
            //   stringString = 'BG游戏上分变换金币'
            // } else if (item.type == 53) {
            //   stringString = 'BG游戏下分变换金币'
            // } else if (item.type == 54) {
            //   stringString = 'CMD体育上分变换金额'
            // } else if (item.type == 55) {
            //   stringString = 'CMD体育下分变换金额'
            // } else if (item.type == 561) {
            //   stringString = '一分快三-[和值]'
            // } else if (item.type == 562) {
            //   stringString = '一分快三-[二同号复选]'
            // } else if (item.type == 563) {
            //   stringString = '一分快三-[三军]'
            // } else if (item.type == 571) {
            //   stringString = '一分时时彩-[个位]'
            // } else if (item.type == 572) {
            //   stringString = '一分时时彩-[十位]'
            // } else if (item.type == 573) {
            //   stringString = '一分时时彩-[龙虎万千]'
            // } else if (item.type == 581) {
            //   stringString = '北京赛车-[猜冠军]'
            // } else if (item.type == 582) {
            //   stringString = '北京赛车-[冠亚和大小单双]'
            // } else if (item.type == 591) {
            //   stringString = '一分六合彩-[特码两面]'
            // } else if (item.type == 592) {
            //   stringString = '一分六合彩-[特码生肖]'
            // } else if (item.type == 593) {
            //   stringString = '一分六合彩-[特码色波]'
            // } else if (item.type == 601) {
            //   stringString = '鱼虾蟹-[一同号]'
            // } else if (item.type == 602) {
            //   stringString = '鱼虾蟹-[二同号]'
            // } else if (item.type == 603) {
            //   stringString = '鱼虾蟹-[二不同]'
            // } else if (item.type == 611) {
            //   stringString = '河内彩票-[特码]'
            // } else if (item.type == 612) {
            //   stringString = '河内彩票-[普通号]'
            // } else if (item.type == 120) {
            //   stringString = '人工-测试金币'
            // } else if (item.type == 121) {
            //   stringString = '人工-首充彩金'
            // } else if (item.type == 122) {
            //   stringString = '人工-首提彩金'
            // } else if (item.type == 123) {
            //   stringString = '人工-用户亏损彩金'
            // } else if (item.type == 124) {
            //   stringString = '人工-掉单'
            // } else if (item.type == 125) {
            //   stringString = '人工-其他'
            // } else if (item.type == 126) {
            //   stringString = '人工-人工提出'
            // } else if (item.type == 127) {
            //   stringString = '人工-每日亏损彩金'
            // } else if (item.type == 128) {
            //   stringString = '人工-用户贡献彩金'
            // } else if (item.type == 129) {
            //   stringString = '人工-每日首充彩金'
            // } else if (item.type == 130) {
            //   stringString = '人工-用户回馈彩金'
            // } else if (item.type == 131) {
            //   stringString = '人工-广告工资'
            // } else if (item.type == 299) {
            //   stringString = 'USDT充值收益'
            // } else if (item.type == 56) {
            //   stringString = '沙巴体育上分变换金币'
            // } else if (item.type == 57) {
            //   stringString = '沙巴体育下分变换金币'
            // } else if (item.type == 613) {
            //   stringString = '红包中奖'
            // } else if (item.type == 58) {
            //   stringString = 'BTI体育上分变换金币'
            // } else if (item.type == 59) {
            //   stringString = 'BTI体育下分变换金币'
            // } else if (item.type == 60) {
            //   stringString = 'SE真人上分变换金币'
            // } else if (item.type == 61) {
            //   stringString = 'SE真人下分变换金币'
            // } else if (item.type == 74) {
            //   stringString = 'XG体育上分变换金币'
            // } else if (item.type == 75) {
            //   stringString = 'XG体育下分变换金币'
            // } else if (item.type == 70) {
            //   stringString = 'OB真人上分变换金币'
            // } else if (item.type == 71) {
            //   stringString = 'OB真人下分变换金币'
            // } else if (item.type == 324) {
            //   stringString = 'PP电子上分变换金额'
            // } else if (item.type == 325) {
            //   stringString = 'PP电子下分变换金额'
            // } else if (item.type == 326) {
            //   stringString = 'EVO电子上分变换金额'
            // } else if (item.type == 327) {
            //   stringString = 'EVO电子下分变换金额'
            // } else if (item.type == 328) {
            //   stringString = 'QT游戏上分变换金额'
            // } else if (item.type == 329) {
            //   stringString = 'QT游戏下分变换金额'
            // } else if (item.type == 331) {
            //   stringString = '体育反水'
            // } else if (item.type == 332) {
            //   stringString = '真人反水'
            // } else if (item.type == 333) {
            //   stringString = '老虎机反水'
            // } else if (item.type == 420) {
            //   stringString = 'RWB投注扣钱'
            // } else if (item.type == 421) {
            //   stringString = 'RWB重新结算扣钱'
            // } else if (item.type == 422) {
            //   stringString = 'RWB结算加钱'
            // } else if (item.type == 400) {
            //   stringString = 'FB投注扣钱'
            // } else if (item.type == 401) {
            //   stringString = 'FB派彩/本金'
            // } else if (item.type == 402) {
            //   stringString = 'FB退款'
            // } else if (item.type == 403) {
            //   stringString = 'FB提前结算'
            // } else if (item.type == 404) {
            //   stringString = 'FB订单取消补扣'
            // } else if (item.type == 405) {
            //   stringString = 'FB订单取消返还'
            // } else if (item.type == 460) {
            //   stringString = '注册体验活动'
            // } else if (item.type == 461) {
            //   stringString = '注册体验活动扣除'
            // } else if (item.type == 334) {
            //   stringString = 'VIP升级礼金'
            // } else if (item.type == 335) {
            //   stringString = 'VIP月红包'
            // } else if (item.type == 336) {
            //   stringString = 'VIP生日礼金'
            // } else if (item.type == 337) {
            //   stringString = 'VIP周复赛奖金'
            // }
            this.$set(item, "typeString", typeString);
            this.$set(item, "stringString", stringString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            this.$set(item, "gmtUpdateString", formatUnixTime(item.gmtUpdate));
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list2 = [];
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    async getUserCategoryListF() {
      const res = await getUserCategoryList({});
      if (!(res instanceof Error)) {
        if (res.data) {
          this.labelOptionList = res.data;
        }
      }
    },
    // 选中
    // timeDatasF(item, i) {
    //   console.log(formatUnixTime(new Date()));

    //   console.log(item.times, i);

    //   this.indexs = i;
    // },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      this.fetchData();
      this.fetchData2();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      // this.fetchData();
      this.fetchData2();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      // this.fetchData();
      this.fetchData2();
    },
  },
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

.timeDatas {
  width: 80px;
  height: 35px;
  margin-right: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.timeDatas:hover {
  background: var(--theme);
  border: 1px solid var(--theme);
  color: #fff;
}

.timeDatas2 {
  background: var(--theme);
  border: 1px solid var(--theme);
  color: #fff;
}
</style>

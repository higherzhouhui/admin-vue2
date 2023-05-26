<template>
  <div>
    <!-- 按钮 -->
    <span v-if="data">
      <div style="display: flex; align-items: center">
        <span> {{ "查看" }}</span>
        <el-button
          style="margin: 0; padding: 0"
          type="text"
          @click.stop="showDrawerClick"
        >
          <i class="el-icon--right"
            ><svg-icon icon-class="eye-open" class-name="see-btn"
          /></i>
        </el-button>
      </div>
    </span>

    <!-- 侧边栏 -->
    <el-drawer
      direction="rtl"
      :append-to-body="true"
      :modal-append-to-body="false"
      :close-on-press-escape="true"
      :wrapper-closable="true"
      :show-close="true"
      :destroy-on-close="true"
      :title="'投注详情'"
      :visible.sync="drawer"
      :size="'80%'"
    >
      <div class="panel">
        <el-card class="card">
          <div class="card2">
            <!-- ${index == 0 ? 'border_top' : ''} -->
            <div
              v-for="(item, index) in JSONData"
              :key="index"
              :class="`JSONData  `"
            >
              <div class="JSONData_top">
                {{ item.names }}
              </div>
              <div class="JSONData_bottom">
                <span
                  v-if="
                    item.key == 'awayteamname' ||
                    item.key == 'hometeamname' ||
                    item.key == 'leaguename' ||
                    item.key == 'bettypename' ||
                    item.key == 'sportname'
                  "
                  >{{ item[item.key][1].name }}</span
                >
                <span v-else>{{ item[item.key] }}</span>
              </div>
            </div>
          </div>
        </el-card>
        <!-- tableTop -->
        <el-table v-if="list[0] != undefined" :data="list" size="mini">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            v-for="item in tableTop"
            :prop="item.key"
            :label="item.names"
            :key="item.key"
            width="150"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "UserDrawer",
  props: {
    data: {
      required: false,
      type: String,
      default: "",
    },
  },
  data() {
    return {
      drawer: false,
      JOSNCN: {
        trans_id: "注单编号",
        vendor_member_id: "会员账号",
        operator_id: "厂商 ID",
        league_id: "联赛编号",
        leaguename: "联赛名称",
        lang: "语系",
        name: "联赛或队伍名称",
        match_id: "赛事编号",
        home_id: "主队编号",
        hometeamname: "主队名称",
        away_id: "客队编号",
        awayteamname: "客队名称",
        team_id: "队伍编号",
        game_id: "场次编号",
        match_datetime: "赛事开球时间",
        sport_type: "体育种类",
        bet_type: "下注类型",
        parlay_ref_no: "混合过关注单号码",
        odds: "注单赔率",
        stake: "会员投注金额",
        transaction_time: "投注交易时间",
        ticket_status: "注单状态",
        winlost_amount: "此注输或赢的金额",
        after_amount: "下注后的余额",
        currency: "币别",
        winlost_datetime: "决胜时间",
        odds_type: "赔率类型",
        odds_Info: "odds_Info",
        bet_team: "下注对象",
        exculding: "会员投注比分",
        bet_tag: "下注",
        homehdp: "主队让球/大小盘球头",
        away_hdp: "客队让球/大小盘球头",
        hdp: "让球/大小盘球头",
        ou_hdp: "篮球总分大小盘球头",
        islive: "是否在滚球时下注",
        home_score: "下注时主队得分",
        home_score2: "预测时间赛果",
        away_score: "下注时客队得分",
        away_score2: "预测时间赛果",
        settlement_time: "注单结算的时间",
        bettypename: "投注类型",
        home_hdp: "主队让球/大小盘球头",
        sportname: "体育类型",
        customInfo1: "厂商备注1",
        customInfo2: "厂商备注2",
        customInfo3: "厂商备注3",
        customInfo4: "厂商备注4",
        customInfo5: "厂商备注5",
        ba_status: "会员是否为 BA 状态",
        esports_gameid: "电子竞技游戏类型",
        total_score: "总进球",
        version_key: "版本号",
        ParlayData: "混合过关信息",
        resettlementinfo: "重新结算信息",
        ActionDate: "重新结算时间",
        balancechange: "余额是否更动",
        winlost: "前次结算输或赢的金额",
        isLucky: "注单属于串关幸运玩法",
        parlay_type: "parlay_type",
        combo_type: "回传内容",
        parlay_id: "混合过关",
        percentage: "折扣比例",
        discount_stake: "折扣后的投注金额",
        match_id: "表示为 pool id",
        bet_team: "Pick 名称",
        transdate: "投注日期",
        sold: "卖给 ColossusBet 的百分比",
        remains: "卖完剩下的百分比",
        line: "多重组合",
        bet_type: "下注类型",
        stake: "会员投注金额",
        status: "ColossusBet 注单状态",
        winlost_amount: "ColossusBet 注单标识符",
        pool_type: "Pool 类型",
        last_ball_no: "下注时，前一颗的球号",
        odds_type: "赔率类型",
        betchoice: "betchoice",
        selection_name: "下注类型 (英文)",
        selection_name_cs: "下注类型 (简中)",
        status: "注单状态",
        tokenmoney: "下注的注单",
        range: "指数范围",
        match_id: "游戏棋数",
        lottery_bettype: "彩票游戏类别",
      },
      JSONData: [],
      ParlayData: [],
      tableTop: [],
      list: [],
    };
  },
  mounted() {},
  methods: {
    // 显示侧边栏
    showDrawerClick() {
      let JSData = JSON.parse(this.data);
      //   console.log("JSON", JSData);
      //   this.JOSNCN
      //   for (const item of JSData) {
      //     console.log("-----item", item);
      //   }
      let as = [];
      for (const key in JSData) {
        for (const key_2 in this.JOSNCN) {
          if (key == key_2) {
            // console.log(
            //   "------------key[JSData]",
            //   this.JOSNCN[key_2],
            //   JSData[key]
            // );

            if (key == "ParlayData") {
              console.log(
                "ParlayData--------------",
                JSData["ParlayData"] != null
                  ? JSON.parse(JSData["ParlayData"])
                  : ""
              );
              if (JSData["ParlayData"] != null) {
                let ParlayDataJSON = JSON.parse(JSData["ParlayData"]);
                let aaaa = [];
                ParlayDataJSON.forEach((value, index) => {
                  value.awayteamname =
                    value.awayteamname != null &&
                    value.awayteamname[0] != undefined
                      ? value.awayteamname[1].name
                      : "";
                  value.bettypename =
                    value.bettypename != null &&
                    value.bettypename[0] != undefined
                      ? value.bettypename[1].name
                      : "";
                  value.hometeamname =
                    value.hometeamname != null &&
                    value.hometeamname[0] != undefined
                      ? value.hometeamname[1].name
                      : "";
                  value.leaguename =
                    value.leaguename != null && value.leaguename[0] != undefined
                      ? value.leaguename[1].name
                      : "";
                  value.sportname =
                    value.sportname != null && value.sportname[0] != undefined
                      ? value.sportname[1].name
                      : "";

                  for (const key in value) {
                    for (const key_2 in this.JOSNCN) {
                      if (key == key_2) {
                        aaaa = [
                          ...aaaa,
                          {
                            names: this.JOSNCN[key_2],
                            key: key,
                            [key]: JSData[key],
                          },
                        ];
                      }
                    }
                  }
                });

                this.list = [...ParlayDataJSON];
                console.log("ParlayDataJSON-------------", [...ParlayDataJSON]);

                let aas = [];
                for (let i = 0; i < aaaa.length; i++) {
                  var judge = true;
                  for (let index = 0; index < aas.length; index++) {
                    if (aaaa[i].key === aas[index].key) {
                      judge = false;
                    }
                  }
                  judge && aas.push(aaaa[i]);
                }
                // console.log("aaaa----------------------------", aaaa, aas);
                this.tableTop = aas;
              }
            } else {
              as = [
                ...as,
                { names: this.JOSNCN[key_2], key: key, [key]: JSData[key] },
              ];
            }
          }
        }
      }
      this.JSONData = as;
      //   console.log("as-------------------", as);
      this.drawer = true;
      // 刷新全部模块
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0;
}
::v-deep .el-card__body {
  padding: 0;
}
::v-deep .el-drawer__header {
  padding: 5px 0 0 20px;
  margin-bottom: 0;
}

.card {
  width: 100%;
  padding: 10px;

  margin-bottom: 20px;
}
.card2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}
.border_top {
  border-top: 1px solid #ebeef5;
}
.JSONData {
  width: 100%;
  display: flex;
  //   flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 45px;
  border-bottom: 1px solid #ebeef5;
}
.JSONData_top {
  height: 100%;
  width: 100%;
  //   border: 1px solid #606266;
  line-height: 45px;
  text-align: center;
  //   border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.JSONData_bottom {
  height: 100%;
  width: 100%;
  line-height: 45px;
  padding-left: 10px;
  border-right: 1px solid #ebeef5;
}
.noAnchor {
  padding: 10px 0 10px 10px;
  display: inline-block;
}
.panel-header {
  background-color: #fafafa;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 10px;
  span {
    font-weight: bold;
  }
}

.panel {
  padding: 10px;
}

.see-btn {
  padding: 0;
  margin: 0;
  vertical-align: 0em;
}
.card-column {
  display: flex;
  border: 1px solid #ebeef5;
  border-top: none;
  &:hover {
    background-color: rgb(245, 247, 250);
  }
  .column-label {
    min-width: 40%;
    border-right: 1px solid #ebeef5;
    padding: 3px 0;
    font-size: 14px;
    text-align: center;
  }
  .column-data {
    padding: 3px 0 3px 10px;
    font-size: 14px;
  }
  .colorL {
    color: #47a2ff;
    cursor: pointer;
    &:hover {
      color: #0682ff;
    }
  }
}
.card-column:first-child {
  border-top: 1px solid #ebeef5;
}
.column-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .card-column {
    .column-label {
      width: 50%;
    }
    .colorz {
      color: #00b578;
    }
    border-top: none;
  }
  .card-column:first-child {
    border-right: none;
  }
}
.card-title {
  color: var(--theme);
  font-size: 16px;
  font-weight: 500;
}

.card-ctxs-anchor {
  display: flex;
  flex-direction: column;

  .tag-v {
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    border-top: none;
    .tag-title {
      color: #606266;
      font-size: 16px;
      line-height: 22px;
      font-weight: normal;
      line-height: normal;
      min-width: 24.8%;
      text-align: center;
    }
    > span {
      border-left: 1px solid #ebeef5;
      padding: 3px 0 3px 10px;
    }
  }
  .tag-v:first-child {
    border-top: 1px solid #ebeef5;
  }
}

.card-ctxs {
  display: flex;
  flex-direction: column;
  .card-switch {
    display: flex;
    align-items: center;
    padding: 0px;
    margin: 0px;
  }

  span {
    color: #606266;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    padding: 3px 0px;
  }
}

.list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 13px;
  b {
    color: red;
    display: flex;
    margin-bottom: 10px;
  }
  span {
    display: block;
    width: 100%;
    color: #606266;
    padding: 3px 0px;
    font-size: 16px;
  }
}

.colorRed {
  color: red;
}
</style>

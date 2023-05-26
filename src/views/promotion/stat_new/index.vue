<template>
  <div class="app-container">
    <div style="margin-bottom: 20px" />

    <div style="margin: 40px 0px">
      <el-divider content-position="center">
        <h2>今日统计</h2>
      </el-divider>
    </div>

    <!-- 选择框 -->
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between">
      <!-- 级联选择器 -->
      <el-cascader v-model="todayListQuery.channel" size="small" :props="cascaderProps" :show-all-levels="false"
        placeholder="请选择" clearable @change="handleTodaySearchFilter" />
      <el-button size="medium" plain @click="refreshTodayClick">刷新</el-button>
      <!--   <el-button style="margin: 10px" type="primary" @click="changeStart()">昨日统计</el-button> -->
    </div>

    <el-table v-cloading="todayListLoading" :data="todayList"
      :header-cell-style="{ background: '#66b1ff', color: '#fff' }">
      <el-table-column prop="channel" label="渠道标识" min-width="100" />
      <el-table-column label="游戏总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.gameTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="彩票总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.cpTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开元游戏总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.kyTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>

      <!--      <el-table-column label="BG游戏总盈利" min-width="120"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.bgTotalCoin} ₫` }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="AWC游戏总盈利" min-width="130">
        <template slot-scope="{ row }">
          <span>{{ `${row.awcTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="CMD游戏总盈利" min-width="130"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.cmdTotalCoin} ₫` }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="BTI游戏总盈利" min-width="130">
        <template slot-scope="{ row }">
          <span>{{ `${row.btiTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击量" min-width="130">
        <template slot-scope="{ row }">
          <span>{{ `${row.clickCount}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安装量" min-width="130">
        <template slot-scope="{ row }">
          <span>{{ `${row.installCount}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="沙巴游戏总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.sabaTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="OB游戏总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.obTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="XG游戏总盈利" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.xgTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="至尊游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.zzTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AG游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.agTotalCoin} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="富翁游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.fwTotalCoin} ₫` }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="activeCount" label="活跃用户" min-width="150">
        <template slot-scope="{ row }">
          <div>
            <div>
              安卓:{{
                row.activeCountAndroid == undefined ? 0 : row.activeCountAndroid
              }}
            </div>
            <div>
              苹果:{{
                row.activeCountIos == undefined ? 0 : row.activeCountIos
              }}
            </div>
            <div>
              pc:{{ row.activeCountPc == undefined ? 0 : row.activeCountPc }}
            </div>
            <div>
              h5:{{ row.activeCountH5 == undefined ? 0 : row.activeCountH5 }}
            </div>
            <div>
              合计:{{ row.activeCount == undefined ? 0 : row.activeCount }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="新增用户" min-width="150">
        <template slot-scope="{ row }">
          <!--   <span>{{ `苹果${row.addCountApple} 安卓${row.addCountAndroid} (合计：${row.addCount})` }}</span> -->

          <span>
            苹果: <strong>{{ `${row.addCountApple}` }}</strong><br />安卓: <strong>{{ `${row.addCountAndroid}` }}</strong> 合计
            :
            <el-button plain type="warning" size="mini" @click="addRoutes2(row, 0, null)">
              {{ `${row.addCount}` }}</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="150">
        <template slot-scope="{ row }">
          <!-- <span>{{ `${row.payAmountAll} ₫ /笔数 ${row.payNumberAll} /人数${row.payCountAll}` }}</span> -->
          <!-- <span>{{ `VDN:${row.payAmountAll} `}} <br>{{ `笔数:${row.payNumberAll}`}}<br>{{ `人数:${row.payCountAll}`}} </span> -->
          <span>
            VND: <strong>{{ `${row.payAmountAll}` }}</strong><br />笔数: <strong>{{ `${row.payNumberAll}` }}</strong>
            <br />人数: <strong>{{ `${row.payCountAll}` }} </strong></span>
        </template>
      </el-table-column>
      <el-table-column label="提款金额" min-width="130">
        <template slot-scope="{ row }">
          <span>{{ `${row.withdrawAmount} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道充值金额" min-width="170">
        <template slot-scope="{ row }">
          <!-- <span>{{ `${row.payAmount} ₫/笔数${row.payNumber}/人数${row.payCount}` }}</span> -->
          <!--  <span>{{ `VDN:${row.payAmount} `}} <br>{{ `笔数:${row.payNumber}`}}<br>{{ `人数:${row.payCount}`}} </span> -->

          <span>
            VND: <strong>{{ `${row.payAmount}` }}</strong><br />笔数: <strong>{{ `${row.payNumber}` }}</strong> <br />人数:
            <strong>{{ `${row.payCount}` }} </strong></span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="代理充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.agentAmount} ₫ /笔数${row.agentPayNumber}/人数${row.agentPayCount} ` }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="银行卡充值金额" min-width="170">
        <template slot-scope="{ row }">
          <!-- <span>{{ `${row.bankAmount} ₫ /笔数${row.bankPayNumber}/人数${row.bankPayCount} ` }}</span> -->
          <!-- <span>{{ `VDN:${row.bankAmount} `}} <br>{{ `笔数:${row.bankPayNumber}`}}<br>{{ `人数:${row.bankPayCount}`}} </span> -->

          <span>
            VND: <strong>{{ `${row.bankAmount}` }}</strong><br />笔数: <strong>{{ `${row.bankPayNumber}` }}</strong>
            <br />人数: <strong>{{ `${row.bankPayCount}` }} </strong></span>
        </template>
      </el-table-column>
      <el-table-column label="首充金额" min-width="100">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, null)">{{ `${row.payAmountDay} ₫ `
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="payCountAll" label="充值人数" min-width="100">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 2, null)">{{ `${row.payCountAll}`
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="payCountDay" label="首充人数" min-width="100">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, null)">{{ `${row.payCountDay}`
          }}</el-button>
        </template>
      </el-table-column>
      <!--  <el-table-column prop="disBindAddCount" label="过滤绑定率人数" min-width="120"   /> -->
      <el-table-column prop="disIpAddCount" label="过滤IP人数 " min-width="100">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, null)">{{ `${row.disIpAddCount}`
          }}</el-button>
        </template> </el-table-column>>
      <el-table-column prop="disUdidAddCount" label="过滤UDID人数" min-width="120">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, null)">{{ `${row.disUdidAddCount}`
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="center">
        <h2>历史统计</h2>
      </el-divider>
    </div>

    <div style="margin-bottom: 20px;">
      <DatePicker v-model="historyListQuery.pickerValue" @change="handleHistorySearchFilter" />
      <div style="display: flex; display: flex;">
        <!-- 日期选择 -->
        <!-- <el-date-picker v-model="historyListQuery.pickerValue" clearable size="small" type="daterange" align="right"
          unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
          format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions" @change="handleHistorySearchFilter" />
        <span style="margin: 5px" /> -->
        <!-- 级联选择器 -->
        <el-cascader v-model="historyListQuery.channel" size="small" :props="cascaderProps" :show-all-levels="false"
          placeholder="请选择" clearable @change="handleHistorySearchFilter" />
        <el-button size="small" style="margin-left: 10px;" plain @click="refreshHistoryClick">刷新</el-button>
      </div>

    </div>

    <el-table v-cloading="historyListLoading" :data="historyList"
      :header-cell-style="{ background: '#66b1ff', color: '#fff' }">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="date" label="日期(天)" width="120" />
      <el-table-column prop="channel" label="渠道标识" min-width="80" />
      <el-table-column prop="clickCount" label="点击量" min-width="60"></el-table-column>
      <el-table-column prop="installCount" label="安装量" min-width="60"></el-table-column>
      <el-table-column prop="activeCount" label="活跃用户" min-width="90">
        <template slot-scope="{ row }">
          <div>
            <div>
              安卓:{{
                row.activeCountAndroid == undefined ? 0 : row.activeCountAndroid
              }}
            </div>
            <div>
              苹果:{{
                row.activeCountIos == undefined ? 0 : row.activeCountIos
              }}
            </div>
            <div>
              pc:{{ row.activeCountPc == undefined ? 0 : row.activeCountPc }}
            </div>
            <div>
              h5:{{ row.activeCountH5 == undefined ? 0 : row.activeCountH5 }}
            </div>
            <div>
              合计:{{ row.activeCount == undefined ? 0 : row.activeCount }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="新增用户" min-width="150">
        <template slot-scope="{ row }">
          <!-- <span>{{ `苹果${row.addCountApple} 安卓${row.addCountAndroid} (合计：${row.addCount})` }}</span> -->
          <!--  <span>{{ `苹果:${row.addCountApple}`}} <br>{{ `安卓:${row.addCountAndroid}`}}<br>{{ `合计:${row.addCount}`}} </span> -->

          <span>
            苹果: <strong>{{ `${row.addCountApple}` }}</strong><br />安卓: <strong>{{ `${row.addCountAndroid}` }}</strong> 合计
            :
            <el-button plain type="warning" size="mini" @click="addRoutes2(row, 0, row.date)">
              {{ `${row.addCount}` }}</el-button>
          </span>

          <!--   <span> 苹果: <strong>{{ `${row.addCountApple}`}}</strong><br>安卓: <strong>{{ `${row.addCountAndroid}`}}</strong> <br>合计: <strong>{{ `${row.addCount}`}} </strong></span> -->
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountAll} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提款金额" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ `${row.withdrawAmount} ₫` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道充值金额" min-width="150">
        <template slot-scope="{ row }">
          <!-- <span>{{ `${row.payAmount} ₫/笔数${row.payNumber}/人数${row.payCount}` }}</span> -->
          <!--   <span>{{ `VDN:${row.payAmount} `}} <br>{{ `笔数:${row.payNumber}`}}<br>{{ `人数:${row.payCount}`}} </span> -->
          <span>
            VND: <strong>{{ `${row.payAmount}` }}</strong><br />笔数: <strong>{{ `${row.payNumber}` }}</strong> <br />人数:
            <strong>{{ `${row.payCount}` }} </strong></span>
        </template>
      </el-table-column>
      <!--   <el-table-column label="代理充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.agentAmount} ₫ /笔数${row.agentPayNumber}/人数${row.agentPayCount} ` }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="银行卡充值金额" min-width="150">
        <template slot-scope="{ row }">
          <!--   <span>{{ `VND ${row.bankAmount} ₫ /笔数${row.bankPayNumber}/人数${row.bankPayCount} ` }}</span> -->
          <!--  <span>{{ `VDN:${row.bankAmount} `}} <br>{{ `笔数:${row.bankPayNumber}`}}<br>{{ `人数:${row.bankPayCount}`}} </span> -->
          <span>
            VND: <strong>{{ `${row.bankAmount}` }}</strong><br />笔数: <strong>{{ `${row.bankPayNumber}` }}</strong>
            <br />人数: <strong>{{ `${row.bankPayCount}` }} </strong></span>

          <!-- <span>{{ `${row.bankAmount} ₫ ` }}</span><br />
          <span>{{ `笔数${row.bankPayNumber}` }}</span><br />
          <span>{{ `人数 ${row.bankPayCount} ` }}</span>-->
        </template>
      </el-table-column>

      <el-table-column label="首充金额" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountDay} ₫` }}</span>
        </template>

        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, row.date)">{{ `${row.payAmountDay} ₫`
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="payCountAll" label="充值人数" min-width="80">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 2, row.date)">{{ `${row.payCountAll}`
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="payCountDay" label="首充人数" min-width="150">
        <template slot-scope="{ row }">
          <el-button plain type="warning" size="mini" @click="addRoutes1(row, 1, row.date)">{{ `${row.payCountDay}`
          }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="disBindAddCount" label="过滤绑定率人数" min-width="120"   /> -->
      <el-table-column prop="disIpAddCount" label="过滤IP人数 " min-width="120" />
      <el-table-column prop="disUdidAddCount" label="过滤UDID人数" min-width="120" />
      <el-table-column label="次日留存" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ `${row.seconddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三日留存" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ `${row.thirddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周留存" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ `${row.weekPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月留存" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ `${row.monthPreserve}%` }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="center">
        <h2>总统计</h2>
      </el-divider>
    </div>

    <el-table v-cloading="totalListLoading" :data="totalList"
      :header-cell-style="{ background: '#66b1ff', color: '#fff' }">
      <!-- <el-table-column type="" label="序号" width="60"   /> -->
      <!-- <el-table-column prop="" label="日期" width="120"   />
      <el-table-column prop="" label="渠道标识" min-width="80"   /> -->
      <!--  <el-table-column prop="" label="" min-width="60"   /> -->
      <el-table-column label="总新增用户" min-width="200">
        <template slot-scope="{ row }">
          <!--   <span>{{ `苹果${row.totalCountApple} 安卓${row.totalCountAndroid} (合计：${row.totalAddCount})` }}</span> -->
          <span>
            苹果: <strong>{{ `${row.totalCountApple}` }}</strong><br />安卓: <strong>{{ `${row.totalCountAndroid}` }}</strong>
            <br />合计: <strong>{{ `${row.totalAddCount}` }} </strong></span>
        </template>
      </el-table-column>
      <el-table-column prop="totalWithdrawMoney" label="总提款金额" min-width="180" />
      <el-table-column prop="totalPayAmountAll" label="总充值金额" min-width="180" />
      <el-table-column prop="totalPayAmountDay" label="首充金额" min-width="100" />
      <el-table-column prop="totalPayCountAll" label="总充值人数" min-width="100" />
      <el-table-column prop="totalPayCountDay" label="首充人数" min-width="150" />
      <!--  <el-table-column prop="totalDisBindAddCount" label="总过滤绑定率人数" min-width="200"   /> -->
      <el-table-column prop="totalDisIpAddCount" label="总过滤IP人数 " min-width="150" />
      <el-table-column prop="totalDisUdidCount" label="总过滤UDID人数" min-width="150" />
      <el-table-column label="次日留存率" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.seconddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三日留存率" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.thirddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周留存率" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.weekPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月留存率" min-width="100">
        <template slot-scope="{ row }">
          <span>{{ `${row.monthPreserve}%` }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="historyListQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="historyListQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="historyListQuery.total"
      @size-change="handleHistorySizeChange" @current-change="handleHistoryCurrentChange" />
  </div>
</template>

<script>
import {
  getStatToday,
  getStatHistoryList,
  getTotal,
  testNewJob,
} from "@/api/promotion/stat_new";
import { getPromotionChannelList } from "@/api/promotion/channel_base";
import { getAllPromotionChannelUrlList } from "@/api/promotion/channel_url";
import { emptyS, nullS, formatUnixTime, sortBy, getDateTime } from "@/utils/tools";
import clip from "@/utils/clipboard";
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "StatPromotionChannelNewController",
  filters: {},
  data() {
    const cascaderRawDatas = [
      { id: 1, label: "全部", value: "all", leaf: true },
      { id: 2, label: "自然增长", value: "natural", leaf: true },
      { id: 3, label: "用户推广", value: "user", leaf: true },
      { id: 4, label: "渠道推广", value: "channel", leaf: false },
      { id: 5, label: "用户过滤", value: "userdis", leaf: true },
      { id: 6, label: "渠道过滤", value: "channeldis", leaf: true },
    ];
    return {
      // 今日
      todayList: null,
      totalList: null,
      todayListLoading: true,
      todayListQuery: {
        channel: null,
      },

      // 历史
      historyList: null,
      historyListLoading: true,
      historyListQuery: {
        page: 1,
        limit: 20,
        total: 0,
        channel: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      },

      // 级联选择器
      cascaderProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, value, data } = node;
          if (level === 0) {
            resolve(cascaderRawDatas);
          } else if (level === 1) {
            if (`${value}` === "channel") {
              // 获取所有渠道列表
              getPromotionChannelList({})
                .then((res) => {
                  var nodes = (res.data.list || []).map((item) => {
                    return {
                      id: item.id,
                      value: `${item.channel}`,
                      label: `${item.channel}`,
                      leaf: false,
                    };
                  });
                  // 排序
                  const sortNodes = nodes.sort(sortBy("value"));
                  resolve(sortNodes);
                })
                .catch((err) => {
                  this.$message.error(err);
                  resolve([]);
                });
            } else {
              resolve([]);
            }
          } else if (level === 2) {
            // 或者指定渠道所有链接列表
            getAllPromotionChannelUrlList({
              channelId: data.id,
            })
              .then((res) => {
                var nodes = (res.data.list || []).map((item) => {
                  return {
                    id: item.id,
                    value: `${item.channel}`,
                    label: `${item.channel}`,
                    leaf: true,
                  };
                });
                // 排序
                // const sortNodes = nodes.sort(sortBy('value'));
                resolve(nodes);
              })
              .catch((err) => {
                this.$message.error(err);
                resolve([]);
              });
          } else {
            resolve([]);
          }
        },
      },

      // 日期选项
      pickerOptions: {
        shortcuts: [
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
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
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
    };
  },
  created() {
    this.fetchTodayData();
    this.fetchHistoryData();
  },
  methods: {
    resetCreateModel() {
      this.createModel = {
        parentId: 1,
        level: 0,
        name: null,
        icon: null,
        gameId: null,
        type: 1,
        status: 0,
      };
    },

    // 获取今日数据
    fetchTodayData() {
      this.todayListLoading = true;

      var channel = "";
      var type = null;
      const channelQuerys = this.todayListQuery.channel;
      if (Array.isArray(channelQuerys)) {
        if (channelQuerys.length > 0) {
          const sel = channelQuerys[0];
          if (sel === "channel") {
            // 是渠道
            if (channelQuerys.length === 2) {
              // 选择第二级
              channel = channelQuerys[1];
              type = 0;
            } else if (channelQuerys.length === 3) {
              // 选择第三级
              channel = channelQuerys[2];
              type = 1;
            } else {
              channel = sel;
            }
          } else {
            // 其他
            channel = sel;
          }
        }
      }

      // console.error(channel)
      // console.error(type)
      getStatToday(channel, type)
        .then((res) => {
          var list = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            list.push(res.data);
          }
          this.todayList = list;
          this.todayListLoading = false;
        })
        .catch((err) => {
          this.todayList = null;
          this.todayListLoading = false;
          this.$message.error(err);
        });
    },

    addRoutes1(row, flag, date) {
      this.$router.push({
        path: "/user/center/new_user/index",
        query: { tt: row.channel, ss: flag, dd: date },
      });
      // this.$router.push({path:'/user/center/user/letter/index',query:{tt:row.id }})
    },

    addRoutes2(row, flag, date) {
      this.$router.push({
        path: "/promotion/center/add_user/index",
        query: { tt: row.channel, ss: flag, dd: date },
      });
      // this.$router.push({path:'/user/center/user/letter/index',query:{tt:row.id }})
    },

    // 获取历史数据
    fetchHistoryData() {
      this.historyListLoading = true;
      this.totalListLoading = true;
      var channel = "";
      const channelQuerys = this.historyListQuery.channel;
      if (Array.isArray(channelQuerys)) {
        if (channelQuerys.length > 0) {
          const sel = channelQuerys[0];
          if (sel === "channel") {
            // 是渠道
            if (channelQuerys.length === 2) {
              // 选择第二级
              channel = channelQuerys[1];
            } else if (channelQuerys.length === 3) {
              // 选择第三级
              channel = channelQuerys[2];
            } else {
              channel = sel;
            }
          } else {
            // 其他
            channel = sel;
          }
        }
      }

      // console.error(channel)
      getTotal({
        pageSize: this.historyListQuery.limit,
        pageNum: this.historyListQuery.page,
        channel: channel,
        pickerValue: this.historyListQuery.pickerValue,
      })
        .then((res) => {
          var allList = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            allList.push(res.data);
          }
          this.totalList = allList;
          this.totalListLoading = false;
          this.historyListLoading = false;
          return getStatHistoryList({
            pageSize: this.historyListQuery.limit,
            pageNum: this.historyListQuery.page,
            channel: channel,
            pickerValue: this.historyListQuery.pickerValue,
          });
        })
        .then((res) => {
          this.historyList = res.data.list || null;
          this.historyListQuery.total = res.data.total;
          this.historyListLoading = false;
        })
        .catch((err) => {
          this.historyList = null;
          this.historyListQuery.total = 0;
          this.historyListLoading = false;
          this.$message.error(err);
        });
    },

    /**
     * --------------- 今日 ---------------
     */

    // 过滤
    handleTodaySearchFilter() {
      this.fetchTodayData();
    },

    refreshTodayClick() {
      this.todayListQuery.channel = null;
      this.fetchTodayData();
    },

    changeStart() {
      this.$confirm("是否进行昨日统计？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          testNewJob()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "统计成功",
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
        .catch(() => { });
    },
    /**
     * --------------- 历史 ---------------
     */

    // 过滤
    handleHistorySearchFilter() {
      this.historyListQuery.page = 1;
      this.fetchHistoryData();
    },

    // 每页的条数改变
    handleHistorySizeChange(val) {
      this.historyListQuery.limit = val;
      this.historyListQuery.page = 1;
      this.fetchHistoryData();
    },

    // 当前页改变
    handleHistoryCurrentChange(val) {
      this.historyListQuery.page = val;
      this.fetchHistoryData();
    },

    refreshHistoryClick() {
      this.historyListQuery.page = 1;
      this.historyListQuery.channel = null;
      this.historyListQuery.pickerValue = [NOW_TIME_START, NOW_TIME_END];
      this.fetchHistoryData();
    },
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>

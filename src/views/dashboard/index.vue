<template>
  <div class="homePage">
    <!-- <el-date-picker
      v-model="platFormPickValues"
      size="mini"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      style="margin-bottom: 8px;"
      format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      value-format="timestamp"
      @change="getTimeChangeData"
    /> -->
    <DatePicker v-model="platFormPickValues" @change="getTimeChangeData" />

    <div class="topContainer">
      <div class="item">
        <div class="title">
          <span>新增用户数据</span>
          <!-- <el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="handleRefreshUserData('new')" /> -->
        </div>
        <div
          v-cloading="userLoadingNew"
          class="content"
        >
          <div class="left divide">
            <div class="number">{{ userData.yesterdayNew }}</div>
            <div class="desc">昨日新增用户数</div>
          </div>
          <div class="left">
            <div class="number">{{ userData.todayNew }}</div>
            <div class="desc">今日新增用户数</div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>活跃用户数据</span>
          <!-- <el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="handleRefreshUserData('active')" /> -->
        </div>
        <div v-cloading="userLoadingSActive" class="content">
          <div class="left divide">
            <div class="number">{{ userData.yesterdayActive }}</div>
            <div class="desc">昨日活跃用户数</div>
          </div>
          <div class="left">
            <div class="number">{{ userData.todayActive }}</div>
            <div class="desc">今日活跃用户数</div>
          </div>
        </div>
      </div>
      <div class="item" style="min-width: 475px;">
        <div class="title">
          <span class="activeTitle">活跃用户平台占比</span>
          <div class="btns">
            <!-- <el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="hanleRefreshPlatForm()" /> -->
          </div>
        </div>
        <div v-cloading="platFormLoading" class="content">
          <div id="scale" />
        </div>
      </div>
    </div>
    <div class="botContainer">
      <div class="item">
        <div class="title">
          新增用户变化趋势
          <div class="btns">
            <!-- <el-date-picker
              v-model="newUserPickValues"
              size="mini"
              type="daterange"
              :picker-options="trendpickerOptions"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              format="yyyy-MM-dd"
              value-format="timestamp"
              @change="handleRefreshNewUserQS"
            /> -->
            <!-- <el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="handleRefreshNewUserQS()" /> -->
          </div>
        </div>
        <div v-cloading="newUserLoading" class="content">
          <div id="newUser" />
        </div>
      </div>
      <div class="item pieChart">
        <div class="title">
          活跃用户变化趋势
          <div class="btns">
            <!-- <el-date-picker
              v-model="activePickValues"
              size="mini"
              type="daterange"
              :picker-options="trendpickerOptions"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              format="yyyy-MM-dd"
              value-format="timestamp"
              @change="handleRefreshActiveUserQS"
            /> -->
            <!-- <el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="handleRefreshActiveUserQS()" /> -->
          </div>
        </div>
        <div v-cloading="activeUserLoading" class="content">
          <div id="activeUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {
  newUserStatistics,
  getProportioActiveUser,
  getUserChangeTrendActive,
  getUserChangeTrendNew
} from '@/api/dashboard/index'
import { formatUnixTime } from '@/utils/tools'

import moment from 'moment'
export default {
  name: 'Dashboard',
  filters: {},
  data() {
    return {
      userData: {},
      userLoadingNew: true,
      userLoadingSActive: true,
      platFormLoading: true,
      newUserLoading: true,
      activeUserLoading: true,
      platFormPickValues: [],
      // platFormPickValues: [new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000 * 6, new Date().getTime()],
      newUserPickValues: [new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000 * 6, new Date().getTime()],
      activePickValues: [new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000 * 6, new Date().getTime()],
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const start = new Date(new Date().toLocaleDateString()).getTime()
              const end = new Date().getTime()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨日',
            onClick(picker) {
              const end = new Date(new Date().toLocaleDateString()).getTime() - 1000
              const start = new Date(new Date().toLocaleDateString()).getTime() - 86400 * 1000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      trendpickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() + 1000
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.platFormPickValues = this.initTimer
    this.fetchData()
  },
  mounted() {

  },
  methods: {
    fetchData() {
      this.handleRefreshUserData()
      this.hanleRefreshPlatForm()
      this.handleRefreshNewUserQS()
      this.handleRefreshActiveUserQS()
    },
    getTimeChangeData() {
      this.fetchData()
    },
    // 平台占比
    hanleRefreshPlatForm() {
      this.platFormLoading = true
      getProportioActiveUser(this.handlePickvalueToSE(this.platFormPickValues)).then(res => {
        this.platFormLoading = false
        if (res.code === 200) {
          const data = res.data || {}
          let total = 0
          const seriersData = []
          Object.keys(data).map(key => {
            seriersData.push({ value: data[key], name: key.toLocaleUpperCase() })
            total += data[key]
          })
          this.pieEcharts(seriersData, total)
        }
      })
    },
    // 新增趋势
    handleRefreshNewUserQS() {
      this.newUserLoading = true
      getUserChangeTrendNew(this.handlePickvalueToSE(this.platFormPickValues)).then(res => {
        this.newUserLoading = false
        if (res.code === 200) {
          const data = { xAxis: [], yAxis: [] }
          res.data.forEach(item => {
            data.xAxis.push(moment(formatUnixTime(item.time * 1000)).format('MM-DD'))
            data.yAxis.push(item.number)
          })
          this.normalChart(data, 'newUser')
        }
      })
    },
    // 活跃趋势
    handleRefreshActiveUserQS() {
      this.activeUserLoading = true
      getUserChangeTrendActive(this.handlePickvalueToSE(this.platFormPickValues)).then(res => {
        this.activeUserLoading = false
        if (res.code === 200) {
          const data = { xAxis: [], yAxis: [] }
          res.data.forEach(item => {
            data.xAxis.push(moment(formatUnixTime(item.time * 1000)).format('MM-DD'))
            data.yAxis.push(item.number)
          })
          this.normalChart(data, 'activeUser')
        }
      })
    },
    // 新增用户，活跃用户
    handleRefreshUserData(type) {
      if (type === 'new') {
        this.userLoadingNew = true
      } else if (type === 'active') {
        this.userLoadingSActive = true
      } else {
        this.userLoadingNew = true
        this.userLoadingSActive = true
      }
      newUserStatistics().then(res => {
        if (type === 'new') {
          this.userLoadingNew = false
        } else if (type === 'active') {
          this.userLoadingSActive = false
        } else {
          this.userLoadingNew = false
          this.userLoadingSActive = false
        }
        if (res.code === 200) {
          this.userData = res.data
        }
      })
    },
    handlePickvalueToSE(pickerValue) {
      if (pickerValue && pickerValue.length) {
        // 结束时间延后一天才能查到今天
        const data = {
          startTime: pickerValue[0],
          endTime: pickerValue[1] + 86400000
        }
        return data
      }
      return {}
    },
    pieEcharts(cdata, total) {
      const myScaleChart = echarts.init(document.getElementById('scale'))
      let data = cdata
      if (!cdata.length) {
        data = [
          { name: 'H5', value: 0 },
          { name: 'PC', value: 0 },
          { name: 'IOS', value: 0 },
          { name: 'ANDROID', value: 0 }
        ]
      }
      // 配置图表
      const scaleOption = {
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            var result = '<p style="margin: 0">总用户：' + total + '</p>'
            result += '<p style="margin: 0">' + params.name + '用户：' + params.value + '</p>'
            result += '<p style="margin: 0">占比：' + Math.round(params.value / total * 10000) / 100 + '%</p'
            return result
          }
        },
        label: {
          normal: {
            formatter: '{b}:{c}:({d}%)',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 15
            }
          }
        },
        labelLine: {
          show: false
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'top'
        },
        series: [
          {
            name: '活跃用户占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: data,
            label: {
              normal: {
                formatter: '{b}:{c}:({d}%)',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 15
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myScaleChart.setOption(scaleOption)
    },
    normalChart(data, id) {
      var myScaleChart = echarts.init(document.getElementById(id))
      // 配置图表
      const option = {
        grid: {
          top: '60px',
          left: '50px',
          right: '20px',
          bottom: '30px'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            data: data.yAxis,
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            smooth: true
          }
        ]
      }
      myScaleChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.homePage {
  padding: 20px 20px 0 0;
  font-weight: bold;
  background: var(--menuBg);
  height: 100%;
  .topContainer {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
    column-gap: 20px;
    margin-bottom: 20px;
    @media screen and (max-width: 1440px) {
      column-gap: 15px;
    }
  }
  .item {
      border-radius: 6px;
      border: 1px solid #f5f5f5;
      width: 100%;
      padding: 10px;
      min-width: 180px;
      background: #fff;
      .title {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
        .activeTitle {
          min-width: 120px;
        }
        .refresh {
          color: var(--theme);
          cursor: pointer;
        }
      }
      .btns {
        display: flex;
        button {
          margin-left: 6px;
        }
      }
      .content {
        display: flex;
        align-items: center;
        height: 190px;
      }
      .left {
        flex: 1;
        text-align: center;
        position: relative;
        .number {
          font-size: 20px;
          color: var(--theme);
          margin-bottom: 12px;
          font-weight: bold;
        }
        .desc {
          font-size: 14px;
          opacity: 0.8;
        }
      }
      .divide {
        &::after {
          content: '';
          width: 1px;
          height: 18px;
          background: var(--theme);
          position: absolute;
          right: 0;
          top: 2px;
          opacity: 0.4;
        }
      }
    }
  .botContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media screen and (max-width: 1440px) {
      grid-template-columns: 1fr;
      row-gap: 20px;
    }
    column-gap: 20px;
    .content {
      height: 450px;
    }
  }
  #scale {
    width: 100%;
    height: 250px;
  }
  #newUser {
    width: 100%;
    height: 100%;
  }
  #activeUser {
    width: 100%;
    height: 100%;
  }
}
.el-button--mini {
  padding: 4px;
}
</style>

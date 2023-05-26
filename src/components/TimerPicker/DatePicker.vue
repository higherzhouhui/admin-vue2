<!-- 时间组件 -->
<template>
    <el-form :inline="true">
        <slot></slot>
        <el-form-item style="margin-top: 1px;">
            <el-date-picker v-model="timeValue" size="small" :clearable="false" type="datetimerange" range-separator="~"
                @change="handleSearchFilter" :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"
                align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                value-format="timestamp" />
        </el-form-item>
        <el-form-item>
            <el-button size="small" :type="type == 1 ? 'primary' : ''" @click="checkDate(1)">今日</el-button>
            <el-button size="small" :type="type == 2 ? 'primary' : ''" @click="checkDate(2)">昨日</el-button>
            <el-button size="small" :type="type == 3 ? 'primary' : ''" @click="checkDate(3)">本周</el-button>
            <el-button size="small" :type="type == 4 ? 'primary' : ''" @click="checkDate(4)">上周</el-button>
            <el-button size="small" :type="type == 5 ? 'primary' : ''" @click="checkDate(5)">本月</el-button>
            <el-button size="small" :type="type == 6 ? 'primary' : ''" @click="checkDate(6)">上月</el-button>
            <el-button size="small" :type="type == 7 ? 'primary' : ''" @click="checkDate(7)">最近三月</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { getDateTime, getNowFormatDay } from '@/utils/tools'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
    props: ['format', 'value', 'dateType'],
    data() {
        return {
            pickerOptions: {
                disabledDate: time => {
                    console.log(time)
                    return time.getTime() < this.getAllDate(7, true)[0];
                },
                onPick: ({ maxDate, minDate }) => {
                    this.minDate = minDate.getTime()
                }
            },
            activeIndex: 0,
            listQuery: {
                pickerValue: []
            },
            minDate: '',
            type: 1,
            timeValue: []
        }
    },
    watch: {
        value() {
            this.initValue()
        },
        // timeValue: {
        //     deep: true,
        //     handler() {
        //         this.pickerOptions.disabledDate = time.getTime() < this.getAllDate(7, true)[0]
        //     }
        // }
    },
    computed: {
    },
    created() {
        this.initValue()
    },
    methods: {
        initValue() {
            if (this.value && this.value.length && this.value.length == 2) {
                if (this.dateType == 1) {
                    this.timeValue = [new Date(this.value[0].replace('-', '/')).getTime(), new Date(this.value[1].replace('-', '/')).getTime() + 86399999]
                    return this.handleSearchFilter(this.timeValue, false)
                } else if (this.dateType == 2) {
                    this.timeValue = [new Date(this.value[0].split(' ')[0].replace('-', '/')).getTime(), new Date(this.value[1].split(' ')[0].replace('-', '/')).getTime() + 86399999]
                    return this.handleSearchFilter(this.timeValue, false)
                } else if (this.dateType == 3 || this.dateType == 4) {
                    let y1 = String(this.value[0]).substr(0, 4)
                    let m1 = String(this.value[0]).substr(4, 2)
                    let d1 = String(this.value[0]).substr(6, 2)
                    let y2 = String(this.value[1]).substr(0, 4)
                    let m2 = String(this.value[1]).substr(4, 2)
                    let d2 = String(this.value[1]).substr(6, 2)
                    this.timeValue = [new Date(`${y1}/${m1}/${d1}`).getTime(), new Date(`${y2}/${m2}/${d2}`).getTime() + 86399999]
                    return this.handleSearchFilter(this.timeValue, false)
                } else {
                }

            } else {
                this.type = 0
            }
            this.timeValue = this.value
            this.handleSearchFilter(this.timeValue, false)
        },
        handleSearchFilter(val, isChange = true) {
            this.minDate = ''
            if (!val || !val.length) {
                if (this.value && this.value.length) {
                    this.$emit('input', [])
                }
                if (isChange) this.$emit('change', [])
                return this.type = 0
            }
            let timeArr = this.checkActive(val)
            let type = 0
            for (let i = 1; i < 8; i++) {
                let arr = this.getAllDate(i)
                if (arr[0] == val[0] && (arr[1]-999 == val[1] || val[1] === arr[1])) {
                    type = i
                    break
                }
            }
            // debugger
            // if (isChange) 
            this.type = type
            if (this.value && this.value.length && timeArr[0] == this.value[0] && this.value[1] == timeArr[1]) return
            if(timeArr[1] % 1000 == 0) {
                timeArr[1] = timeArr[1] * 1 + 999
            }
            this.$emit('input', timeArr)
            if (isChange) this.$emit('change', val)
        },
        checkActive(arr) {
            if (!this.dateType) return arr
            if (this.dateType == 1) return [getNowFormatDay('-', true, arr[0]), getNowFormatDay('-', true, arr[1])]
            else if (this.dateType == 2) return [`${getNowFormatDay('-', true, arr[0])} 00:00:00`, `${getNowFormatDay('-', true, arr[1])} 23:59:59`]
            else if (this.dateType == 3) return [`${getNowFormatDay('', true, arr[0])}000000`, `${getNowFormatDay('', true, arr[1])}235959`]
            else if (this.dateType == 4) return [`${getNowFormatDay('', true, arr[0])}`, `${getNowFormatDay('', true, arr[1])}`]
            return arr
        },
        checkDate(type) {
            let timeArr = this.getAllDate(type)
            this.type = type
            timeArr = this.checkActive(timeArr)
            this.$emit('input', timeArr)
            this.$emit('change', timeArr)
        },
        getAllDate(type, bol = false) {
            let [NOW_TIME_START, NOW_TIME_END] = this.$store.getters.timerDate;
            var today = new Date();
            //构建当前日期,格式：2022-08-22 00:00:00
            var year = today.getFullYear(); //本年 
            var month = today.getMonth() + 1; //本月
            var day = today.getDate(); //本日
            var newDate = new Date(year + "-" + month + "-" + day + " 00:00:00"); //年月日拼接
            var nowTime = newDate.getTime(); //当前的时间戳
            var weekDay = newDate.getDay(); //当前星期 0.1.2.3.4.5.6 【0 = 周日】
            weekDay = weekDay == 0 ? 7 : weekDay
            var oneDayTime = 24 * 60 * 60 * 1000; //一天的总ms
            var mondayTime = (1 - weekDay) * oneDayTime + nowTime; //本周一的时间戳
            if (type == 1) return [NOW_TIME_START, NOW_TIME_END]
            if (type == 2) return [NOW_TIME_START - 86400000, NOW_TIME_END - 86400000]
            if (type == 3) return [mondayTime, NOW_TIME_END]
            var lastMondayTime = nowTime - (weekDay + 6) * oneDayTime; //上周一的时间戳
            var lastSundayTime = nowTime - (weekDay + 0) * oneDayTime; //上周日的时间戳
            if (type == 4) return [lastMondayTime, lastSundayTime + 86399999]
            var nowMonthStart = new Date(`${year}/${month}`).getTime()
            if (type == 5) return [nowMonthStart, NOW_TIME_END]
            var lastMonthEnd = nowMonthStart - 1
            var lastMonthStart = new Date(`${year}/${month - 1}`).getTime()
            if (type == 6) return [lastMonthStart, lastMonthEnd]

            if (type == 7) {
                if (bol) {
                    if (this.minDate) {
                        return [this.minDate - (90 * 86400000), this.minDate]
                    }else if(this.timeValue && this.timeValue.length) {
                        return [this.timeValue[0] - (90 * 86400000), this.timeValue[0]]
                    }
                }
                if(this.dateType == 2 || this.dateType == 3) {
                    return [NOW_TIME_END - (89 * 86400000) + (1000), NOW_TIME_END]
                 }
                // debugger
                return [NOW_TIME_END - (90 * 86400000), NOW_TIME_END]
            }
        }
    }
}
</script>
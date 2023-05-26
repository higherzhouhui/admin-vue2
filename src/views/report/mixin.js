import Decimal from "decimal.js";
import { getDateTime } from '@/utils/tools'
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()
let mixin = {
  data() {
    return {
      xxx: "asdasd",
      currentTimeZone: localStorage.getItem("currentTimeZone"),
    };
  },
  methods: {
    //计算直播盈利
    moneyCount() {
      return 0;
    },
    //没有日期时设置初始化日期
    initDataParams() {
      // if (
      //   !this.listQuery.pickerValue ||
      //   this.listQuery.pickerValue.length === 0
      // ) {
      //   let now = new Date(
      //     new Date(new Date().toLocaleDateString()).getTime() +
      //       24 * 60 * 60 * 1000 -
      //       1000
      //   ).getTime();
      //   let before = new Date(
      //     new Date(new Date().toLocaleDateString()).getTime() -
      //       6 * 24 * 60 * 60 * 1000
      //   ).getTime();
      //   this.listQuery.pickerValue = [before, now];
      // }
      let params = { ...this.listQuery };
      this.listLoading = true;
      if (this.listQuery.pickerValue && this.listQuery.pickerValue.length === 2) {
        params.startTime = this.listQuery.pickerValue[0];
        params.endTime = this.listQuery.pickerValue[1];
        // params.startTime =
        //   this.listQuery.pickerValue[0] -
        //   new Date().getTimezoneOffset() * 60 * 1000 -
        //   7 * 60 * 60 * 1000;
        // params.endTime =
        //   this.listQuery.pickerValue[1] -
        //   new Date().getTimezoneOffset() * 60 * 1000 -
        //   7 * 60 * 60 * 1000;
      }
      delete params.pickerValue;
      console.log(params, "params");
      return params;
    },
    //获取接口列表数据后设置
    setList(list) {
      return (
        list.map((v) => {
          return Object.assign(v, {
            moneyCount: this.moneyCount(v),
            reportDateLong: this.stemToTime(v.reportDateLong),
          });
        }) || []
      );
    },
    //根据时间戳转时间
    stemToTime(stem) {
      stem += this.currentTimeZone * 60 * 60 * 1000;
      function zeroTime(t) {
        return t
          .split("/")
          .map((v) => (v < 10 ? "0" + v : v))
          .join("-");
      }
      let s = zeroTime(new Date(stem).toLocaleDateString());
      let e = new Date(stem).toLocaleTimeString();
      return `${s}`;
    },
    // 重置
    resets() {
      this.reloadData();
      this.resetCreateModel();
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = [];
      this.listLoading = true;
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchData();
    },
    // 双精度浮点数相加
    accAdd(arg1, arg2) {
      return Decimal(arg1).add(Decimal(arg2)).toNumber();
    },
  },
};

export default mixin;

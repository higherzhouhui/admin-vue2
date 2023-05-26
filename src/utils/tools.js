// import moment from 'moment/moment'
import moment from 'moment-timezone'
/**
 * 判断字符串是否为空
 * obj 需要处理的文字
 */
export function emptyS(obj) {
  if (obj === null ||
    typeof obj === 'undefined' ||
    `${obj}` === '' ||
    `${obj}` === 'null' ||
    `${obj}` === 'NULL') {
    return true
  } else {
    return false
  }
}

/**
 * 处理文字
 * obj 需要处理的文字
 * def 默认文字
 */
export function nullS(obj, def) {
  var newString = ''
  if (emptyS(obj)) {
    if (!emptyS(def)) {
      newString = def
    }
  } else {
    if (typeof obj === 'string') {
      newString = obj
    } else {
      if (!emptyS(def)) {
        newString = def
      }
    }
  }
  return newString
}

/**
 * 时间戳转时间
 */
export function formatUnixTime(cts, type) {
  return formatTimeZone({ cdate: cts, type: type })
  // if (cts == null) return ''
  // var ts = new Date(cts)
  // var year = 1900 + ts.getYear()
  // var month = '0' + (ts.getMonth() + 1)
  // var date = '0' + ts.getDate()
  // var hour = '0' + ts.getHours()
  // var minute = '0' + ts.getMinutes()
  // var second = '0' + ts.getSeconds()
  // return year + '-' + month.substring(month.length - 2, month.length) + '-' + date.substring(date.length - 2, date.length) +
  //   ' ' + hour.substring(hour.length - 2, hour.length) + ':' +
  //   minute.substring(minute.length - 2, minute.length) + ':' +
  //   second.substring(second.length - 2, second.length)
}

// 时间戳转为 hh:mm:ss
export function formatSuTime(ts) {
  if (ts == null) {
    return ''
  }
  var ts = new Date(ts)
  var hour = ts.getHours()
  var minute = ts.getMinutes()
  var second = ts.getSeconds()
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  return hour + ':' + minute + ':' + second
}

// 毫秒转为 hh:mm:ss
export function formatTime(mss) {
  var hours = parseInt(mss / (1000 * 60 * 60))
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = parseInt((mss % (1000 * 60)) / 1000)
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

// 请求链接拼接
export function getURL(url, obj) {
  if (obj.pickerValue != null && JSON.stringify(obj.pickerValue) != '[]' && Array.isArray(obj.pickerValue) && obj.pickerValue.length > 0) {
    let startTime = null
    let endTime = null
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1] + (1000 * 60 * 60 * 24 - 1)

    url += `startTime=${startTime}&endTime=${endTime}`
  }

  Object.keys(obj).forEach(key => {
    if (obj[key] != undefined) {
      url += `&${key}=${obj[key]}`
    }
  })

  return url
}

/**
 * 获取当前时间
 */
export function getNowFormatDate() {
  var date = new Date()
  var seperator1 = '-'
  var seperator2 = '/'
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    ' ' + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds()
  return currentdate
}

/**
 * 获取当前日期
 */
export function getNowFormatDay(seperator1 = '', hasDay = true, time) {
  var date = time ? new Date(time) : new Date()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var currentdate = `${date.getFullYear()}${seperator1}${month}${hasDay ? (seperator1 + strDate) : ''}`
  return currentdate
}

/**
 * 按数组中某个元素排序
 * 使用例子：list.sort(toolUtils.compare('xxx'))
 */
export function listCompareBy(property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

/**
 * 数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：list.sort(sortBy('xxx',false)) // 表示根据xxx属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性
 * @param rev true表示升序排列，false降序排序
 * */
export function sortBy(attr, rev) {
  // 第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1
  } else {
    rev = (rev) ? 1 : -1
  }
  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

/**
 * 是否是正确的图片格式
 * @param {Object} src
 */
export function judgeImgAddress(src) {
  var imgSrc = nullS(src)
  if (imgSrc.indexOf('http://') == -1 && imgSrc.indexOf('https://') == -1) {
    return null
  }
  return imgSrc
}

/**
 * 将RGB转换成#HEX
 * @param {Object} rgb
 * var rgb = '220,20,60'
 * alert(rgb2hex(rgb))
 */
export function rgb2hex(rgb) {
  var reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/
  var arr = reg.exec(rgb)

  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2)
  }
  var _hex = '#' + hex(arr[1]) + hex(arr[2]) + hex(arr[3])
  return _hex.toUpperCase()
}

/**
 * hex16进制颜色转rgb
 * @param hex 例如:"#23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
export function hex2rgba(hex, opacity) {
  return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' +
    hex
      .slice(5, 7)) + ',' + opacity + ')'
}

/**
 * hex16进制颜色转rgb
 * @param hex 例如:"#23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
export function hex2rgba2(hex, opacity) {
  return [
    parseInt('0x' + hex.slice(1, 3)),
    parseInt('0x' + hex.slice(3, 5)),
    parseInt('0x' + hex.slice(5, 7))
  ]
}

/**
 * @param 根据指定日期（yyyy-mm-dd）获取周一和周日的日期
 * @author QC
 * @date 2018-03-15
 * */
export function getMonDayAndSunDay(value) {
  const dateValue = value
  const arr = dateValue.split('-')
  // 月份-1 因为月份从0开始 构造一个Date对象
  const date = new Date(arr[0], arr[1] - 1, arr[2])
  const dateOfWeek = date.getDay() // 返回当前日期的在当前周的某一天（0～6--周日到周一）
  let dateOfWeekInt = parseInt(dateOfWeek, 10) // 转换为整型
  if (dateOfWeekInt == 0) {
    // 如果是周日
    dateOfWeekInt = 7
  }
  const aa = 7 - dateOfWeekInt // 当前于周末相差的天数
  const temp2 = parseInt(arr[2], 10) // 按10进制转换，以免遇到08和09的时候转换成0
  const sunDay = temp2 + aa // 当前日期的周日的日期
  const monDay = sunDay - 6 // 当前日期的周一的日期
  const startDate = new Date(arr[0], arr[1] - 1, monDay)
  const endDate = new Date(arr[0], arr[1] - 1, sunDay)
  const sm = parseInt(startDate.getMonth()) + 1 // 月份+1 因为月份从0开始
  const em = parseInt(endDate.getMonth()) + 1
  const start = startDate.getFullYear() + '-' + sm + '-' + startDate.getDate()
  const end = endDate.getFullYear() + '-' + em + '-' + endDate.getDate()
  const result = []
  result.push(start)
  result.push(end)
  return result
}

/**
 * 根据日期获取月初和月末
 */
export function getMonthBeginAndEnd(value) {
  // 获取当前月份的第一天
  function getCurrentMonthFirstDay(date) {
    date.setDate(1)
    var month = parseInt(date.getMonth() + 1)
    var day = date.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day
  }

  // 获取当前月份的最后一天
  function getCurrentMonthLastDay(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = new Date(year, month, 0)
    return year + '-' + month + '-' + day.getDate()
  }

  const dateValue = value
  const arr = dateValue.split('-')
  // 月份-1 因为月份从0开始 构造一个Date对象
  var cloneNowDate = new Date(arr[0], arr[1] - 1, arr[2])

  const begin = getCurrentMonthFirstDay(cloneNowDate)
  const end = getCurrentMonthLastDay(cloneNowDate)

  const result = []
  result.push(begin)
  result.push(end)
  return result
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (format) {
  var args = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var i in args) {
    var n = args[i]
    if (new RegExp('(' + i + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' +
        n).substr(('' + n).length))
    }
  }
  return format
}

/**
 * 钱币换算（分->元）
 */
export function moneyConvert(money, fixed = 2, unit = false) {
  var defaultPrice = ''
  if (unit === false) {
    defaultPrice = '￥' + parseInt('0').toFixed(fixed)
  } else {
    defaultPrice = '' + parseInt('0').toFixed(fixed)
  }
  if (money != null && money > 0) {
    var price = money / 100
    if (fixed == 0) {
      defaultPrice = unit === false ? `￥${price}` : `${price}`
    } else { // 默认走到这里
      if (unit === false) {
        defaultPrice = '￥' + price.toFixed(fixed)
      } else {
        defaultPrice = '' + price.toFixed(fixed)
      }
    }
  }
  return defaultPrice
}

/**
 * 在上传图片之前
 * @param {Object} fileType
 * @param {Object} fileSize
 */
export function beforeUploadImage(fileType, fileSize) {
  // const isPNG = fileType === 'image/png';
  // const isJPEG = fileType === 'image/jpeg';
  // const isJPG = fileType === 'image/jpg';
  // const isBMP = fileType === 'image/bmp';
  // const isGIF = fileType === 'image/gif';
  // if (!isJPG && !isPNG) {
  //   return {
  //     can: false,
  //     msg: '上传图片只能是 JPG 或 PNG 格式!'
  //   };
  // }
  // const isLtSize = fileSize / 1024 / 1024 < 20;
  // if (!isLtSize) {
  //   return {
  //     can: false,
  //     msg: '上传图片大小不能超过 20MB!'
  //   };
  // }
  return {
    can: true,
    msg: ''
  }
}

/**
 * 上传文件到oss
 * @param {Object} ossParams
 * @param {Object} path
 * @param {Object} fileName
 * @param {Object} file
 */
export function uploadFile(ossParams, path, fileName, file) {
  return new Promise((resolve, reject) => {
    if (emptyS(fileName)) {
      reject('文件名错误')
      return
    }
    if (fileName.indexOf('.') === -1) {
      reject('文件格式错误 ')
      return
    }
    var suffix = fileName.substr(fileName.indexOf('.')) // 文件后缀
    const file_name = (path || 'assets') + '_' + Date.parse(new Date()) + '_' + Math.round(Math.random() * 100000) + suffix // 组成新文件名
    console.log('上传的文件名=' + file_name)
    const {
      key,
      secret,
      bucketName,
      endpoint,
      token,
      domain

    } = ossParams

    const OSS = require('ali-oss')
    const client = new OSS({
      region: 'oss-accelerate',
      accessKeyId: key,
      accessKeySecret: secret,
      stsToken: token,
      endpoint: endpoint,
      bucket: bucketName
    })

    client
      .put(`${path || 'assest'}/` + file_name, file)
      .then(res => {
        const {
          name,
          url
        } = res
        if (url != null && url != undefined) {
          // console.log('12323', url, url.replace(`${bucketName}.${endpoint}`, `${domain}`));
          // oss返回 domain 运维做了cdn加速
          resolve(url.replace(`${bucketName}.${endpoint}`, `${domain}`).replace('http://', 'https://'))
          //  resolve(url.replace('skstream.oss-cn-shanghai.aliyuncs.com', 'pat.heblcyy.com').replace('http://', 'https://'))
        } else {
          reject('url为空')
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 上传文件到oss
 * @param {Object} ossParams
 * @param {Object} path
 * @param {Object} fileName
 * @param {Object} file
 *
 */
export function uploadResourceFiles(data) {
  const { ossParams, fileName, file, dir } = data
  return new Promise((resolve, reject) => {
    if (emptyS(fileName)) {
      reject('文件名错误')
      return
    }
    if (fileName.indexOf('.') === -1) {
      reject('文件格式错误 ')
      return
    }
    var name = fileName
    var suffix = name.substr(name.indexOf('.')) // 文件后缀
    const file_name = dir + '_' + Date.parse(new Date()) + '_' + Math.round(Math.random() * 100000) + suffix // 组成新文件名
    const {
      key,
      secret,
      bucketName,
      endpoint,
      token,
      domain

    } = ossParams

    const OSS = require('ali-oss')
    const client = new OSS({
      region: 'oss-accelerate',
      accessKeyId: key,
      accessKeySecret: secret,
      stsToken: token,
      endpoint: endpoint,
      bucket: bucketName
    })

    client
      .put(`${dir}/` + file_name, file)
      .then(res => {
        const {
          name,
          url
        } = res
        if (url != null && url != undefined) {
          // console.log('12323', url, url.replace(`${bucketName}.${endpoint}`, `${domain}`));
          // oss返回 domain 运维做了cdn加速
          resolve(url.replace(`${bucketName}.${endpoint}`, `${domain}`).replace('http://', 'https://'))
          //  resolve(url.replace('skstream.oss-cn-shanghai.aliyuncs.com', 'pat.heblcyy.com').replace('http://', 'https://'))
        } else {
          reject('url为空')
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 规则
 * @type {string} 类型
 */

export function getImageLibary(type, html) {
  const typeList = [
    { dir: 'assets', prefix: 'assets', form: 'png', width: 60, height: 60, size: 5, desc: '交易类型图标' },
    { dir: 'fbtype', prefix: 'fbtype', form: 'png', width: 48, height: 48, size: 5, desc: '意见反馈类型图标' },
    { dir: 'headicon', prefix: 'headicon', form: 'jpg', width: 160, height: 160, size: 10, desc: '用户默认头像' },
    { dir: 'gicon', prefix: 'gicon', form: 'png', width: 100, height: 100, size: 10, desc: '自营游戏图标' },
    { dir: 'gtype', prefix: 'gtype', form: 'png', width: 48, height: 48, size: 20, desc: '游戏分类图' },
    { dir: 'customer', prefix: 'customer', form: 'png', width: 130, height: 130, size: 5, desc: '客服头像' },
    { dir: 'badge', prefix: 'badge', form: 'png', width: 30, height: 30, size: 10, desc: '徽章图标' },
    { dir: 'level', prefix: 'level', form: 'png', width: 62, height: 32, size: 10, desc: '用户等级图标' },
    { dir: 'vip', prefix: 'vip', form: 'png', width: 400, height: 400, size: 5, desc: '贵族等级图标' },
    { dir: 'banner', prefix: 'banner', form: 'png', width: 750, height: 300, size: 100, desc: '广告banner图' },
    { dir: 'gimg', prefix: 'gimg', form: 'png', width: 80, height: 80, size: 100, desc: '礼物/座驾图片' },
    { dir: 'gfile', prefix: 'gfile', form: 'png', width: 50, height: 50, size: 30, desc: '礼物/座驾SVG文件' },
    { dir: 'gmp4', prefix: 'gmp4', form: 'png', width: 200, height: 200, size: 0, desc: '礼物/座驾MP4文件' },
    { dir: 'alist', prefix: 'alist', form: 'png', width: 750, height: 300, size: 100, desc: '活动列表图' },
    { dir: 'ainfo', prefix: 'ainfo', form: 'png', width: 500, height: 1500, size: 300, desc: '活动详情图' },
    { dir: 'glist', prefix: 'glist', form: 'png', width: 750, height: 300, size: 300, desc: '游戏列表图' },
    { dir: 'g3ic', prefix: 'g3ic', form: 'png', width: 88, height: 88, size: 100, desc: '三方游戏图标' },
    { dir: 'openApp', prefix: 'openApp', form: 'png', width: 414, height: 897, size: 200, desc: '开屏广告' },
    { dir: 'appModal', prefix: 'appModal', form: 'png', width: 414, height: 897, size: 200, desc: '开屏广告' },
    { dir: 'avatar', prefix: 'avatar', form: 'png', width: 100, height: 100, size: 100, desc: '管理后台用户头像' },
    { dir: 'live', prefix: 'live', form: 'png', width: 100, height: 100, size: 200, desc: '直播间封面' },
    { dir: 'sysMsg', prefix: 'sysMsg', form: 'png', width: 100, height: 100, size: 200, desc: '系统消息' }
  ]
  let list = typeList[0]
  typeList.forEach(item => {
    if (item.dir === type) {
      list = item
    }
  })
  if (html) {
    list = `<p><span>图片格式:${list.form}</span><span>大小:${list.size}K</span><span>尺寸:${list.width}X${list.height}</span></p>`
  }
  return list
}

/**
 * 是否是小数或整数
 * @param {Object} s 传递过来的数值
 */
export function isFloatAndNumber(s) {
  var regu = '^([0-9])[0-9]*(\\.\\w*)?$'
  var re = new RegExp(regu)
  if (re.test(s)) {
    return true
  } else {
    return false
  }
}

/**
 * 合并数组（去重）
 * @param {Object} arr1
 * @param {Object} arr2
 */
export function MergeArray(arr1, arr2) {
  var _arr = new Array()
  for (var i = 0; i < arr1.length; i++) {
    _arr.push(arr1[i])
  }
  for (var i = 0; i < arr2.length; i++) {
    var flag = true
    for (var j = 0; j < arr1.length; j++) {
      if (arr2[i] == arr1[j]) {
        flag = false
        break
      }
    }
    if (flag) {
      _arr.push(arr2[i])
    }
  }
  return _arr
}

export function formatTimeZone(params) {
  const { cdate, type } = params || {}
  if (!cdate) {
    return ''
  }
  const numberTime = () => {
    let offest = localStorage.getItem('currentTimeZone') || 0
    if (isNaN(offest * 1)) {
      offest = 7
    } else {
      offest = offest * 1 + 7
    }
    let time = moment(cdate).utcOffset(offest)
    if (!isNaN(cdate * 1)) {
      time = moment(cdate * 1).utcOffset(offest)
    }
    if (type === 'timestamp') {
      return time.valueOf()
    }
    if (type === 'day') {
      return time.format('YYYY-MM-DD')
    }
    return time.format('YYYY-MM-DD HH:mm:ss')
  }
  // 返回根据时间戳和日期分别处理
  if (isNaN(cdate * 1)) {
    return formatTimeZoneString(params)
  } else {
    return numberTime()
  }
}

function formatTimeZoneString(params) {
  const { cdate, type } = params || {}
  if (!cdate) {
    return ''
  }
  // 将越南时间转为当前系统时间
  const ynTime = moment.tz(cdate, 'Asia/Ho_Chi_Minh').valueOf()
  const currentTime = new Date(cdate).getTime()
  // 当前时间与越南时间相差
  const differTime = currentTime - ynTime
  let offest = localStorage.getItem('currentTimeZone') || 0
  if (isNaN(offest * 1)) {
    offest = 0
  }
  const time = moment(ynTime + differTime + offest * 3600000)
  if (type === 'timestamp') {
    return time.valueOf()
  }
  if (type === 'day') {
    return time.format('YYYY-MM-DD')
  }
  return time.format('YYYY-MM-DD HH:mm:ss')
}

export function handleRequestConfig(config) {
  const whiteUrl = ['/activity/lottery/updateLotteryBackwaterConfig',
    '/activity/reward/updateRewardAnchorConfig',
    '/live/booking/config/save',
    '/live/booking/config/updateById']
  if (config && config.url) {
    if (whiteUrl.includes(config.url)) {
      return
    }
    if (config.data) {
      const { startDate, endDate, startTime, endTime } = config.data
      if (startDate) {
        const newDate = specifyZoneTime(startDate)
        config.data = {
          ...config.data,
          startDate: newDate
        }
      }
      if (endDate) {
        const newDate = specifyZoneTime(endDate)
        config.data = {
          ...config.data,
          endDate: newDate
        }
      }
      if (startTime) {
        const newDate = specifyZoneTime(startTime)
        config.data = {
          ...config.data,
          startTime: newDate
        }
      }
      if (endTime) {
        const newDate = specifyZoneTime(endTime)
        config.data = {
          ...config.data,
          endTime: newDate
        }
      }
    } else if (config.params) {
      const { startTime, endTime } = config.params
      if (startTime) {
        const newDate = specifyZoneTime(startTime)
        config.params = {
          ...config.params,
          startTime: newDate
        }
      }
      if (endTime) {
        const newDate = specifyZoneTime(endTime)
        config.params = {
          ...config.params,
          endTime: newDate
        }
      }
    } else {
      const { startTime, endTime } = getQuery(config.url)
      if (startTime) {
        const replaceStr = `startTime=${startTime}`
        const newTime = specifyZoneTime(startTime)
        const newReplaceStr = `startTime=${newTime}`
        const newUrl = config.url.replace(replaceStr, newReplaceStr)
        config.url = newUrl
      }
      if (endTime) {
        const replaceStr = `endTime=${endTime}`
        const newTime = specifyZoneTime(endTime)
        const newReplaceStr = `endTime=${newTime}`
        const newUrl = config.url.replace(replaceStr, newReplaceStr)
        config.url = newUrl
      }
    }
  }
}
// 指定到越南时区
export const specifyZoneTime = (time, zone) => {
  if (!time) {
    return ''
  }
  let offest = localStorage.getItem('currentTimeZone') || 0
  if (isNaN(offest * 1)) {
    offest = 7
  } else {
    offest = offest * 1 + 7
  }
  let ctime = ''
  if (isNaN(time * 1)) {
    return time
  } else {
    ctime = time * 1
    // 如果为数值但不为时间戳也不做处理
    if (String(time).length !== String(new Date().getTime()).length) {
      return time
    }
  }
  // 将传入时间根据选中时区进行转换
  const offestTime = moment(ctime).utcOffset(offest).format('yyyy-MM-DD HH:mm:ss')
  // 当前时区和选中时区的差值
  const dqjxzTime = ctime - new Date(offestTime).getTime()
  // 将传入时间转为越南时间
  const shiftTime = moment.tz(offestTime, zone || 'Asia/Ho_Chi_Minh').valueOf()
  // 越南时间 减去时区差值 减去与越南时区的差值
  const finalTime = shiftTime + dqjxzTime - (offest - 7) * 60 * 60 * 1000
  console.log('originTime:', new Date(ctime))
  console.log('shiftTime:', new Date(ctime))
  if (isNaN(finalTime)) {
    return time
  } else {
    return finalTime
  }
}

const getQuery = (url) => {
  const search = url.split('?')
  if (search.length > 1) {
    return search[1].replace('?', '').replace('@', '&').split('&').reduce((arr, item) => {
      arr[item.split('=')[0]] = item.split('=')[1]
      return arr
    }, {})
  }
  return {}
}

// 拼接字符串
export const stitchUrl = (url, data) => {
  let newUrl = url
  Object.keys(data).map(item => {
    if (!data[item]) {
      return
    }
    if (data[item] instanceof Object) {
      return
    }
    if (newUrl.includes('?')) {
      newUrl += `&${item}=${data[item]}`
    } else {
      newUrl += `?${item}=${data[item]}`
    }
  })
  return newUrl
}
function getSQ() {
  let sysSq = localStorage.getItem('currentTimeZone') || 0
  sysSq = sysSq * -1 - 7
  let dqSq = new Date().getTimezoneOffset() / 60
  let cSq = sysSq - dqSq
  return cSq * 60 * 60 * 1000

}
export function getDateTime() {
  let str
  let sqTime = getSQ()
  try {
    let time = new Date().getTime() - sqTime
    str = moment(new Date(time)).format('YYYY/MM/DD')
  } catch (error) {
    str = new Date().toLocaleDateString()
  }

  const NOW_TIME_START = new Date(str).getTime()
  const NOW_TIME_END = NOW_TIME_START + 86399999
  return { NOW_TIME_END, NOW_TIME_START }
}
/* 移除HTML标签代码*/
export function removeHTMLTag(str) {
  str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
  // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str = str.replace(/ /ig, '')// 去掉
  return str
}

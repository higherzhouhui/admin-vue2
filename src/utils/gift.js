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
export function formatUnixTime(ts) {
  if (ts == null) {
    return ''
  }
  var ts = new Date(ts);
  var year = 1900 + ts.getYear();
  var month = "0" + (ts.getMonth() + 1);
  var date = "0" + ts.getDate();
  var hour = "0" + ts.getHours();
  var minute = "0" + ts.getMinutes();
  var second = "0" + ts.getSeconds();
  return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length) +
    " " + hour.substring(hour.length - 2, hour.length) + ":" +
    minute.substring(minute.length - 2, minute.length) + ":" +
    second.substring(second.length - 2, second.length);
}

/**
 * 获取当前时间
 */
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = "/";
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds();
  return currentdate;
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
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }
  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
}

/**
 * 是否是正确的图片格式
 * @param {Object} src
 */
export function judgeImgAddress(src) {
  var imgSrc = nullS(src)
  if (imgSrc.indexOf("http://") == -1 && imgSrc.indexOf("https://") == -1) {
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
  var reg = /(\d{1,3}),(\d{1,3}),(\d{1,3})/;
  var arr = reg.exec(rgb);

  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  var _hex = "#" + hex(arr[1]) + hex(arr[2]) + hex(arr[3]);
  return _hex.toUpperCase();
}

/**
 * hex16进制颜色转rgb
 * @param hex 例如:"#23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
export function hex2rgba(hex, opacity) {
  return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" +
    hex
      .slice(5, 7)) + "," + opacity + ")";
}

/**
 * hex16进制颜色转rgb
 * @param hex 例如:"#23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
export function hex2rgba2(hex, opacity) {
  return [
    parseInt("0x" + hex.slice(1, 3)),
    parseInt("0x" + hex.slice(3, 5)),
    parseInt("0x" + hex.slice(5, 7))
  ]
}

/**
 * @param 根据指定日期（yyyy-mm-dd）获取周一和周日的日期
 * @author QC
 * @date 2018-03-15
 * */
export function getMonDayAndSunDay(value) {
  let dateValue = value;
  let arr = dateValue.split('-');
  //月份-1 因为月份从0开始 构造一个Date对象
  let date = new Date(arr[0], arr[1] - 1, arr[2]);
  let dateOfWeek = date.getDay(); //返回当前日期的在当前周的某一天（0～6--周日到周一）
  let dateOfWeekInt = parseInt(dateOfWeek, 10); //转换为整型
  if (dateOfWeekInt == 0) {
    // 如果是周日
    dateOfWeekInt = 7;
  }
  let aa = 7 - dateOfWeekInt; //当前于周末相差的天数
  let temp2 = parseInt(arr[2], 10); //按10进制转换，以免遇到08和09的时候转换成0
  let sunDay = temp2 + aa; //当前日期的周日的日期
  let monDay = sunDay - 6; //当前日期的周一的日期
  let startDate = new Date(arr[0], arr[1] - 1, monDay);
  let endDate = new Date(arr[0], arr[1] - 1, sunDay);
  let sm = parseInt(startDate.getMonth()) + 1; //月份+1 因为月份从0开始
  let em = parseInt(endDate.getMonth()) + 1;
  let start = startDate.getFullYear() + '-' + sm + '-' + startDate.getDate();
  let end = endDate.getFullYear() + '-' + em + '-' + endDate.getDate();
  let result = [];
  result.push(start);
  result.push(end);
  return result;
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
  };

  // 获取当前月份的最后一天
  function getCurrentMonthLastDay(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = new Date(year, month, 0)
    return year + '-' + month + '-' + day.getDate()
  };

  let dateValue = value;
  let arr = dateValue.split('-');
  //月份-1 因为月份从0开始 构造一个Date对象
  var cloneNowDate = new Date(arr[0], arr[1] - 1, arr[2]);

  let begin = getCurrentMonthFirstDay(cloneNowDate);
  let end = getCurrentMonthLastDay(cloneNowDate);

  let result = [];
  result.push(begin);
  result.push(end);
  return result;
}

Date.prototype.format = function (format) {
  var args = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp('(' + i + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' +
      n).substr(('' + n).length));
  }
  return format;
};


/**
 * 钱币换算（分->元）
 */
export function moneyConvert(money, fixed = 2, unit = false) {
  var defaultPrice = '';
  if (unit === false) {
    defaultPrice = '￥' + parseInt('0').toFixed(fixed);
  } else {
    defaultPrice = '' + parseInt('0').toFixed(fixed);
  }
  if (money != null && money > 0) {
    var price = money / 100;
    if (fixed == 0) {
      defaultPrice = unit === false ? `￥${price}` : `${price}`;
    } else { // 默认走到这里
      if (unit === false) {
        defaultPrice = '￥' + price.toFixed(fixed);
      } else {
        defaultPrice = '' + price.toFixed(fixed);
      }
    }
  }
  return defaultPrice;
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
  };
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
      reject('文件名错误');
      return
    }
    if (fileName.indexOf('.') === -1) {
      reject('文件格式错误');
      return
    }
    var name = fileName;
    var suffix = name.substr(name.indexOf('.')); // 文件后缀
    var uri = nullS(path);
    uri = uri.replace(/\//g, '_');
    const file_name = 'gift' + '_' + Date.parse(new Date()) + suffix; // 组成新文件名
    console.log('上传的文件名=' + file_name)

    const {
      key,
      secret,
      bucketName,
      endpoint,
      token,
      domain
    } = ossParams;

    let OSS = require('ali-oss');
    let client = new OSS({
      accessKeyId: key,
      accessKeySecret: secret,
      stsToken: token,
      endpoint: endpoint,
      bucket: bucketName
    });

    client
      .put('gift/' + file_name, file)
      .then(res => {
        const {
          name,
          url
        } = res
        if (url != null && url != undefined) {
          // resolve(url.replace("sakura-live-new.oss-cn-shanghai.aliyuncs.com", "ikarong.com"));
          // oss返回 domain 运维做了cdn加速
          resolve(url.replace(`${bucketName}.${endpoint}`, `${domain}`).replace('http://', 'https://'))
        } else {
          reject('url为空');
        }
      })
      .catch(err => {
        reject(err);
      });
  })
}

/**
 * 是否是小数或整数
 * @param {Object} s 传递过来的数值
 */
export function isFloatAndNumber(s) {
  var regu = "^([0-9])[0-9]*(\\.\\w*)?$";
  var re = new RegExp(regu);
  if (re.test(s)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 合并数组（去重）
 * @param {Object} arr1
 * @param {Object} arr2
 */
export function MergeArray(arr1, arr2) {
  var _arr = new Array();
  for (var i = 0; i < arr1.length; i++) {
    _arr.push(arr1[i]);
  }
  for (var i = 0; i < arr2.length; i++) {
    var flag = true;
    for (var j = 0; j < arr1.length; j++) {
      if (arr2[i] == arr1[j]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      _arr.push(arr2[i]);
    }
  }
  return _arr;
}

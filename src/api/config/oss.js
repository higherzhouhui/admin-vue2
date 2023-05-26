import request from '@/utils/request'

// oss上传签名生成
export function getOSSPolicy() {
  return request({
    url: '/aliyun/oss',
    method: 'get'
  })
}



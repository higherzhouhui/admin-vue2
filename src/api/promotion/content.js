import request from '@/utils/request'

// 分享文案信息
export function getShareContent() {
  return request({
    url: '/config/share/content/get',
    method: 'post'
  })
}

// 分享文案修改
export function updateShareContent(msg) {
  return request({
    url: '/config/share/content',
    method: 'post',
    data: {
      content: msg
    }
  })
}

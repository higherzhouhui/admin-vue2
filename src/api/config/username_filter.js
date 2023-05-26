import request from '@/utils/request'

export function getUserNameFilterList( data) {
  var url = `/filter/username/wordList?`
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && JSON.stringify(data.type) != '[]') {
    url += `type=${data.type}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function addWord(params) {
  return request({
    url: '/filter/username/addWord',
    method: 'post',
    params
  })
}

export function updateWord(data) {
  return request({
    url: '/filter/username/update',
    method: 'post',
    data
  })
}



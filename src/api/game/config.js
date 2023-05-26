import request from '@/utils/request'

// 游戏列表
export function getGameList(pageSize = 20, pageNum = 1, data) {
  var url = `/game/config?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.gameId != null && data.gameId != undefined && `${data.gameId}` != 'null' && `${data.gameId}` != '') {
    url += `&gameId=${data.gameId}`
  }
  if (data.name != null && data.name != undefined && `${data.name}` != 'null' && `${data.name}` != '') {
    url += `&name=${data.name}`
  }
  if (data.detail != null && data.detail != undefined && `${data.detail}` != 'null' && `${data.detail}` != '') {
    url += `&detail=${data.detail}`
  }
  if (data.parentId != null && data.parentId != undefined && `${data.parentId}` != 'null' && `${data.parentId}` != '') {
    url += `&parentId=${data.parentId}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getParentList(parentId) {
  return request({
    url: '/game/config?parentId=0',
    method: 'get'
  })
}

// 新增游戏
export function createGame(data) {
  return request({
    url: '/game/config',
    method: 'post',
    data
  })
}

// 编辑游戏
export function updateGame(data) {
  return request({
    url: '/game/config',
    method: 'patch',
    data
  })
}

// 刪除游戏
export function deleteGame(id) {
  return request({
    url: '/game/config/' + id,
    method: 'delete'
  })
}

export function startOk() {
  return request({
    url: '/center/user/base/statementsetempty?value=1',
    method: 'get'
  })
}

export function startNo() {
  return request({
    url: '/center/user/base/statementsetempty?value=2',
    method: 'get'
  })
}


// 新增游戏
export function refreshGameList() {
  return request({
    url: '/game/config/refreshGameList',
    method: 'post'
  })
}
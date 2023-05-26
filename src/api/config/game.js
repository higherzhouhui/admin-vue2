import request from '@/utils/request'

// 游戏列表
export function getGameList(pageSize = 20, pageNum = 1, data) {
  var url = `/config/game?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增游戏
export function createGame(data) {
  return request({
    url: '/config/game',
    method: 'post',
    data
  })
}

// 编辑游戏
export function updateGame(data) {
  return request({
    url: '/config/game',
    method: 'patch',
    data
  })
}

export function startGame() {
  return request({
    url: '/config/game/isStart?&status=0',
    method: 'get'
  })
}

export function stopGame() {
  return request({
    url: '/config/game/isStart?&status=1',
    method: 'get'
  })
}

// 刪除游戏
export function deleteGame(id) {
  return request({
    url: '/config/game/' + id,
    method: 'delete'
  })
}

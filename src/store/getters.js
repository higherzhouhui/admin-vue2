const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  dynamicRoutes: state => state.permission.dynamicRoutes,
  delDynamicRoutes: state => state.permission.delDynamicRoutes,
  buttonPermission: state => state.user.buttonPermission,
  permission_routes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  ossInfos: state => state.oss.ossInfos,
  loading: state => state.app.loading,
  timerDate: state => state.user.timerDate
}
export default getters

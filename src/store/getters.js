const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  uploadImageApi: state => state.upload.uploadImageApi
}
export default getters

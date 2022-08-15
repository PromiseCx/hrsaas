import store from '@/store'

// 混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    checkPermission(key) {
      // key为要检查的点
    //   store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item.key === key)
      }
      return false
    }
  }
}

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { loginAPI, getUserInfoAPI, getUserDetailByIdAPI } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // vuex的持久化，vuex初始化在本地缓存中获取

  // 这里有getters快捷访问，不能设置为null，会报错
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token // 将数据给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // vuex数据置空
    removeToken() // 本地缓存数据同步置空
  },
  setUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const result = await loginAPI(data)
    context.commit('setToken', result)
    setTimeStamp() // is now timeStamp
  },
  async getUserInfo(context) {
    const result = await getUserInfoAPI()
    const baseInfo = await getUserDetailByIdAPI(result.userId)
    const obj = { ...result, ...baseInfo }
    context.commit('setUserInfo', obj)
    return result
  },
  logout(context) {
    // delete token
    context.commit('removeToken')
    // delete userinfo
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 设置permissio中的路由为初始状态
    // vuex中子模块调用子模块的action，只有在两模块都不加锁的时候可以随意调用
    // 不加命名空间时，所有mutatios和actions都是挂在全局上的，所以可以直接调用
    // 但是加了命名空间之后，context指的是模块的，而不是全局的
    // 此时要，加第三个参数，{route：true}表示调用根级的mutat或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { loginAPI, getUserInfoAPI, getUserDetailByIdAPI } from '@/api/user'

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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

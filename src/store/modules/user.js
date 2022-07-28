import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() // vuex的持久化，vuex初始化在本地缓存中获取
}

const mutations = {
  setToken(state, token) {
    state.token = token // 将数据给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // vuex数据置空
    removeToken() // 本地缓存数据同步置空
  }
}

const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

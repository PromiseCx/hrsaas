import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally 注册全局组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)

// 将所有的svg目录下的所有的后缀为.svg文件全部引入到项目中
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)


import Layout from '@/layout'

// 员工路由的规则
// 单一的路由规则是一个对象，所有的路由规则是一个数组
export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/setting'),
    // 路由的元信息，存储数据的地方
    meta: { title: '公司设置', icon: 'setting' } // 左侧导航会读取这里的title
  }]
}

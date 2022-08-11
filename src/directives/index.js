export const imageerror = {
  // 指令对象，会在dom元素插入节点之后执行
  inserted(dom, options) {
    dom.src = dom.src || options.value
    // options 中的 value 为src的值
    // dom 为当前指令作用的对象
    // 当图片有地址，但是没有加载成功的时候，会触发图片的一个事件 onerror
    dom.onerror = () => {
      // 当图片出现异常的时候，会将指令的默认值设置为图片的内容
      dom.src = options.value
    }
  },
  // 该钩子函数，会在当前指令作用的组件更新数据完毕之后执行
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

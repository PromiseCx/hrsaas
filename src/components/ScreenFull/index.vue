<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  methods: {
    changeScreen() {
      // document.documentElement.requestFullscreen()
      if (!ScreenFull.isEnabled) {
        this.$message.warning('当前全局组件不可用！')
        return
      }
      ScreenFull.toggle()
    }
  }
}
</script>

<style>
</style>

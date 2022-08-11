<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- <image-upload /> -->
    <!-- <page-tools :show-before="true"> -->
    <!--
          插槽除了slot名字之外，还可以用 v-slot指令配合template标签使用
          slot="name"
          v-slot:name
       -->
    <!-- <template v-slot:before>
        <el-button type="primary">daoruexcel</el-button>
      </template>
      <el-button slot="after" type="primary">daoruexcel</el-button>
    </page-tools> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

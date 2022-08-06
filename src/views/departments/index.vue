<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部： -->
      <el-card class="tree-card">
        <!-- elementui的行列布局，row和col -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDept" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDept"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 组件自身的自定义事件都是独立的，名字冲突也不影响 -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartmentsAPI } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: {
        name: '黑龙江大庆五维卓越软件开发中心',
        manager: '负责人',
        id: ''
      },
      showDialog: false,
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartmentsAPI()
      this.departs = tranListToTreeData(result.depts, '')
    },
    addDept(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 通过ref可以获取组件的实例，可以调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

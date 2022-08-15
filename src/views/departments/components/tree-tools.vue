<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px;width: 100%"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row justify="end" type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu v-if="isRoot" slot="dropdown">
              <el-dropdown-item command="add" :disabled="checkPermission('aa')">添加子部门</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-else slot="dropdown">
              <el-dropdown-item command="add" :disabled="checkPermission('aa')">添加子部门</el-dropdown-item>
              <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartmentsAPI } from '@/api/departments'

export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // add children depts
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // edit children depts
        this.$emit('editDepts', this.treeNode)
      } else {
        // delete children depts
        this.$confirm('确定要删除该组织部门吗？').then(() => {
          return deleteDepartmentsAPI(this.treeNode.id)
        }).then(() => {
          // 调用接口删除之后，后端的数据已经删除了 但是前端的页面数据还没变化
          this.$emit('delDepts')
          this.$message.success('删除部门组织成功！')
        })
      }
    }
  }
}
</script>

<style>

</style>

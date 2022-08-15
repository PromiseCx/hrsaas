<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleListAPI } from '@/api/setting'
import { getUserDetailByIdAPI } from '@/api/user'
import { assignRolesAPI } from '@/api/employes'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleListAPI()
      this.list = rows
    },
    async getUserDetailById(id) {
      /**
         * 给props传递是异步的，不能直接使用props传过来的id，
         * 这个方法是父组件调用的
         */
      const { roleIds } = await getUserDetailByIdAPI(id)
      this.roleIds = roleIds
    },
    btnCancel() {
      this.roleIds = []
      this.$emit('update:showDialog', false)
    },
    async btnOk() {
      await assignRolesAPI({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showDialog', false)
      /**
       * 修改父组件的值除了以上方法，还有
       * 1.自定义事件
       * 2.update：props，值
       * 3.this.$parent.props = value
       */
    }
  }
}
</script>

<style>

</style>

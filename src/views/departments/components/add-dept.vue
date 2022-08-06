<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartmentsAPI,
  addDepartmentsAPI,
  getDepartDetailsAPI,
  updateDepartmentsAPI
} from '@/api/departments'
import { getEmployeeSimpleAPI } from '@/api/employes'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // check whe dept name wheater is the same
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门name，在同级部门进行对比
      const { depts } = await getDepartmentsAPI()

      let isRepeat = false
      if (this.formData.id) {
        // 有id为编辑模式
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.formData.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === value)
      } else {
        // 没有id为新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }

      // 子节点的pid和父节点的id相等
      isRepeat
        ? callback(new Error('同级部门下已经存在这个部门了！'))
        : callback()
    }
    const checkCodeReapeat = async(rule, value, callback) => {
      const { depts } = await getDepartmentsAPI()
      let isRepeat = false
      if (this.formData.id) {
        // 有id为编辑模式
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value && value)
      } else {
        isRepeat = depts.some((item) => item.code === value && value)
      }
      isRepeat
        ? callback(new Error('组织架构下已经存在这个编码了！'))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          { trigger: 'blur', validator: checkCodeReapeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimpleAPI()
    },
    async getDepartDetail(id) {
      // props传值是异步的，直接  this.treeNode.id 可能取不到id
      this.formData = await getDepartDetailsAPI(id)
    },
    btnOK() {
      this.$refs.deptForm.validate(async(isOK) => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartmentsAPI(this.formData)
          } else {
            await addDepartmentsAPI({
              ...this.formData,
              pid: this.treeNode.id
            })
          }

          this.$emit('addDepts')
          /**
           update:showDialog是固定写法，在使用sync修饰符的时候，可以省略父组件的监听自定义事件和方法函数
           父组件中只需要添加  ：showDialog.sync = "showDialog"
           在父组件传值的属性后加.sync
           update:props属性，值
           *
           */
          this.$emit('update:showDialog', false)
          // 关闭dialog时会触发close事件，所以这里不需要重置数据
        }
      })
    },
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        <el-card>
          <el-tabs>
            <el-tab-pane label="角色管理">
              <el-row style="height: 60px">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="showDialog = true"
                >新增角色</el-button>
              </el-row>
              <el-table border="" :data="list">
                <el-table-column
                  type="index"
                  label="序号"
                  width="120"
                  align="center"
                  header-align="left"
                />
                <el-table-column
                  prop="name"
                  label="角色名称"
                  width="240"
                  align="center"
                />
                <el-table-column
                  prop="description"
                  label="描述"
                  align="center"
                />
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-button size="small" type="success">分配权限</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="editRole(row.id)"
                    >编辑</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="deleteRole(row.id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row
                type="flex"
                justify="center"
                style="height: 60px"
                align="middle"
              >
                <el-pagination
                  layout="prev,pager,next"
                  :total="page.total"
                  :page-size="page.pagesize"
                  :current-page="page.page"
                  @current-change="changePage"
                />
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="公司信息">
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                show-icon
                :closable="false"
              />
              <el-form label-width="120px" style="margin-top: 50px">
                <el-form-item label="企业名称">
                  <el-input
                    v-model="formData.name"
                    style="width: 400px"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input
                    v-model="formData.companyAddress"
                    style="width: 400px"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="电话">
                  <el-input
                    v-model="formData.companyPhone"
                    style="width: 400px"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input
                    v-model="formData.mailbox"
                    style="width: 400px"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remarks"
                    style="width: 400px"
                    disabled
                    type="textarea"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </h2>
    </div>
    <!-- dialog -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @close="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleListAPI,
  getCompanyInfoAPI,
  deleteRoleAPI,
  getRoleDetailAPI,
  updateRoleAPI,
  addRoleAPI
} from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [],
      page: {
        // 放置页码和相关数据
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleListAPI(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfoAPI(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？')
        await deleteRoleAPI(id)
        this.getRoleList()
        this.$message.success('删除角色成功！')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // 实现数据的回显
      this.roleForm = await getRoleDetailAPI(id)
      this.showDialog = true
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOk() {
      /**
       * 再点击确定后，会关闭弹层，会触发close关闭事件，所以不用重写清空功能
       */
      try {
        await this.$refs.roleForm.validate()
        // 有id为编辑 否则为新增
        if (this.roleForm.id) {
          await updateRoleAPI(this.roleForm)
        } else {
          // add
          await addRoleAPI(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功！')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>

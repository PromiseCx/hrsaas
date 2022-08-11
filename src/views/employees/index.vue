<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- left total count -->
        <span slot="before">共{{ page.total }}条数据</span>
        <!-- right button  -->
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
          >excel导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增</el-button>
        </template>
      </page-tools>
      <el-table :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column width="120px" label="头像" align="center">
          <template v-slot="{ row }">
            <img
              v-imageerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              alt=""
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
              "
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
          :formatter="formatEmployment"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <!-- 作用域插槽+过滤器 -->
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template v-slot="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="formOfEmployment">
          <template v-slot="{ row }">
            <el-switch :value="row.formOfEmployment === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
            >查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button
              type="text"
              size="small"
              @click="delEmployee(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev,pager,next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 组件弹层 -->
    <!-- sync目的是帮助子组件来修改父组件的数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, delEmployeeAPI } from '@/api/employes'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeListAPI(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        await delEmployeeAPI(id)
        this.$message.success('删除员工成功!')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async(excel) => {
        //  excel是引入文件的导出对象
        const { rows } = await getEmployeeListAPI({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          /**
           * 获取所有的数据，并没有这个接口,但可以将所有数据放到一页中来查询
           */
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })

      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    showQrCode(url) {
      if (url) {
        // 页面的渲染是异步的
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 等页面数据更新完毕之后在执行
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像！')
      }
    }
  }
}
</script>

<style>
</style>

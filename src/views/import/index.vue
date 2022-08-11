<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployeeAPI } from '@/api/employes'
export default {
  methods: {
    async success({ header, results }) {
      // header,results 中的数据是中文，要改成英文
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key]), '/')
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        arr.push(userInfo)
      })
      await importEmployeeAPI(arr)
      this.$message.success('导入excel成功！')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>

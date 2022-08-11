<template>
  <div>
    <!-- 图片上传组件 -->
    <!-- file-list是上传文件的列表，可以绑定到上传组件上，让组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :on-change="changeFile"
      :class="{ disabled:fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
// 实例化cos对象
const cos = new COS({
  SecretId: 'AKIDDG3ZomUv5yaw1pNeeNp1vYuznKabCWZL',
  SecretKey: 'WljQr1uWswjFUSAbleGbfSyDBsJTMxHM'
})

export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null,
      percent: 0,
      showPercent: false // 默认不显示进度条
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.imgUrl
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // file是要删除的文件，fileList是删除之后的文件
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      //   this.fileList = fileList
    },
    changeFile(file, fileList) {
      // 不能用push，这个钩子会触发多次
      // file是当前的文件，fileList是当前的最新数组
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小，1m = 1024kb，1kb= 1024b
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      if (params.file) {
        // upload
        cos.putObject({
          Bucket: 'promise-cx-1313286071',
          Region: 'ap-beijing',
          Key: params.file.name,
          Body: params.file, // 上传的文件对象
          StorageClass: 'STANDARD',
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            // upload success
            // 虽然是一张图片，但是fileList是一个数组
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                //   upload为true表示 该图片已经成功上传到服务器，地址已经是腾讯云的地址了  就不可以执行保存了
                return { url: 'http://' + data.Location, upload: true } // 将本地的地址换成腾讯云地址
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>

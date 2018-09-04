<script>
// 编辑头像的一个 vue 组件示例

import BreadCrumb from '@/common/breadcrumb'

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

import { mapGetters, mapActions } from 'vuex'
import toast from '@/utils/toast'
import { throttle } from 'lodash'

export default {
  name: 'profile-avatar-edit',
  computed: {
    ...mapGetters([
      'authToken',
      'env'
    ]),
    breadcrumb () {
      return [
        {
          name: 'profile',
          text: 'menu.profile'
        },
        {
          text: '编辑头像'
        }
      ]
    },
    uploadUrl () {
      return `${this.env.URI_BASE}user/avatar`
    }
  },
  components: {
    BreadCrumb,
    toast
  },
  data () {
    return {
      imageSrc: '',
      uploadFile: null,
      cropperHandle: null
    }
  },
  methods: {
    ...mapActions([
      'setUserInfo'
    ]),
    selectImage (e) {
      const file = e.target.files[0]
      if (file.type.indexOf('image') === -1) {
        toast.log('请上传正确格式的图片', { type: 'error' })
        return
      }
      const _self = this
      if (this.cropperHandle) {
        this.cropperHandle.destroy()
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        this.imageSrc = fileReader.result
        this.$nextTick(function () {
          const result = document.querySelector('#profile-avatar-edit__result')
          const image = document.querySelector('#profile-avatar-edit__img')
          // new Cropper
          const cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            minCropBoxWidth: 40,
            ready: function () {
            },
            crop: throttle(clipImage, 200)
          })
          this.cropperHandle = cropper

          function clipImage () {
            const croppedCanvas = cropper.getCroppedCanvas()
            const roundedCanvas = getCompressedCanvas(croppedCanvas)
            const roundedImage = document.createElement('img')
            roundedImage.src = roundedCanvas.toDataURL()
            // remove child node
            result.innerHTML = ''
            result.appendChild(roundedImage)
            roundedCanvas.toBlob(function (blob) {
              const file = new File([blob], Date.now() + '.png', { type: 'image/png', lastModified: Date.now() })
              _self.uploadFile = file
            })
          }
        })
      }

      function getCompressedCanvas (sourceCanvas) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // const width = sourceCanvas.width
        // const height = sourceCanvas.height
        canvas.width = 200
        canvas.height = 200
        context.imageSmoothingEnabled = true
        context.drawImage(sourceCanvas, 0, 0, 200, 200)
        // context.globalCompositeOperation = 'destination-in'
        // context.beginPath()
        // context.moveTo(200, 100)
        // context.arc(100, 100, 100, 0, 2 * Math.PI, true)
        // context.fill()
        return canvas
      }
    },
    uploadImage () {
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      const request = new XMLHttpRequest()
      request.open('POST', this.uploadUrl)
      request.setRequestHeader('Authorization', this.authToken)
      request.send(formData)
      request.onload = (e) => {
        if (e.currentTarget.status === 200) {
          try {
            const rsp = JSON.parse(e.currentTarget.response)
            if (rsp.status === '100000') {
              toast.log('上传用户头像成功', { type: 'success' })
              this.setUserInfo()
            } else {
              throw new Error('状态码:' + rsp.status)
            }
          } catch (e) {
            console.error(e)
            toast.log(['上传用户头像失败:', e], { type: 'error' })
          }
        }
      }
    },
    cancel () {
      this.$router.push({ name: 'profile' })
    }
  },
  mounted () {
  }
}
</script>

<template lang="pug">
  .profile-avatar-edit
    BreadCrumb(
      :data="breadcrumb"
    )
    .row.no-gutters
      .cropper-container
        img#profile-avatar-edit__img(v-if="imageSrc", :src="imageSrc")
      .snapshot-container.text-center
        #profile-avatar-edit__result
        p.text-preview Preview
        input(type="file", id="profile-avatar-edit__input", @change="selectImage")
        label.el-button.el-button--primary.select-btn(for="profile-avatar-edit__input") 选择图片
        p.text-intro 点击"选择图片",完成自定义编辑后,点击"保存"完成上传头像操作.
        .btn-wrapper
          label.el-button.el-button--default(@click="cancel") 取消
          el-button(type="success", @click="uploadImage", :disabled="!uploadFile") 保存
</template>

<style lang="scss">
.profile-avatar-edit {
  @import '~@/theme-dark/variables';
  .cropper-container {
    width: 560px;
    height: 420px;
    margin-right: 90px;
    border-radius: 4px;
    background: url(/static/img/bg-masaike.png);
    overflow: hidden;
    #profile-avatar-edit__img {
      max-width: 100%;
    }
  }
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
  .snapshot-container {
    width: 200px;
    position: relative;
    input[type="file"] {
      visibility: hidden;
      position: absolute;
    }
    .text-preview {
      font-size: 18px;
    }
    .text-intro {
      font-size: 10px;
      margin-top: 18px;
      text-align: left;
    }
    .select-btn {
      width: 130px;
    }
    #profile-avatar-edit__result {
      height: 200px;
      width: 200px;
      background: #fff;
      margin-bottom: 16px;
      background: url(/static/img/bg-avatar.png);
      background-size: cover;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .btn-wrapper {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      .el-button {
        width: 90px;
      }
    }
  }
}
</style>



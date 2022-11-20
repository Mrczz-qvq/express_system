<script setup lang="ts">
import type { UploadProps } from 'element-plus'

import { reactive } from 'vue'
import useStore from '@/stores'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const { user } = useStore()

const state = reactive({
  tempAvatarURL: ''
})

// const handleAvatarSuccess: UploadProps['onSuccess'] = (
//   response,
//   uploadFile
// ) => {
//   imageUrl.value = URL.createObjectURL(uploadFile.raw!)
// }
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片只能 JPG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  state.tempAvatarURL = URL.createObjectURL(rawFile)
  // 实际上并不上传，只是显示出来
  return false
}

const updateInfo = async (key: string) => {
  const res = await request({
    url: `/${user.role}/updateinfo`,
    method: 'post',
    data: {
      id: user.token,
      [key]: user.getByServerKey(key),
    },
  })
  if (res.status !== 200) {
    ElMessage.error(`${key} 修改失败, status=${res.status}`)
    return
  }
  ElMessage.success(`${key} 修改成功`)
  // console.log("试图更新", key)
}

const confirmAvatar = () => {
  if (!state.tempAvatarURL) {
    ElMessage.warning('先上传图片才能修改头像')
    return
  }
  user.avatar = state.tempAvatarURL
}
</script>

<template>
  <main class="container">
    <div class="flex-column">
      <section class="upload-box">
        <!-- <img :src="state.tempAvatarURL" class="avatar" alt="炸虾" /> -->
        <el-image
          class="avatar"
          :src="state.tempAvatarURL"
          :preview-src-list="[state.tempAvatarURL]"
          :initial-index="0"
          fit="cover"
        >
          <template #error>
            <div class="image-slot"><el-icon><Picture /></el-icon></div>
          </template>
        </el-image>
        <div class="divider"></div>
        <el-upload
          class="avatar avatar-uploader"
          action="/not-implemented/avatar"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <!-- :on-success="handleAvatarSuccess" -->
          <!-- 后端未实现 -->
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </section>
      <el-button color="#a2d1ef" @click="confirmAvatar">确认上传</el-button>
    </div>

    <el-form class="user-info-form" :model="user">
      <el-form-item label="昵称：">
        <el-input v-model="user.nickname" @keyup.enter="updateInfo('name')"/>
      </el-form-item>
      <el-form-item label="性别：" v-if="!user.role.includes('manager')">
        <el-input v-model="user.sex" @keyup.enter="updateInfo('sex')"/>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="user.phone" @keyup.enter="updateInfo('phonenumber')"/>
      </el-form-item>
      <el-form-item label="身份证：" v-if="user.role!=='courier'">
        <el-input v-model="user.idcard" @keyup.enter="updateInfo('idcard')"/>
      </el-form-item>
    </el-form>
  </main>
</template>

<style scoped lang="less">
@avatar-height: 10rem;
@avatar-width: 10rem;

.container {
  width: 50%;
  padding: 2rem 1rem;
  border-radius: 2rem;
  justify-content: flex-start;
}

.flex-column {
  display: flex;
  flex-direction: column;

  .el-button {
    width: 2 * @avatar-width;
    margin: 0 auto;
  }

  .upload-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .divider {
      margin: 0 1.2rem;
      border-left: 1px solid #666;
    }
    .avatar {
      height: @avatar-height;
      width: @avatar-width;
      margin: 0.5rem 0;
      border-radius: 5%;
    }
    .avatar .image-slot {
      display: flex;
      justify-content: center;
      font-size: 2rem;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #e5f5ff;
      color: var(--el-text-color-secondary);
    }
  }
}

.user-info-form > .el-form-item {
  width: 80%;
  margin: 1rem auto;
}

:deep(.avatar-uploader .el-upload) {
  cursor: pointer;
  border: 1px dashed #666;
  border-radius: 5%;
  transition: var(--el-transition-duration);
  &:hover {
    border-color: #ffba55;
  }
  
  .el-icon.avatar-uploader-icon {
    &:hover {
      color: #ffba55;
    }
    font-size: 28px;
    color: #666;
    width: @avatar-height;
    height: @avatar-width;
    text-align: center;
    transition: inherit;
  }
}

</style>

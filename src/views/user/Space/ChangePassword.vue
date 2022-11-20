<script setup lang="ts">
import { reactive } from 'vue'
import useStore from '@/stores'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const { user } = useStore()
const state = reactive({
  oldPassowrd: '',
  newPassowrd: '',
  newPassowrd2: '',
})

const checkOld = () => {
  if (state.oldPassowrd && user.password === state.oldPassowrd) {
    return true
  }
  ElMessage.error('旧密码错误！')
  return false
}

const checkNew = () => {
  if (state.newPassowrd2 && state.newPassowrd === state.newPassowrd2) {
    return true
  }
  ElMessage.error('两次输入的密码不匹配！')
  return false
}

const confirmPwd = async () => {
  if (!checkOld() || !checkNew()) {
    return
  }
  const res = await request({
    url: '/customer/updateinfo',
    method: 'post',
    data: {
      id: user.token,
      password: state.newPassowrd2,
    },
  })
  if (res.status !== 200) {
    ElMessage.error(`密码修改失败, status=${res.status}`)
    return
  }
  user.password = state.newPassowrd2
  ElMessage.success('密码修改成功')
}
</script>

<template>
  <main class="container">
    <h3 class="title">修改密码</h3>
    <el-form class="pwd-form" :model="state">
      <el-form-item label="旧密码：">
        <el-input v-model="state.oldPassowrd" @change="checkOld"/>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="state.newPassowrd"/>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input v-model="state.newPassowrd2" @change="checkNew"/>
      </el-form-item>
      <el-button color="#a2d1ef" @click="confirmPwd">确认修改</el-button>
    </el-form>
  </main>
</template>

<style scoped lang="less">
.container {
  width: 50%;
  padding: 2rem 1rem 3rem;
  border-radius: 2rem;
  .title {
    text-align: center;
  }
}
.pwd-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-form-item {
    width: 80%;
    margin: 2rem auto;
  }
  .el-button {
    width: 80%;
  }
}
</style>

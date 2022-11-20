<script setup lang="ts">
import type { LoginFormData } from '@/types/login'

import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue'
import { ElForm, ElInput, ElMessage } from 'element-plus'
import router from '@/router'
import { useRoute } from 'vue-router'
// import { getCaptcha } from '@/api/login'
import useStore from '@/stores'
import { drawCaptcha } from '@/utils/validate'

const { user } = useStore()
const route = useRoute()

const loginFormRef = ref(ElForm)
const passwordRef = ref(ElInput)
const loginInfo = {
  title: 'ExpresSys',
  username: '账号',
  password: '密码',
  login: '登 录',
  code: '请输入验证码',
  copyright: 'Copyright © 2022 - 2023 noe.cc All Rights Reserved.',
  icp: 'ICP备案号:福ICP备60002333号-6',
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    callback(new Error('密码不可小于6位'))
  } else {
    callback()
  }
}
const validateValidCode = (rule: any, value: any, callback: any) => {
  if (value.length !== 4 || value !== state.correctCode) {
    callback(new Error('验证码错误'))
  } else {
    callback()
  }
}
// arrow 与 function 区别于必须先定义才能调用

const state = reactive({
  redirect: '',
  iconColor: '#333',
  loginForm: {
    username: '',  // 13110510812
    password: '',  // 123456
    role: 'customer',
    code: '',
    uuid: '',
  } as LoginFormData,
  loginRules: {
    username: [{ required: true, trigger: 'blur' }],
    password: [{ 
      required: false, 
      trigger: 'blur', 
      validator: validatePassword,
      // 'inline-message': false,
    },],
    code: [{ required: true, trigger: 'blur', validator: validateValidCode }],
  },
  correctCode: '正确的验证码',  // 初值为不会出现的
  loading: false,
  passwordType: 'password',
  captchaBase64: '',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
})

const {
  loginForm,
  loginRules,
  loading,
  passwordType,
  captchaBase64,
  capslockTooltipDisabled,
  showCopyright,
} = toRefs(state)

const checkCapslock = (e: any) => {
  const { key } = e
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z'
}

const showPwd = () => {
  if (state.passwordType === 'password') {
    state.passwordType = ''
  } else {
    state.passwordType = 'password'
  }
  nextTick(() => {
    passwordRef.value.focus()
  })
}

// async 函数将非promise包装成 Promise 对象，需要逐层await
// await 接promise对象就会等其执行完
const handleLogin = async () => {
  const inner = async (valid: boolean) => {
    if(!valid) {
      return false
    }
    try {
      await user.login(state.loginForm)
      router.push({ path: state.redirect || '/', query: state.otherQuery })
    } catch (err: any) {
      refreshCaptcha()
      ElMessage.error(err.message)
      return false
    }
  }
  
  state.loading = true
  await loginFormRef.value.validate(inner)
  state.loading = false
}

// 获取验证码
const refreshCaptcha = () => {
  // state.captchaBase64 = "/imgs/valid_code.jpg"
  // state.loginForm.uuid = "null"

  // getCaptcha().then(({ data }: { data: Captcha}) => {
  //   const { img, uuid } = data
  //   state.captchaBase64 = img
  //   state.loginForm.uuid = uuid
  // })

  const canvas = document.querySelector('#captcha-canvas') as HTMLCanvasElement
  state.correctCode = drawCaptcha(canvas)
}
const autoFillCaptcha = () => {
  state.loginForm.code = state.correctCode
}

const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  route,
  () => {
    const query = route.query
    if (query) {
      state.redirect = query.redirect as string
      state.otherQuery = getOtherQuery(query)
    }
  },
  {
    immediate: true,
  }
)


onMounted(() => {
  refreshCaptcha()
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false
    } else {
      state.showCopyright = true
    }
  }
})
</script>

<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ loginInfo.title }}</h3>
      </div>

      <el-form-item prop="username">
        <el-icon class="icon-left" :color="state.iconColor"><User /></el-icon>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="loginInfo.username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip
        :disabled="capslockTooltipDisabled"
        content="Caps lock is On"
        placement="right"
      >
        <el-form-item prop="password">
          <el-icon class="icon-left" :color="state.iconColor"><Lock /></el-icon>
          <el-input
            ref="passwordRef"
            :key="passwordType"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="loginInfo.password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capslockTooltipDisabled = true"
            @keyup.enter="handleLogin"
          />
          <el-icon class="icon-right" @click="showPwd" :color="state.iconColor"><View /></el-icon>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="code">
        <el-icon class="icon-left" :color="state.iconColor"><CircleCheck /></el-icon>
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          :placeholder="loginInfo.code"
          @keyup.enter="handleLogin"
        />

        <!-- <div class="captcha"> -->
          <!-- <img
            alt="validdate code"
            :src="captchaBase64"
            @click="refreshCaptcha"
            height="38px"
          /> -->
        <!-- </div> -->
          <canvas 
            id="captcha-canvas" 
            width="90" height="35" 
            @click="refreshCaptcha"
            @auxclick="autoFillCaptcha"
          >
          </canvas>
      </el-form-item>

      
      <el-radio-group v-model="state.loginForm.role">
        <el-radio label="customer">普通用户</el-radio>
        <el-radio label="courier">快递员</el-radio>
        <el-radio label="manager">网点管理员</el-radio>
        <el-radio label="supermanager">后台管理员</el-radio>
      </el-radio-group>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        @click.prevent="handleLogin"
        >{{ loginInfo.login }}
      </el-button>

      <div class="tips">
        <span style="margin-right: 20px"
          >{{ loginInfo.username }}: admin</span
        >
        <span> {{ loginInfo.password }}: 123456</span>
      </div>
    </el-form>

    <div v-if="showCopyright == true" class="copyright">
      <p>{{ loginInfo.copyright }}</p>
      <p>{{ loginInfo.icp }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@bg: #add7f2;
@dark_gray: #889aa4;
@light_gray: #eee;
@cursor: #fff;

:deep(.el-form-item > .el-form-item__content) {
  @itemHeight: 40px;
  .el-form-item__error {
    position: absolute;
    top: @itemHeight;
    color: #ff3e3e;
  }
  position: relative;
  height: @itemHeight;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  // justify-content: space-around;
}

:deep(.el-input) {
  .el-input__wrapper {
    .el-input__inner {
      &:hover {
        border-color: var(--el-input-hover-border, var(--el-border-color-hover));
        box-shadow: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }

      caret-color: #000;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      height: 36px;
      box-shadow: none;
    }
    
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
  
  display: inline-block;
  height: 36px;
  width: 85%;
}

:deep(.el-form-item) {
  border: 1px solid rgba(12, 78, 200,0.4);
  background: #fff;
  border-radius: 5px;
}

.login-container {
  width: 100%;
  height: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    & > *:not(:first-child) {
      margin-top: 20px;
    }

    button {
      width: 100%;
    }

    .icon-left {
      margin: 0 20px 0 15px;
    }
    .icon-right {
      right: 10px;
      cursor: pointer;
    }

  }

  .el-radio-group {
    width: 100%;
    justify-content: space-around;
  }

  .tips {
    display: none;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #fff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  // .captcha {
  //   right: 30px;
  //   img {
  //     height: 36px;
  //     cursor: pointer;
  //     vertical-align: middle; 
  //   }
  // }
  #captcha-canvas {
    cursor: pointer;
  }
  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }
}
</style>

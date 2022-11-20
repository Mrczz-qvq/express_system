<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue'

// 组件依赖
import { ElForm, ElInput, ElMessage } from 'element-plus'
import router from '@/router'

// API依赖
import { useRoute } from 'vue-router'
import { getCaptcha } from '@/api/login'
import type { LoginFormData, Captcha } from '@/types/login'
// 状态管理依赖
import useStore from '@/stores'

const { user } = useStore()
const route = useRoute()

const loginFormRef = ref(ElForm)
const passwordRef = ref(ElInput)
const loginInfo = {
  title: 'ExpresSys',
  username: '用户名',
  password: '密码',
  login: '登 录',
  code: '请输入验证码',
  copyright: 'Copyright © 2022 - 2023 noe.cc All Rights Reserved.',
  icp: 'ICP备案号:福ICP备60002333号-6',
}

const state = reactive({
  redirect: '',
  iconColor: '#eee',
  loginForm: {
    username: '',
    password: '',
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
  },
  loading: false,
  passwordType: 'password',
  captchaBase64: '',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
})

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'))
  } else {
    callback()
  }
}

const {
  loginForm,
  loginRules,
  loading,
  passwordType,
  captchaBase64,
  capslockTooltipDisabled,
  showCopyright,
} = toRefs(state)

function checkCapslock(e: any) {
  const { key } = e
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z'
}

function showPwd() {
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
async function handleLogin() {
  const inner = async (valid: boolean) => {
    if(!valid) {
      return false
    }
    try {
      await user.login(state.loginForm)
      router.push({ path: state.redirect || '/', query: state.otherQuery })
    } catch (err: any) {
      handleCaptchaGenerate()
      ElMessage.error(err.message)
      return false
    }
  }
  
  state.loading = true
  await loginFormRef.value.validate(inner)
  state.loading = false
}

// 获取验证码
function handleCaptchaGenerate() {
  state.captchaBase64 = "/imgs/valid_code.jpg"
  state.loginForm.uuid = "null"
  // getCaptcha().then(({ data }: { data: Captcha}) => {
  //   const { img, uuid } = data
  //   state.captchaBase64 = img
  //   state.loginForm.uuid = uuid
  // })
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

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

onMounted(() => {
  handleCaptchaGenerate()
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
            placeholder="Password"
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

        <div class="captcha">
          <img
            alt="validdate code"
            :src="captchaBase64"
            @click="handleCaptchaGenerate"
            height="38px"
          />
        </div>
      </el-form-item>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        style="width: 100% margin-bottom: 30px"
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
@bg: #2d3a4b;
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

      background: transparent;
      border: 0px;
      border-radius: 0px;
      color: @light_gray;
      height: 36px;
      caret-color: @cursor;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
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
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .captcha {
    right: 30px;
    img {
      height: 36px;
      cursor: pointer;
      vertical-align: middle; 
    }
  }
  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

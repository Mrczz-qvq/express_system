<script setup lang="ts">
import { reactive } from 'vue'
import useStore from '@/stores'
import type { NavListItem } from "@/types/nav"
import router from '@/router'

const props = defineProps<{
  color?: string
  bgColor?: string
  hoverColor?: string
  selectedId?: string
}>()

const { user } = useStore()
const state = reactive({
  style: {
    color: props.color || "#000",
    bgColor: props.bgColor || "#fff",
    hoverColor: props.hoverColor || "#66ccff",
  },
  visible: false,
  title: "首页",
  list: [
    {
      index: "0",
      path: "/",
      name: "首页",
    },
    {
      index: "1",
      path: "/user/order",
      name: "用户服务",
    },
    {
      index: "2",
      path: "/admin/outlet",
      name: "物流服务",
    },
    {
      index: "3",
      path: "/about",
      name: "关于",
    },
  ] as Array<NavListItem>,
  enterSlideUp: false,
  leaveSlideDown: false,
  isShow: false,
})

const handleLogin = () => {
  router.push('/login')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'logout':
      user.resetToken()
      break
    case 'changePwd':
      router.push({path: '/user/space', hash: '#1'})
      break
    default:
      break
  }
}

const toUserSpace = () => {
  router.push('/user/space')
}

</script>

<template>
  <div class="nav">
    <div class="nav-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-menu
            :router="true"
            :default-active="selectedId"
            active-text-color="#409eff"
            mode="horizontal"
          >
            <el-menuItem
              :route="l.path"
              :index="l.index"
              v-for="l in state.list"
              :key="l.index"
            >
              {{l.name}}
            </el-menuItem>
          </el-menu>
        </el-col>
        
        <el-col v-if="user.isLoggedIn" :span="5">
          <div class="nav-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link" @click="toUserSpace">
                <img class="avatar" :src="user.avatar" alt="炸虾">
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout">登 出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
        <el-col v-else :span="2">
          <el-button class="loginBtn" @click="handleLogin">登录</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="less">
:root * {
  font-size: 18px;
  color: v-bind('state.style.color');
  background-color: v-bind('state.style.bgColor');
}

.nav {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #eee;
  .nav-content {
    width: 1200px;
    margin: 0 auto;
    .el-menu-item:hover {
      color: v-bind('state.style.hoverColor');
    }
    .el-menu-item.is-active {
      font-weight: 550;
      // color: v-bind('state.style.hoverColor');
      background-color: #ecf5ff;
    }
  }
  
  .nav-right {
    position: relative;
    text-align: right;
    .avatar {
      height: 50px;
      margin: 0;
      border-radius: 50%;
      margin-top: 5px;
      cursor: pointer;
    }
  }

  .loginBtn {
    &:hover {
      background-color: #ecf5ff;
      color: v-bind('state.style.hoverColor');
    }
    width: 80%;
    height: 100%;
    margin: 0 auto;
    padding: 0;
    border: none;
  }
}

@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0.1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}

@keyframes maskFadeOut {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0;
  }
}
</style>

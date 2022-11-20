<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
import AddressVue from '@/components/Address.vue'
import EditInfoVue from './EditInfo.vue'
import ChangePasswordVue from './ChangePassword.vue'
import OrderListVue from './OrderList.vue'
import useStore from '@/stores'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const { user } = useStore()
const route = useRoute()
const state = reactive({
  menu: ['修改信息', '修改密码', '地址管理', '订单管理', ],
  menuSelected: parseInt(route.hash[1]) || 0,
})
</script>

<template>
  <div class="container">
    <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="1"></Nav>
    <main>
      <aside class="sidebar user-nav">
        <img class="avatar" :src="user.avatar" alt="炸虾">
        <p>昵称：{{ user.nickname }}</p>
        
        <el-button
          color="#a2d1ef"
          v-for="(item, i) in state.menu"
          :class="{ active: state.menuSelected===i }"
          @click="() => state.menuSelected=i"
        >
          {{ item }}
        </el-button>
      </aside>

      <EditInfoVue v-if="state.menuSelected===0" class="sidebar"></EditInfoVue>
      <ChangePasswordVue v-if="state.menuSelected===1" class="sidebar"></ChangePasswordVue>
      <AddressVue v-if="state.menuSelected===2" class="sidebar" width="60%"></AddressVue>
      <OrderListVue v-if="state.menuSelected===3" class="sidebar"></OrderListVue>
    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped lang="less">
:deep(.el-form) {
  .el-form-item__label {
    color: #000;
  }
  .el-input .el-input__wrapper {
    .el-input__inner {
      color: #000;
      -webkit-text-fill-color: #333;
    }
    box-shadow: none;
    background-color: transparent;
  }
}

:deep(.el-form-item) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>

<style scoped lang="less">
@bg-color: #6096e6;

.container > main {
  margin: 0 12%;
  padding: 20px 0;
  display: flex;
  justify-content: space-around;
}
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: @bg-color;
  border-color: #446da9;
  * {
   margin: 0 auto; 
  }
}
.user-nav {
  width: 20%;
  max-height: 400px;
  padding: 2rem 0;
  border-radius: 1.5rem;

  .avatar {
    height: 6.5rem;
    width: 6.5rem;
    margin-bottom: 1.2rem;
  }
  .el-button {
    color: #000;
    border: 1px solid #446da9;
    height: 2.6rem;
    width: 7rem;
    border-radius: 0.5rem;
    font-size: 24px;
    margin-top: 1rem;
    &.active {
      color: #fff;
      border: 1px solid #bc883c;
      background-color: #ffba55;
    }
  }
}
</style>

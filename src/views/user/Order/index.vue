<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import UserEntry from '@/components/UserEntry.vue'
import Footer from '@/components/Footer.vue'
import OrderInfo from './OrderInfo.vue'
import OrderType from './OrderType.vue'
import OrderPay from './OrderPay.vue'
import OrderResult from './OrderResult.vue'
import useStore from '@/stores'
const { order } = useStore()
</script>

<template>
  <div class="order">
    <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="1"></Nav>
    <main>
      <UserEntry class="entries" :selected-id="2"></UserEntry>
      <OrderInfo v-if="order.orderStep===0"></OrderInfo>
      <!-- <OrderType v-model:form2="formState" v-if="global.orderStep===1"></OrderType> -->
      <OrderType v-if="order.orderStep===1"></OrderType>
      <OrderPay v-if="order.orderStep===2"></OrderPay>
      <OrderResult v-if="order.orderStep===3"></OrderResult>
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
.order > main {
  margin: 0 12%;
  padding: 20px 0;
  overflow: hidden;
  .entries {
    margin-bottom: 30px;
  }
}
</style>

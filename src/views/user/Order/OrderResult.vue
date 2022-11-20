<script setup lang="ts">
import useStore from '@/stores'

const { order } = useStore()
</script>

<template>
  <div class="main">
    <main class="result">
      <h3>支付成功！快递小哥正在赶来...</h3>
      <p>订单号：{{order.orderNo}}</p>
      <p>寄件人信息：{{order.sender.address}} {{order.sender.name}} {{order.sender.phone}}</p>
      <p>收件人信息：{{order.receiver.address}} {{order.receiver.name}} {{order.receiver.phone}}</p>
      <p>寄件码：{{Math.floor(10002133 * order.orderId!) % 10000}}</p>
    </main>

    <footer class="operation">
      <el-button color="#ffba55" class="submitBtn" @click="() => order.$reset()">再下一单</el-button>
    </footer>

  </div>
</template>

<style scoped lang="less">
.main {
  display: flex;
  flex-direction: column;
  background-color: #6096e6;
  padding: 30px 30px;
  border-radius: 40px;
  margin-bottom: 100px;
}

.result {
  width: 70%;
  margin: 0 auto;
  h3 {
    margin-top: 0;
  }
}

.operation {
  display: flex;
  justify-content: right;
  .el-button {
    height: 38px;
    width: 110px;
    font-size: 22px;
    font-weight: 600;
    border-radius: 10px;
  }
  .submitBtn {
    color: #fff;
    border: 1px solid #bc883c;
  }
}
</style>

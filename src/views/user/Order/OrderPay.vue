<script setup lang="ts">
import useStore from '@/stores'

const { order } = useStore()
</script>

<template>
  <div class="main">
    <main class="qrCode">
      <h3>扫码支付</h3>
      <el-image style="width: 240px; height: 240px" src="/imgs/QRCode_pay.jpg" fit="cover" />
    </main>

    <footer class="operation">
      <el-button color="#8d8d8d" class="backBtn" @click="order.back">上一步</el-button>
      <el-button color="#ffba55" class="submitBtn" @click="order.submit">我已支付</el-button>
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

.qrCode {
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
  }
  .backBtn {
    border: 1px solid #111;
    margin-right: 30px;
  }
  .submitBtn {
    color: #fff;
    border: 1px solid #bc883c;
  }
}
</style>

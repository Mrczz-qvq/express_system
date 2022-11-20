<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import UserEntry from '@/components/UserEntry.vue'
import Footer from '@/components/Footer.vue'
import { reactive } from 'vue'
import useStore from '@/stores'
import router from '@/router'

const { global } = useStore()
const imgUrlList = [
  'imgs/default_backgroud.jpg',
  'imgs/test-backgroud (1).jpg',
  'imgs/test-backgroud (2).jpg',
  'imgs/test-backgroud (3).jpg',
  'imgs/test-backgroud (4).jpg',
  'imgs/test-backgroud (5).jpg',
  'imgs/test-backgroud (6).jpg',
  'imgs/test-backgroud (7).jpg',
  'imgs/test-backgroud (8).jpg',
]

const state = reactive({
  orderId: ''  // 7231145141919810
})
const queryByOrderNo = () => {
  if (!state.orderId) {
    return
  }
  global.searchedOrderNo = state.orderId
  router.push('user/space#3')
}
</script>

<template>
  <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="0" ></Nav>
  <main class="main">
    <section class="propaganda">
      <el-image
        :src="imgUrlList[0]"
        :preview-src-list="imgUrlList"
        :initial-index="4"
        fit="cover"
      />
      <div class="notice">
        <h3 class="title">公告</h3>
        <span class="body">由于部分地区疫情管控政策，物流时效可能产生延迟，望周知</span>
      </div>
    </section>

    <section class="function">
      <div class="inputBox">
        <el-input v-model="state.orderId" placeholder="输入运单号"/>
        <el-button color="#ffba55" @click="queryByOrderNo">查询</el-button>
      </div>

      <UserEntry class="entries"></UserEntry>
    </section>
  </main>

  <Footer></Footer>
</template>

<style scoped lang="less">
@color: #000;

.main {
  height: 80%;
  background-color: #b2c8f3;
}

.propaganda {
  height: 200px;
  .el-image {
    width: 800px;
  }
  .notice {
    .title {
      color: #fff;
      background-color: #ec5f74;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 6px;
    }
    .body {
      font-size: 18px;
      padding: 30px 20px;
      width: 260px;
      border-radius: 10px;
      background-color: #ffd39f;
    }
    width: 400px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #94cdf1;
  }
  margin: 0 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.function {
  .inputBox {
    .el-input {
      width: 700px;
    }
    .el-button {
      color: #fff;
    }
    display: flex;
    margin: 20px 20% 0;
    flex-direction: row;
    justify-content: space-around;
    background-color: #add7f2;
    border: 1px solid #58b6e5;
    padding: 10px 10px;
  }

  .entries {
    margin: 80px 20% 0;
    padding: 0 0 100px; // sTODO 给上面的组件的留白，调整后删去
  }
}
</style>

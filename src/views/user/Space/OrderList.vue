<script setup lang="ts">
import { reactive, onBeforeMount, computed } from 'vue'
import useStore from '@/stores'
import exprReq from '@/api/system/express'

const { user, global } = useStore()
const state = reactive({
  expressList: [] as Array<any>,
  activeTab: 0,
})
const typeTabs = [
  {text: '待揽收', event: () => {state.activeTab=0}},
  {text: '已揽收', event: () => {state.activeTab=1}},
  {text: '已签收', event: () => {state.activeTab=2}},
]
onBeforeMount(async () => {
  let { data } = await exprReq.getall(user.token)
  if (global.searchedOrderNo) {
    data = data.filter((e: any) => e.trackingno === global.searchedOrderNo)
    global.searchedOrderNo = ''
  }
  state.expressList.push(...data)
  expressData.forEach(item => {
    if (!item.value.length) {
      state.activeTab++
    }
  })
})

const expressData = [
  // 待揽收
  computed(() => {
    return state.expressList.filter(e => !e.pickingtime && !e.signingtime)
  }),
  // 已揽收
  computed(() => {
    return state.expressList.filter(e => !!e.pickingtime && !e.signingtime)
  }),
  // 已签收
  computed(() => {
    return state.expressList.filter(e => !!e.signingtime)
  }),
]

const handleExpr = async (expr: any, type: string) => {
  switch (type) {
    case 'pick':
      await exprReq.pick(expr.id)
      break;
    case 'sign':
      await exprReq.sign(expr.id, user.token)
      break;
    default:
      break;
  }
  const { data } = await exprReq.get(expr.id)
  Object.keys(expr).forEach(k => {
    expr[k] = data[k]
  })
}

</script>

<template>
  <main class="orderlist-box">
    <nav class="type-tabs" v-if="state.expressList.length">
      <el-button
        color="#a4d2f0"
        v-for="(item, i) in typeTabs"
        :class="{ active: state.activeTab===i }"
        @click="item.event"
        >
          {{ item.text }}
      </el-button>
    </nav>
    <h2 class="type-tabs" v-else>
      暂无数据
    </h2>
    
    <section class="order-list">
      <div class="order" v-for="expr in expressData[state.activeTab]?.value">
        <div>
          <p>订单号: {{expr.trackingno}}</p>
          <p>寄件人信息: {{expr.sendname}}</p>
          <p>收件人信息: {{expr.receivename}}</p>
        </div>
        <div>
          <p>快递类型: {{expr.context}}</p>
          <p>物品信息: {{expr.type}}</p>
          <p>下单时间: {{expr.ordertime}}</p>
        </div>
        <!-- <el-button color="#ffba55" @click="handleExpr(expr, 'pick')">
          揽收
          <el-icon class="el-icon--right"><CircleCheck /></el-icon>
        </el-button> -->
        <el-button color="#ffba55" v-if="state.activeTab===1" @click="handleExpr(expr, 'sign')">
          签收
          <el-icon class="el-icon--right"><CircleCheck /></el-icon>
        </el-button>
      </div>
    </section>
  </main>
</template>

<style scoped lang="less">
.orderlist-box {
  display: flex;
  flex-direction: column;
  width: 60%;
  padding: 1.2rem 1.4rem 1.2rem 3rem;
  margin-bottom: 8rem;
  border-radius: 26px;
  background-color: #6096e6;
  justify-content: left;
}

.type-tabs {
  .el-button {
    color: #000;
    border: 1px solid #446da9;
    height: 32px;
    width: 100px;
    border-radius: 8px;
    font-size: 20px;
  }
  .el-button.active {
    color: #fff;
    border: 1px solid #bc883c;
    background-color: #ffba55;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.order-list > .order{
  &:first-child {
    margin-top: 2rem;
  }
  > div {
    margin-right: 6%;
  }
  p {
    margin: 0.2rem 0;
  }
  :deep(.el-button > span) {
    color: #fff;
    font-size: 20px;
  }
  margin: 1rem 0;
  padding: 0.2rem 1.6rem;
  border-radius: 0.8rem;
  background-color: #add7f2;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
}
</style>

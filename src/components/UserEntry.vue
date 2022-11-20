<script setup lang="ts">
import router from '@/router'

const props = defineProps<{
  selectedId?: number
}>()

const items = [
  {route: '/user/order', text: '寄快递'},
  {route: '/user/outlet', text: '网点查询'},
  {route: '/user/price', text: '资费查询'},
  {route: '/user/address', text: '地址服务'},
]

const routeTo = (url: string) => {
  router.push(url)
}
</script>

<template>
  <section class="entries">
    <el-button
      color="#6096e6"
      v-for="(item, i) in items"
      :class="{ active: props.selectedId===i }"
      @click="routeTo(item.route)"
      >
        <!-- <router-link :to="item.route"></router-link> -->
        {{ item.text }}
    </el-button>
  </section>
</template>

<style scoped lang="less">
.entries {
  .el-button {
    color: #fff;
    border: 1px solid #446da9;
    height: 70px;
    width: 160px;
    border-radius: 10%;
    font-size: 26px;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.el-button.active {
  border: 1px solid #bc883c;
  background-color: #ffba55;
}
</style>

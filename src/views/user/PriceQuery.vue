<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import UserEntry from '@/components/UserEntry.vue'
import Footer from '@/components/Footer.vue'

const expressTypes = [
  {name: '普通快递', src:'福建', dest:'浙江', initW: 8, subsequentW: 3},
  {name: '特快专递', src:'福建', dest:'浙江', initW: 10, subsequentW: 5},
  {name: '生鲜寄', src:'福建', dest:'浙江', initW: 10, subsequentW: 5},
  {name: '大件寄', src:'福建', dest:'浙江', initW: 8, subsequentW: 5},
]
</script>

<template>
  <div class="order">
    <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="1"></Nav>
    <main>
      <UserEntry class="entries" :selected-id="2"></UserEntry>

      <section class="price-info">
        <aside class="type-tabs" v-for="express in expressTypes">
          <nav class="tabs" > {{ express.name }}</nav>
          <p>出发地：{{ express.src }}</p>
          <p>目的地：{{ express.dest }}</p>
          <p>首重(1kg)*：{{ express.initW }}元</p>
          <p>续重*：{{ express.subsequentW }}元/kg</p>
        </aside>
      </section>

    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped lang="less">
@bgColor: #9dd0f0;

.order {
  background-color: @bgColor;
  height: 100%;
}
.order > main {
  margin: 0 12%;
  padding: 20px 0;
  overflow: hidden;
  .entries {
    margin-bottom: 30px;
  }
}

.price-info {
  display: flex;
  flex-direction: row;
  padding: 30px 20px 100px;
  border-radius: 20px;
  background-color: #6096e6;
  justify-content: space-around;
}

.price-info .type-tabs {
  .tabs {
    color: #000;
    border: 1px solid #446da9;
    background-color: #a1d1ef;
    height: 32px;
    width: 100px;
    border-radius: 8px;
    font-size: 20px;
    text-align: center;
    line-height: 32px;
  }
}
</style>

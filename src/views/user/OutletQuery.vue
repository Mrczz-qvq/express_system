<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import UserEntry from '@/components/UserEntry.vue'
import Footer from '@/components/Footer.vue'
import TencentMapVue from '@/components/TencentMap.vue'

</script>

<template>
  <div class="container">
    <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="1"></Nav>
    <main>
      <UserEntry class="entries" :selected-id="1"></UserEntry>

      <TencentMapVue></TencentMapVue>
    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped lang="less">
@bgColor: #9dd0f0;

.container {
  background-color: @bgColor;
  height: 100%;
}
.container > main {
  margin: 0 12%;
  padding: 20px 0;
  overflow: hidden;
  max-height: 450px;
  .entries {
    margin-bottom: 30px;
  }
}
</style>

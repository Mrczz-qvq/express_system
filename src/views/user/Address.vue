<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import UserEntry from '@/components/UserEntry.vue'
import Footer from '@/components/Footer.vue'
import AddressVue from '@/components/Address.vue'
</script>

<template>
  <div class="container">
    <Nav bg-color="#b2c8f3" hover-color="#f19d63" selected-id="3"></Nav>
    <main>
      <UserEntry class="entries" :selected-id="3"></UserEntry>

      <AddressVue></AddressVue>
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
    }
    .el-icon {
      color: #fff !important;
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

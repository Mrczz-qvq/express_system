<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
import useStore from '@/stores'
import addrReq from '@/api/system/address'

const props = defineProps<{
  width?: string
}>()

const { user } = useStore()
const address = reactive({
  default: "",
  list: [
    // {id: 0, uid: user.token, address: '福建省福州市闽侯县福州大学'},
  ] as any
})
const state = reactive({
  newAddress: '',
})

onBeforeMount(async () => {
  const res = await addrReq.get(user.token)
  address.list.push(...res.data)
  address.default = address.list[0]?.address || ''
})

const deleteAddr = async (idx: number) => {
  await addrReq.delete(address.list[idx].id)
  address.list.splice(idx, 1)
  address.default = address.list[0]?.address || ''
}

const addAddr = async () => {
  if (state.newAddress === '') {
    return
  }
  const res = await addrReq.add(user.token, state.newAddress)
  address.list.push({
    id: res.data,
    uid: user.token,
    address: state.newAddress,
  })
  state.newAddress = ''
}

const updateAddr = async (idx: number) => {
  await addrReq.update(address.list[idx].id, address.list[idx].address)
}
</script>

<template>
  <main class="address-box">
    <div class="newAddr">
      <el-input v-model="state.newAddress" clearable/>
      <el-button class="newBtn" color="#a1d1ef" @click="addAddr">新增地址</el-button>
    </div>
    
    <el-form :model="address">
      <el-form-item label="默认地址：">
        <span style="color: #000">{{ address.default }}</span>
      </el-form-item>

      <el-form-item :label="'地址' + (i+1) + '：'" v-for="(item, i) in address.list">
        <el-input 
          v-model="item.address"
          clearable 
          @clear="deleteAddr(i)"
          @keyup.enter="updateAddr(i)"
        />
      </el-form-item>
    </el-form>
  </main>
</template>

<style scoped lang="less">
.address-box {
  display: flex;
  flex-direction: column;
  width: v-bind('props.width');
  padding: 2rem 1.4rem 2rem 3rem;
  border-radius: 20px;
  background-color: #6096e6;
  justify-content: left;
}

.newAddr {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 0.4rem;

  .el-input {
    width: 70%;
  }

  .newBtn {
    color: #000;
    border: 1px solid #446da9;
    height: 32px;
    width: 100px;
    border-radius: 8px;
    font-size: 20px;
    text-align: center;
    line-height: 32px;
    margin-left: 10%;
  }
}

.el-form > .el-form-item {
  margin-top: 0.5rem;
}
</style>

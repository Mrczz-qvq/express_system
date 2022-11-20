<script setup lang="ts">
import useStore from '@/stores'
import { reactive, onBeforeMount } from 'vue'
import addrReq from '@/api/system/address'

const { user, order } = useStore()
const addressList = reactive([] as any)
onBeforeMount(async () => {
  const res = await addrReq.get(user.token)
  addressList.push(...res.data)
})

// props方式组件间通信
// import type { UserInfo } from '@/types/order'
// import { reactive } from 'vue'
// const props = defineProps<{
//   form1: {
//     sender: UserInfo,
//     receiver: UserInfo,
//     mode: number,
//     appoTime: string,
//     remark: string,
//   }
// }>()
// const formState = reactive({...props.form1})
// const emit = defineEmits(['update:form1'])
// emit('update:form1', formState)

const onSubmit = () => {
  order.next()
}
</script>

<template>
  <section class="form-main">
    <el-form :inline="true" :model="order" class="form-left">
      <div class="infoForm">
        <el-form-item label="寄件人姓名">
          <el-input v-model="order.sender.name" placeholder="" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="order.sender.phone" placeholder="" />
        </el-form-item>

        <el-form-item label="省市区">
          <el-input v-model="order.sender.region" placeholder="" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-select v-model="order.sender.address" placeholder="请选择">
            <el-option v-for="addr in addressList" :label="addr.address" :value=addr.id />
          </el-select>
        </el-form-item>

        <el-form-item label="邮政编码">
          <el-input v-model="order.sender.mailCode" placeholder="" />
        </el-form-item>
      </div>

      <div class="infoForm">
        <el-form-item label="收件人姓名">
          <el-input v-model="order.receiver.name" placeholder="" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="order.receiver.phone" placeholder="" />
        </el-form-item>

        <el-form-item label="省市区">
          <el-input v-model="order.receiver.region" placeholder="" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-select v-model="order.receiver.address" placeholder="请选择">
            <el-option v-for="addr in addressList" :label="addr.address" :value=addr.id />
          </el-select>
        </el-form-item>

        <el-form-item label="邮政编码">
          <el-input v-model="order.receiver.mailCode" placeholder="" />
        </el-form-item>
      </div>
    </el-form>

    <aside class="form-right">
      <el-form :inline="false" :model="order">
        <el-form-item label="寄件方式*：">
          <el-select v-model="order.mode" placeholder="请选择">
            <el-option label="快递员上门" :value=1 />
            <el-option label="网点自寄" :value=2 />
          </el-select>
        </el-form-item>
        
        <el-form-item label="预约时间*：">
          <el-date-picker
            v-model="order.appoTime"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
        
        <el-form-item label="备注：">
          <el-input v-model="order.remark" placeholder="" />
        </el-form-item>

        <el-form-item>
          <el-button class="submitBtn" color="#ffba55" type="primary" @click="onSubmit">下一步</el-button>
        </el-form-item>
      </el-form>
    </aside>
  </section>
</template>

<style scoped lang="less">
.form-main {
  display: flex;
  flex-direction: row;
}

.form-left {
  width: 60%;
  margin-right: 10%;
  .infoForm {
    background-color: #6096e6;
    margin-bottom: 20px;
    padding: 20px 30px 10px;
    border-radius: 20px;
  }
}

.form-right {
  .el-form-item:last-child {
    margin-top: 60%;
  }
  .submitBtn {
    height: 50px;
    width: 130px;
    border-radius: 10px;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    border: 1px solid #bc883c;
  }
}
</style>

<script setup lang="ts">
import { reactive } from 'vue'
import useStore from '@/stores'
const { order } = useStore()

const props = defineProps<{
  form2: {
    type: string,
    payment: string,
    weight: number|undefined,
    insurance: number|undefined,
    volume: number|undefined,
    valueAdded: string,
    price: number,
    time: string,
    orderType: string,
  }
}>()
const formState = reactive({...props.form2})
const state = reactive({
  activeTab: 0
})
const typeTabs = [
  {text: '普通快递', event: () => {state.activeTab=0}},
  {text: '特快专递', event: () => {state.activeTab=1}},
  {text: '生鲜寄', event: () => {state.activeTab=2}},
  {text: '大件寄', event: () => {state.activeTab=3}},
]

const emit = defineEmits(['update:form2'])
const onSubmit = (step: number) => {
  formState.orderType = typeTabs[state.activeTab].text
  emit('update:form2', formState)
  order.orderStep += step
}
const computePrice = () => {
  formState.price += Math.floor(Math.random() * 100)
}
</script>

<template>
  <div class="form-main">
    <nav class="type-tabs">
      <el-button
        color="#a4d2f0"
        v-for="(item, i) in typeTabs"
        :class="{ active: state.activeTab===i }"
        @click="item.event"
        >
          {{ item.text }}
      </el-button>
    </nav>

    <main class="form">
      <el-form :inline="true" :model="formState" class="infoForm">
        <el-form-item :label="state.activeTab===2? '生鲜类型*': '物品类型*'">
          <el-input v-model="formState.type" @blur="computePrice"/>
        </el-form-item>
        <el-form-item label="付款方式*">
          <el-select v-model="formState.payment" placeholder="请选择">
            <el-option label="寄付现结" :value=1 />
            <el-option label="到付" :value=2 />
            <el-option label="寄付月结" :value=3 />
          </el-select>
        </el-form-item>

        <el-form-item label="物品重量*">
          <el-input v-model="formState.weight" @blur="computePrice"/>
        </el-form-item>
        <el-form-item label="保价">
          <el-input v-model="formState.insurance" @blur="computePrice"/>
        </el-form-item>

        <el-form-item :label="'物品体积' + (state.activeTab===3? '*': '')">
          <el-input v-model="formState.volume" @blur="computePrice"/>
        </el-form-item>
        <el-form-item label="增值服务">
          <el-select v-model="formState.valueAdded" placeholder="可选">
            <el-option label="无" :value=0 />
            <el-option label="高度隐秘包装" :value=1 />
            <el-option label="礼盒包装" :value=2 />
            <el-option label="产品刻字" :value=3 />
            <el-option label="内附贺卡" :value=4 />
          </el-select>
        </el-form-item>
        <el-form-item label="预计运费">
          <el-input disabled v-model="formState.price"/>
        </el-form-item>
        <el-form-item label="时效选择*" v-if="state.activeTab===1">
          <el-select v-model="formState.time" placeholder="请选择">
            <el-option label="24小时" :value=1 />
            <el-option label="48小时" :value=2 />
          </el-select>
        </el-form-item>
      </el-form>
    </main>

    <footer class="operation">
      <el-button color="#8d8d8d" class="backBtn" @click="onSubmit(-1)">上一步</el-button>
      <el-button color="#ffba55" class="submitBtn" @click="onSubmit(1)">一键下单</el-button>
    </footer>

  </div>
</template>

<style scoped lang="less">
.form-main {
  display: flex;
  flex-direction: column;
  background-color: #6096e6;
  padding: 30px 30px;
  border-radius: 40px;
  margin-bottom: 100px;
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

.form {
  width: 80%;
  .infoForm {
    margin-bottom: 20px;
    padding: 20px 30px 10px;
    border-radius: 20px;
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

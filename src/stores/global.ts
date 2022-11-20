import { defineStore } from 'pinia'
// 偷懒起见存一些组件间可共享的/全局变量

const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    searchedOrderNo: ''
  }),
})

export default useGlobalStore

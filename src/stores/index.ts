import useUserStore from './user'
import useGlobalStore from './global'
import useOrderStore from './order'
import { createPinia, setMapStoreSuffix } from 'pinia'
import { watch } from 'vue'

declare module 'pinia' {
  export interface MapStoresCustomization {
    // set it to the same value as above
    suffix: ''
  }
}
setMapStoreSuffix('') // completely remove the suffix

const globalPinia = createPinia()
const user = useUserStore(globalPinia)
// 当token变化就刷新用户信息
watch(
  () => user.token,
  () => user.reqUserInfo(),
  {immediate: true},
)
const order = useOrderStore(globalPinia)
const global = useGlobalStore(globalPinia)

// const useStore = (addPinia?: boolean) => {
//   const pinia = addPinia? globalPinia: undefined
//   return {
//     user: useOrderStore(pinia),
//     order: useOrderStore(pinia),
//     // global: useGlobalStore(pinia),
//   }
// }
// export default useStore

export default () => ({
  user,
  order,
  global,
})
// 干脆都用globalPinia初始化，然后固定返回，否则用的pinia不同数据就不会同步
// 保持函数是为了跟旧代码兼容

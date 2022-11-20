import { defineStore } from 'pinia'
import type { UserInfo, OrderFormData } from '@/types/order'
import exprReq from '@/api/system/express'

const useOrderStore = defineStore({
  id: 'order',
  state: (): OrderFormData => ({
    orderStep: 0, // 当前下单到第几步

    sender: {} as UserInfo,
    receiver: {} as UserInfo,
    mode: 1,  // 寄件方式
    appoTime: '',  // 预约时间
    remark: '',  // 备注
    
    type: '',  // 物品类型
    payment: '',  // 付款方式
    weight: undefined,  // 重量
    insurance: undefined,  // 保价
    volume: undefined,  // 体积
    valueAdded: '',  // 增值服务
    price: 0,  // 预计运费
    time: '',  // 时效
  
    orderType: '',  // 订单类型
    orderId: undefined,  // 订单id
    orderNo: '',  // 订单号
  }),

  actions: {
    next() {
      this.orderStep++
    },
    back() {
      this.orderStep--
    },
    async submit() {
      const res = await exprReq.add(this)
      this.orderId = res.data.id
      this.orderNo = res.data.trackingno
      this.next()
    }
  }
})

export default useOrderStore

export interface UserInfo {
  name: string
  phone: string
  region: string
  address: string
  mailCode: number
}

export interface OrderFormData {
  orderStep: number,

  sender: UserInfo,
  receiver: UserInfo,
  mode: number,  // 寄件方式
  appoTime: string,  // 预约时间
  remark: string,  // 备注
  
  type: string,  // 物品类型
  payment: string,  // 付款方式
  weight: number|undefined,  // 重量
  insurance: number|undefined,  // 保价
  volume: number|undefined,  // 体积
  valueAdded: string,  // 增值服务
  price: 0,  // 预计运费
  time: string,  // 时效

  orderType: string,  // 订单类型
  orderId: number|undefined,  // 订单id
  orderNo: string,  // 订单号
}

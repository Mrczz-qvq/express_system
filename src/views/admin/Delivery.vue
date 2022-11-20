<script setup lang="ts">
import request from "@/utils/request";
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import useStore  from '@/stores'
import { useRoute } from "vue-router"
import router from "@/router";
import NavVue from "@/components/Nav.vue";
import FooterVue from "@/components/Footer.vue";
const {user} = useStore()
async function load(){
const ds = await request({
    url: '/customer/getexpress',
    method: 'post',
    data: {
        id:user.token,
    }
  })
  .then(function(res){
    console.log(user.token)
    state.tableData = res.data
  });

}
load();
async function search(){
  const ds = await request({
    url: '/express/getexpressbytrackingno',
    method: 'post',
    data: { 
      trackingno: state.search_name,
    },
  })
  .then(function(res){
      state.tableData = []
      state.tableData.push(res.data)
  });
}
async function qs(){
  const ds = await request({
    url: '/express/signexpress',
    method: 'post',
    data: { 
      id: state.tran_form.id,
      signname: 'Xizz',
    },
  })
  .then(function(res){
    console.log(res.data)
      load()
  });
}
async function lj(){
  const ds = await request({
    url: '/express/pickexpress',
    method: 'post',
    data: { 
      id: state.tran_form.id,
    },
  })
  .then(function(res){
      load()
  });
}
interface tranForm {
      branchid: number,
      sex:string,
      id: number,
      password: string,
      phonenumber:string,
      name: string,
      idcard: number,
      jobno: number,
}

const state = reactive({
  //表格数据
  tableData: [
    
  ] as Array<tranForm>,
  //弹窗
  dialogVisible: false,
  //快捷查询的名称
  search_name: '',
  //当前页数
  currentPage: 1,
  //每页大小
  pageSize: 5,
  //隐藏项目
  isShow: false,
  //表单对齐方式
  labelPosition: 'right',
  //表单数据
  tran_form: {} as tranForm,
})

//读取列表数据
const searchaddress = async ( ) => {
  search()
  
}


// 增加打卡窗口
const open = () => {
  state.tran_form = {
      branchid: 78,
      id: 1,
      sex: 'male',
      password: "6846868",
      phonenumber: "1222886",
      name: "blue",
      idcard: 6486865,
      jobno:1111,
  }
  state.dialogVisible = true
}
//重置查询
const resettable = async () => {
  load()
}

const qsByid = async (val: number,pk:string,sn:string) => {
  if(pk!=null && sn==null){
    state.tran_form.id = val
    qs() 
  }
}
const ljByid = async (val: number,pk:string,sn:string) => {
  if(pk==null && sn==null){
    state.tran_form.id = val
    lj()
  }
}

//改变每页条数
const handleSizeChange = (val: number) => {
  state.pageSize = val
  load()
}

//改变当前页
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  load()
}
const backto = async () => {
  router.go(-1);
}

//跳转网点管理
const gotooutlet = () => {
  router.push({path:'/admin/outlet'})
}
//跳转快递管理
const gotodelivery = () => {
  router.push({path:'/admin/delivery'})
}
//跳转快递员管理
const gotocourier = () => {
  router.push({path:'/admin/courier'})
}
</script>


<template>
  <NavVue selected-id="2" bg-color="#b2c8f3" hover-color="#f19d63"></NavVue>
  <div class="main">
    <!-- 头信息 - 新增、搜索、批量操作 -->
    <div style="width:100%; height: 10%; padding-top: 10px; text-align: center;">
      <el-button  @click="gotooutlet()" class="outlet" v-if="user.hasAuth('manager')">
        网点管理
      </el-button>
      <el-button  @click="gotodelivery()"  class="delivery" v-if="user.hasAuth('courier')">
        快递管理
      </el-button>
      <el-button  @click="gotocourier()" class="courier" v-if="user.hasAuth(null)">
        快递员管理
      </el-button>
    </div>
    <div style="margin: 20px 10px 0px 10px; height: 40px;">
      
      <div style="float: right;margin-right: 3%;">
        <el-input placeholder="请输入名称" v-model="state.search_name" clearable style="width: 500px; margin-right: 15px;"></el-input>
        <el-button class="qubt" @click="searchaddress">查询</el-button>
        <el-button class="qubt" @click="resettable">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div style="margin-top: 10px ; margin-left: 2%; margin-right: 2%;">
      <el-table :data="state.tableData.slice((state.currentPage-1)*state.pageSize,state.currentPage*state.pageSize)" :border="true"
      :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center', background: '#6096e6', color:'#fff'}" 
      :row-style="{ color:'#000' }" style="width: 100% ; font-size:16px ">
        <el-table-column type="expand">
          <template #default="props">
            <div style="width:100%; height: auto; display: flex;">
              <div class="extable" style="padding-left:180px">
                <p>类型: {{props.row.context}}</p>
                <p>Type: {{props.row.type}}</p>
              </div>
              <div class="extable">
                <p>Sendname: {{props.row.sendname}}</p>
                <p>Sendphone: {{props.row.sendphone}}</p>
                <p>Sendaddress: {{props.row.sendaddress}}</p>
              </div>
              <div class="extable">
                <p>Receivename: {{props.row.receivename}}</p>
                <p>Receivephone: {{props.row.receivephone}}</p>
                <p>Receiveaddress: {{props.row.receiveaddress}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="Id" width="80px"></el-table-column>
        <el-table-column prop="trackingno" label="订单号"></el-table-column>
        <!-- <el-table-column prop="context" label="类型"></el-table-column> -->
        <el-table-column prop="ordertime" label="Ordertime" width="180px"></el-table-column>
        <el-table-column prop="pickingtime" label="Pickingtime" width="180px"></el-table-column>
        <el-table-column prop="signingtime" label="Signingtime" width="180px"></el-table-column>
        <el-table-column prop="state" label="state" width="120px"></el-table-column>
        <!-- <el-table-column prop="type" label="type"></el-table-column> -->
        <!-- <el-table-column prop="sendtaddress" label="sendtaddress"></el-table-column>
        <el-table-column prop="receiveaddress" label="receiveaddress"></el-table-column> -->
        <!-- <el-table-column prop="courierid" label="courierid"></el-table-column>
        <el-table-column prop="customerid" label="customerid"></el-table-column> -->
        <!-- <el-table-column prop="sendname" label="sendname"></el-table-column>
        <el-table-column prop="sendphone" label="sendphone"></el-table-column>
        <el-table-column prop="receivename" label="receivename"></el-table-column>
        <el-table-column prop="receivephone" label="receivephone"></el-table-column> -->
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button size="default" @click="qsByid(scope.row.id,scope.row.pickingtime,scope.row.signingtime)">
              签收
            </el-button>
            <el-button size="default" @click="ljByid(scope.row.id,scope.row.pickingtime,scope.row.signingtime)">
              揽件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin-top: 10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="state.currentPage" background
        :page-sizes="[5, 10, 20]" :page-size="state.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="state.tableData.length">
      </el-pagination>
    </div>
    <div style="margin-top: 230px; color:#9dd0f0">-</div>
    <!-- <FooterVue></FooterVue> -->
  </div>
</template>

<style scoped>
.whiteitem .el-form-item__label{
  color: white;
}

.el-dialog__title {
            color: white;
}
.main{
  background-color:#9dd0f0; 
  height: auto; 
  padding-top:1px ;
}
.addbt{
  width:100px;
  height:40px;
  font-size: 16px;
  border-radius: 8px;
}
.qubt{
  width:60px;
  height: 30px;
  font-size: 15px;
  border-radius: 6px;
}

.el-button{
  border: 1px solid #446da9;
  background-color:#6096e6;
  color: #fff;
}

.el-pagination {
  justify-content: center;  
}

.outlet{
  width:150px; 
  height: 60px; 
  font-size:20px; 
  border-radius: 10px;
  margin-right: 50px;
  color:#000;
  background-color: rgb(152,206,240);
  border: 2px solid rgb(88,182,229);
}

.courier{
  width:150px; 
  height: 60px; 
  font-size:20px; 
  color:#000;
  border-radius: 10px;
  background-color: rgb(152,206,240);
  border: 2px solid rgb(88,182,229);
}

.delivery{
  width:150px; 
  height: 60px; 
  font-size:20px; 
  color:#fff; 
  background-color: rgb(255,186,85);
  border: 2px solid #fff;
  border-radius: 10px;
  margin-right: 50px;
}

.extable{
  color:rgba(0, 0, 0, 0.7);
  width:33%; 
  height:120px;
}

</style>

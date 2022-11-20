<script setup lang="ts">
import request from "@/utils/request";
import { reactive } from 'vue'
import useStore  from '@/stores'
import { useRoute } from "vue-router"
import router from "@/router";
import NavVue from "@/components/Nav.vue";
import FooterVue from "@/components/Footer.vue";

const {user} = useStore()
async function load(){
const ds = await request({
    url: '/courier/getall',
    method: 'get',
  })
  .then(function(res){
      state.tableData = res.data
  });

}
load();
async function search(){
  const ds = await request({
    url: '/courier/findcourier',
    method: 'post',
    data: { 
      name:state.search_name,
    },
  })
  .then(function(res){
      state.tableData = res.data
  });
}
async function deletecourier(val: number){
  const ds = await request({
    url: '/courier/delete',
    method: 'post',
    data: { 
      id: val,
    },
  })
  .then(function(res){
     load()
  });
}
async function addcourier(){
const ds = await request({
    url: '/courier/insert',
    method: 'post',
    data: { 
        name:state.tran_form.name,
        idcard:state.tran_form.idcard,
        phonenumber:state.tran_form.phonenumber,
        sex:state.tran_form.sex,
        password:state.tran_form.password,
        branchid:state.tran_form.branchid,
    },
  })
  .then(function(res){
      state.tran_form.id = res.data.id;
      state.tran_form.jobno = res.data.jobno;
      load()
  });

}
async function updatecourier1(){
  const ds = await request({
    url: '/courier/updateinfo',
    method: 'post',
    data: { 
        id: state.tran_form.id,
        name:state.tran_form.name,
        idcard:state.tran_form.idcard,
        phonenumber:state.tran_form.phonenumber,
        sex:state.tran_form.sex,
        branchid:state.tran_form.branchid,
    },
  })
  .then(function(res){
      updatecourier2()
      console.log(res.data)
  });
}
async function updatecourier2(){
  const ds = await request({
    url: '/courier/updatepassword',
    method: 'post',
    data: { 
      id: state.tran_form.id,
      password:state.tran_form.password,
    },
  })
  .then(function(res){
      load()
      console.log(res.data)
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
  dialogVisible1: false,
  dialogVisible2: false,
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
const deletecar = async (val: number) => {
  deletecourier(val)
  
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
  state.dialogVisible1 = true
}
//重置查询
const resettable = async () => {
  load()
}

const editbyid = async (val: number) => {
  state.tran_form.id = val
  state.dialogVisible2 = true
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
// 增加运输工具
const saveCar = async () => {
  addcourier()
  state.dialogVisible1 = false
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
//更新所有
const updateall = () => {
  updatecourier1()
  //关闭对话框
  state.dialogVisible2 = false
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
      <div style="float: left; margin-left: 3%;">
        <el-button class="addbt" @click="open">新增快递员</el-button>
      </div>
      <div style="float: right;margin-right: 3%;">
        <el-input placeholder="请输入名称" v-model="state.search_name" clearable style="width: 500px; margin-right: 15px;"></el-input>
        <el-button class="qubt" @click="searchaddress">查询</el-button>
        <el-button class="qubt" @click="resettable">重置</el-button>
      </div>
    </div>
    <!-- 弹窗 -->
    <div>
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="增加快递员" v-model="state.dialogVisible1" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="快递员名称:" class="whiteitem">
              <el-input v-model="state.tran_form.name"></el-input>
            </el-form-item>
            <el-form-item label="电话:" class="whiteitem">
              <el-input v-model="state.tran_form.phonenumber"></el-input>
            </el-form-item>
            <el-form-item label="idcard:" class="whiteitem">
              <el-input v-model="state.tran_form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="sex:" class="whiteitem">
              <el-input v-model="state.tran_form.sex"></el-input>
            </el-form-item>
            <el-form-item label="密码:" class="whiteitem">
              <el-input v-model="state.tran_form.password"></el-input>
            </el-form-item>
            <el-form-item label="branchid:" class="whiteitem">
              <el-input v-model="state.tran_form.branchid"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible1 = false">取 消</el-button>

            <el-button type="primary" @click="saveCar" >完成</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
     <!-- 弹窗2 -->
     <div>
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="修改快递员" v-model="state.dialogVisible2" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="快递员名称:" class="whiteitem">
              <el-input v-model="state.tran_form.name"></el-input>
            </el-form-item>
            <el-form-item label="电话:" class="whiteitem">
              <el-input v-model="state.tran_form.phonenumber"></el-input>
            </el-form-item>
            <el-form-item label="idcard:" class="whiteitem">
              <el-input v-model="state.tran_form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="sex:" class="whiteitem">
              <el-input v-model="state.tran_form.sex"></el-input>
            </el-form-item>
            <el-form-item label="密码:" class="whiteitem">
              <el-input v-model="state.tran_form.password"></el-input>
            </el-form-item>
            <el-form-item label="branchid:" class="whiteitem">
              <el-input v-model="state.tran_form.branchid"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible2 = false">取 消</el-button>

            <el-button type="primary" @click="updateall" >完成</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 表格 -->
    <div style="margin-top: 10px ; margin-left: 2%; margin-right: 2%;">
      <el-table :data="state.tableData.slice((state.currentPage-1)*state.pageSize,state.currentPage*state.pageSize)" :border="true"
      :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center', background: '#6096e6', color:'#fff'}" 
      :row-style="{ color:'#000' }" style="width: 100% ; font-size:16px ">
        <el-table-column prop="id" label="id" width="60px"></el-table-column>
        <el-table-column prop="name" label="name" width="100px"></el-table-column>
        <el-table-column prop="idcard" label="idcard" width="200px">
          <!-- <template #default="scope">
            <el-tag type="success" v-if="scope.row.address === 1">空闲</el-tag>
            <el-tag type="danger" v-if="scope.row.address === 0">执行任务中</el-tag>
          </template> -->
        </el-table-column>
        <el-table-column prop="branchid" label="branchid" width="100px"></el-table-column>
        <el-table-column prop="phonenumber" label="phonenumber" width="250px"></el-table-column>
        <el-table-column prop="sex" label="sex" width="60px"></el-table-column>
        <el-table-column prop="jobno" label="jobno"></el-table-column>
        <el-table-column prop="password" label="password" width="200px"></el-table-column>
        <!-- <el-table-column prop="courierid" label="courierid"></el-table-column>
        <el-table-column prop="customerid" label="customerid"></el-table-column> -->
        <!-- <el-table-column prop="sendname" label="sendname"></el-table-column>
        <el-table-column prop="sendphone" label="sendphone"></el-table-column>
        <el-table-column prop="receivename" label="receivename"></el-table-column>
        <el-table-column prop="receivephone" label="receivephone"></el-table-column> -->
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button size="default" @click="editbyid(scope.row.id)">
              编辑
            </el-button>
            <el-button size="default" @click="deletecar(scope.row.id)">
              删除
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
  color:#fff; 
  background-color: rgb(255,186,85);
  border: 2px solid #fff;
  border-radius: 10px;
}

.delivery{
  width:150px; 
  height: 60px; 
  font-size:20px; 
  color:#000;
  border-radius: 10px;
  background-color: rgb(152,206,240);
  border: 2px solid rgb(88,182,229);
  margin-right: 50px;
}

</style>

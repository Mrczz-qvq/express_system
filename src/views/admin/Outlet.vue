<script setup lang="ts">
import request from "@/utils/request";
import { reactive } from 'vue'
import useStore  from '@/stores'
import router from "@/router";
import NavVue from "@/components/Nav.vue";
import FooterVue from "@/components/Footer.vue";

const {user} = useStore()
async function load(){
const ds = await request({
    url: '/branch/getbranchinfo_all',
    method: 'get',
  })
  .then(function(res){
      state.tableData = res.data
  });

}
load();
async function addbranch(){
const ds = await request({
    url: '/branch/insert',
    method: 'post',
    data: { 
      address: state.tran_form.address,   
    },
  })
  .then(function(res){
      state.tran_form.branchid = res.data;
      addname();
  });

}
async function addname(){
  const ds = await request({
    url: '/manager/insert',
    method: 'post',
    data: { 
      name: state.tran_form.name,
      phonenumber: state.tran_form.phonenumber,
      type:0,
      password :'aaa',
      idcard:'213123aa',
    },
  })
  .then(function(res){
      state.tran_form.id = res.data.id;;
      update()
  });
}
async function update(){
  const ds = await request({
    url: '/manager/updatebranch',
    method: 'post',
    data: { 
      branchid: state.tran_form.branchid,
      id: state.tran_form.id
    },
  })
  .then(function(res){
      load()
  });
}
async function deletebranch(val: number){
  const ds = await request({
    url: '/branch/delete',
    method: 'post',
    data: { 
      id: val,
    },
  })
  .then(function(res){
     load()
  });
}
async function search(){
  const ds = await request({
    url: '/branch/searchbyaddress',
    method: 'post',
    data: { 
      address: state.search_name,
    },
  })
  .then(function(res){
      state.tableData = []
      state.tableData.push(res.data)
  });
}
async function updatemanager(){
  const ds = await request({
    url: '/manager/updateinfo',
    method: 'post',
    data: { 
      id: state.tran_form.id,
      name: state.tran_form.name,
      phonenumber: state.tran_form.phonenumber
    },
  })
  .then(function(res){
        load()
  });
}
async function updateaddress(){
  const ds = await request({
    url: '/branch/updateaddress',
    method: 'post',
    data: { 
      id: state.tran_form.branchid,
      address: state.tran_form.address,
    },
  })
  .then(function(res){
       searchidbybranchid()
      console.log(res.data)
  });
}
async function searchidbybranchid(){
  const ds = await request({
    url: '/branch/getmanager',
    method: 'post',
    data: { 
      id: state.tran_form.branchid,
    },
  })
  .then(function(res){
      state.tran_form.id = res.data.id;
      console.log(res.data)
      updatemanager()
  });
}

interface tranForm {
  branchid: number
  address: string
  name: string
  phonenumber: string
  id: number
}

const state = reactive({
  //表格数据
  tableData: [] as Array<tranForm>,
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
const searchaddress = async () => {
  let newtable = []
  for (let i = 0; i < state.tableData.length; i++) {
    if (state.tableData[i].address.indexOf(state.search_name) !== -1) {
      newtable.push(state.tableData[i])
    }
  }
  state.tableData = newtable
}

//跳转快递
const gotoexpress = (val: number) => {
  router.push({ path: '/admin/express', query: { id: val } })
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

// 增加打卡窗口
const open = () => {
  state.tran_form = {
      branchid: state.tableData.length,
      name: 'gs',
      address: 'dadnamea',
      phonenumber: '1213210',
      id:0,
  }
  state.dialogVisible1 = true
}

// 增加运输工具
const saveCar = async () => {
  addbranch()
  //关闭对话框
  state.dialogVisible1 = false
}
const resettable = async () => {
  load()
}

// 增加运输工具
const deletecar = async (val: number) => {
  deletebranch(val)
  
}
/*提前查询*/
const findCarBybranchid = async (val: number) => {
  state.tran_form.branchid = val;
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
//更新所有
const updateall = () => {
  updateaddress()
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
        <el-button class="addbt" @click="open">新增网点</el-button>
      </div>

      <div style="float: right;margin-right: 3%;">
        <el-input placeholder="请输入名称" v-model="state.search_name" clearable style="width: 500px; margin-right: 15px;"></el-input>
        <el-button class="qubt" @click="searchaddress">查询</el-button>
        <el-button class="qubt" @click="resettable">重置</el-button>
      </div>

    </div>
    <!-- 弹窗1 -->
    <div>
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="增加网点" v-model="state.dialogVisible1" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="管理员名称:" class="whiteitem">
              <el-input v-model="state.tran_form.name" ></el-input>
            </el-form-item>
            <el-form-item label="电话:" class="whiteitem" >
              <el-input v-model="state.tran_form.phonenumber" ></el-input>
            </el-form-item>
            <el-form-item label="地址:" class="whiteitem">
              <el-input v-model="state.tran_form.address"></el-input>
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
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="修改网点" v-model="state.dialogVisible2" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="管理员名称:" class="whiteitem">
              <el-input v-model="state.tran_form.name" ></el-input>
            </el-form-item>
            <el-form-item label="电话:" class="whiteitem" >
              <el-input v-model="state.tran_form.phonenumber" ></el-input>
            </el-form-item>
            <el-form-item label="地址:" class="whiteitem">
              <el-input v-model="state.tran_form.address"></el-input>
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
        <el-table-column prop="branchid" label="网点id" width="100px"></el-table-column>
        <el-table-column prop="name" label="管理员" width="150px"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phonenumber" label="电话" width="250px"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #default="scope">
            <el-button size="default"  @click="gotoexpress(scope.row.branchid)">
              查看快递
            </el-button>
            <el-button size="default"  @click="findCarBybranchid(scope.row.branchid)">
              编辑
            </el-button>
            <el-button size="default"  @click="deletecar(scope.row.branchid)">
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
  width:80px;
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
  color:#fff; 
  background-color: rgb(255,186,85);
  border: 2px solid #fff;
  border-radius: 10px;
  margin-right: 50px;
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
  color:#000;
  border-radius: 10px;
  background-color: rgb(152,206,240);
  border: 2px solid rgb(88,182,229);
  margin-right: 50px;
}

</style>

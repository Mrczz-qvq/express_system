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
  //????????????
  tableData: [] as Array<tranForm>,
  //??????
  dialogVisible1: false,
  dialogVisible2: false,
  //?????????????????????
  search_name: '',
  //????????????
  currentPage: 1,
  //????????????
  pageSize: 5,
  //????????????
  isShow: false,
  //??????????????????
  labelPosition: 'right',
  //????????????
  tran_form: {} as tranForm,
})

//??????????????????
const searchaddress = async () => {
  let newtable = []
  for (let i = 0; i < state.tableData.length; i++) {
    if (state.tableData[i].address.indexOf(state.search_name) !== -1) {
      newtable.push(state.tableData[i])
    }
  }
  state.tableData = newtable
}

//????????????
const gotoexpress = (val: number) => {
  router.push({ path: '/admin/express', query: { id: val } })
}

//??????????????????
const gotooutlet = () => {
  router.push({path:'/admin/outlet'})
}
//??????????????????
const gotodelivery = () => {
  router.push({path:'/admin/delivery'})
}

//?????????????????????
const gotocourier = () => {
  router.push({path:'/admin/courier'})
}

// ??????????????????
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

// ??????????????????
const saveCar = async () => {
  addbranch()
  //???????????????
  state.dialogVisible1 = false
}
const resettable = async () => {
  load()
}

// ??????????????????
const deletecar = async (val: number) => {
  deletebranch(val)
  
}
/*????????????*/
const findCarBybranchid = async (val: number) => {
  state.tran_form.branchid = val;
  state.dialogVisible2 = true  
}

//??????????????????
const handleSizeChange = (val: number) => {
  state.pageSize = val
  load()
}

//???????????????
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  load()
}
//????????????
const updateall = () => {
  updateaddress()
  //???????????????
  state.dialogVisible2 = false
}

</script>


<template>
  <NavVue selected-id="2" bg-color="#b2c8f3" hover-color="#f19d63"></NavVue>
  <div class="main">
    <!-- ????????? - ?????????????????????????????? -->
    <div style="width:100%; height: 10%; padding-top: 10px; text-align: center;">
      <el-button  @click="gotooutlet()" class="outlet" v-if="user.hasAuth('manager')">
        ????????????
      </el-button>
      <el-button  @click="gotodelivery()"  class="delivery" v-if="user.hasAuth('courier')">
        ????????????
      </el-button>
      <el-button  @click="gotocourier()" class="courier" v-if="user.hasAuth(null)">
        ???????????????
      </el-button>
    </div>
    <div style="margin: 20px 10px 0px 10px; height: 40px;">
      <div style="float: left; margin-left: 3%;">
        <el-button class="addbt" @click="open">????????????</el-button>
      </div>

      <div style="float: right;margin-right: 3%;">
        <el-input placeholder="???????????????" v-model="state.search_name" clearable style="width: 500px; margin-right: 15px;"></el-input>
        <el-button class="qubt" @click="searchaddress">??????</el-button>
        <el-button class="qubt" @click="resettable">??????</el-button>
      </div>

    </div>
    <!-- ??????1 -->
    <div>
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="????????????" v-model="state.dialogVisible1" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="???????????????:" class="whiteitem">
              <el-input v-model="state.tran_form.name" ></el-input>
            </el-form-item>
            <el-form-item label="??????:" class="whiteitem" >
              <el-input v-model="state.tran_form.phonenumber" ></el-input>
            </el-form-item>
            <el-form-item label="??????:" class="whiteitem">
              <el-input v-model="state.tran_form.address"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible1 = false">??? ???</el-button>

            <el-button type="primary" @click="saveCar" >??????</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- ??????2 -->
    <div>
      <el-dialog style="background-color:#9dd0f0; border-radius: 10px;" title="????????????" v-model="state.dialogVisible2" wbranchidth="35%" >
        <div style="wbranchidth: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-wbranchidth="100px" :model="state.tran_form">
            <el-form-item label="???????????????:" class="whiteitem">
              <el-input v-model="state.tran_form.name" ></el-input>
            </el-form-item>
            <el-form-item label="??????:" class="whiteitem" >
              <el-input v-model="state.tran_form.phonenumber" ></el-input>
            </el-form-item>
            <el-form-item label="??????:" class="whiteitem">
              <el-input v-model="state.tran_form.address"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible2 = false">??? ???</el-button>

            <el-button type="primary" @click="updateall" >??????</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- ?????? -->
    <div style="margin-top: 10px ; margin-left: 2%; margin-right: 2%;">
      <el-table :data="state.tableData.slice((state.currentPage-1)*state.pageSize,state.currentPage*state.pageSize)" :border="true"
      :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center', background: '#6096e6', color:'#fff'}" 
      :row-style="{ color:'#000' }" style="width: 100% ; font-size:16px ">
        <el-table-column prop="branchid" label="??????id" width="100px"></el-table-column>
        <el-table-column prop="name" label="?????????" width="150px"></el-table-column>
        <el-table-column prop="address" label="??????"></el-table-column>
        <el-table-column prop="phonenumber" label="??????" width="250px"></el-table-column>
        <el-table-column label="??????" width="300px">
          <template #default="scope">
            <el-button size="default"  @click="gotoexpress(scope.row.branchid)">
              ????????????
            </el-button>
            <el-button size="default"  @click="findCarBybranchid(scope.row.branchid)">
              ??????
            </el-button>
            <el-button size="default"  @click="deletecar(scope.row.branchid)">
              ??????
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- ?????? -->
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

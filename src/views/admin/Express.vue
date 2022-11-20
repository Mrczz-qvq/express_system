<script setup lang="ts">
import request from "@/utils/request";
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import useStore  from '@/stores'
import { useRoute } from "vue-router"
import router from "@/router";
import NavVue from "@/components/Nav.vue";
import FooterVue from "@/components/Footer.vue";

let route = useRoute();
async function load(){
const ds = await request({
    url: '/branch/getexpress',
    method: 'post',
    data: { 
      id:  route.query.id,
    },
  })
  .then(function(res){
      state.tableData = res.data
      console.log(res.data); 
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
interface tranForm {
      branchid: number,
      context:  string,
      courierid: number,
      currentaddress: string,
      customerid: number,
      freight: number,
      id: number,
      receiveaddress: string,
      receivename: string,
      receivephone: string,
      sendaddress: string,
      sendname: string,
      sendphone: string,
      signname: string,
      state: string,
      trackingno: string,
      type: string,
      weight: number,
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
  //总条数
  total: 0,
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
      branchid: 7,
      context:"玻璃杯",
      courierid: 1,
      currentaddress: 'null',
      customerid: 1,
      freight: 15,
      id: 1,
      receiveaddress: "fuzhou",
      receivename: "jie",
      receivephone: "567890",
      sendaddress: "null",
      sendname: "che",
      sendphone: "123456",
      signname: "null",
      state: "已签收",
      trackingno: "2022100900142413914700001",
      type: "贵重物品",
      weight: 10,
  }
  state.dialogVisible = true
}

const resettable = async () => {
  load()
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
</script>


<template>
  <NavVue selected-id="2" bg-color="#b2c8f3" hover-color="#f19d63"></NavVue>
  <div class="main">
    <!-- 头信息 - 新增、搜索、批量操作 -->
    <div style="margin: 20px 10px 0px 10px; height: 40px;">
      <div style="float: left; margin-left: 3%;">
        <el-button class="addbt" @click="backto()">返回</el-button>
      </div>
      <div style="float: right;margin-right: 3%;">
        <el-input placeholder="请输入订单号" v-model="state.search_name" clearable style="width: 500px; margin-right: 15px;"></el-input>
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
        <el-table-column prop="id" label="Id" width="100px"></el-table-column>
        <el-table-column prop="trackingno" label="订单号"></el-table-column>
        <el-table-column prop="ordertime" label="Ordertime" width="180px"></el-table-column>
        <el-table-column prop="pickingtime" label="Pickingtime" width="180px"></el-table-column>
        <el-table-column prop="signingtime" label="Signingtime" width="180px"></el-table-column>
        <el-table-column prop="state" label="State" width="150px"></el-table-column>
        <!-- <el-table-column prop="type" label="type"></el-table-column>
        <el-table-column prop="sendtaddress" label="sendtaddress"></el-table-column>
        <el-table-column prop="receiveaddress" label="receiveaddress"></el-table-column>
        <el-table-column prop="sendname" label="sendname"></el-table-column>
        <el-table-column prop="sendphone" label="sendphone"></el-table-column>
        <el-table-column prop="receivename" label="receivename"></el-table-column>
        <el-table-column prop="receivephone" label="receivephone"></el-table-column> -->
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin-top: 10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="state.currentPage" background
        :page-sizes="[5, 10, 20]" :page-size="state.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="state.tableData.length">
      </el-pagination>
    </div>
    <div style="margin-top: 230px; color:#9dd0f0">-</div>
    <!-- <Footer></Footer> -->
  </div>
</template>

<style scoped>
.main{
  background-color:#9dd0f0; 
  height: auto; 
  padding-top:1px ;
}
.addbt{
  width:60px;
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

.extable{
  color:rgba(0, 0, 0, 0.7);
  width:33%; 
  height:120px;
}

</style>

<script setup lang="ts">
import request from "@/utils/request";
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'

interface tranForm {
  tran_id: number
  tran_state: number
  tran_name: string
  tran_money: number
}

const state = reactive({
  //表格数据
  tableData: [
    {
      tran_id: 1,
      tran_name: 'Tom',
      tran_state: 1,
      tran_money: 'No. 189, Grove St, Los Angeles',
    },
    {
      tran_id: 2,
      tran_name: '尼玛',
      tran_state: 0,
      tran_money: 114,
    },
    {
      tran_id: 3,
      tran_name: 'jack',
      tran_state: 1,
      tran_money: 514,
    },
  ] as Array<tranForm>,
  //弹窗
  dialogVisible: false,
  //快捷查询的名称
  search_tran_name: '',
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
const loadData = async () => {
  const res = await request.get('/api/TranController/findTranList', {
    params: {
      tran_name: state.search_tran_name,
      currentPage: state.currentPage,
      pageSize: state.pageSize
    }
  })

  state.tableData = res.data.list
  state.total = res.data.total
}

//改变每页条数
const handleSizeChange = (val: number) => {
  state.pageSize = val
  loadData()
}

//改变当前页
const handleCurrentChange = (val: number) => {
  state.currentPage = val
  loadData()
}

// 增加打卡窗口
const open = () => {
  state.tran_form = {
    tran_id: state.tableData.length,
    tran_name: '',
    tran_state: 1,
    tran_money: 0,
  }
  state.dialogVisible = true
}

//增加运输工具
const saveCar = async () => {
  const res: any = await request.post('/api/TranController/saveTran', state.tran_form)
  if (res.code === 0) {
    ElMessage.success({
      message: res.message,
      type: 'success'
    })
  } else {
    ElMessage.error({
      message: res.message,
      type: 'error'
    })
  }
  //关闭对话框
  state.dialogVisible = false
  //load数据
  loadData()
}

/*提前查询*/
const findCarById = async (tran_id: number) => {
  state.dialogVisible = true
  const res: any = request.get('/api/TranController/findTranById', {
    params: {
      tran_id: tran_id
    }
  })

  if (res.code === 0) {
    state.dialogVisible = true
    state.tran_form = res.data
    return
  }

  ElMessage.error({
    message: res.message,
    type: 'error'
  })
}

/*修改*/
const updateCar = async () => {
  const res: any = request.put('/api/TranController/updateTran', state.tran_form)

  if (res.code === 0) {
    ElMessage.success({
      message: res.message,
      type: 'success'
    })
  } else {
    ElMessage.error({
      message: res.message,
      type: 'error'
    })
  }
  state.dialogVisible = false
  loadData()
}
</script>


<template>
  <div style="padding: 10px">
    <!-- 头信息 - 新增、搜索、批量操作 -->
    <div>
      <div style="float: left;margin: 10px">
        <el-button type="success" round @click="open">新增运输工具</el-button>
      </div>

      <div style="margin-top: 10px; float: right;margin-right: 50px">
        <el-input placeholder="请输入名称" v-model="state.search_tran_name" clearable style="width: 200px"></el-input>
        <el-button type="primary" round style="margin-left: 5px" @click="loadData">查询</el-button>
      </div>

    </div>
    <!-- 表格 -->
    <div style="margin-top: 10px">
      <el-table ref="multipleTable" :data="state.tableData" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="tran_id" label="id" v-if="state.isShow"></el-table-column>
        <el-table-column prop="tran_name" label="运输工具名称"></el-table-column>
        <el-table-column prop="tran_state" label="运输工具状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.tran_state === 1">空闲</el-tag>
            <el-tag type="danger" v-if="scope.row.tran_state === 0">执行任务中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tran_money" label="运输起步费用"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" icon="el-icon-edit" @click="findCarById(scope.row.tran_id)">
              编辑
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin-top: 10px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="state.currentPage"
        :page-sizes="[5, 10, 15]" :page-size="state.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="state.total">
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <div>
      <el-dialog title="编辑运输工具" v-model="state.dialogVisible" width="35%">
        <div style="width: 350px;margin-left: 40px">
          <el-form :label-position="state.labelPosition" label-width="100px" :model="state.tran_form">
            <el-form-item label="运输工具名称:">
              <el-input v-model="state.tran_form.tran_name"></el-input>
            </el-form-item>
            <el-form-item label="运输起步费用:">
              <el-input v-model="state.tran_form.tran_money"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible = false">取 消</el-button>

            <el-button type="primary" @click="saveCar" v-if="state.tran_form.tran_id === null">增加运输工具</el-button>
            <el-button type="primary" @click="updateCar" v-if="state.tran_form.tran_id !== null">>修改运输工具</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>

</style>

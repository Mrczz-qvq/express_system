<script setup lang="ts">
import { onBeforeMount, onMounted, onBeforeUnmount, reactive, computed } from 'vue'
import request from '@/utils/request'
import { rootRequest } from '@/utils/request'

// const mapScript = document.createElement('script')
// mapScript.type = "text/javascript"
// mapScript.src = 'https://map.qq.com/api/js?v=2.exp&key=HKGBZ-J6RCU-GYXVJ-BSAP3-A5P2H-IQB5W'
// 这jb脚本烂，用useScriptTag也无法动态加入

interface Location {
  lat: number,
  lng: number,
}

const state = reactive({
  inputAddress: '',
  allOutlets: [] as Array<any>,
  targetOutlets: [] as Array<any>,
  targetIdx: 0,
  clickPos: '',
})
const tmap = {
  cls: {} as any,
  obj: {} as any,
  markers: {} as any,
  infoWindow: {} as any,
}

const targetOutlet = computed(() => {
  if (!state.targetOutlets.length) {
    return null
  }
  return state.targetOutlets.at(state.targetIdx)
})

onBeforeMount(async () => {
  const res = await request({
    url: '/branch/getbranchinfo_all',
    method: 'get',
  })
  state.allOutlets.push(...res.data)
  // 后端不想做，只能模拟一下
  state.allOutlets.push(...[
    { branchid: 78, address: "福州大学一号网点", name: "gs1", phonenumber: "1213210", loc: [26.058268, 119.200908] }, 
    { branchid: 79, address: "福州大学阳光科技大厦", name: "gs2", phonenumber: "1213210", loc: [26.052133, 119.202263] }, 
    { branchid: 80, address: "福州大学图书馆", name: "gs3", phonenumber: "1213210", loc: [26.058960, 119.19748] }, 
    { branchid: 90, address: "aqua", name: "gs4", phonenumber: "1213210", loc: [26.1, 119.4] }, 
    { branchid: 93, address: "meaqua", name: "gs6", phonenumber: "1213210", loc: [26.2, 119.3] }, 
  ])
})

onMounted(async () => {
  // document.head.prepend(mapScript)
  // nextTick(initMap)
  const loc = await locateByIP()
  initMap(loc)
})
onBeforeUnmount(() => {
  // document.head.removeChild(mapScript)
})

const locateByIP = async (): Promise<Location> => {
  // 26.062228, 119.201398
  // https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
  const res = await rootRequest({
    url: '/outer-apis/tmap/location/v1/ip',
    method: 'get',
    params: { key: 'HKGBZ-J6RCU-GYXVJ-BSAP3-A5P2H-IQB5W' },
  })
  return res.data.result.location
}

const initMap = (center: Location) => {
  tmap.cls = (window as any).TMap
  const myLatlng = new tmap.cls.LatLng(center.lat, center.lng)
  const myOptions = {
    zoom: 16,
    center: myLatlng,
  }
  tmap.obj = new tmap.cls.Map(document.getElementById('tencentMap'), myOptions)
  tmap.obj.on("click", function (e: any) {
    var lat = e.latLng.getLat().toFixed(6)
    var lng = e.latLng.getLng().toFixed(6)
    state.clickPos = lat + "," + lng
  })


  tmap.markers = new tmap.cls.MultiMarker({
    map: tmap.obj,  //指定地图容器
    //样式定义
    styles: {
      //创建一个styleId为"marker"的样式（styles的子属性名即为styleId）
      marker: new tmap.cls.MarkerStyle({
        width: 20,  // 点标记样式宽度（像素）
        height: 30, // 点标记样式高度（像素）
        // src: '../img/marker.png',  //图片路径
        //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
        anchor: { x: 10, y: 30 }
      })
    },
    //点标记数据数组
    geometries: []
  })

  tmap.infoWindow = new tmap.cls.InfoWindow({
    map: tmap.obj,
    position: new tmap.cls.LatLng(39.984104,116.307503),
    offset: { x: 0, y: -32 } //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
  })
  tmap.infoWindow.close()
}

const updateMarkers = () => {
  tmap.markers.setGeometries([])
  tmap.markers.add(state.targetOutlets.map((v, idx) => {
    return {
      id: idx,
      styleId: 'marker',
      position: new tmap.cls.LatLng(...v.loc),
      properties: {
        address: v.address,
      }
    }
  }))
  tmap.markers.on("click", (e: any) => {
    tmap.infoWindow.open()  //打开信息窗
    tmap.infoWindow.setPosition(e.geometry.position)  // 设置信息窗位置
    tmap.infoWindow.setContent(e.geometry.properties.address)  // 设置信息窗内容
  })
}

const queryOutlet = () => {
  if (!state.inputAddress) {
    return
  }
  state.targetOutlets = state.allOutlets.filter(
    // item => item.address.includes(state.inputAddress)
    item => item.loc && item.address.includes(state.inputAddress)
  )
  updateMarkers()
  seekOutlet(0)
}

const seekOutlet = (step: number) => {
  if (!state.targetOutlets.length) {
    return
  }
  state.targetIdx = (state.targetIdx + step) % state.targetOutlets.length
  tmap.obj.setCenter(new tmap.cls.LatLng(...targetOutlet.value.loc))
}
</script>

<template>
  <main class='outlet-box'>

    <aside class="query-box">
      <div class="input-box">
        <label>当前地址: </label>
        <el-input v-model="state.inputAddress" placeholder="" @keyup.enter="queryOutlet"/>
        <el-button color="#ffba55" class="submitBtn" @click="queryOutlet">查询网点</el-button>
      </div>
      <div class="outlet-info" v-if="targetOutlet">
        <el-icon @click="seekOutlet(-1)"><ArrowLeft /></el-icon>
        <div>
          <p>网点编号：{{ targetOutlet.branchid }}</p>
          <p>网点地址：{{ targetOutlet.address }}</p>
          <p>网点管理员：{{ targetOutlet.name }}</p>
          <p>网点联系方式：{{ targetOutlet.phonenumber }}</p>
        </div>
        <el-icon @click="seekOutlet(1)"><ArrowRight /></el-icon>
      </div>
    </aside>

    <aside class="map-box">
      <section id="tencentMap"></section>
      <span class="info">当前点击坐标为： {{ state.clickPos }}</span>
    </aside>
  </main>
</template>

<style scoped lang="less">
.outlet-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #6096e6;
  padding: 20px 30px;
  border-radius: 40px;
  margin-bottom: 100px;
}

.query-box {
  width: 45%;
  .input-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .el-input {
      width: 65%;
    }
    .submitBtn {
      color: #fff;
      border: 1px solid #bc883c;
    }
  }

  .outlet-info {
    .el-icon {
      font-size: 30px;
      cursor: pointer;
      &:hover {
        color: #ffba55;
      }
    }
    display:flex;
    flex-direction:row;
    align-items: center;
    font-size: 20px;
    justify-content: space-around;
  }
}

.map-box {
  position: relative;
  width: 50%;
  .info {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 12px;
    background: #fff;
    width: 15rem;
    padding: 0.4rem;
    border-radius: 3px;
  }
}
</style>

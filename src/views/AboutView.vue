<script setup lang="ts">
import NavVue from "@/components/Nav.vue"

</script>

<template>
  <main>
    <NavVue bg-color="#b2c8f3" hover-color="#f19d63" selected-id="3"></NavVue>
    <div class="aboutus">
      <div class="title">
        <el-divider content-position="center">团队简介</el-divider>
        <p>
          <el-tag>小新快递</el-tag>
        </p>
      </div>
      <el-card class="box-card" style="margin-bottom: 10px;">
        <div class="text item">
          <el-row :gutter="50">
            <div>
              <img class="user-card-image" src="/picture/cxp.jpg">
            </div>
            <el-col :span="15">
              <p>Cxp</p>
              <div class="grid-content bg-purple">
                <span class="large">电子黑奴</span>，会不会梦见赛博农场主？
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class='topMask square'></div>
        <div class='topMask circular'></div>
      </el-card>
      <el-card class="box-card" style="margin-bottom: 10px;">
        <div class="text item">
          <el-row :gutter="40">
            <div>
              <img class="user-card-image" src="/picture/Czz.jpg">
            </div>
            <el-col :span="10">
              <p>Czz</p>
              <div class="grid-content bg-purple">
                <span class="large">装帅好累还好鸽是真帅 </span>
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="40">
            <div>
              <img class="user-card-image" src="/picture/wyj.jpg">
            </div>
            <el-col :span="13">
              <p>Wyj</p>
              <div class="grid-content bg-purple">
                <span class="large">英雄可以受委屈，</span>但别踩我的切尔西。
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="40">
            <div>
              <img class="user-card-image" src="/picture/lj.jpg">
            </div>
            <el-col :span="10">
              <p>Lj</p>
              <div class="grid-content bg-purple">
                <span class="large">愤怒的星星狐。</span>
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class='topMask square'></div>
        <div class='topMask circular'></div>
      </el-card>
      <el-card class="box-card" style="margin-bottom: 10px;">
        <div class="text item">
          <el-row :gutter="40">
            <div>
              <img class="user-card-image" src="/picture/czl.jpg">
            </div>
            <el-col :span="10">
              <p>Czl</p>
              <div class="grid-content bg-purple">
                <span class="large">开心的星星狐。</span>
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class="text item">
          <el-row stlye="margin-left: 15px; margin-right: -10px;">
            <div>
              <img class="user-card-image" src="/picture/yl.jpg">
            </div>
            <el-col :span="15">
              <p>YL</p>
              <div class="grid-content bg-purple">
                <span class="large">有因必有果</span>，找工作就得来卓跃。
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class="text item">
          <el-row stlye="margin-left: 15px; margin-right: 0px;">
            <div>
              <img class="user-card-image" src="/picture/yzt.jpg">
            </div>
            <el-col :span="13">
              <p>Yzt</p>
              <div class="grid-content bg-purple">
                <span class="large">没啥优点</span>，除了钱多的一批。
              </div>
            </el-col>
  
          </el-row>
        </div>
        <div class='topMask square'></div>
        <div class='topMask circular'></div>
      </el-card>
    </div>
  </main>
</template>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.user-card-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  vertical-align: top;
  margin: 20px;
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.aboutus .grid-content.line {
  border-right: 10px solid #ddd;
  height: 150px;
}

.aboutus .el-card__header {
  background: #545c64;
}

.aboutus .el-card__body {
  padding: 50px 20px;
}

.aboutus .el-timeline-item__wrapper {
  top: -8px;
}

.aboutus .title p .el-tag {
  margin: 0px 20px;
  font-size: 30px;
  cursor: pointer;
}
</style>
<style scoped>
.aboutus {
  font-size: 14px;
  text-align: left;
  padding: 0px 100px;
  padding-bottom: 100px;
}

.intro {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.text {
  font-size: 15px;
  text-align: left;
  line-height: 30px;
  text-indent: 2em;
}

.box-card {
  position: relative;
  text-align: center;
}

.item {
  display: inline-block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.clearfix span {
  color: #fff;
  font-weight: bold;
}

.title p {
  color: #8c8888;
  font-size: 15px;
  text-align: center;
}

.grid-content .large {
  font-size: 16px;
  color: #409EFF;
  font-weight: bold;
}

.topMask {
  width: 100px;
  height: 100px;
  background-color: rgba(68, 138, 255, 0.2);
  transform: rotate(45deg);
  position: absolute;
}

.square {
  border-radius: 5px;
  top: 0px;
}

.circular {
  border-radius: 50%;
  top: 80px;
  left: 80%;
  background-color: rgba(255, 208, 75, 0.2);
}
</style>

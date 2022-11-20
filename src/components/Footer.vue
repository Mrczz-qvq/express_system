<script setup lang="ts">
</script>

<template>
  <footer>
    <section class="footer">
      <ul class="footer-entry">
        <li><a href="#">了解我们</a></li>
        <li><a href="#">新闻政策</a></li>
        <li><a href="#">隐私政策</a></li>
      </ul>

      <ul class="footer-entry">
        <li><a href="#">关注我们</a></li>
        <li><a href="#">微信公众号</a></li>
        <li><a href="#">微博</a></li>
        <li><a href="#">社区</a></li>
      </ul>

      <ul class="footer-entry">
        <li><a href="#">帮助</a></li>
        <li><a href="#">联系我们</a></li>
      </ul>
    </section>
  </footer>
</template>

<style scoped lang="less">
@hoverColor: #f19d63;

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #6096e6;
  border-top: 1px solid #446da9;
}

.footer {
  .footer-entry {
    li:first-child {
      font-size: 20px;
    }
    list-style-type: none;
  }
  a {
    color: #000;
    &:hover {
      color: @hoverColor;
    }
    text-decoration:none;
  }

  display: flex;
  flex-direction: row;
  margin: 0 10%;
  height: 140px;
  justify-content: space-evenly;
}
</style>

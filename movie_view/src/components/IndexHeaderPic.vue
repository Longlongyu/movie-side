<template lang="pug">
  section.headerPic
    div
      p.imgTitle recommendTitle
      a(href="baidu.com")
        img.headerImg(src="http://imgsrc.baidu.com/image/c0%3Dpixel_huitu%2C0%2C0%2C294%2C40/sign=d1377315b5096b6395145610654be228/b3119313b07eca80be498ddd9a2397dda14483b8.jpg")
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
section.headerPic
  header: 300px
  width: 100%
.headerImg
  heigth: 300px
  width: 100%
.imgTitle
  z-index: 2
  padding-left: 45%
  padding-top: 230px
  position: absolute
  color: #fff
  font-size: 20px
</style>

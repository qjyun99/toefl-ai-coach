<template>
  <view class="app">
    <tab-bar v-if="showTabBar" />
    <view class="content">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showTabBar: true
    }
  },
  onLaunch() {
    console.log('🦞 托福AI教练小程序启动')
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  padding-bottom: 100rpx;
}
</style>

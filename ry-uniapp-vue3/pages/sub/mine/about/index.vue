<template>
  <view class="about-container">
    <view class="header-section">
      <uni-title type="h2" title="若依移动端"></uni-title>
    </view>
    <view class="copyright">
      <view>Copyright &copy; 2022 ruoyi.vip All Rights Reserved.</view>
    </view>
  </view>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
	.about-container{
		margin: 8px;
		background: $uni-bg-color;
		.content-section{
			text-align: center;
		}
		.header-section {
		  display: flex;
		  padding: 30rpx 0 0;
		  flex-direction: column;
		  align-items: center;
		}
		.copyright {
		  margin-top: 50rpx;
		  text-align: center;
		  line-height: 60rpx;
		  color: $uni-text-color-grey;
		}
	}

</style>

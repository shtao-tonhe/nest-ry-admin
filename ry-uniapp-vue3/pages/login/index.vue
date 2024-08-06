<template>
	<view class="login">
		<view class="mt-24px mb-24px text-center font-size-32px">登录页面</view>	
		<button
		  style="
		    text-align: center;
		    line-height: 85rpx;
		    color: #fff;
		    font-size: 30rpx;
		    margin: auto;
		    width: 493rpx;
		    height: 85rpx;
		    background: #ff5a00;
		    border-radius: 58rpx 58rpx 58rpx 58rpx;
		  "
		  @tap="loginAgree"
		>
		  一键登录
		</button>
	</view>
</template>

<script lang="ts" setup>
	import { login,getInfo } from '@/api/login'
	import { setRefreshToken, setToken } from '@/utils/auth'
	import useUserStore from '@/store/user'
	const userStore = useUserStore()
	
	function loginAgree() {
	  uni.showLoading({
	    title: '登录中...',
	  })
	  uni.login({
	    success: loginRes => {
	      login({
	        loginCode: loginRes.code,
	      }).then(result => {
					setToken(result.token)
					setRefreshToken(result.refreshToken)
					getInfo().then(data => {
						userStore.setInfo(data)
						uni.switchTab({
							url: '/pages/home/index'
						})
					})
	      })
	    },
	  })
		setTimeout(()=>{
			uni.hideLoading()
		},1000)
	}
</script>

<style lang="scss">
	.login{
		
	}
</style>
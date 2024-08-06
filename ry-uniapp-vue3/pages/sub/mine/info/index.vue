<template>
  <view class="info-container">
		<view class="bg-white m-16px flex-center p-16px flex-wrap">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			  <image class="avatar" :src="currentAvatarUrl"></image>
			</button> 
			<view class="w-full flex mt-24px">
				<view class="color-9 font-size-16px text-right">昵称：</view>
				<view>
					<input
						type="nickname"
						v-model="nickName"
					/>
				</view>
			</view>
		</view>
  </view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';

	const currentAvatarUrl = ref('https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0')
	const nickName = ref('默认')
		
	function onChooseAvatar(e) {
		const { avatarUrl } = e.detail
		currentAvatarUrl.value = avatarUrl
	}
</script>

<style lang="scss" scoped>
  .info-container{
		.avatar-wrapper{
			width: 80px;
			height: 80px;
			padding: 0;
			margin: 0;
			border: none;
			outline: none;
			.avatar{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>

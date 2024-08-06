<template>
	<view class="home-container">
		<!-- 轮播图 -->
		<uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current">
			<swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper">
				<swiper-item v-for="(item, index) in data" :key="index">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image :src="item.image" mode="widthFix" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<!-- 九宫格 -->
		<view class="grid-body m-16px">
			<uni-grid :column="3" :highlight="true" @change="changeGrid">
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="contact" size="30"></uni-icons>
						<text class="text">用户管理</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="help" size="30"></uni-icons>
						<text class="text">常见问题</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<uni-icons type="info" size="30"></uni-icons>
						<text class="text">关于我们</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from "@dcloudio/uni-app"
	import { bannerList,gridList,recommendList } from '@/api/home';

	const current = ref(0)
	const swiperDotIndex = ref(0)
	const data = [
		{
			image: '/static/images/banner/banner01.jpg'
		},
	]
	function clickBannerItem(item) {
		console.log(item)
	}
  function changeSwiper(e) {
		current.value = e.detail.current
	}
	function changeGrid(e) {
		console.log('模块建设中~')
	}
	
	onShow(() => {
		bannerList()
		gridList()
		recommendList()
	})
</script>

<style lang="scss" scoped>
	.home-container{
		min-height: 100vh;
		height: 100%;
		.uni-swiper-dot-box {
			width: 100%;
			.swiper-box{
				background: $uni-bg-color;
			}
			.swiper-item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: $uni-bg-color;
			}
		}
		.grid-body{
			background: $uni-bg-color;
			.grid-item-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 0 0 15px 0;
			}
		}
	}
</style>

<template>
  <view class="help-container">
		<uni-collapse accordion>
			<uni-collapse-item v-for="(item, findex) in list" :key="'i' + findex" :title="item.title">
				<view class="colapse-text">
					<text>{{item.content}}</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const list = ref([
	{
		title: '如何修改用户头像？',
		content: '请点击[我的] - [选择头像] - [点击提交]即可更换用户头像'
	},
	{
		title: '如何修改登录密码？',
		content: '请点击[我的] - [应用设置] - [修改密码]即可修改登录密码',
	}
])
function handleText(item) {
	
}
</script>

<style lang="scss" scoped>
	.help-container{
		margin: 8px;
		.colapse-text{
			padding: 0px 24px 12px;
		}
	}
</style>

<template>
	<view @click="upload" class="upload-file">
		<slot>图片上传</slot>
	</view>
</template>

<script lang="ts" setup>
	import uploadFile from '@/utils/upload'
	function upload(){
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				uploadFile({
					url: '/file/upload',
					filePath: res.tempFilePaths[0]
				}).then(data=>{
					console.log('上传成功',data)
				})
			}
		});

	}
</script>

<style lang="scss">
.upload-file{
	display: inline-block;
	height: 100%;
}
</style>
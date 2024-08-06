<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="flex justify-between">
        <view class="flex items-center">
          <image :src="avatar" class="cu-avatar" mode="widthFix">
          </image>
          <view class="user-info">
            <view class="u_title">
              用户名：{{ nickName }}
            </view>
          </view>
        </view>
      </view>
    </view>
		<!-- 选项栏 -->
    <view class="content-section p-16px">
			<uni-section class="mb-10" title='编辑资料' @click="handleToEditInfo">
				<template v-slot:decoration>
					<uni-icons type="gear" size="14"></uni-icons>
				</template>
				<template v-slot:right>
					<uni-icons type="right" size="14"></uni-icons>
				</template>
			</uni-section>
			<uni-section class="mb-10" title='常见问题' @click="handleHelp">
				<template v-slot:decoration>
					<uni-icons type="help" size="14"></uni-icons>
				</template>
				<template v-slot:right>
					<uni-icons type="right" size="14"></uni-icons>
				</template>
			</uni-section>
			<uni-section class="mb-10" title='关于我们' @click="handleAbout">
				<template v-slot:decoration>
					<uni-icons type="info" size="14"></uni-icons>
				</template>
				<template v-slot:right>
					<uni-icons type="right" size="14"></uni-icons>
				</template>
			</uni-section>
    </view>
  </view>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import useUserStore from '@/store/user';
	import { onShow } from "@dcloudio/uni-app"
	import { getInfo } from '@/api/login';
	
	const userStore = useUserStore()
	const nickName = computed(()=>{
		return userStore.nickName
	})
	const avatar = computed(()=>{
		return userStore.avatar
	})
	const windowHeight = computed(()=>{
		return uni.getSystemInfoSync().windowHeight - 50
	})

	// 编辑信息
	function handleToEditInfo() {
		uni.navigateTo({url:'/pages/sub/mine/info/index'})
	}

	function handleHelp() {
		uni.navigateTo({url:'/pages/sub/mine/help/index'})
	}

	function handleAbout() {
		uni.navigateTo({url:'/pages/sub/mine/about/index'})
	}
	
	onShow(() => {
		getInfo().then(data => {
			userStore.setInfo(data)
		})
	})
	
</script>

<style lang="scss" scoped>
  .mine-container {
    width: 100%;
    height: 100%;
    .header-section {
      padding: 30px;
      background-color: $uni-bg-color-blue;
      color: white;

      .login-tip {
        font-size: 18px;
        margin-left: 10px;
      }

      .cu-avatar {
        border: 1px solid $uni-border-color;
				width: 60px;
				height: 60px;
				border-radius: 50%;
      }

      .user-info {
        margin-left: 15px;

        .u_title {
          font-size: 18px;
          line-height: 30px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					width: 50%;
        }
      }
    }

    .content-section {
      position: relative;
      top: 0px;
		}
  }
</style>

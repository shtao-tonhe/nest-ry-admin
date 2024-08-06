import { defineStore } from 'pinia'
// @ts-ignore
const useUserStore = defineStore('user', {
	state: () => ({
		nickName: '',
		avatar: '',
		wxOpenId: '',
	}),
	actions: {
		setInfo(value) {
		  this.avatar = value.avatar || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
			this.nickName = value.nickName || value.wxOpenId
			this.wxOpenId = value.wxOpenId
		},
		clearInfo(){
			this.avatar = ''
			this.nickName = ''
			this.wxOpenId = ''
		}
	},
	getters: {},
	persist: {
	  enabled: true,
	}
})
export default useUserStore
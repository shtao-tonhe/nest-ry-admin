<template>
  <!-- 倒计时组件 -->
  <div>
    <span v-if="currentSeconds > 1">
      {{ statics.day + '天' + statics.hour + '时' + statics.minute + '分' + statics.second + '秒' }}
    </span>
    <span v-else>已执行</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  // 倒计时时间,单位秒数 s
  seconds: {
    type: Number,
    default: 0
  }
})
const currentSeconds = ref(0)
const statics = ref({
  day: '',
  hour: '',
  minute: '',
  second: ''
})
onBeforeMount(() => {
  currentSeconds.value = props.seconds
  calculateTime(currentSeconds.value)
})
function calculateTime(seconds: number) {
  let day = Math.floor(seconds / 86400)
  statics.value.day = String(day)
  let hour = Math.floor((seconds % 86400) / 3600)
  statics.value.hour = String(hour)
  let myminute = Math.floor(((seconds % 86400) % 3600) / 60)
  statics.value.minute = String(myminute)
  let mysecond = Math.floor(((seconds % 86400) % 3600) % 60)
  statics.value.second = String(mysecond)
  setTimeout(() => {
    if (seconds > 1) {
      currentSeconds.value--
      calculateTime(currentSeconds.value)
    } else {
      statics.value.day = '0'
      statics.value.hour = '0'
      statics.value.minute = '0'
      statics.value.second = '0'
    }
  }, 1000)
}
</script>

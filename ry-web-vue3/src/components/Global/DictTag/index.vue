<template>
  <!-- 字典回显标签组件,使用方式参考：views/system/menu -->
  <div>
    <span>{{ unmatch }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  // 数据
  options: {
    type: Array<{ value: string; label: string }>,
    required: true,
    default: []
  },
  // 当前的值
  value: {
    type: String || Number,
    required: true,
    default: null
  }
})

const unmatch = computed(() => {
  const fItem = props.options.find((item) => {
    return item.value == props.value
  })
  if (!fItem) {
    return '-'
  } else {
    return fItem.label
  }
})
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>

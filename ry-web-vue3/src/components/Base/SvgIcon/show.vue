<template>
  <!-- 
    本地图标展示页面，登录后访问：http://localhost:8081/show-icon 即可查看所有的图标
    从左至右对应icons中从上至下的顺序
   -->
  <div>
    <div class="text-center mb-20px mt-20px">本地svg图标展示页面</div>
    <icon-select ref="iconSelectRef" />
  </div>
</template>

<script setup lang="ts">
import IconSelect from '@/components/System/IconSelect/index.vue'
</script>

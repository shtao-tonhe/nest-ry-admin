<template>
  <!-- 通用svg图标组件 assets/icons中设置 -->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script lang="ts">
/**
 * 图标基础组件，本地assets/icons中的图标导入
 * @example
 * 使用user.svg
 * <svg-icon icon-class="user" />
 */
export default defineComponent({
  props: {
    iconClass: {
      // 图标名称
      type: String,
      required: true
    },
    className: {
      // 自定义类名
      type: String,
      default: ''
    },
    color: {
      // 自定义颜色
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.iconClass}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`
        }
        return 'svg-icon'
      })
    }
  }
})
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  position: relative;
  display: inline-block;
  margin-right: 12px;
  font-size: 15px;
}

.svg-icon {
  position: relative;
  width: 1em;
  height: 1em;
  vertical-align: -2px;
  fill: currentcolor;
}
</style>

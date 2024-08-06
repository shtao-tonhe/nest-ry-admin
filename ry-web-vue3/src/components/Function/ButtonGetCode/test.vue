<template>
  <div class="test">
    <buttonGetCode :account="account" type="1"></buttonGetCode>
  </div>
</template>

<script>
import buttonGetCode from './ButtonGetCode'
export default {
  components: {
    buttonGetCode
  },
  data() {
    return {
      account: '13272101251'
    }
  }
}
</script>

<style scoped lang="scss">
.show {
  width: 100%;
  min-height: 500px;
}
</style>

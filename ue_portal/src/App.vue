<template>
  <tms-frame class="tms-finder" :display="{footer:true,left:true}" :leftWidth="'240px'">
    <template v-slot:left>
      <sidebar class="sidebar-container" />
    </template>
    <template v-slot:center>
      <router-view :key="key"></router-view>
    </template>
  </tms-frame>
</template>
<script>
import Sidebar from './components/Sidebar'

export default {
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  },
  components: {
    Sidebar
  }
}
</script>
<style lang="scss">
.tms-finder {
  .tms-frame__main {
    .tms-frame__main__center {
      width: calc(100% - 240px);
      overflow: hidden;
    }
  }
}
</style>

<template>
  <tms-frame class="tms-finder" :display="{footer:true,left:true}" :leftWidth="'240px'">
    <template v-slot:left>
      <sidebar class="sidebar-container" />
    </template>
    <template v-slot:center>
      <router-view></router-view>
    </template>
  </tms-frame>
</template>
<script>
import Sidebar from './components/Sidebar'

export default {
  components: {
    Sidebar
  }
}
</script>

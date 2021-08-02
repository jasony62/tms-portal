<template>
  <div>
    <div class="sidebar-wrapper">
      <el-menu class="sidebar-el-menu" :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
        <li style="flex:1;"></li>
        <el-menu-item class="logout" index="logout" :text-color="variables.menuText" @click="logout()">退出登录</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return false
    }
  },
  async created() {
    let dynaRoutes = await this.$store.dispatch('router/generateRoutes')
    this.$router.addRoutes(dynaRoutes)
    if (this.$route.path === '/') {
      this.$router.push({ name: dynaRoutes[0].name })
    }
  },
  methods: {
    logout() {
      this.$removeToken()
      window.location.reload()
    }
  }
}
</script>
<style lang="scss">
.sidebar-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 240px;
    display: flex;
    flex-direction: column;
  }
  > ul {
    height: 100%;
    .logout {
      flex: 0 0 56px;
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 100%;
      align-items: center;
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>

<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          Butterfly-Vue
        </div>
        <div class="sidebar">
          <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
          >
            <el-menu-item index="emergency">emergency</el-menu-item>
            <el-menu-item index="drag">drag</el-menu-item>
            <el-menu-item index="grid">grid(layout)</el-menu-item>
            <el-menu-item index="radial">radial(layout)</el-menu-item>
            <el-menu-item index="base">基础用法</el-menu-item>
            <el-menu-item index="userEndpoint">自定义锚点用法</el-menu-item>
            <el-menu-item index="tree">tree</el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header>示例</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  }
}
</script>

<style scoped>
  #app {
    width: 100%;
  }

  .el-header {
    line-height: 60px;
  }

  .el-aside {
    background-color: rgb(50, 65, 87);
  }

  .el-main {
    padding: 0;
  }

  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
    color: white;
    text-align: center;
    line-height: 32px;
  }
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 64px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .sidebar > ul {
    height: 100%;
  }
  .el-menu {
    border-right: solid 0px#e6e6e6;
  }
</style>

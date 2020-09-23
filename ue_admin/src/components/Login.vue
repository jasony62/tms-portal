<template>
  <div class="login-frame">
    <div class="login">
      <tms-login :on-success="fnSuccessToken" class="tms-login"></tms-login>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    fnSuccessToken(newToken) {
      window.sessionStorage.setItem('access_token', newToken)
      if (this.$tmsRouterHistory.canBack()) {
        this.$router.back()
      } else {
        this.$router.push({name: 'home'})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding-top: 200px;

  .login {
    display: flex;
    justify-content: center;
    /* transform: translate(-50%, -50%); */

    .tms-login {
      border: 1px solid #ddd;
    }
  }
}
</style>
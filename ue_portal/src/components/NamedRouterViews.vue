<template>
  <div class='named-router-views'>
    <router-view v-for="view in views" :key="view.name" :name="view.name"></router-view>
  </div>
</template>
<script>
export default {
  name: 'NamedRouterViews',
  props: {
    views: { type: Array }
  }
}
</script>
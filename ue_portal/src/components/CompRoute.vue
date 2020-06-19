<template>
  <div class="online-lib">
    <div class="debug">
      <div>lib: {{ lib }}</div>
      <div>libProps: {{ libProps }}</div>
      <div>views: {{ views }}</div>
      <div>onlineProps: {{ onlineProps }}</div>
      <hr />
      <div>$route.path: {{ $route.path }}</div>
      <div>$route.name: {{ $route.name }}</div>
      <div>$route.meta: {{ $route.meta }}</div>
    </div>
    <hr />
    <comp-online ref="onlineComp" :url="lib.url" :includeCss="lib.includeCss" :props="onlineProps" :events="onlineEvents"></comp-online>
    <hr />
    <div v-if="views.length">
      <named-router-views :views="views"></named-router-views>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('router')

export default {
  name: 'CompRoute',
  props: {
    lib: Object,
    libProps: Object,
    views: { type: Array, default: () => [] }
  },
  data() {
    return {
      route: {},
      comp: null
    }
  },
  computed: {
    onlineProps: function() {
      return this.libProps
    },
    onlineEvents: function() {
      return this.lib && typeof this.lib.events === 'object'
        ? Object.keys(this.lib.events)
        : []
    }
  },
  methods: {
    ...mapMutations(['SET_RESPONSE']),
    async setOnlineCompEvents(events) {
      const { onlineComp } = this.$refs

      if (
        !onlineComp ||
        typeof events !== 'object' ||
        Object.keys(events).length === 0
      )
        return

      Object.entries(events).forEach(([evtName, { route, mapResponse }]) => {
        onlineComp.$off(evtName)
        if (route) {
          onlineComp.$on(evtName, rsp => {
            let rsp2 = mapResponse
            if (Array.isArray(mapResponse)) {
              const mappings = mapResponse.reduce(
                (m, { shareKey, responseKey }) =>
                  shareKey ? Object.assign(m, { [shareKey]: responseKey }) : m,
                {}
              )
              // 根据映射关系创建共享数据对象
              rsp2 = this.$transfer({}, rsp, mappings)
            }
            this.SET_RESPONSE(rsp2)
            this.$router.push({ name: route })
          })
        }
      })
    }
  },
  mounted() {
    this.$watch('lib.events', {
      handler: 'setOnlineCompEvents',
      immediate: true
    })
  }
}
</script>

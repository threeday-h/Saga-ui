<template>
  <slot />
</template>

<script>
export default {
  name: "SagaConfigProvider",
  props: {
    fileDomain: {
      type: String,
    },
    offlineTaskStatusQuery: {
      type: Function,
    },
  },
  provide() {
    return {
      configProvider: this,
    }
  },
}
</script>

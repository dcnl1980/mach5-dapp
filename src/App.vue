<template>
 <TokenSale />
</template>

<script>
import TokenSale from './components/TokenSale.vue'


export default {
  name: 'App',

  components: {
    TokenSale
  },

  data() {
    return {
    }
  },

  methods: {

  }
}
</script>

<style>
 .btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover {
    @apply bg-blue-700;
  }
  .btn-red {
    @apply bg-red-500 text-white;
  }
  .btn-green {
    @apply bg-green-500 text-white;
  }
</style>
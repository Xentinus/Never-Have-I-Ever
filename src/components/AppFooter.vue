<template>
  <div class="absolute bottom-4 left-4 text-sm">
    <div>v{{ BUILD_VERSION }}</div>
    <div class="text-gray-400">
      © {{ currentYear }} <a href="https://kellner.dev/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-300 transition-colors">Béla Kellner</a>
    </div>
  </div>
</template>

<script>
import { BUILD_VERSION } from '@/constants/build.js'

export default {
  name: 'AppFooter',
  data() {
    return {
      BUILD_VERSION
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script> 
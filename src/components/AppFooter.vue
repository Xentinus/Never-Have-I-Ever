<template>
  <div v-if="isAtBottom || isOnSpecialPage" class="fixed bottom-4 left-4 w-full text-sm footer-flash">
    <div class="font-bold">v{{ BUILD_VERSION }}</div>
    <div class="text-gray-400">
      © {{ currentYear }} <a href="https://kellner.dev/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-300 transition-colors">Béla Kellner</a>
    </div>
  </div>
</template>

<style>
.footer-height {
  height: var(--footer-height);
}
body {
   padding-bottom: 50px;
}
.footer-flash {
  animation: flash 1s ease-in-out;
}

@keyframes flash {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>

<script>
import { BUILD_VERSION } from '@/constants/build.js'

export default {
  name: 'AppFooter',
  data() {
    return {
      BUILD_VERSION,
      isAtBottom: false,
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    isOnSpecialPage() {
      return this.$route.name === 'StartupPage' || this.$route.name === 'SettingsPage' || this.$route.name === 'GamePage';
    }
  },
  mounted() {
    if (this.isOnSpecialPage) {
      this.checkScrollPosition();
    }
    window.addEventListener('scroll', this.checkScrollPosition);
    window.addEventListener('resize', this.checkScrollPosition);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkScrollPosition);
    window.removeEventListener('resize', this.checkScrollPosition);
  },
  methods: {
    checkScrollPosition() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      this.isAtBottom = scrollPosition >= documentHeight - 50;
    },
  }
}
</script> 
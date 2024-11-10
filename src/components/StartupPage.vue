<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-wrapper">
      <h1 class="text-6xl md:text-8xl font-bold mb-2 neon-purple">NEVER</h1>
      <h2 class="text-4xl md:text-6xl font-bold mb-12">have I ever</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="startGame"
          class="modern-button primary w-64 text-xl mx-auto">
          Játék indítása
        </button>
        <button
          @click="openSettings"
          class="modern-button transparent w-64 text-xl mx-auto">
          Beállítások
        </button>
      </div>
      <AppFooter />
    </div>
  </template>

  <script>
  import { keyboardNavigation } from '@/mixins/keyboardNavigation'
  import AppFooter from '@/components/AppFooter.vue'

  export default {
    name: 'StartupPage',
    mixins: [keyboardNavigation],
    methods: {
      startGame() {
        this.$router.push('/categories')
      },
      openSettings() {
        this.$router.push('/settings')
      }
    },
    computed: {
      currentYear() {
        return new Date().getFullYear()
      }
    },
    components: {
      AppFooter
    }
  }
  </script>
<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 class="text-4xl md:text-6xl font-bold mb-2">NEVER</h1>
      <h2 class="text-2xl md:text-4xl font-bold mb-12">have I ever</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="startGame"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none mx-auto">
          Játék indítása
        </button>
        <button
          @click="openSettings"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none mx-auto">
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

  <style scoped>
  /* Optional: Remove the default focus outline and use ring instead */
  button:focus {
    outline: none;
  }
  </style>
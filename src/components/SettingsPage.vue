<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 class="text-3xl font-bold mb-6">Beállítások</h2>
      <div class="mb-6">
        <p class="text-xl mb-2">Visszaszámlálás ideje:</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            v-for="(time) in countdownOptions"
            :key="time"
            @click="setCountdownTime(time)"
            :class="[
              'py-2 px-4 rounded-full text-lg focus:ring-2 focus:ring-white focus:outline-none w-full',
              countdownTime === time ? 'bg-blue-600' : 'bg-gray-700'
            ]"
          >
            {{ time }} mp
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <button
          @click="saveSettings"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none">
          Mentés
        </button>

        <button
          @click="returnToStartup"
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none">
          Vissza a főoldalra
        </button>
      </div>
      <AppFooter />
    </div>
</template>

<script>
import { keyboardNavigation } from '@/mixins/keyboardNavigation'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'SettingsPage',
  mixins: [keyboardNavigation],
  components: {
    AppFooter
  },
  data() {
    return {
      countdownOptions: [15, 20, 25, 30, 35, 40],
      countdownTime: 20,
    }
  },
  methods: {
    setCountdownTime(time) {
      this.countdownTime = time
    },
    saveSettings() {
      this.$store.commit('setCountdownTime', this.countdownTime)
      this.$router.push('/')
    },
    returnToStartup() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
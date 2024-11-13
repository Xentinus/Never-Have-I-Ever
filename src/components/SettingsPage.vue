<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">BEÁLLÍTÁSOK</h2>
      <div class="mb-6">
        <p class="text-xl md:text-2xl font-bold mb-6 text-center">VISSZASZÁMLÁLÁS IDEJE</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <button
            v-for="time in countdownOptions"
            :key="time"
            @click="setCountdownTime(time)"
            :class="[
              'modern-button',
              countdownTime === time ? 'white' : 'transparent'
            ]"
          >
            {{ time }} mp
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <button
          @click="saveSettings"
          class="modern-button primary">
          Mentés
        </button>

        <button
          @click="returnToStartup"
          class="modern-button transparent">
          <i class="fas fa-arrow-left mr-2"></i>Vissza a főoldalra
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
      countdownTime: this.$store.state.countdownTime || 20,
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
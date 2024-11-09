<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">{{ currentQuestion.text }}</h2>
    <div class="relative mb-6">
      <svg class="w-32 h-32" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#4B5563"
          stroke-width="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3B82F6"
          stroke-width="10"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {{ Math.ceil(timeLeft) }}
      </span>
    </div>
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        v-if="!isPaused"
        @click="pauseTimer"
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none mx-auto sm:mx-0">
        Megállítás
      </button>
      <button 
        v-if="isPaused"
        @click="resumeTimer"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none mx-auto sm:mx-0">
        Folytatás
      </button>
      <button
        @click="exitGame"
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-64 text-xl focus:ring-2 focus:ring-white focus:outline-none mx-auto sm:mx-0">
        Kilépés
      </button>
    </div>
    <div class="absolute bottom-4 right-4 text-sm">
      {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
    </div>
    <AppFooter />
  </div>
</template>

<script>
import { keyboardNavigation } from '@/mixins/keyboardNavigation'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'GamePage',
  mixins: [keyboardNavigation],
  components: {
    AppFooter
  },
  data() {
    return {
      currentQuestionIndex: 0,
      timeLeft: 20,
      isPaused: false,
      timerId: null,
      circumference: 2 * Math.PI * 45,
    }
  },
  computed: {
    currentQuestion() {
      return this.$store.getters.gameQuestions[this.currentQuestionIndex] || { text: 'No more questions' }
    },
    totalQuestions() {
      return this.$store.getters.gameQuestions.length
    },
    dashOffset() {
      return this.circumference * (1 - this.timeLeft / this.$store.state.countdownTime)
    }
  },
  created() {
    this.$store.dispatch('prepareGameQuestions')
    this.startTimer()
  },
  methods: {
    startTimer() {
      this.timeLeft = this.$store.state.countdownTime
      this.timerId = setInterval(() => {
        if (!this.isPaused) {
          this.timeLeft -= 0.1
          if (this.timeLeft <= 0) {
            this.nextQuestion()
          }
        }
      }, 100)
    },
    pauseTimer() {
      this.isPaused = true
    },
    resumeTimer() {
      this.isPaused = false
    },
    nextQuestion() {
      this.currentQuestionIndex++
      if (this.currentQuestionIndex >= this.totalQuestions) {
        this.exitGame()
      } else {
        this.timeLeft = this.$store.state.countdownTime
      }
    },
    exitGame() {
      clearInterval(this.timerId)
      this.$router.push('/')
    }
  },
  beforeDestroy() {
    clearInterval(this.timerId)
    // Clean up keyboard navigation when component is destroyed
    if (this.$el) {
      this.$el.removeEventListener('keydown', this.handleKeyNavigation)
    }
  }
}
</script>
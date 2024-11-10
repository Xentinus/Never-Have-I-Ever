<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">KATEGÓRIÁK</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="toggleCategory(category.id)"
        :class="[
          'modern-button',
          selectedCategories.includes(category.id) ? 'white' : 'transparent'
        ]"
      >
        {{ category.name }}
      </button>
    </div>
    <div class="px-4 lg:px-0 w-full flex flex-col items-center space-y-4">
      <button
        @click="startGame"
        :disabled="!isValid"
        :class="[
          'modern-button primary w-full sm:w-96 md:w-[32rem]',
          !isValid && 'opacity-50 cursor-not-allowed'
        ]"
      >
        Játék indítása a kiválasztott kategóriákkal
      </button>
      <button
        @click="returnToStartup"
        class="modern-button transparent w-full sm:w-96 md:w-[32rem]"
      >
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
  name: 'CategorySelection',
  mixins: [keyboardNavigation],
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    selectedCategories() {
      return this.$store.state.selectedCategories;
    },
    isValid() {
      return this.selectedCategories.length > 0 && this.$store.getters.selectedQuestionsCount > 0;
    }
  },
  components: {
    AppFooter
  },
  methods: {
    toggleCategory(categoryId) {
      this.$store.commit('toggleCategory', categoryId);
    },
    startGame() {
      if (this.isValid) {
        this.$router.push({ name: 'game' });
      }
    },
    returnToStartup() {
      this.$router.push('/')  // or this.$router.push({ name: 'startup' }) if you're using named routes
    }
  }
}
</script>
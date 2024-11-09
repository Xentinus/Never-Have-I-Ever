<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 class="text-3xl font-bold mb-6">Válassz kategóriákat</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="toggleCategory(category.id)"
          :class="[
            'py-2 px-4 rounded-full text-lg focus:ring-2 focus:ring-white focus:outline-none',
            selectedCategories.includes(category.id) ? 'bg-blue-600' : 'bg-gray-700'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
      <button
        @click="startGame"
        :disabled="!isValid"
        :class="[
          'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-96 md:w-[32rem] text-xl focus:ring-2 focus:ring-white focus:outline-none mb-4',
          !isValid && 'opacity-50 cursor-not-allowed'
        ]"
      >
        Játék indítása a kiválasztott kategóriákkal
      </button>
      <button
        @click="returnToStartup"
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-96 md:w-[32rem] text-xl focus:ring-2 focus:ring-white focus:outline-none"
      >
        Vissza a főoldalra
      </button>
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
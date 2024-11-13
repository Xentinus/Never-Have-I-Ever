<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">KATEGÓRIÁK</h2>
    <div v-if="categories.length > 0" class="flex flex-wrap justify-center gap-4 mb-6">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="toggleCategory(category.id)"
        :ref="category.id === categories[0]?.id ? 'firstCategory' : ''"
        :class="[
          'modern-button',
          selectedCategories.includes(category.id) ? 'white' : 'transparent'
        ]"
      >
        {{ category.name }}
      </button>
    </div>
    <div v-else class="text-xl mb-6">
      Nincsenek kiválasztható kategóriák!
    </div>
    <div class="px-4 lg:px-0 w-full flex flex-col items-center space-y-4">
      <button
        v-if="categories.length > 0"
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
        ref="returnButton"
        class="modern-button transparent w-full sm:w-96 md:w-[32rem]"
      >
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
      return this.selectedCategories.length > 0;
    }
  },
  components: {
    AppFooter
  },
  async created() {
    await this.$store.dispatch('fetchCategories')
    // Várunk egy tick-et, hogy a DOM frissüljön
    this.$nextTick(() => {
      if (this.categories.length > 0) {
        this.focusFirstCategory()
      } else {
        this.focusReturnButton()
      }
    })
  },
  methods: {
    focusFirstCategory() {
      if (this.$refs.firstCategory && this.$refs.firstCategory[0]) {
        this.$refs.firstCategory[0].focus()
      }
    },
    toggleCategory(categoryId) {
      this.$store.commit('toggleCategory', categoryId);
    },
    async startGame() {
      if (this.isValid) {
        await this.$store.dispatch('prepareGameQuestions')
        if (this.$store.state.gameQuestions.length > 0) {
          this.$router.push({ name: 'game' });
        } else {
          alert('Nincsenek kérdések a kiválasztott kategóriákban!')
        }
      }
    },
    returnToStartup() {
      this.$router.push('/')
    },
    focusReturnButton() {
      if (this.$refs.returnButton) {
        this.$refs.returnButton.focus()
      }
    }
  }
}
</script>
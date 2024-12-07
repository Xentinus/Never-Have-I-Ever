<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">KATEGÓRIÁK</h2>
    <div>
      <!-- Kategória gombok -->
      <div v-if="paginatedCategories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <button
          v-for="category in paginatedCategories"
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

      <!-- Lapozó -->
      <div v-if="categories.length > itemsPerPage" class="mt-4 flex flex-col md:flex-row justify-between items-center modern-button transparent">
        <div class="text-gray-200 text-center md:text-left">
          <span class="block md:inline">{{ startIndex + 1 }}-{{ endIndex }} / {{ categories.length }} kategória</span>
        </div>
        <div class="flex gap-2 mt-2 md:mt-0">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="modern-button white p-0.5 w-1/2 disabled:opacity-50 text-sm"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="modern-button white px-3 py-1 text-sm">
            {{ currentPage }}
          </span>
          <button 
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="modern-button white p-0.5 w-1/2 disabled:opacity-50 text-sm"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Lapozó után térköz -->
      <div class="mt-12"></div>

      <!-- Gombok -->
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
    </div>
    <AppFooter />

    <!-- Betöltő képernyő -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import { keyboardNavigation } from '@/mixins/keyboardNavigation'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'CategorySelection',
  mixins: [keyboardNavigation],
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6,
      isLoading: false,
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    selectedCategories() {
      return this.$store.state.selectedCategories;
    },
    isValid() {
      return this.selectedCategories.length > 0;
    },
    totalPages() {
      return Math.ceil(this.categories.length / this.itemsPerPage)
    },
    paginatedCategories() {
      console.log(this.categories)
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.categories.slice(start, end)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.categories.length)
    }
  },
  components: {
    AppFooter
  },
  async created() {
    this.isLoading = true;
    await this.$store.dispatch('fetchCategories');
    this.isLoading = false;
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

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loader {
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #ffffff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
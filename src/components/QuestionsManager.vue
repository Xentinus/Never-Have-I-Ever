<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-wrapper">
    <div class="container mx-auto max-w-4xl flex flex-col h-full justify-center">
      <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">KÉRDÉSEK</h2>

      <!-- Kereső és új kérdés gomb -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="relative w-full md:w-2/3 lg:w-2/4">
          <input
            v-model="searchQuery"
            type="text"
            class="modern-button transparent w-full pl-10 pr-4 py-3"
            placeholder="Keresés..."
          >
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button 
          @click="showAddModal = true"
          class="modern-button primary w-full md:w-1/3 lg:w-2/4 py-3"
        >
          <i class="fas fa-plus mr-2"></i>Új kérdés
        </button>
      </div>

      <!-- Kérdés kártyák -->
      <div class="flex-grow overflow-hidden">
        <div class="grid grid-cols-1 gap-4 p-1">
          <div v-for="question in paginatedQuestions"
               :key="question.id"
               class="modern-button transparent text-left cursor-pointer p-4"
               @click="showActionModal(question)">
            <p class="text-xl mb-2">{{ question.text }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="category in question.Categories" 
                    :key="category.id"
                    class="text-sm bg-purple-600 px-2 py-1 rounded">
                {{ category.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lapozó -->
      <div class="mt-8 flex justify-between items-center modern-button transparent">
        <div class="text-gray-200">
          {{ startIndex + 1 }}-{{ endIndex }} / {{ filteredQuestions.length }} kérdés
        </div>
        <div class="flex gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="modern-button white p-1 disabled:opacity-50 text-sm"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="modern-button white px-3 py-1 text-sm">
            {{ currentPage }}
          </span>
          <button 
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="modern-button white p-1 disabled:opacity-50 text-sm"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Új kérdés modál -->
      <div v-if="showAddModal" class="modal-backdrop" @click="showAddModal = false">
        <div class="modal-content" @click.stop>
          <h2 class="text-2xl font-bold mb-4">Új kérdés</h2>
          <textarea
            v-model="newQuestion.text"
            class="w-full p-3 rounded bg-gray-700 text-white mb-4"
            placeholder="Kérdés szövege"
            rows="3"
          ></textarea>
          <div class="mb-4">
            <h3 class="mb-4">Kategóriák:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label v-for="category in categories" 
                     :key="category.id"
                     class="relative inline-flex items-center cursor-pointer group">
                <input type="checkbox"
                       :value="category.id"
                       v-model="newQuestion.categoryIds"
                       class="sr-only peer">
                <div class="w-14 h-7 bg-gray-700 rounded-full peer 
                            peer-checked:bg-purple-600
                            after:content-[''] 
                            after:absolute 
                            after:top-1 
                            after:left-1 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            after:duration-300
                            peer-checked:after:translate-x-7
                            peer-focus:ring-4
                            peer-focus:ring-purple-800
                            group-hover:after:scale-95">
                </div>
                <div class="ml-3 flex flex-col">
                  <span class="text-sm font-medium text-gray-300">{{ category.name }}</span>
                  <span class="text-xs text-gray-500 peer-checked:text-purple-400">
                    {{ newQuestion.categoryIds.includes(category.id) ? 'Aktív' : 'Inaktív' }}
                  </span>
                </div>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button @click="showAddModal = false" class="modern-button transparent">
              <i class="fas fa-times mr-2"></i>Mégse
            </button>
            <button @click="addQuestion" class="modern-button primary" :disabled="!newQuestion.text.trim()">
              <i class="fas fa-check mr-2"></i>Mentés
            </button>
          </div>
        </div>
      </div>

      <!-- Művelet modál -->
      <div v-if="selectedQuestion" class="modal-backdrop" @click="selectedQuestion = null">
        <div class="modal-content" @click.stop>
          <h3 class="text-2xl font-bold mb-6">Műveletek</h3>
          <p class="mb-4">{{ selectedQuestion.text }}</p>
          <div class="flex flex-col gap-4">
            <button @click="startEdit(selectedQuestion)" class="modern-button yellow w-full">
              <i class="fas fa-edit mr-2"></i>Szerkesztés
            </button>
            <button @click="confirmDelete(selectedQuestion)" class="modern-button red w-full">
              <i class="fas fa-trash mr-2"></i>Törlés
            </button>
            <button @click="selectedQuestion = null" class="modern-button transparent w-full">
              <i class="fas fa-times mr-2"></i>Bezárás
            </button>
          </div>
        </div>
      </div>

      <!-- Szerkesztés modál -->
      <div v-if="editingId" class="modal-backdrop" @click="cancelEdit">
        <div class="modal-content" @click.stop>
          <h2 class="text-2xl font-bold mb-4">Kérdés szerkesztése</h2>
          <textarea
            v-model="editingText"
            class="w-full p-3 rounded bg-gray-700 text-white mb-4"
            placeholder="Kérdés szövege"
            rows="3"
          ></textarea>
          <div class="mb-4">
            <h3 class="mb-4">Kategóriák:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label v-for="category in categories" 
                     :key="category.id"
                     class="relative inline-flex items-center cursor-pointer group">
                <input type="checkbox"
                       :value="category.id"
                       v-model="editingCategoryIds"
                       class="sr-only peer">
                <div class="w-14 h-7 bg-gray-700 rounded-full peer 
                            peer-checked:bg-purple-600
                            after:content-[''] 
                            after:absolute 
                            after:top-1 
                            after:left-1 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            after:duration-300
                            peer-checked:after:translate-x-7
                            peer-focus:ring-4
                            peer-focus:ring-purple-800
                            group-hover:after:scale-95">
                </div>
                <div class="ml-3 flex flex-col">
                  <span class="text-sm font-medium text-gray-300">{{ category.name }}</span>
                  <span class="text-xs text-gray-500 peer-checked:text-purple-400">
                    {{ editingCategoryIds.includes(category.id) ? 'Aktív' : 'Inaktív' }}
                  </span>
                </div>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button @click="cancelEdit" class="modern-button transparent">
              <i class="fas fa-times mr-2"></i>Mégse
            </button>
            <button @click="saveEdit" class="modern-button primary" :disabled="!editingText.trim()">
              <i class="fas fa-check mr-2"></i>Mentés
            </button>
          </div>
        </div>
      </div>

      <!-- Törlés megerősítő modál -->
      <div v-if="deleteConfirmation" class="modal-backdrop" @click="deleteConfirmation = null">
        <div class="modal-content" @click.stop>
          <h2 class="text-2xl font-bold mb-4">Kérdés törlése</h2>
          <p class="mb-4">Biztosan törölni szeretnéd ezt a kérdést?</p>
          <p class="mb-4 italic">{{ deleteConfirmation.text }}</p>
          <div class="flex justify-end gap-2">
            <button @click="deleteConfirmation = null" class="modern-button transparent">
              <i class="fas fa-times mr-2"></i>Mégse
            </button>
            <button @click="deleteQuestion" class="modern-button red">
              <i class="fas fa-trash mr-2"></i>Törlés
            </button>
          </div>
        </div>
      </div>

      <!-- Lábléc -->
      <div class="mt-4 text-center">
        <button @click="$router.push('/')" class="modern-button transparent">
          <i class="fas fa-arrow-left mr-2"></i>Vissza a főoldalra
        </button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import axios from 'axios'

export default {
  name: 'QuestionsManager',
  components: {
    AppFooter
  },
  data() {
    return {
      questions: [],
      categories: [],
      newQuestion: {
        text: '',
        categoryIds: []
      },
      editingId: null,
      editingText: '',
      editingCategoryIds: [],
      showAddModal: false,
      deleteConfirmation: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      selectedQuestion: null,
    }
  },
  computed: {
    filteredQuestions() {
      if (!this.searchQuery) return this.questions
      const query = this.searchQuery.toLowerCase()
      return this.questions.filter(question => 
        question.text.toLowerCase().includes(query) ||
        question.Categories.some(cat => cat.name.toLowerCase().includes(query))
      )
    },
    totalPages() {
      return Math.ceil(this.filteredQuestions.length / this.itemsPerPage)
    },
    paginatedQuestions() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredQuestions.slice(start, end)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredQuestions.length)
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    }
  },
  async created() {
    await this.loadQuestions()
    await this.loadCategories()
  },
  methods: {
    async loadQuestions() {
      try {
        const response = await axios.get('http://localhost:3000/questions')
        this.questions = response.data
      } catch (error) {
        console.error('Hiba a kérdések betöltésekor:', error)
      }
    },
    async loadCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories')
        this.categories = response.data
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error)
      }
    },
    async addQuestion() {
      if (!this.newQuestion.text.trim()) return
      
      try {
        await axios.post('http://localhost:3000/questions', {
          text: this.newQuestion.text.trim(),
          categoryIds: this.newQuestion.categoryIds
        })
        this.newQuestion = { text: '', categoryIds: [] }
        this.showAddModal = false
        await this.loadQuestions()
      } catch (error) {
        console.error('Hiba a kérdés hozzáadásakor:', error)
      }
    },
    startEdit(question) {
      this.editingId = question.id
      this.editingText = question.text
      this.editingCategoryIds = question.Categories.map(c => c.id)
      this.selectedQuestion = null
    },
    async saveEdit() {
      if (!this.editingText.trim()) return
      
      try {
        await axios.put(`http://localhost:3000/questions/${this.editingId}`, {
          text: this.editingText.trim(),
          categoryIds: this.editingCategoryIds
        })
        this.editingId = null
        this.editingText = ''
        this.editingCategoryIds = []
        await this.loadQuestions()
      } catch (error) {
        console.error('Hiba a kérdés szerkesztésekor:', error)
      }
    },
    cancelEdit() {
      this.editingId = null
      this.editingText = ''
      this.editingCategoryIds = []
    },
    confirmDelete(question) {
      this.deleteConfirmation = question
      this.selectedQuestion = null
    },
    async deleteQuestion() {
      try {
        await axios.delete(`http://localhost:3000/questions/${this.deleteConfirmation.id}`)
        this.deleteConfirmation = null
        await this.loadQuestions()
      } catch (error) {
        console.error('Hiba a kérdés törlésekor:', error)
      }
    },
    showActionModal(question) {
      this.selectedQuestion = question
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: start;
  z-index: 50;
  overflow-y: auto;
  padding: 1rem;
}

.modal-content {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid #374151;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin: 2rem auto;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #374151;
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem auto;
    padding: 1rem;
  }
  
  .modal-backdrop {
    padding: 0.5rem;
  }
}

.group:hover .after\:scale-95::after {
  transform: scale(0.95);
}

input:checked + div::after {
  transform: translateX(1.75rem);
}

input:checked + div {
  background-color: rgb(147, 51, 234);
}

input:focus + div {
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3);
}
</style> 
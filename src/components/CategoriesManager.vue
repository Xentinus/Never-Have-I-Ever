<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-wrapper">
    <div class="container mx-auto max-w-4xl flex flex-col h-full justify-center">
      <!-- Fejléc -->
      <h2 class="text-4xl md:text-6xl font-bold mb-10 text-center neon-purple">KATEGÓRIÁK</h2>

      <!-- Kereső és új kategória gomb -->
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
          <i class="fas fa-plus mr-2"></i>Új kategória
        </button>
      </div>

      <!-- Kategória kártyák rács -->
      <div class="flex-grow overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
          <div v-for="category in paginatedCategories"
               :key="category.id"
               class="modern-button transparent text-center cursor-pointer"
               @click="showActionModal(category)">
            <span class="text-xl">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Lapozó -->
      <div class="mt-8 flex justify-between items-center modern-button transparent">
        <div class="text-gray-200">
          {{ startIndex + 1 }}-{{ endIndex }} / {{ filteredCategories.length }} kategória
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

      <!-- Művelet modál -->
      <div v-if="selectedCategory" class="modal-backdrop" @click="selectedCategory = null">
        <div class="modal-content" @click.stop>
          <h3 class="text-2xl font-bold mb-6 text-center">{{ selectedCategory.name }}</h3>
          <div class="flex flex-col gap-4">
            <button @click="startEdit(selectedCategory)" class="modern-button yellow w-full">
              <i class="fas fa-edit mr-2"></i>Szerkesztés
            </button>
            <button @click="confirmDelete(selectedCategory)" class="modern-button red w-full">
              <i class="fas fa-trash mr-2"></i>Törlés
            </button>
            <button @click="selectedCategory = null" class="modern-button transparent w-full">
              <i class="fas fa-times mr-2"></i>Bezárás
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

    <!-- Új kategória modál -->
    <div v-if="showAddModal" class="modal-backdrop" @click="showAddModal = false">
      <div class="modal-content" @click.stop>
        <h2 class="text-2xl font-bold mb-4">Új kategória</h2>
        <input
          v-model="newCategory"
          type="text"
          class="w-full p-3 rounded bg-gray-700 text-white mb-4"
          placeholder="Kategória neve"
          @keyup.enter="addCategory"
        >
        <div class="flex justify-end gap-2">
          <button @click="showAddModal = false" class="modern-button transparent">
            <i class="fas fa-times mr-2"></i>Mégse
          </button>
          <button @click="addCategory" class="modern-button primary" :disabled="!newCategory.trim()">
            <i class="fas fa-check mr-2"></i>Mentés
          </button>
        </div>
      </div>
    </div>

    <!-- Szerkesztés modál -->
    <div v-if="editingId" class="modal-backdrop" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h2 class="text-2xl font-bold mb-4">Kategória szerkesztése</h2>
        <input
          v-model="editingText"
          type="text"
          class="w-full p-3 rounded bg-gray-700 text-white mb-4"
          placeholder="Kategória neve"
          @keyup.enter="saveEdit"
        >
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
        <h2 class="text-2xl font-bold mb-4">Kategória törlése</h2>
        <p class="mb-4">Biztosan törölni szeretnéd a következő kategóriát: "{{ deleteConfirmation.name }}"?</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteConfirmation = null" class="modern-button transparent">
            <i class="fas fa-times mr-2"></i>Mégse
          </button>
          <button @click="deleteCategory" class="modern-button red">
            <i class="fas fa-trash mr-2"></i>Törlés
          </button>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import axios from 'axios'

export default {
  name: 'CategoriesManager',
  components: {
    AppFooter
  },
  data() {
    return {
      categories: [],
      newCategory: '',
      editingId: null,
      editingText: '',
      showAddModal: false,
      deleteConfirmation: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: this.getItemsPerPage(),
      selectedCategory: null,
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.categories
      const query = this.searchQuery.toLowerCase()
      return this.categories.filter(category => 
        category.name.toLowerCase().includes(query)
      )
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage)
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredCategories.slice(start, end)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredCategories.length)
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    filteredCategories() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages)
      }
    }
  },
  async created() {
    await this.loadCategories()
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async loadCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories')
        this.categories = response.data
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error)
      }
    },
    async addCategory() {
      if (!this.newCategory.trim()) return
      
      try {
        await axios.post('http://localhost:3000/categories', {
          name: this.newCategory.trim()
        })
        this.newCategory = ''
        this.showAddModal = false
        await this.loadCategories()
      } catch (error) {
        console.error('Hiba a kategória hozzáadásakor:', error)
      }
    },
    confirmDelete(category) {
      this.deleteConfirmation = category
      this.selectedCategory = null
    },
    async deleteCategory() {
      try {
        await axios.delete(`http://localhost:3000/categories/${this.deleteConfirmation.id}`)
        this.deleteConfirmation = null
        await this.loadCategories()
      } catch (error) {
        console.error('Hiba a kategória törlésekor:', error)
      }
    },
    startEdit(category) {
      this.editingId = category.id
      this.editingText = category.name
      this.selectedCategory = null
    },
    async saveEdit() {
      if (!this.editingText.trim()) return
      
      try {
        await axios.put(`http://localhost:3000/categories/${this.editingId}`, {
          name: this.editingText.trim()
        })
        this.editingId = null
        this.editingText = ''
        await this.loadCategories()
      } catch (error) {
        console.error('Hiba a kategória szerkesztésekor:', error)
      }
    },
    cancelEdit() {
      this.editingId = null
      this.editingText = ''
    },
    showActionModal(category) {
      this.selectedCategory = category;
    },
    getItemsPerPage() {
      const width = window.innerWidth;
      if (width >= 1024) { // lg breakpoint
        return 9;
      } else if (width >= 640) { // sm breakpoint
        return 6;
      }
      return 4; // mobile
    },
    handleResize() {
      this.itemsPerPage = this.getItemsPerPage();
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages);
      }
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
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  border: 1px solid #374151;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
    padding: 1rem;
  }
}
</style>
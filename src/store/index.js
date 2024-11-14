import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const API_URL = 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    countdownTime: 20,
    categories: [],
    selectedCategories: [],
    gameQuestions: []
  },
  mutations: {
    setCountdownTime(state, time) {
      state.countdownTime = time
    },
    setCategories(state, categories) {
      state.categories = categories
    },
    toggleCategory(state, categoryId) {
      const index = state.selectedCategories.indexOf(categoryId)
      if (index === -1) {
        state.selectedCategories.push(categoryId)
      } else {
        state.selectedCategories.splice(index, 1)
      }
    },
    setGameQuestions(state, questions) {
      state.gameQuestions = questions.map(text => ({ text }))
    }
  },
  actions: {
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/categories/with-questions`)
        commit('setCategories', response.data)
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error)
      }
    },
    async prepareGameQuestions({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/questions/categories`, {
          params: {
            categoryIds: state.selectedCategories.join(',')
          }
        })
        commit('setGameQuestions', response.data)
      } catch (error) {
        console.error('Hiba a kérdések betöltésekor:', error)
      }
    }
  },
  getters: {
    selectedQuestionsCount: (state) => {
      return state.selectedCategories.length > 0 ? 1 : 0
    },
    gameQuestions: (state) => state.gameQuestions
  }
})
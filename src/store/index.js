import Vue from 'vue'
import Vuex from 'vuex'
import categoriesData from '@/assets/categories.json'
import questionsData from '@/assets/questions.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    countdownTime: 20,
    categories: categoriesData,
    questions: questionsData,
    selectedCategories: [],
    gameQuestions: []
  },
  mutations: {
    setCountdownTime(state, time) {
      state.countdownTime = time
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
      state.gameQuestions = questions
    }
  },
  actions: {
    prepareGameQuestions({ commit, state }) {
      const selectedQuestions = state.questions.filter(question => 
        question.categories.some(categoryId => state.selectedCategories.includes(categoryId))
      )
      const shuffledQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5)
      commit('setGameQuestions', shuffledQuestions)
    }
  },
  getters: {
    selectedQuestionsCount: (state) => {
      return state.questions.filter(question => 
        question.categories.some(categoryId => state.selectedCategories.includes(categoryId))
      ).length
    },
    gameQuestions: (state) => state.gameQuestions
  }
})
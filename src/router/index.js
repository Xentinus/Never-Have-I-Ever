import Vue from 'vue'
import VueRouter from 'vue-router'
import StartupPage from '@/components/StartupPage.vue'
import CategorySelection from '@/components/CategorySelection.vue'
import GamePage from '@/components/GamePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import CategoriesManager from '@/components/CategoriesManager.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'startup',
    component: StartupPage
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategorySelection
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  },
  {
    path: '/categories-manager',
    name: 'CategoriesManager',
    component: CategoriesManager
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
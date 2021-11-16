import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/wheel',
    name: 'Wheel',
    component: () => import(/* webpackChunkName: "about" */ '../views/Wheel.vue')
  },
  {
    path: '/wheel2',
    name: 'Wheel2',
    component: () => import(/* webpackChunkName: "about" */ '../views/Wheel2.vue')
  },
  {
    path: '/*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

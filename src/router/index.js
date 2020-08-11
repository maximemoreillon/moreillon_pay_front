import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from '../views/Users.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Users',
    component: Users
  },
  {
    path: '/log',
    name: 'Log',
    component: () => import('../views/Log.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

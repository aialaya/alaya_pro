import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import i18n from '@/plugins/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/home/index.vue'),
    meta: { 
      requiresAuth: true,
      title: 'home.routeName'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/login/index.vue'),
    meta: { 
      requiresAuth: false,
      title: 'login.routeName'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/register/index.vue'),
    meta: { 
      requiresAuth: false,
      title: 'register.routeName'
    }
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: () => import('../pages/password/forgetPassword.vue'),
    meta: { 
      requiresAuth: false,
      title: 'forgetPassword.routeName'
    }
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: () => import('../pages/password/resetPassword.vue'),
    meta: { 
      requiresAuth: false,
      title: 'resetPassword.routeName'
    }
  },
  {
    path: '/marker/:id',
    name: 'Marker',
    component: () => import('../pages/imageMarker/index.vue'),
    meta: { 
      requiresAuth: true,
      title: 'imageMarker.routeName'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/404/index.vue'),
    meta: { 
      requiresAuth: false,
      title: '404'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async(to, _from, next) => {
  document.title = `${i18n.global.t(to.meta.title as string)} - ${i18n.global.t('common.siteName')}`
  
  const userStore = useUserStore()
  const token = to.query.token
  if(token){
    userStore.setToken("",token.toString())
    await userStore.refreshToken()
  }
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else {
    if(userStore.token){
      await userStore.getUserInfo()
    }
    next()
  }
})

export default router

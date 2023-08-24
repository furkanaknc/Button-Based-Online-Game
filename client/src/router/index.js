import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path:'/login',
    name:'login',
    component:() => import('../views/LoginView.vue'),
    meta:{
      requireGuest: true
    }
  },
  {
    path:'/register',
    name:'register',
    component:() => import('../views/RegisterView.vue'),
    meta:{
      requireGuest: true
    }
  },
  {
    path: '/:roomId',
    name: 'Game',
    component:() => import('../views/GameView.vue'),
    meta:{
      requireAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



router.beforeEach((to,from,next)=>{
  if(to.matched.some(record => record.meta.requireAuth)){
    if(!store.getters.isLoggedIn){
      next('login');
    }else{
      next();
    }
  }else if(to.matched.some(record => record.meta.requireGuest)){
    if(store.getters.isLoggedIn){
      next('/');
    }else{
      next();
    }
  }else{
    next();
  }
});


export default router

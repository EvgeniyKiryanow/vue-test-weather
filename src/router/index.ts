// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import FavoritesPage from '../views/FavoritePage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/favorites', name: 'Favorites', component: FavoritesPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

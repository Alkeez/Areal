import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/organizations' // По умолчанию открываем организации
      },
      {
        path: '/organizations',
        name: 'Organizations',
        component: () => import('../pages/OrganizationsPage.vue'),
      },
      {
        path: '/departments',
        name: 'Departments',
        component: () => import('../pages/DepartmentsPage.vue'),
      },
      {
        path: '/positions',
        name: 'Positions',
        component: () => import('../pages/PositionsPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
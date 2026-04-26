import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/organizations'
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
      {
        path: '/users',
        name: 'Users',
        component: () => import('../pages/UsersPage.vue'),
      },
      {
        path: '/employees',
        name: 'Employees',
        component: () => import('../pages/EmployeesPage.vue'),
      },
      {
        path: '/employees/:id/history',
        name: 'EmployeeHistory',
        component: () => import('../pages/EmployeeHistoryPage.vue'),
      },
      {
        path: '/hr',
        name: 'HrOperations',
        component: () => import('../pages/HrOperationsPage.vue'),
      },
      {
        path: '/history',
        name: 'GlobalHistory',
        component: () => import('../pages/GlobalHistoryPage.vue'), // Создадим ниже
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
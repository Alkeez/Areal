<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Areal HR
        </q-toolbar-title>
        
        <!-- Отладка: Если currentUser есть, покажет имя и роль -->
        <div v-if="currentUser" class="q-mr-md text-subtitle2">
          Добро пожаловать, {{ currentUser.first_name }} ({{ currentUser.role }})
        </div>
        <div v-else class="q-mr-md text-subtitle2 text-red">
          Данные не загружены
        </div>

        <q-btn flat round icon="logout" @click="logout" title="Выход" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Навигация</q-item-label>

        <q-item clickable to="/organizations" v-ripple>
          <q-item-section avatar><q-icon name="business" /></q-item-section>
          <q-item-section><q-item-label>Организации</q-item-label></q-item-section>
        </q-item>

        <q-item clickable to="/departments" v-ripple>
          <q-item-section avatar><q-icon name="account_tree" /></q-item-section>
          <q-item-section><q-item-label>Отделы</q-item-label></q-item-section>
        </q-item>

        <q-item clickable to="/positions" v-ripple>
          <q-item-section avatar><q-icon name="work" /></q-item-section>
          <q-item-section><q-item-label>Должности</q-item-label></q-item-section>
        </q-item>

        <q-item clickable to="/employees" v-ripple>
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section><q-item-label>Сотрудники</q-item-label></q-item-section>
        </q-item>

        <q-item clickable to="/hr" v-ripple>
          <q-item-section avatar><q-icon name="assignment" /></q-item-section>
          <q-item-section><q-item-label>Кадровые операции</q-item-label></q-item-section>
        </q-item>

        <q-item clickable to="/history" v-ripple>
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section><q-item-label>История изменений</q-item-label></q-item-section>
        </q-item>

        <q-separator />

        <!-- Условие: если currentUser существует И его роль 'admin' -->
        <q-item clickable to="/users" v-ripple v-if="currentUser && currentUser.role === 'admin'">
          <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
          <q-item-section><q-item-label>Пользователи</q-item-label></q-item-section>
        </q-item>
    
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { Notify } from 'quasar';

const leftDrawerOpen = ref(true);
const router = useRouter();
const currentUser = ref<any>(null);

onMounted(async () => {
  await loadProfile();
});

async function loadProfile() {
  try {
    const res = await api.get('/auth/profile');
    console.log('Получен профиль:', res.data); // Смотрим в консоль браузера
    currentUser.value = res.data;
  } catch (e) {
    console.error('Ошибка профиля', e);
    currentUser.value = null;
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logout() {
  try {
    await api.post('/auth/logout');
    currentUser.value = null; 
    router.push('/login');
  } catch (e) {
    router.push('/login');
  }
}
</script>
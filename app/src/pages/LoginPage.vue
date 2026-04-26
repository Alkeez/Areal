<template>
  <!-- Добавили QLayout и QPageContainer -->
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding class="flex flex-center bg-grey-3">
        <q-card style="width: 400px" class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-center">Вход в систему</div>
          </q-card-section>

          <q-card-section>
            <q-input 
              v-model="login" 
              label="Логин" 
              dense 
              outlined 
              class="q-mb-md" 
              @keyup.enter="handleLogin"
            />
            <q-input 
              v-model="password" 
              label="Пароль" 
              type="password" 
              dense 
              outlined 
              class="q-mb-md"
              @keyup.enter="handleLogin"
            />
          </q-card-section>

          <q-card-actions align="center">
            <q-btn 
              label="Войти" 
              color="primary" 
              @click="handleLogin" 
              style="width: 100%"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar'; // Импортируем Notify напрямую

const login = ref('');
const password = ref('');
const router = useRouter();

async function handleLogin() {
  if (!login.value || !password.value) {
    Notify.create({ type: 'warning', message: 'Введите логин и пароль' }); // Используем Notify.create
    return;
  }
  
  try {
    const res = await api.post('/auth/login', { 
      login: login.value, 
      password: password.value 
    });
    
    Notify.create({ 
      type: 'positive', 
      message: `Добро пожаловать, ${res.data.first_name}!` 
    });
    
    router.push('/');
  } catch (e) {
    Notify.create({ 
      type: 'negative', 
      message: 'Неверный логин или пароль' 
    });
  }
}
</script>
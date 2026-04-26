<template>
  <q-page padding>
    <q-btn label="Добавить пользователя" color="primary" @click="openDialog()" class="q-mb-md"/>

    <q-table
      title="Пользователи"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round icon="edit" color="blue" @click="openDialog(props.row)"/>
          <q-btn dense flat round icon="delete" color="red" @click="deleteItem(props.row.id)"/>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Редактировать' : 'Создать' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.surname" label="Фамилия" dense outlined class="q-mb-sm"/>
          <q-input v-model="form.first_name" label="Имя" dense outlined class="q-mb-sm"/>
          <q-input v-model="form.patronymic" label="Отчество" dense outlined class="q-mb-sm"/>
          <q-input v-model="form.login" label="Логин" dense outlined class="q-mb-sm"/>
          <q-input v-model="form.password" :label="form.id ? 'Новый пароль (оставьте пустым)' : 'Пароль'" type="password" dense outlined class="q-mb-sm" :disable="!!form.id && !form.changePassword">
             <q-toggle v-model="form.changePassword" label="Сменить" v-if="form.id" class="q-ml-sm"/>
          </q-input>
          <q-select v-model="form.role" :options="roleOptions" label="Роль" dense outlined emit-value map-options/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="saveItem"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const rows = ref([]);
const loading = ref(false);
const dialog = ref(false);
const form = ref<any>({ id: null, surname: '', first_name: '', patronymic: '', login: '', password: '', role: 'hr_manager', changePassword: false });

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'surname', label: 'Фамилия', field: 'surname' },
  { name: 'login', label: 'Логин', field: 'login' },
  { name: 'role', label: 'Роль', field: 'role' },
  { name: 'actions', label: 'Действия' }
];

const roleOptions = [
  { label: 'Администратор', value: 'admin' },
  { label: 'Менеджер по персоналу', value: 'hr_manager' }
];

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  try { rows.value = (await api.get('/users')).data; } 
  catch (e) { $q.notify({ type: 'negative', message: 'Ошибка' }); }
  finally { loading.value = false; }
}

function openDialog(row: any = null) {
  if (row) {
    form.value = { ...row, password: '', changePassword: false };
  } else {
    form.value = { id: null, surname: '', first_name: '', patronymic: '', login: '', password: '', role: 'hr_manager', changePassword: false };
  }
  dialog.value = true;
}

async function saveItem() {
  try {
    const { id, created_at, updated_at, deleted_at, changePassword, ...data } = form.value;
    
    if (id && !changePassword) {
        delete data.password;
    }

    if (id) {
      await api.put(`/users/${id}`, data);
    } else {
      await api.post('/users', data);
    }
    dialog.value = false;
    fetchData();
    $q.notify({ type: 'positive', message: 'Сохранено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка сохранения' });
  }
}

async function deleteItem(id: number) {
  if (!confirm('Удалить?')) return;
  try {
    await api.delete(`/users/${id}`);
    fetchData();
    $q.notify({ type: 'info', message: 'Удалено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка' });
  }
}
</script>
<template>
  <q-page padding>
    <q-btn label="Добавить организацию" color="primary" @click="openDialog()" class="q-mb-md"/>

    <q-table
      title="Организации"
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

    <!-- Диалог создания/редактирования -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Редактировать' : 'Создать' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.name" label="Наименование" dense outlined class="q-mb-md"/>
          <q-input v-model="form.comment" label="Комментарий" dense outlined type="textarea"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="saveItem" v-close-popup/>
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
const form = ref({ id: null, name: '', comment: '' });

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Наименование', field: 'name', sortable: true },
  { name: 'comment', label: 'Комментарий', field: 'comment' },
  { name: 'actions', label: 'Действия', field: 'actions' }
];

onMounted(() => {
  fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await api.get('/organizations');
    rows.value = res.data;
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка загрузки данных' });
  } finally {
    loading.value = false;
  }
}

function openDialog(row: any = null) {
  if (row) {
    form.value = { ...row };
  } else {
    form.value = { id: null, name: '', comment: '' };
  }
  dialog.value = true;
}

async function saveItem() {
  try {
    const { id, created_at, updated_at, deleted_at, ...data } = form.value;

    if (id) {
      await api.put(`/organizations/${id}`, data);
    } else {
      await api.post('/organizations', data);
    }
    fetchData();
    dialog.value = false; // Закрываем диалог вручную
    $q.notify({ type: 'positive', message: 'Сохранено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка сохранения' });
  }
}

async function deleteItem(id: number) {
  if (!confirm('Удалить запись?')) return;
  try {
    await api.delete(`/organizations/${id}`);
    fetchData();
    $q.notify({ type: 'info', message: 'Удалено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка удаления' });
  }
}
</script>
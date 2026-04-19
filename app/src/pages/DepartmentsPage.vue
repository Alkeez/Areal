<template>
  <q-page padding>
    <q-btn label="Добавить отдел" color="primary" @click="openDialog()" class="q-mb-md"/>

    <q-table
      title="Отделы"
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
          <q-select 
            v-model="form.organization_id" 
            :options="orgOptions" 
            label="Организация" 
            emit-value 
            map-options 
            dense 
            outlined 
            class="q-mb-md"
          />
          <q-select 
            v-model="form.parent_id" 
            :options="deptOptions" 
            label="Родительский отдел (не обязательно)" 
            emit-value 
            map-options 
            dense 
            outlined 
            clearable
            class="q-mb-md"
          />
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
const form = ref({ id: null, organization_id: null, parent_id: null, name: '', comment: '' });

// Для выпадающих списков
const orgOptions = ref([]);
const deptOptions = ref([]);

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Наименование', field: 'name', sortable: true },
  { name: 'organization_id', label: 'ID Организации', field: 'organization_id' },
  { name: 'parent_id', label: 'ID Родителя', field: 'parent_id' },
  { name: 'actions', label: 'Действия', field: 'actions' }
];

onMounted(() => {
  fetchData();
  fetchOptions();
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await api.get('/departments');
    rows.value = res.data;
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка загрузки данных' });
  } finally {
    loading.value = false;
  }
}

async function fetchOptions() {
  try {
    // Загружаем список организаций для выбора
    const orgRes = await api.get('/organizations');
    orgOptions.value = orgRes.data.map((o: any) => ({ label: o.name, value: o.id }));

    // Загружаем список отделов для выбора родителя
    const deptRes = await api.get('/departments');
    deptOptions.value = deptRes.data.map((d: any) => ({ label: d.name, value: d.id }));
  } catch (e) {
    console.error(e);
  }
}

function openDialog(row: any = null) {
  if (row) {
    form.value = { ...row };
  } else {
    form.value = { id: null, organization_id: null, parent_id: null, name: '', comment: '' };
  }
  dialog.value = true;
}

async function saveItem() {
  try {
    const { id, created_at, updated_at, deleted_at, ...data } = form.value;

    if (id) {
      await api.put(`/departments/${id}`, data);
    } else {
      await api.post('/departments', data);
    }
    fetchData();
    fetchOptions(); // Обновляем списки
    dialog.value = false;
    $q.notify({ type: 'positive', message: 'Сохранено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка сохранения' });
  }
}

async function deleteItem(id: number) {
  if (!confirm('Удалить запись?')) return;
  try {
    await api.delete(`/departments/${id}`);
    fetchData();
    fetchOptions();
    $q.notify({ type: 'info', message: 'Удалено' });
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка удаления' });
  }
}
</script>
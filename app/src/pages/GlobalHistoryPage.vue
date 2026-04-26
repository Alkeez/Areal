<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">История изменений (Глобальный журнал)</div>
      </q-card-section>

      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 20 }"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { Notify } from 'quasar';

const rows = ref([]);
const loading = ref(false);

const columns = [
  { name: 'created_at', label: 'Дата', field: 'created_at', sortable: true },
  { name: 'entity_type', label: 'Объект', field: 'entity_type' },
  { name: 'entity_id', label: 'ID Объекта', field: 'entity_id' },
  { name: 'field_name', label: 'Поле', field: 'field_name' },
  { name: 'old_value', label: 'Старое знач.', field: 'old_value' },
  { name: 'new_value', label: 'Новое знач.', field: 'new_value' },
];

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  try {
    // Получаем всю историю сразу
    const res = await api.get('/change_history');
    rows.value = res.data;
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Ошибка загрузки истории' });
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <q-page padding>
    <q-btn flat label="Назад к списку" icon="arrow_back" to="/employees" class="q-mb-md" />
    
    <q-card>
      <q-card-section>
        <div class="text-h6">История изменений сотрудника</div>
      </q-card-section>
      
      <q-separator />

      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { Notify } from 'quasar';

const route = useRoute();
const rows = ref([]);
const loading = ref(false);

const columns = [
  { name: 'created_at', label: 'Дата', field: 'created_at', sortable: true },
  { name: 'user_id', label: 'ID Пользователя', field: 'user_id' },
  { name: 'field_name', label: 'Поле', field: 'field_name' },
  { name: 'old_value', label: 'Старое значение', field: 'old_value' },
  { name: 'new_value', label: 'Новое значение', field: 'new_value' },
];

onMounted(async () => {
  loading.value = true;
  try {
    // Получаем ID сотрудника из URL
    const employeeId = route.params.id;
    const res = await api.get(`/change_history`, { 
      params: { type: 'employee', id: employeeId } 
    });
    rows.value = res.data;
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Ошибка загрузки истории' });
  } finally {
    loading.value = false;
  }
});
</script>
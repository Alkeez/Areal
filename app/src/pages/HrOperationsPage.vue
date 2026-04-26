<template>
  <q-page padding>
    <q-btn label="Добавить операцию" color="primary" @click="openDialog()" class="q-mb-md"/>

    <q-table
      title="Кадровые операции"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round icon="delete" color="red" @click="deleteItem(props.row.id)"/>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Новая операция</div>
        </q-card-section>

        <q-card-section>
          <q-select 
            v-model="form.employee_id" 
            :options="employeeOptions" 
            label="Сотрудник" 
            emit-value 
            map-options 
            dense 
            outlined 
            class="q-mb-md"
          />
          <q-select 
            v-model="form.operation_type" 
            :options="typeOptions" 
            label="Тип операции" 
            emit-value 
            map-options 
            dense 
            outlined 
            class="q-mb-md"
          />
          
          <!-- Показываем поля в зависимости от типа -->
          <template v-if="form.operation_type === 'hiring' || form.operation_type === 'department_change'">
             <q-select 
                v-model="form.department_id" 
                :options="departmentOptions" 
                label="Отдел" 
                emit-value 
                map-options 
                dense 
                outlined 
                class="q-mb-md"
              />
          </template>

          <template v-if="form.operation_type === 'hiring' || form.operation_type === 'position_change'">
              <q-select 
                v-model="form.position_id" 
                :options="positionOptions" 
                label="Должность" 
                emit-value 
                map-options 
                dense 
                outlined 
                class="q-mb-md"
              />
          </template>

          <template v-if="['hiring', 'salary_change'].includes(form.operation_type)">
              <q-input 
                v-model.number="form.salary" 
                label="Зарплата" 
                type="number" 
                dense 
                outlined 
                class="q-mb-md"
              />
          </template>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Создать" color="primary" @click="saveItem"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
const dialog = ref(false);
const form = ref<any>({ id: null, employee_id: null, operation_type: 'hiring', department_id: null, position_id: null, salary: null });

// Опции для селектов
const employeeOptions = ref([]);
const departmentOptions = ref([]);
const positionOptions = ref([]);

const typeOptions = [
    { label: 'Прием на работу', value: 'hiring' },
    { label: 'Изменение зарплаты', value: 'salary_change' },
    { label: 'Перевод в отдел', value: 'department_change' },
    { label: 'Увольнение', value: 'firing' }
];

const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'employee_id', label: 'ID Сотр.', field: 'employee_id' },
  { name: 'operation_type', label: 'Тип', field: 'operation_type' },
  { name: 'salary', label: 'Зарплата', field: 'salary' },
  { name: 'created_at', label: 'Дата', field: 'created_at' },
  { name: 'actions', label: 'Действия' }
];

onMounted(async () => {
    await fetchData();
    await loadOptions();
    
    // Если пришли по ссылке "Кадровые операции" из профиля сотрудника
    if (route.query.employee_id) {
        form.value.employee_id = parseInt(route.query.employee_id as string);
        dialog.value = true;
    }
});

async function fetchData() {
  loading.value = true;
  try { 
    const res = await api.get('/hr_operations'); 
    rows.value = res.data; 
  } catch (e) { Notify.create({ type: 'negative', message: 'Ошибка' }); }
  finally { loading.value = false; }
}

async function loadOptions() {
    try {
        const [empRes, deptRes, posRes] = await Promise.all([
            api.get('/employees'),
            api.get('/departments'),
            api.get('/positions')
        ]);
        employeeOptions.value = empRes.data.map((e: any) => ({ label: `${e.surname} ${e.first_name}`, value: e.id }));
        departmentOptions.value = deptRes.data.map((d: any) => ({ label: d.name, value: d.id }));
        positionOptions.value = posRes.data.map((p: any) => ({ label: p.name, value: p.id }));
    } catch (e) {}
}

function openDialog() {
    form.value = { id: null, employee_id: null, operation_type: 'hiring', department_id: null, position_id: null, salary: null };
    dialog.value = true;
}

async function saveItem() {
    try {
        const { id, ...data } = form.value;
        await api.post('/hr_operations', data);
        dialog.value = false;
        fetchData();
        Notify.create({ type: 'positive', message: 'Операция создана' });
    } catch (e) {
        Notify.create({ type: 'negative', message: 'Ошибка' });
    }
}

async function deleteItem(id: number) {
    if (!confirm('Отменить операцию?')) return;
    try {
        await api.delete(`/hr_operations/${id}`);
        fetchData();
    } catch (e) {}
}
</script>
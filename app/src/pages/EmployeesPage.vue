<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <q-btn label="Добавить сотрудника" color="primary" @click="openDialog()" />
      </div>
      <div class="col-auto">
        <q-input v-model="search" dense outlined placeholder="Поиск по ФИО" @keyup.enter="fetchData" class="q-ml-md">
          <template v-slot:append>
            <q-icon name="search" @click="fetchData" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      title="Сотрудники"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-passport="props">
        <q-td :props="props">
          {{ props.row.passport_series }} {{ props.row.passport_number }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat round icon="edit" color="blue" @click="openDialog(props.row)"/>
          <q-btn dense flat round icon="delete" color="red" @click="deleteItem(props.row.id)"/>
          <q-btn dense flat round icon="history" color="purple" :to="`/employees/${props.row.id}/history`" class="q-ml-sm">
            <q-tooltip>История</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon="work" color="green" :to="`/hr?employee_id=${props.row.id}`" class="q-ml-sm">
             <q-tooltip>Кадровые операции</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Диалог создания/редактирования -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 800px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Редактировать' : 'Создать' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle2 text-blue q-mb-sm">Личные данные</div>
          <div class="row q-col-gutter-sm">
            <div class="col-4"><q-input v-model="form.surname" label="Фамилия" dense outlined /></div>
            <div class="col-4"><q-input v-model="form.first_name" label="Имя" dense outlined /></div>
            <div class="col-4"><q-input v-model="form.patronymic" label="Отчество" dense outlined /></div>
            <div class="col-4"><q-input v-model="form.birth_date" label="Дата рождения" type="date" dense outlined /></div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-blue q-mb-sm">Паспортные данные</div>
          <div class="row q-col-gutter-sm">
            <div class="col-3"><q-input v-model="form.passport_series" label="Серия" dense outlined /></div>
            <div class="col-3"><q-input v-model="form.passport_number" label="Номер" dense outlined /></div>
            <div class="col-3"><q-input v-model="form.passport_issue_date" label="Дата выдачи" type="date" dense outlined /></div>
            <div class="col-3"><q-input v-model="form.passport_div_code" label="Код подразделения" dense outlined /></div>
            <div class="col-12"><q-input v-model="form.passport_issued_by" label="Кем выдан" dense outlined /></div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-blue q-mb-sm">Адрес регистрации</div>
          <div class="row q-col-gutter-sm">
            <div class="col-4"><q-input v-model="form.reg_region" label="Область" dense outlined /></div>
            <div class="col-4"><q-input v-model="form.reg_city" label="Населенный пункт" dense outlined /></div>
            <div class="col-4"><q-input v-model="form.reg_street" label="Улица" dense outlined /></div>
            <div class="col-2"><q-input v-model="form.reg_house" label="Дом" dense outlined /></div>
            <div class="col-2"><q-input v-model="form.reg_building" label="Корпус" dense outlined /></div>
            <div class="col-2"><q-input v-model="form.reg_apartment" label="Квартира" dense outlined /></div>
          </div>

          <!-- Секция файлов (только для редактирования) -->
          <template v-if="form.id">
            <q-separator class="q-my-md" />
            <div class="text-subtitle2 text-blue q-mb-sm">Сканы паспорта</div>
            
            <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col-6">
                    <q-input v-model="newFileName" label="Имя файла" dense outlined />
                </div>
                <div class="col-6">
                    <q-input v-model="newFilePath" label="Путь к файлу (URL)" dense outlined hint="В реальном проекте здесь будет загрузка файла" />
                </div>
            </div>
            <q-btn label="Добавить файл" size="sm" color="secondary" @click="addFile" class="q-mb-md"/>

            <q-list bordered separator v-if="files.length > 0">
                <q-item v-for="file in files" :key="file.id">
                    <q-item-section>
                        <q-item-label>{{ file.name }}</q-item-label>
                        <q-item-label caption>{{ file.path }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn flat round icon="delete" color="red" size="sm" @click="deleteFile(file.id)"/>
                    </q-item-section>
                </q-item>
            </q-list>
          </template>

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
import { Notify } from 'quasar';

const rows = ref([]);
const loading = ref(false);
const dialog = ref(false);
const search = ref('');
const files = ref<any[]>([]); // Для списка файлов сотрудника
const newFileName = ref('');
const newFilePath = ref('');

// Шаблон формы со всеми полями
const emptyForm = {
  id: null, surname: '', first_name: '', patronymic: '', birth_date: null,
  passport_series: '', passport_number: '', passport_issue_date: null, passport_div_code: '', passport_issued_by: '',
  reg_region: '', reg_city: '', reg_street: '', reg_house: '', reg_building: '', reg_apartment: ''
};

const form = ref<any>({ ...emptyForm });

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'surname', label: 'Фамилия', field: 'surname', sortable: true },
  { name: 'first_name', label: 'Имя', field: 'first_name', sortable: true },
  { name: 'passport', label: 'Паспорт', field: 'passport_number' },
  { name: 'actions', label: 'Действия', field: 'actions' }
];

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  try {
    const res = await api.get('/employees', { params: { search: search.value } });
    rows.value = res.data;
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Ошибка' });
  } finally {
    loading.value = false;
  }
}

async function openDialog(row: any = null) {
  if (row) {
    form.value = { ...row };
    // Загружаем файлы для сотрудника
    const resFiles = await api.get(`/files?employee_id=${row.id}`);
    files.value = resFiles.data;
  } else {
    form.value = { ...emptyForm };
    files.value = [];
  }
  dialog.value = true;
}

async function saveItem() {
  try {
    const { id, created_at, updated_at, deleted_at, ...data } = form.value;
    if (id) {
      await api.put(`/employees/${id}`, data);
    } else {
      await api.post('/employees', data);
    }
    dialog.value = false;
    fetchData();
    Notify.create({ type: 'positive', message: 'Сохранено' });
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Ошибка' });
  }
}

async function deleteItem(id: number) {
  if (!confirm('Уволить сотрудника?')) return;
  try {
    await api.delete(`/employees/${id}`);
    fetchData();
    Notify.create({ type: 'info', message: 'Сотрудник уволен' });
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Ошибка' });
  }
}

// Работа с файлами
async function addFile() {
    if (!newFileName.value || !newFilePath.value) return;
    try {
        await api.post('/files', {
            employee_id: form.value.id,
            name: newFileName.value,
            path: newFilePath.value
        });
        newFileName.value = '';
        newFilePath.value = '';
        // Обновляем список файлов
        const resFiles = await api.get(`/files?employee_id=${form.value.id}`);
        files.value = resFiles.data;
    } catch (e) {
        Notify.create({ type: 'negative', message: 'Ошибка добавления файла' });
    }
}

async function deleteFile(id: number) {
    try {
        await api.delete(`/files/${id}`);
        files.value = files.value.filter(f => f.id !== id);
    } catch (e) {
        Notify.create({ type: 'negative', message: 'Ошибка удаления файла' });
    }
}
</script>
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('change_history', {
    id:             'id',
    user_id:        { type: 'integer', references: 'users(id)' }, // Кто изменил (пока может быть null)
    entity_type:    { type: 'varchar(50)', notNull: true }, // Название таблицы
    entity_id:      { type: 'integer', notNull: true }, // ID записи
    field_name:     { type: 'varchar(100)', notNull: true }, // Какое поле
    old_value:      { type: 'text' },
    new_value:      { type: 'text' },
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('change_history');
};
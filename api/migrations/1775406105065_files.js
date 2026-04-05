exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('files', {
    id:             'id',
    employee_id:    { type: 'integer', references: 'employees(id)', notNull: true },
    name:           { type: 'varchar(255)', notNull: true },
    path:           { type: 'varchar(255)', notNull: true },
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('files');
};
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('departments', {
    id:             'id',
    organization_id: { type: 'integer', references: 'organizations(id)', notNull: true },
    parent_id:      { type: 'integer', references: 'departments(id)' }, // Ссылка на себя
    name:           { type: 'varchar(255)', notNull: true },
    comment:        { type: 'text' },
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('departments');
};
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('organizations', {
    id:             'id', // Serial PK
    name:           { type: 'varchar(255)', notNull: true },
    comment:        { type: 'text' },
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('organizations');
};
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id:             'id',
    surname:        { type: 'varchar(100)', notNull: true },
    first_name:     { type: 'varchar(100)', notNull: true },
    patronymic:     { type: 'varchar(100)' },
    login:          { type: 'varchar(50)', notNull: true, unique: true },
    password:       { type: 'varchar(255)', notNull: true }, // Хеш пароля
    role:           { type: 'varchar(20)', notNull: true, default: 'hr_manager' }, // admin, hr_manager
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
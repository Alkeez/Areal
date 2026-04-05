exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('employees', {
    id:             'id',
    surname:        { type: 'varchar(100)', notNull: true },
    first_name:     { type: 'varchar(100)', notNull: true },
    patronymic:     { type: 'varchar(100)' },
    birth_date:     { type: 'date' },
    
    // Паспортные данные
    passport_series:    { type: 'varchar(10)' },
    passport_number:    { type: 'varchar(10)' },
    passport_issue_date:{ type: 'date' },
    passport_div_code:  { type: 'varchar(10)' },
    passport_issued_by: { type: 'varchar(255)' },

    // Адрес регистрации
    reg_region:     { type: 'varchar(100)' },
    reg_city:       { type: 'varchar(100)' },
    reg_street:     { type: 'varchar(100)' },
    reg_house:      { type: 'varchar(10)' },
    reg_building:   { type: 'varchar(10)' },
    reg_apartment:  { type: 'varchar(10)' },

    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('employees');
};
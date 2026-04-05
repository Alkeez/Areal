exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('hr_operations', {
    id:             'id',
    employee_id:    { type: 'integer', references: 'employees(id)', notNull: true },
    operation_type: { type: 'varchar(50)', notNull: true }, // hiring, salary_change, department_change, firing
    department_id:  { type: 'integer', references: 'departments(id)' },
    position_id:    { type: 'integer', references: 'positions(id)' },
    salary:         { type: 'decimal(10, 2)' },
    
    created_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at:     { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at:     { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('hr_operations');
};
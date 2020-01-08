
exports.up = function (knex) {
	return knex.schema.createTable('tasks', table => {
		table.increments('id').primary()
		table.string('subject').notNull()
		table.string('priority').notNull()
		table.string('description').notNull()
		table.datetime('estimateAt')
		table.datetime('estimateAtTime')
		table.datetime('doneAt')
		table.integer('userId').references('id')
			.inTable('users').notNull()
	})
};

exports.down = function (knex) {
	return knex.schema.dropTable('tasks')
};

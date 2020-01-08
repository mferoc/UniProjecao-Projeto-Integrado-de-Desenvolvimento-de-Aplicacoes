const { database, user, password } = require('./.env')

module.exports = {

	client: 'postgresql',
	connection: {
		database,
		user,
		password
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};

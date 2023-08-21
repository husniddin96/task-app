/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.integer('order_id').notNullable();
        table.enu('status', ['todo', 'in-progress', 'done']);
        table.integer('story_points');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.boolean('soft_delete').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('tasks');
};

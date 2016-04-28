exports.up = function(knex, Promise) {
console.log('create table')

  return knex.schema.createTableIfNotExists('Cats', function(table) {
    table.increments('id');
    table.string('hashed_password');
    table.string('userName');
    table.string('email');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cats').then(function () {
    console.log('cats table was dropped')
  })
};

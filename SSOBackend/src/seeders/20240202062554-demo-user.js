'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('User', [
      {
        email: 'John Doe 1',
        password: '123',
        username: 'fakeuser1',
      }, {
        email: 'John Doe 2',
        password: '123',
        username: 'fakeuser2',
      }, {
        email: 'John Doe 3',
        password: '123',
        username: 'fakeuser3',
      },], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

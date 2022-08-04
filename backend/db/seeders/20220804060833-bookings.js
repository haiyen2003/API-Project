'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 4,
        userId: 1,
        // startDate: 2023-04-10,
        // endDate: 2023-04-17
      },
      {
        spotId: 5,
        userId: 2,
        // startDate: 2023-02-17,
        // endDate: 2023-02-30
      },
      {
        spotId: 6,
        userId: 3,
        // startDate: 2023-01-17,
        // endDate: 2023-01-20
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Bookings', {
      where: { id: booking.map(booking => booking.id) }
    }, {});
  }
};

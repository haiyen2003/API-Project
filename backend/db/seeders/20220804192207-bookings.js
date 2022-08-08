'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 2,
        userId: 1,
        startDate: new Date("2023-04-10"),
        endDate: new Date("2023-04-17")
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date("2023-07-17"),
        endDate: new Date("2023-07-30")
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date("2023-01-17"),
        endDate: new Date("2023-01-20")
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date("2023-01-27"),
        endDate: new Date("2023-01-30")
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

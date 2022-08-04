'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        review: 'this place is great',
        stars: 4,
        spotId: 2,
        userId: 5
      },
      {
        review: 'this place is amazing',
        stars: 5,
        spotId: 1,
        userId: 4
      },
      {
        review: 'this place is shit',
        stars: 3,
        spotId: 3,
        userId: 6
      }
    ], {})

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', {
      where: { id: review.map(review => review.id) }
    }, {});
  }
};

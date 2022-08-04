'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', [
      {
        url: 'www.url1.com',
        previewImage: true,
        spotId: 1,
        reviewId: 1,
        userId: 4
      },
      {
        url: 'www.url2.com',
        previewImage: false,
        spotId: 2,
        reviewId: 2,
        userId: 5
      },
      {
        url: 'www.url3.com',
        previewImage: true,
        spotId: 3,
        reviewId: 3,
        userId: 6
      }
    ], {})

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', {
      where: { id: image.map(image => image.id) }
    }, {});
  }
}

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '905 Jefferson st',
        city: 'Oakland',
        state: 'CA',
        country: 'USA',
        lat: 0.125,
        lng: 0.5,
        name: 'the Castle',
        description: 'nice view, 2b2b',
        price: 1800
      },
      {
        ownerId: 2,
        address: '1444 Leavenworth st',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 0.115,
        lng: 0.5,
        name: 'NobHill house',
        description: 'good location, 3b1b',
        price: 1800
      },
      {
        ownerId: 3,
        address: '888 Ofarrell st',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 0.115,
        lng: 0.3,
        name: 'Potato Farm',
        description: 'good location, great view, 2b1b',
        price: 2500
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {

     const Op = Sequelize.Op;
     return queryInterface.bulkDelete('Spots', {
       name: { [Op.in]: ['NobHill house', 'the Castle', 'Potato Farm'] }
     }, {});
  }
};

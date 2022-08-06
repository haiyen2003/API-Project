const express = require('express');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { Booking } = require('../../db/models');
const { Image } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');

//get all the Spots
router.get('/', async (req, res, next) => {

    const allSpots = await Spot.findAll({
        order: [['name', 'ASC']]
    });
    return res.json(allSpots);
}
);

//get all the Spots by currentUser

router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const currSpot = await Spot.findAll({
            where: { ownerId: user.id }
        });
        return res.json(currSpot);
    }
});

//get details of a spot from an Id
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId;

    const currSpot = await Spot.findByPk(id);
    if(!currSpot){
        const err = new Error('This spot doesnot exist.');
        err.status = 404;
        err.error = ['Please type in valid spot number'];
        return next(err);
    }
    return res.json(currSpot);
});

//get Review by Spot Id
router.get('/:spotId/reviews', async (req, res, next) => {
    const id = req.params.spotId;
    const currSpot = await Spot.findByPk(id);
   const review = await Review.findAll({
    where: { spotId: id},
    include: Spot
   });
   if(!currSpot){
    const err = new Error('This spot doesnot exist.');
    err.status = 404;
    err.error = ['Please type in valid spot number'];
    return next(err);
}
   return res.json(review);
});

// get all Bookings for a Spot based on the Spot's Id - why this one show an empty array?
router.get('/:spotId/bookings', async(req, res, next) => {
    const id = req.params.spotId;
    const booking = await Booking.findAll({
        where: {spotId: id}
    })

    if(!id){
        const err = new Error('This spot doesnot exist.');
        err.status = 404;
        err.error = ['Please type in valid spot number'];
        return next(err);
    }
    return res.json(booking);
})

//Create and return a new spot - fixed ownerId allowNull: true
router.post('/',requireAuth, async (req, res, next) => {
    const { address, city, state, country,lat,lng,name,description,price } = req.body;
    const newSpot = await Spot.create(
        {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }
    );
    res.json(newSpot);
});

//Add an image to a spot based on the spot's Id:

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, previewImage } = req.body;
   const {spotId} = req.params;

   //console.log(spotId, '-------SPOTID-------');
    const thisSpot = await Spot.findByPk(spotId);
   // console.log(thisSpot, '//// thisSpot ////');
    if(!thisSpot){
        const err = new Error('This spot doesnot exist.');
        err.status = 404;
        err.error = ['Please type in valid spot number'];
        return next(err);
    }
    const newImage = await Image.create(
        {
          url: url,
          spotId: spotId,
          previewImage: previewImage
        }
    );
    return res.json({
        'id': newImage.id,
        'imageableId': newImage.spotId,
        'url': newImage.url
    });
});

//create and return a new review for a spot by id

router.post('/:spotId/review', requireAuth, async (req, res, next) => {
    const {spotId} = req.params;
    const {review, stars} = req.body;

    const thisSpot = await Spot.findByPk(spotId);
     if(!thisSpot){
         const err = new Error('This spot doesnot exist.');
         err.status = 404;
         err.error = ['Please type in valid spot number'];
         return next(err);
     }

     const newReview = await Review.create({
       review: review,
       stars: stars
     });
     return res.json({
        'review' : newReview.review,
        'stars': newReview.stars
     })
})

module.exports = router;

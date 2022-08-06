const express = require('express');
const { Review } = require('../../db/models');
const { User } = require('../../db/models');
const { Image } = require('../../db/models');
const review = require('../../db/models/review');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');

//get all the Review by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const {user} = req;
    if(user){
        const currReview = await Review.findAll({
            where: {userId: user.id},
            include: [{model: User}]
        });
        return res.json(currReview);
    }
}
);

//create and return a new image for a review by ID

router.post('/:reviewId/images', requireAuth, async(req, res, next) =>{
    const {reviewId} = req.params;
    const {url, previewImage} = req.body;

    const thisReview = await Review.findByPk(reviewId);
    if(!thisReview){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    };

    const thisReviewImages = await Image.findAll({
        where: {
            spotId: thisReview.spotId
        }
    })
    if(thisReviewImages.length >10){
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        return next(err);
    }

    const newImage = await Image.create({
        url: url,
        userId: req.user.id,
        spotId: thisReview.spotId,
        reviewId: reviewId,
        previewImage: previewImage
    });
    res.status(201);
    return res.json({
        'id': newImage.id,
        'imageableId': newImage.spotId,
        'url': newImage.url
    })
})

module.exports = router;

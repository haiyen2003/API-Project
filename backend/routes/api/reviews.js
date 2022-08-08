const express = require('express');
const { Review } = require('../../db/models');
const { User } = require('../../db/models');
const { Image } = require('../../db/models');
const review = require('../../db/models/review');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

//validate reviews

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//get all the Review by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const currReview = await Review.findAll({
            where: { userId: user.id },
            include: [{ model: User }]
        });
        return res.json(currReview);
    }
}
);

//create and return a new image for a review by ID

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url, previewImage } = req.body;

    const thisReview = await Review.findByPk(reviewId);
    if (!thisReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    };

    const thisReviewImages = await Image.findAll({
        where: {
            spotId: thisReview.spotId
        }
    })
    if (thisReviewImages.length > 10) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        return next(err);
    }

    const newImage = await Image.create({
        url: url,
        spotId: thisReview.spotId,
        reviewId: reviewId,
        previewImage: previewImage
    });

    return res.json({
        'id': newImage.id,
        'imageableId': newImage.spotId,
        'url': newImage.url
    })
})

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const { user } = req;

    const thisReview = await Review.findByPk(reviewId);
    if (!thisReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }
    //check current user
    else if (thisReview.userId !== user.id) {
        const err = new Error("Cannot edit Review! Review must belong to current user.");
        err.status = 403;
        return next(err);
    }
    else {
        thisReview.review = review;
        thisReview.stars = stars;
        await thisReview.save();
        return res.json(thisReview);
    }
})

//delete a review

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const thisReview = await Review.findByPk(reviewId);
    const { user } = req;
    if (!thisReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }
   else if (thisReview.userId !== user.id) {
        const err = new Error("Cannot delete Review! Review must belong to current user.");
        err.status = 403;
        return next(err);
    }
    else {
        await thisReview.destroy();
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });
    };
});

module.exports = router;

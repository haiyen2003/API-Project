const express = require('express');
const { Review } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const { User } = require('../../db/models');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');

//get all the Review by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const {user} = req;
    if(user){
        const currReview = await Review.findAll({
            where: {userId: user.id}
        });
        return res.json(currReview);
    }
}
);

module.exports = router;

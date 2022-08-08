const express = require('express');
const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');


//get all the Booking by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const {user} = req;
    if(user){
        const currBooking = await Booking.findAll({
            where: {userId: user.id},
            include: {
                model: Spot,
                attribute: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        });
        return res.json(currBooking);
    }
} //this one did show result before but now It doesnot show result anymore.
);
//
module.exports = router;

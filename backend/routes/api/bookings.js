const express = require('express');
const { Booking } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');


//get all the Booking by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const {user} = req;
    if(user){
        const currBooking = await Booking.findAll({
            where: {userId: user.id}
        });
        return res.json(currBooking);
    }
}
);

module.exports = router;

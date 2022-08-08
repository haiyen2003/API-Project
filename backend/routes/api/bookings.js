const express = require('express');
const { HostNotFoundError } = require('sequelize/types');
const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//const spot = require('../../db/models/spot');
const router = express.Router();
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');


//get all the Booking by current User
router.get('/current', restoreUser, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const currBooking = await Booking.findAll({
            where: { userId: user.id },
            include: {
                model: Spot,
                attribute: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        });
        return res.json(currBooking);
    }
}
);
// Edit a booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;
    let { startDate, endDate } = req.body;
    const { user } = req;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const today = new Date();

    let thisBooking = await Booking.findByPk(bookingId);
    //check if booking exist
    if (!thisBooking) {
        const err = new Error("Booking couldn't be found.");
        err.status = 404;
        return next(err);
    }
    //check current user
    if (thisBooking.userId !== user.id) {
        const err = new Error("Cannot edit booking! Booking must belong to current user.");
        err.status = 403;
        return next(err);
    }
    if (thisBooking.endDate < today) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    }
    //Body validation error
    if (startDate >= endDate) {
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        })
    }
    //edit booking
    const thisBookings = await Booking.findAll({
        where: {
            spotId: thisBooking.spotId,
            [Op.and]: [
                { startDate: { [Op.lte]: endDate } },
                { endDate: { [Op.gte]: startDate } }
            ]
        }
    })
    //check valid new endDate - startDate
    for (let booking of thisBookings) {
        if (startDate >= booking.startDate && startDate <= booking.endDate) {
            res.status(403);
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking"
                }
            })
        }
        else if(endDate <= booking.endDate && endDate >= booking.startDate){
            res.status(403);
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    }

    thisBooking.startDate = startDate;
    thisBooking.endDate = endDate;
    await thisBooking.save();
    return res.json(thisBooking);

})
module.exports = router;

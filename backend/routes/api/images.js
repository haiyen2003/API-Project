const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Image } = require('../../db/models');
const router = express.Router();

//Delete and image

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const thisImage = await Image.findByPk(imageId);
    const { user } = req;

    if (!thisImage) {
        const err = new Error("Image couldn't be found");
        err.status = 404;
        return next(err);
    }
    //check current user
    if (thisImage.userId !== user.id) {
        const err = new Error('Cannot delete this image. Image must belong to current user');
        err.status = 403;
        return next(err);
    }
    else {
        await thisImage.destroy();
        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });
    }
})

module.exports = router;

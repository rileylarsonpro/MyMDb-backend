const { sanitizeHTML } = require('../utils/functions');

exports.sanitizeBioHTML = (req, res, next) => {
    req.body.bio = sanitizeHTML(req.body.bio);
    next();
}

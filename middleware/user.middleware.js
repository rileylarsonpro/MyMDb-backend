const sanitizeHtml = require('sanitize-html');
const sanitizeHtmlOptions = {
    allowedTags: [ 'p', 'br', 'strong', 'em', 'strong', 'u', 'ol', 'ul', 'li', 'a' ],
    allowedAttributes: {
      'a': [ 'href', 'rel' ]
    },
};

exports.sanitizeBioHTML = (req, res, next) => {
    if (req.body.bio && req.body.bio.match(/^(<p>|<\/p>|<br>|\s)*$/)) {
        req.body.bio = '';
    }
    req.body.bio = sanitizeHtml(req.body.bio, sanitizeHtmlOptions);
    next();
}

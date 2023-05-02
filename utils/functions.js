const sanitizeHtml = require('sanitize-html');

const sanitizeHtmlOptions = {
    allowedTags: [ 'p', 'br', 'strong', 'em', 'strong', 'u', 'ol', 'ul', 'li', 'a' ],
    allowedAttributes: {
      'a': [ 'href', 'rel' ]
    },
};

exports.sanitizeHTML = (html) => {
    // if html is undefined set it to an empty string
    if (!html) return "";
    // if htm is not a string set it to an empty string
    if (typeof html !== "string") html = "";
    // if html is exclusively a combination of <p> or </p> or <br> tags set it to an empty string
    if (html.match(/^(<p>|<\/p>|<br>|\s)*$/)) return "";
    // sanitize html and return it
    return sanitizeHtml(html, sanitizeHtmlOptions);
}



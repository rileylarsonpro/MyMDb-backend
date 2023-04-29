const db = require('../config/db.connect');

const User = require('../models/user.model');


(async () => {
    await User.updateMany({profilePicture: {$exists: false} }, { $set: { profilePicture: '' } });

    let users = await User.find();
    for(let user of users) {
        await User.findByIdAndUpdate(user._id, { displayName: user.username });
    }

    db.close(() => console.log("Database closed"));
})();
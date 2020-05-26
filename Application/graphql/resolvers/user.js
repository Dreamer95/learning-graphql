const User = require('../../models/user');

const users = async () => {
    try {
        const users = await User.find();
        console.log(users)
        return users.map(user => {
            return {
                ...user._doc,
                _id: user.id,
                password: null
            };
        });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    users
}
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            _id: false
        }
    ]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
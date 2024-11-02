const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const Wishlist = require('../models/wishlist');


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        // console.log(products);
        res.json(products);
    } catch (err) {
        console.error("Error fetching products", err);
        res.status(500).json({'message' : 'Error fetching products', err});
    }
});


router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

router.get('/cart', async (req, res) =>  {
    try {
        const cart = await Cart.findOne();
        if (!cart) return res.status(404).json({'message' : 'Cart not found'});
        res.json(cart);
    } catch (err) {
        res.status(500).json({'message' : 'Error fetching cart', err});
    }
});

router.post('/cart', async (req, res) => {
    const {productId, quantity} = req.body;
    try {
        let cart = await Cart.findOne();
        if (!cart) cart = new Cart({items : []});

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (productIndex!== -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({productId, quantity});
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Error adding to cart', err});
    }
});

router.get('/wishlist', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne().populate('items.productId'); 
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
        res.json(wishlist);
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        res.status(500).json({ message: 'Error fetching wishlist', err });
    }
});

router.post('/wishlist', async (req, res) => {
    const { productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne();
        if (!wishlist) wishlist = new Wishlist({ items: [] });

        // Check if product already exists in the wishlist
        const productExists = wishlist.items.some(item => item.productId.toString() === productId);
        if (!productExists) {
            wishlist.items.push({ productId });
            await wishlist.save();
        }

        res.json(wishlist);
    } catch (err) {
        console.error('Error adding to wishlist:', err);
        res.status(500).json({ message: 'Error adding to wishlist', err });
    }
});


router.delete('/wishlist/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        let wishlist = await Wishlist.findOne();
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
        wishlist.items = wishlist.items.filter(item => item.productId && item.productId._id.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    } catch (err) {
        console.error('Error removing from wishlist:', err);
        res.status(500).json({ message: 'Error removing from wishlist', err });
    }
});



module.exports = router;
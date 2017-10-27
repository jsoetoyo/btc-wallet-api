const crypto = require('crypto');
const MyWallet = require('blockchain.info/MyWallet');
const User = require('../models/schemas/user');
const Wallet = require('../models/schemas/wallet');
const config = require('../models/config');

exports.getUserById = (req, res, next) => {
    if (req.user)
        var payload = {
            "email": req.user.email,
            "id": req.user.id
        };
    if (!req.id)
        return res.status(403).send('missing user ID');
    User.findById(req.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(403).send('Invalid user ID');
        var payload = {
            "email": user.email,
            "id": user.id
        };
        res.json(payload);
    });

};

exports.createUser = (req, res, next) => {
    var userData = {};
    
    // validate email
    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }
    
    // check if password was provided
    if (req.body.password)
        userData.hash = req.body.password;
    if (req.body.hash)
        userData.hash = req.body.hash;

    var user_id = undefined;

    // create new user
    var newUser = new User(userData);
    newUser.save((err, user) => {
        if (err) {
            if (err.code === 11000)
                return res.status(400).send('Email already registered');    
            return next(err);
        }
        user_id = user.id;

        // generate random password for wallet
        var pswd = crypto.randomBytes(64).toString('hex');

        // Generate new BTC wallet
        var options = {
            'apiHost': config.apiHost,
            'email': req.body.email,
            'hd': true
        };
        
        MyWallet.create(pswd, config.bc_code, options).then((wallet) => {
            if (!wallet.guid) {
                return res.status(400).send('Failed to create wallet'); 
            }
            var walletData = {
                user_id: user_id,
                wallet_id: wallet.guid,
                password: pswd,
                currency: 'BTC'
            };
            
            // save wallet
            var newWallet = new Wallet(walletData);
            newWallet.save((err, wallet) => {
                if (err) {
                    return next(err);
                }
                return res.sendStatus(200);
            });
        });
    });
};

exports.updateUser = (req, res, next) => {
    User.findOneAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.sendStatus(200);
    });
};

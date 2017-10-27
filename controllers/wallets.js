const MyWallet = require('blockchain.info/MyWallet');
const Wallet = require('../models/schemas/wallet');
const config = require('../models/config');

// Returns all the wallets associated with the given user
exports.getWalletsByUserId = (req, res, next) => {
    if (!req.id)
        return res.status(403).send('Not logged in!');
    Wallet.find({'user_id': req.id}).exec((err, wallets) => {
        if (err)
            return res.status(400).send('No wallets found');
        var user_wallets = [];
        var promises = [];
        // For each wallet associated with user, get the balance
        var bc_options = {
            'apiCode': config.bc_code,
            'apiHost': config.apiHost
        };
        wallets.forEach((wallet) => {
            if (wallet.currency == "BTC") {
                // get the current wallet
                var btc_wallet = new MyWallet(wallet.wallet_id, wallet.password, bc_options);
                if (btc_wallet) {
                    var promise = new Promise((resolve, reject) => {
                        // get the balance on the wallet
                        btc_wallet.getBalance().then((resp) => {
                            // add the wallet to the list of wallets to return
                            user_wallets.push({
                                'id': wallet.wallet_id,
                                'currency': wallet.currency,
                                'balance': resp.balance,
                                'unit': 'satoshis'
                            });
                            resolve();
                        });
                    });
                    promises.push(promise);
                }
           }
        });
        
        Promise.all(promises).then(() => {res.json({'wallets': user_wallets});});
    });
};

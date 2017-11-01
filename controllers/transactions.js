const Transaction = require('../models/schemas/transaction');
const Wallet = require('../models/schemas/wallet');

exports.getTransactionsByWalletId = (req, res, next) => {
    // get the wallet
    Wallet.
        find({'wallet_id': req.params.wallet_id}).
        select('user_id').
        exec((err, resp) => {
            if (err || resp.length == 0)
                return res.json([]);
            wallet = resp[0];

            // make sure the wallet belongs to the logged in user
            if (wallet.user_id != req.id)
                return res.json([]);

            // get the transactions 
            Transaction.
                find({'wallet_id': req.params.wallet_id}).
                exec((err, resp) => {
                   if (err || resp.length == 0)
                        return res.json([]);
                    payload = [];
                    resp.forEach((tx) => {
                        payload.push({
                            'to': tx.to,
                            'from': tx.from,
                            'currency': tx.currency,
                            'unit': tx.unit,
                            'amount': tx.amount,
                            'fee': tx.fee,
                            'tx_hash': tx.tx_hash
                        });
                    });
                    return res.json(payload);
            });
    });
}

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
        wallet_id: {type: String, unique: true},
        to: String,
        from: String,
        amount: String,
        fee: String,
        tx_hash: String,
        currency: String,
        unit: String
    },
    {
        toObject: { getters: true },
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        },
    }
);

transactionSchema.pre('save', function(callback) {
    if (!this.wallet_id)
        return callback(new Error('Missing wallet id'));
    if (!this.to)
        return callback(new Error('Missing to address'));
    if (!this.from)
        return callback(new Error('Missing from address'));
    if (!this.amount)
        return callback(new Error('Missing amount'));
    if (!this.tx_hash)
        return callback(new Error('Missing transaction hash'));
    if (!this.tx_hash)
        return callback(new Error('Missing transaction hash'));
    if (!this.currency)
        return callback(new Error('Missing currency'));
    if (!this.unit)
        return callback(new Error('Missing unit'));
    if (!this.fee)
        this.fee = 0;
    callback();
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

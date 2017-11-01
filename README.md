# btc-wallet-api
Backend for btc-wallet


## Creating a new user:
```
/users POST
body:
    email
    password
    phone
    first_name
    last_name
returns:
    nothing 
```

## Logging in:
```
/auth/token POST
body:
    email
    password
Returns
    token <string>
```

## Getting wallets:
```
/wallets GET
body:
    token (can also be in the header as 'x-access-token')
returns:
    wallets: [
    {
            'id': 1
            'currency': 'BTC', 
            'balance': 100,
            'unit': 'satoshis'
        }, 
        {
            'id': 313215
            'currency': 'BTC',
            'balance': 213120,
            'unit': 'satoshis'
        }
    ]
```

## Getting a new address:
```
/wallets/<wallet_id>/address POST
body:
    token (can also be in the header as 'x-access-token')
returns:
    {
        'address': <address>
    }
```

## Making a new transaction:
```
/wallet/<wallet_id>/transaction POST
body:
    address <to address>
    amount
    currency ('BTC')
returns:
    {
        'to': <to>,
        'from': <from>,
        'currency': 'BTC',
        'unit': 'satoshis',
        'amount': <amount>,
        'fee': <fee>,
        'tx_hash': <tx_hash>
    }
```

## Getting all outgoing transaction for a wallet:
```
/wallets/<wallet_id>/transaction GET
returns:
    [
        {
            'to': <to>,
            'from': <from>,
            'currency': 'BTC',
            'unit': 'satoshis',
            'amount': <amount>,
            'fee': <fee>,
            'tx_hash': <tx_hash>
        },{
            ...
        }
    ]
```

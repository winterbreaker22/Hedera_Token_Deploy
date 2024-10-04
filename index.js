require('dotenv').config();
const {
    Hbar,
    Client,
    AccountId,
    PrivateKey,
    TokenCreateTransaction
} = require('@hashgraph/sdk');

const environmentSetup = async () => {
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if(!myAccountId || !myPrivateKey) throw new Error("Account Failed");

    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(myAccountId), PrivateKey.fromStringDer(myPrivateKey))
        .setDefaultMaxTransactionFee(new Hbar(100))
        .setDefaultMaxQueryPayment(new Hbar(50));
    
    const transaction = new TokenCreateTransaction()
        .setTokenName('HengCryptoFirst')
        .setTokenSymbol('HFC')
        .setTreasuryAccountId(AccountId.fromString(myAccountId))
        .setInitialSupply(5000)
        .setAdminKey(PrivateKey.fromStringDer(myPrivateKey))
        .freezeWith(client);
    
    const singedTransaction = await transaction.sign(PrivateKey.fromStringDer(myPrivateKey));

    const transactionResponse = await singedTransaction.execute(client);

    const receipt = await transactionResponse.getReceipt(client);

    const tokenId = receipt.tokenId;
    console.log("New token Id is: ", tokenId);
}

environmentSetup().catch(console.error);
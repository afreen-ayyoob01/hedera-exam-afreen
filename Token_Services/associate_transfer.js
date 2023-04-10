/**
 * @author Afreen Ayyoob
 * Script to transfer the Token
 * 1. Associating the token to the account before transfer
 * 2. Creating a transaction to transfer the token
 */

// Importing Dependencies from the Hashgraph Library
const {
    TransferTransaction,
    TokenAssociateTransaction,
    TokenPauseTransaction,
    TokenUnpauseTransaction,
    AccountBalanceQuery,
    TokenGrantKycTransaction
} = require("@hashgraph/sdk");

//Define tokenAssociateWithAccount() function to associate accounts
module.exports.tokenAssociateWithAccount = async function (
    wallet,
    pvKey,
    tokenId,
    client) {
    try {
        // Associate account Id with token Id 
        let associateOtherWalletTx = await new TokenAssociateTransaction()
            .setAccountId(wallet.accountId)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(pvKey);
        //Submit to Hedera network 
        let associateOtherWalletTxSubmit = await associateOtherWalletTx.execute(client);
        //Get the receipt of the transaction 
        let associateOtherWalletRx = await associateOtherWalletTxSubmit.getReceipt(client);
        return associateOtherWalletRx.status;
    }
    // Identify errors when the status is unsuccessful 
    catch (error) {
        console.info(`Fail to associate account:${error}`);
    }
}
//Define tokenTransferToAccount() function to transfer tokens
module.exports.tokenTransferToAccount = async function (
    wallet,
    tokenAmount,
    treasuryKey,
    tokenId,
    client) {
    try {
        //Create the transfer transaction 
        const transaction = await new TransferTransaction()
            .addTokenTransfer(tokenId, client.operatorAccountId, -tokenAmount)
            .addTokenTransfer(tokenId, wallet.accountId, tokenAmount)
            .freezeWith(client);
        //Sign with the sender account private key 
        const signTx = await transaction.sign(treasuryKey);
        //Sign with the client operator private key and submit to a Hedera network 
        const txResponse = await signTx.execute(client);
        //Request the receipt of the transaction 
        const receipt = await txResponse.getReceipt(client);
        //Obtain the transaction consensus status 
        const transactionStatus = receipt.status;
        return transactionStatus;
    }
    // Identify errors when the status is unsuccessful 
    catch (error) {
        console.info(`Fail to transfer token ${error}`);
    }
}

//Define balaceTokenQuery() functon to examine token balance
module.exports.balaceTokenQuery = async function (
    wallet,
    client,
    tokenId) {
    //Create the query 
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(wallet.accountId);
    //Sign with the client operator private key and submit to a Hedera network 
    const tokenBalance = await balanceQuery.execute(client);
    console.log(`The token balance of the user be owned by AccountId ${wallet.accountId} is: ` + tokenBalance.tokens.get(tokenId));
}
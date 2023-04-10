/**
 * @author Afreen Ayyoob
 * Script to pause and unpause the transfer of Token
 * 1. Creating a function to pause the transfer of token
 * 2. Creating a function to unpause the transfer of token
 */


// Define pauseFT() function to pause token Id
module.exports.pauseFT = async function (
    tokenId,
    pauseKey,
    client) {
    try {
        const transaction = new TokenPauseTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);
        //Sign with the pause key 
        const signTx = await transaction.sign(pauseKey);
        //Submit the transaction to a Hedera network 
        const txResponse = await signTx.execute(client);
        //Request the receipt of the transaction 
        const receipt = await txResponse.getReceipt(client);
        //Get the transaction consensus status 
        const transactionStatus = receipt.status;
        return transactionStatus;
    }
    // Identify errors when the status is unsuccessful 
    catch (error) {
        console.info(`Fail to Pause token: ${error}`);
    }
}
// Define unpauseFT() function to unpause token Id
module.exports.unpauseFT = async function (
    tokenId,
    pauseKey,
    client) {
    try {
        const transaction = new TokenUnpauseTransaction()
            .setTokenId(tokenId)
            .freezeWith(client);
        //Sign with the pause key 
        const signTx = await transaction.sign(pauseKey);
        //Submit the transaction to a Hedera network 
        const txResponse = await signTx.execute(client);
        //Request the receipt of the transaction 
        const receipt = await txResponse.getReceipt(client);
        //Get the transaction consensus status 
        const transactionStatus = receipt.status;
        return transactionStatus;
    }
    // Identify errors when the status is unsuccessful 
    catch (error) {
        console.info(`Fail to unpause token:${error}`);
    }
}
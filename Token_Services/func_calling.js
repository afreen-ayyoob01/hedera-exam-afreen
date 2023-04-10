/**
 * @author Afreen Ayyoob
 * Script to call the function
 * 1. Calling the associate and transfer function
 * 2. Calling the pause and unpause function
 */

// Importing Dependencies from the Hashgraph Library
const {
    Client, Wallet, PrivateKey
} = require("@hashgraph/sdk");

// Import associate_transfer file
const transfer = require('./associate_transfer.js');
// Import pause_unpause file
const operations = require('./pause_unpause.js');


// Acquiring Environment Variables From Environment File
require('dotenv').config({ path: '../.env' });
// Fetch Account1 Id & private key and put down it as treasury account 
const treasuryId = process.env.ACCOUNT1_ID;
const treasuryKey = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);
// Fetch Account3 Id and private key
const Account3_Id = process.env.ACCOUNT3_ID;
const Account3_PrivateKey = PrivateKey.fromString(process.env.ACCOUNT3_PVKEY);

// Fetch Account4 Id and private key
const Account4_Id = process.env.ACCOUNT4_ID;
const Account4_PrivateKey = PrivateKey.fromString(process.env.ACCOUNT4_PVKEY);

const tokenId = process.env.TOKEN_ID;

const pauseKey=PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);

// Validating treasuryId and treasuryKey for null value

if (treasuryId == null || treasuryKey == null) {
    throw new Error("Environment variables treasuryId and treasuryKey must be present");
} 

// Validating Account3_Id and Account3_PrivateKey for null value
if (Account3_Id == null || Account3_PrivateKey == null) {
    throw new Error("Environment variables Account3_Id and Account3_PrivateKey must be present");
} 

// Validating Account4_Id and Account4_PrivateKey for null value
if (Account4_Id == null || Account4_PrivateKey == null) {
    throw new Error("Environment variables Account3_Id and Account3_PrivateKey must be present");
}
// Create connection to the Hedera network
const client = Client.forTestnet();
client.setOperator(treasuryId, treasuryKey);
const adminUser = new Wallet(
    treasuryId, treasuryKey
)
// Create wallet3 using Account3_Id & Account3_PrivateKey
const wallet3 = new Wallet(
    Account3_Id, Account3_PrivateKey
);

// Create wallet4 using Account4_Id & Account4_PrivateKey
const wallet4 = new Wallet(
    Account4_Id, Account4_PrivateKey
);
// Define main function to call other requisite functions utilizing imported transfer file 
async function main() {
    console.log('########################## Associate Accounts ################################');
    // Associate wallet3 using tokenAssociateWithAccount() function 
    let account3_Assosiate_status = await transfer.tokenAssociateWithAccount(wallet3, Account3_PrivateKey, tokenId, client);
    console.log(`Account3 associate status :${account3_Assosiate_status}`);

    // Associate wallet4 using tokenAssociateWithAccount() function 
    let account4_Assosiate_status = await transfer.tokenAssociateWithAccount(wallet4, Account4_PrivateKey, tokenId, client);
    console.log(`Account4 associate status :${account4_Assosiate_status}`);
    
    console.log('########## QueryTokenBalance of Accounts before transfer of tokens ################');
    // Examine the token balance of accounts before token transfer 
    await transfer.balaceTokenQuery(wallet3, client, tokenId);
    await transfer.balaceTokenQuery(wallet4, client, tokenId);
    
    console.log('########################## Transfer tokens to Accounts ########################');
    // transfer token to wallet3 using tokenTransferToAccount() function 
    let account3_Txn_status = await transfer.tokenTransferToAccount(wallet3, 2525, treasuryKey, tokenId, client);
    console.log(`Account3 transaction status :${account3_Txn_status}`);

    // transfer token to wallet4 using tokenTransferToAccount() function 
    let account4_Txn_status = await transfer.tokenTransferToAccount(wallet4, 2525, treasuryKey, tokenId, client);
    console.log(`Account3 transaction status :${account4_Txn_status}`);
    
    console.log('########## QueryTokenBalance of Accounts after transfer of tokens ################');
    // Examine the token balance of accounts before token transfer 
    await transfer.balaceTokenQuery(wallet3, client, tokenId);
    await transfer.balaceTokenQuery(wallet4, client, tokenId);

    console.log('########################## Pause tokens to Accounts ########################');
    // transfer token to wallet3 using tokenTransferToAccount() function 
    let account3_Txn_status1 = await operations.pauseFT( tokenId,pauseKey, client);
    console.log(`Account3 transaction status :${account3_Txn_status1}`);
    
    

    console.log('########################## Transfer tokens to Accounts ########################');
    // transfer token to wallet3 using tokenTransferToAccount() function 
    let account3_Txn_status2 = await transfer.tokenTransferToAccount(wallet3, 135, treasuryKey, tokenId, client);
    console.log(`Account3 transaction status :${account3_Txn_status2}`);
    
    

    console.log('########################## Unpause tokens to Accounts ########################');
    // transfer token to wallet3 using tokenTransferToAccount() function 
    let account3_Txn_status3 = await operations.unpauseFT( tokenId,pauseKey, client);
    console.log(`Account3 transaction status :${account3_Txn_status3}`);
    
    

    console.log('########################## Transfer tokens to Accounts ########################');
    // transfer token to wallet3 using tokenTransferToAccount() function 
    let account3_Txn_status4 = await transfer.tokenTransferToAccount(wallet3, 135, treasuryKey, tokenId, client);
    console.log(`Account3 transaction status :${account3_Txn_status4}`);
    
    console.log('########## QueryTokenBalance of Accounts after transfer of tokens ################');
    // Examine the token balance of accounts before token transfer 
    await transfer.balaceTokenQuery(wallet3, client, tokenId);
    
}
// Call the main() function to execute program
main();
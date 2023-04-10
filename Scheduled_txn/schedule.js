/**
 * @author Afreen Ayyoob
 * Script to schedule a transaction
 * 1. Scheduling a transaction
 * 2. Generating a Scheduled Id
 * 3. Generating a Scheduled transaction Id as well 
 */

// Importing Dependencies from the Hashgraph Library
const {
    TransferTransaction,
    Client,
    ScheduleCreateTransaction,
    PrivateKey,
    Hbar, 
} = require("@hashgraph/sdk");

// Acquiring Environment variables from the environment file
require('dotenv').config({ path: '../.env' });

// Fetching the account Ids and private keys from the enviroment file
const myAccountId = process.env.ACCOUNT1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);

const otherAccountId = process.env.ACCOUNT2_ID;


// Condition to check if AccountID and PrivateKey is present or not
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
const client = Client.forTestnet();

// Setting Operator Id and Private key with the client
client.setOperator(myAccountId, myPrivateKey);

// Function to schedule a transaction
async function main() {

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.from(-10))  //Tranfering Hbar from this account
        .addHbarTransfer(otherAccountId, Hbar.from(10));   //Tranfering Hbar to this account

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)     //Setting a scheduled transaction
        .setScheduleMemo("Scheduled TX!")         // Setting a memo to see on the network
        .setAdminKey(myPrivateKey)                //Setting the admin key to give permission
        .setTransactionValidDuration(120)          //Setting the duration in which a transaction can be valid
        .setWaitForExpiry(true)                   //Setting the expiry function to true
        .execute(client);                        //Executing the transaction with the client
   

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The schedule ID is " +scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.log("The scheduled transaction ID is " +scheduledTxId);
   

    
}

// Calling the main function
main();
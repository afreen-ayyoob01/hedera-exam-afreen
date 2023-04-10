/**
 * @author Afreen Ayyoob
 * Script to Sign a Scheduled Transaction 
 */

// Importing Dependencies from the Hashgraph Library
const {
    ScheduleSignTransaction,
    Client,
    PrivateKey,
} = require("@hashgraph/sdk");

// Acquiring Environment Variables From Environment File
require('dotenv').config({ path: '../.env' });

// Fetching the account Id And Private Key From Environment File
const firstAccountId = process.env.ACCOUNT1_ID;
const firstPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);
const scheduleId = process.env.SCHEDULED_ID;

// Condition To Check Account_Id and Private_key is present or not
if (firstAccountId == null ||
    firstPrivateKey == null ||
    scheduleId == null ) {
    throw new Error("Environment variables ID's and KEY's must be present");
}

// Create our connection to the Hedera network
const client = Client.forTestnet();

// Setting Operator Id and Private key with the client
client.setOperator(firstAccountId, firstPrivateKey);

// Function to Sign a Scheduled Transaction
async function main() {

    //Create the ScheduledSignTransaction
    const transaction = await new ScheduleSignTransaction()
        .setScheduleId(scheduleId)   //Setting the schedule id
        .sign(firstPrivateKey)       // Setting the key to sign the transaction
        .freezeWith(client);     
        

    //Sign with the client operator key to pay for the transaction and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus);

    process.exit();
}

// Calling the main function
main();
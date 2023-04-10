/**
 * @author Afreen Ayyoob
 * 
 * Creating new accounts using this script
 * 1. First Creating new accounts with createAccounts() function 
 * 2. Second Checking the account balance of newly generated accounts
 */

// Importing Dependencies from the Hashgraph Library 
const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar
} = require("@hashgraph/sdk");

// Acquring Environment Variables from the Environment file
require('dotenv').config({ path: '../.env' });

// Function to create new Accounts

async function createAccounts() {

    // Fetching Account Id and Private Key from the Hedera Portal
    const myAccountId = process.env.ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_PVKEY);

    // Condition to check if AccountID and PrivateKey is present or not
    if (myAccountId == null || myPrivateKey == null) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Creating connection to the Hedera network

    const client = Client.forTestnet();

    // Setting Operator Id and Private Key to the network
    client.setOperator(myAccountId, myPrivateKey);

    // Created an array to put all the created account details
    const AccountList = [];

    // Loop to create new Accounts
    for (i = 0; i < 5; i++) {
        
        //Creating new keys with the help of Private Key
        const newAccountPrivateKey = PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;

        //Create a new account with 100 Hbar starting balance
        const newAccount = await new AccountCreateTransaction()
            .setKey(newAccountPublicKey)                  //Setting the Public Key of new generated accounts
            .setInitialBalance(new Hbar(500))           //Setting Initial Balance of 500 Hbar
            .execute(client);                      //Executing the account create transaction

        // Get the new generated account ID
        const getReceipt = await newAccount.getReceipt(client);
        const newAccountId = getReceipt.accountId;    //Storing the Account Id into a variable

        // Printing all the details of new generated Accounts on console
        console.log(`==========================ACCOUNT ${i+1} CREDENTIALS=================================`)
        console.log(`ACCOUNT${i+1}_ID = `+ newAccountId);
        console.log(`ACCOUNT${i+1}_PBKEY = `+ newAccountPublicKey);
        console.log(`ACCOUNT${i+1}_PVKEY = `+ newAccountPrivateKey);

        // Pushing new Account details into the list
        AccountList.push(newAccountId);
    }
    // Printing the balance of all new created accounts
    for (const newAccountId of AccountList) {
        const accountBalance = await new AccountBalanceQuery()
          .setAccountId(newAccountId)        //Setting the account id to get the account balance
          .execute(client);                   // Executing the balance query
        
        //   Printing account id with balance
        console.log("Account " + newAccountId + " balance: " + accountBalance.hbars + "Hbar");
  
        console.log("Account info for account :")
        console.log(JSON.stringify(accountBalance));
      }
 client.close();
}

// Calling the main function
createAccounts();

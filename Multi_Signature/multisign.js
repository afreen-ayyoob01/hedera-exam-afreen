/**
 * @author Afreen Ayyoob
 * Sign a transaction with multiple signatures using this script
 * 1. Approving an allowance to one account on behalf of other account
 * 2. Transfering the Hbar 
 * 3. Again transacting Hbar which gets failed due to one time approval of an allowance  
 */

// Importing dependencies from Hashgraph Library
const {
    Client,
    PrivateKey,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
    AccountAllowanceApproveTransaction,
    TransactionId
} = require("@hashgraph/sdk");

// Acquring Environment variables from the environment file
require('dotenv').config({ path: '../.env' });

// Fetching the account Ids and private keys from the enviroment file
const myAccountId= process.env.ACCOUNT1_ID;
const myPrivateKey= PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);

const account2_Id=process.env.ACCOUNT2_ID;
const account2_pvKey = PrivateKey.fromString(process.env.ACCOUNT2_PVKEY);

const account3_Id=process.env.ACCOUNT3_ID;

// Checking whether account Id and private key are present or not
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Creating connection to the Hedera network
const client = Client.forTestnet();

// Setting the Operator Id and Private Key
client.setOperator(myAccountId, myPrivateKey);

// Function to transfer Hbar using Multiple Signature
async function transfer(){
    
    // Approve account2 to spend 20 Hbar on behalf of account1
    
    const transaction = new AccountAllowanceApproveTransaction()
    .approveHbarAllowance(myAccountId, account2_Id, Hbar.from(20))  //Setting the accounts for approval of an allowance
    .freezeWith(client);

    // Signing the transaction with client
    const signTx = await transaction.sign(myPrivateKey);

    // Executing the transaction after signing
	const txResponse = await signTx.execute(client);

    // Receiving the response after execution
	const receipt = await txResponse.getReceipt(client);

    // Setting a variables to check the status of the transaction
    const transactionStatus = receipt.status;

    // Printing the Status on console
	console.log(`- Allowance approval status: ${transactionStatus}`);

    // Create the query to check the balance
    const query1 = new AccountBalanceQuery()
     .setAccountId(myAccountId);  //Setting the account id to check the account balance

    //  Executing the query to check the balance
    const accountBalance = await query1.execute(client);

    // Printing the result on console
    console.log(`The account balance for account 1 with  ${myAccountId} is ${accountBalance.hbars} HBar`);

    // Checking the same for account2 
    const query2 = new AccountBalanceQuery()
    .setAccountId(account2_Id);
    const accountBalance2 = await query2.execute(client);
    console.log(`The account balance for account 2 with ${account2_Id} is ${accountBalance2.hbars} HBar`);

    // Checking the same for account3
    const query3 = new AccountBalanceQuery()
    .setAccountId(account3_Id);
    const accountBalance3 = await query3.execute(client);
    console.log(`The account balance for account 3 with ${account3_Id} is ${accountBalance3.hbars} HBar`);

    // Account2 performing allowance transfer from account1 to account3
    console.log("Account2 performing allowance transfer from account1 to account3");
    
    // Setting the amount of Hbar to be transfered 
    const sendBal=new Hbar(20);

    // Creating a transaction to transfer the Hbar
    const allowanceSendTx=await new TransferTransaction()
    .addApprovedHbarTransfer(myAccountId, sendBal.negated()) //Setting negated function so that the transaction can be done only once
    .addHbarTransfer(account3_Id, sendBal) // Setting the account Id and balance
    .setTransactionId(TransactionId.generate(account2_Id)) // Spender must generate the TX ID or be the client
    .freezeWith(client);

    // Signing the transaction with client
    const approvedSendSign = await allowanceSendTx.sign(account2_pvKey);

    // Executing the transaction
	const approvedSendSubmit = await approvedSendSign.execute(client);

    // Receiving the response of transaction
	const approvedSendRx = await approvedSendSubmit.getReceipt(client);

    // Printing the status of the transaction
    console.log(`- Allowance transfer status: ${approvedSendRx.status}`);

    // Create the query to check the balance 
    const query11 = new AccountBalanceQuery()
     .setAccountId(myAccountId);  //Setting the account id

    //  Executing the query 
    const accountBalance1 = await query11.execute(client);

    // Receiving the result on console
    console.log(`The account balance for account 1 with ${myAccountId} is ${accountBalance1.hbars} HBar `);

    // Checking the same for account2
    const query21 = new AccountBalanceQuery()
    .setAccountId(account2_Id);
    const accountBalance21 = await query21.execute(client);
    console.log(`The account balance for account 2 with ${account2_Id} is ${accountBalance21.hbars} HBar`);

    // Checking the same for account3
    const query31 = new AccountBalanceQuery()
    .setAccountId(account3_Id);
    const accountBalance31 = await query31.execute(client);
    console.log(`The account balance for account 3 with ${account3_Id} is ${accountBalance31.hbars} HBar`);

    // Again trying to transfer 20 Hbar from account2 to account3
    console.log("Again try to transfer 20 Hbar from account2 to account3");
    const allowanceSendTx1=await new TransferTransaction()
    .addApprovedHbarTransfer(myAccountId, sendBal.negated())
    .addHbarTransfer(account3_Id, sendBal)
    .setTransactionId(TransactionId.generate(account2_Id)) // Spender must generate the TX ID or be the client
    .freezeWith(client);
    const approvedSendSign1 = await allowanceSendTx1.sign(account2_pvKey);
	const approvedSendSubmit1 = await approvedSendSign1.execute(client);
	const approvedSendRx1 = await approvedSendSubmit1.getReceipt(client);

    // Getting an expected error. Transaction can be executed only once 
    console.log(`- Allowance transfer transaction${approvedSendRx1.TransactionId} failed with status ${approvedSendRx1.status.toString()}.`);
}

// Calling the main function 
transfer();
/**
 * @author Afreen Ayyoob
 * Script to create a Fungible Token
 * 1. Creating a token transaction
 * 2. Adding an additional supply to token 
 */

// Importing Dependencies from the Hashgraph Library
const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	AccountBalanceQuery,
	Wallet,
	TokenInfoQuery,
	TokenMintTransaction
} = require("@hashgraph/sdk");

// Acquiring Environment Variables From Environment File
require('dotenv').config({ path: '../.env' });

// Fetching the account Id And Private Key From Environment File and make it as treasury account
const treasuryId = AccountId.fromString(process.env.ACCOUNT1_ID);
const treasuryKey = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);

// Checking whether account id or private key is present or not
if (treasuryId == null || treasuryKey == null) {
	throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}

// Creating a connection  and setting the operator id and private key to the network
const client = Client.forTestnet().setOperator(treasuryId, treasuryKey);


// Setting a pause key 
const pauseKey = PrivateKey.fromString(process.env.ACCOUNT5_PVKEY);

// Setting a supply account for additional supply
const supplyAccountId = AccountId.fromString(process.env.ACCOUNT2_ID);
const supplyPrivateKey = PrivateKey.fromString(process.env.ACCOUNT2_PVKEY);


// Creating a wallet for treasury user
const treasuryUser = new Wallet(
	treasuryId,
	treasuryKey
)

// Creating a wallet for supply user
const supplyUser = new Wallet(
	supplyAccountId,
	supplyPrivateKey
)

// Function to create fungible token
async function main() {
	//Create fungible token
	let tokenCreateTx = await new TokenCreateTransaction()
		.setTokenName("BIGHIT ENTERTAINMENT")     //Setting the token name
		.setTokenSymbol("BTS")         //Setting the token symbol
		.setTokenType(TokenType.FungibleCommon)           //Setting the token type
		.setDecimals(2)                    //Setting decimal value 
		.setInitialSupply(35050)            // Setting the initial supply amount of Hbar
		.setMaxSupply(50000)                  //Setting the maximum supply of Hbars
		.setTreasuryAccountId(treasuryId)     //Setting the treasury account Id
		.setSupplyType(TokenSupplyType.Finite)     //Setting the supply type
		.setAdminKey(treasuryUser.publicKey)          //Setting the treasury user public key as admin key
		.setSupplyKey(supplyUser.publicKey)             //Setting the supply user public key as supply key
		.setPauseKey(pauseKey)                          //Setting the pause key which is declared already
		.freezeWith(client);


	//Signing a transaction to create a token
	let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);

	// Executing the transaction
	let tokenCreateSubmit = await tokenCreateSign.execute(client);

	// Receiving the response 
	let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

	// Generating the token Id 
	let tokenId = tokenCreateRx.tokenId;
	console.log(`- Created token with ID: ${tokenId} \n`);

	//Sign with the Client operator private key, submit the query to the network and get the token supply
	const name = await queryTokenFunction("name", tokenId);
	const symbol = await queryTokenFunction("symbol", tokenId);
	const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
	const maxSupply = await queryTokenFunction("maxSupply", tokenId);
	console.log(`The total supply of the ${name} token is ${tokenSupply} of ${symbol}, Maxsupply = ${maxSupply}`);

	//Create the query
	const balanceQuery = new AccountBalanceQuery()
		.setAccountId(treasuryUser.accountId);

	//Sign with the client operator private key and submit to a Hedera network
	const tokenBalance = await balanceQuery.execute(client);

	console.log("The balance of the user is: " + tokenBalance.tokens.get(tokenId));
	
    console.log("----------------supply_increase---------------------------");
    AdditionalSupply(tokenId);
	
}

// Funtion to validate the token details
async function queryTokenFunction(functionName, tokenId) {

	//Create the query
	const query = new TokenInfoQuery()
		.setTokenId(tokenId);

	console.log("retrieveing the " + functionName);
	const body = await query.execute(client);

	//Sign with the client operator private key, submit the query to the network and get the token supply
	let result;
	if (functionName === "name") {
		result = body.name;
	} else if (functionName === "symbol") {
		result = body.symbol;
	} else if (functionName === "totalSupply") {
		result = body.totalSupply;
	} else if (functionName === "maxSupply") {
		result = body.maxSupply;
	} else {
		return;
	}
	return result;
}


// Function to add the additional supply of Hbars
async function AdditionalSupply(tokenId) {
	//Create the transaction and freeze for manual signing

	const transaction = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setAmount(14950)
		.freezeWith(client);

	//Sign the transaction with the client, who is set as admin and treasury account
	const signTx = await transaction.sign(supplyPrivateKey);

	//Submit the signed transaction to a Hedera network
	const txResponse = await signTx.execute(client);

	//Request the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the transaction consensus status
	const transactionStatus = receipt.status.toString();

	console.log("The transaction consensus status is " + transactionStatus);
	const balanceQuery = new AccountBalanceQuery()
		.setAccountId(treasuryUser.accountId);

	const tokenBalance = await balanceQuery.execute(client);

	console.log("The balance of the user after increase supply is: " + tokenBalance.tokens.get(tokenId));


}

// Calling the main function
main();
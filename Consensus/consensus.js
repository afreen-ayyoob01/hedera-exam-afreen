/**
 * @author Afreen Ayyoob
 * Acquiring Consensus services using this script
 * 1. Creaing a topic 
 * 2. Subscribe to that topic
 * 3. Submit the topic
 */

// Importing Dependencies from the Hashgraph Library
const {
    PrivateKey,
    Client,
    TopicCreateTransaction,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
  } = require("@hashgraph/sdk");
  
  // Acquiring Environment Varibles from the environment file
  require('dotenv').config({ path: '../.env' });
  
  // Get the Account Id and Private Key from the environment file
  const myAccountId = process.env.ACCOUNT1_ID;
  const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT1_PVKEY);
  
  // Build Hedera testnet and mirror node client
  const client = Client.forTestnet();
  
  // Set the operator account ID and operator private key
  client.setOperator(myAccountId, myPrivateKey);
  
  // Funtion to create the Consensus Service
  async function consensusService() {
    // Create a new topic
    let txResponse = await new TopicCreateTransaction().execute(client);
  
    // Get the newly generated topic ID
    let receipt = await txResponse.getReceipt(client);
    let topicId = receipt.topicId;
    console.log(`TOPIC_ID = ${topicId}`);
  
    // Wait 5 seconds between consensus topic creation and subscription creation
    await new Promise((resolve) => setTimeout(resolve, 5000));
  
    // Query to subscribe the topic message
    new TopicMessageQuery()
      .setTopicId(topicId)            //Setting the topic id to subscribe the message 
      .subscribe(client, null, (message) => {
        let messageAsString = Buffer.from(message.contents, "utf8").toString();
        console.log(
          `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
        );
      });
  
    // Send message to topic
    let sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: "Hey there!! This is Afreen, saying hello to you.... ",
    }).execute(client);
    const getReceipt = await sendResponse.getReceipt(client);
  
    // Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus.toString());
  }
  
  // Calling the main function
  consensusService();
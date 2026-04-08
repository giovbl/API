const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda")

/**
 * Creates a new Lambda client
 * @returns The created client
 */
function initializeLambdaClient() {
    return new LambdaClient({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AMAZON_SDK_KEY_ID,
            secretAccessKey: process.env.AMAZON_SDK_SECRET
        }
    })
}


async function invokeSummary(client,refertoId){

  const command = new InvokeCommand({
    FunctionName: 'summary',
    Payload: JSON.stringify({refertoId:refertoId}),
    InvocationType: "Event"
  })

  try{    
        client.send(command);
        
        return true;
    }
    catch(err){
        console.log(JSON.stringify(err))
        return false;
    }
}

module.exports ={
    initializeLambdaClient,
    invokeSummary
}
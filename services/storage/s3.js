const crypto = require('crypto');

const { S3Client, PutObjectCommand, GetObjectCommand, NoSuchKey, S3ServiceException } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * Creates a SHA-256 hash of the given data
 * @param {any} data Data to hash
 * @returns {string} The generated hash
 */
function createHash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

function initializeClient() {
    return new S3Client({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AMAZON_SDK_KEY_ID,
            secretAccessKey: process.env.AMAZON_SDK_SECRET
        }
    })
}

async function getObjectURL(client,objName) {
    
    const command = new GetObjectCommand({
        Bucket: process.env.AMAZON_SDK_BUCKET,
        Key: objName
    })
    
    try{
        return await getSignedUrl(client, command, { expiresIn: 3600 });
    }
    catch(err){
        if(err instanceof S3ServiceException)
            throw err;

        return null;
    }
}

async function addObject(client,objBuffer,objMeta) {

    const objName = createHash(Date.now().toString())
   
    const command  = new PutObjectCommand({
        Bucket: process.env.AMAZON_SDK_BUCKET,
        Key: objName,
        Body: objBuffer,
        ContentType: objMeta
    })

    try{
        
        await client.send(command);

        return objName;
    }
    catch(err){
        console.log(JSON.stringify(err))

        return null;
    }
}

module.exports = {
    initializeClient,
    getObjectURL,
    addObject
}
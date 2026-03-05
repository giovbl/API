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

/**
 * Creates a new S3 client
 * @returns The created client
 */
function initializeClient() {
    return new S3Client({
        region: "eu-north-1",
        credentials: {
            accessKeyId: process.env.AMAZON_SDK_KEY_ID,
            secretAccessKey: process.env.AMAZON_SDK_SECRET
        }
    })
}

/**
 * Generated a URL for a stored object
 * @param {S3Client} client S3 client
 * @param {string} objName Name of the object to retreive
 * @returns {string} A URL where the object can be accessed
 */
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

/**
 * Creates a new object 
 * @param {S3Client} client S3 client
 * @param {*} objBuffer Buffer of the object's data
 * @param {*} objMeta Metadata of the object
 * @returns The generated name of the object
 */
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
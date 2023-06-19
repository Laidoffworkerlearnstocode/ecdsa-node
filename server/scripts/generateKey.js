const secp = require("ethereum-cryptography/secp256k1.js");
const utils = require('ethereum-cryptography/utils');
const fsExtra = require('fs-extra');


async function main() {
    try {
        const keyPairArray = generateKeyArray();
        const keyPairJson = {keys : keyPairArray};
        await saveKeys(keyPairJson);
    } catch (err) {
        console.log(err);
    }
}


function generateKeyArray() {
    let keyPairArray = [];
    for( let i = 0; i < 3; i++ ) {
        const privateKey = secp.secp256k1.utils.randomPrivateKey();
        const hexPrivateKey = utils.bytesToHex(privateKey);
        const publicKey = secp.secp256k1.getPublicKey(privateKey);
        const hexPublicKey = utils.bytesToHex(publicKey);
        console.log(`Private key: ${hexPrivateKey}`);
        console.log(`Public key: ${hexPublicKey}`);
        let keyPair = {};
        keyPair[hexPublicKey] = hexPrivateKey;
        keyPairArray.push(keyPair);
    }
    return keyPairArray;
}

async function saveKeys(keypairjson) {
    try {
        await fsExtra.outputJSON('./keys.json', keypairjson);
    } catch (err) {
        console.log(err);
    }
}

main();
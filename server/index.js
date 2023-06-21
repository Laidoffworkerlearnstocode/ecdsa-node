const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02286489909780120d6eca65e8311240af685765447ff3b46365e32b06b5d35ba9": 100,
  "03ede2c84e86cec7e2c335410ae39f5b87b96820b36a1d23f0f1aac94fe79b3e47": 50,
  "02e7d7fcee8e8ad46a92830e8a512626aec5d34b8bea047ce440cdeb3703196f86": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO：get a signature from the client-side applicaiton
  // recover the public key from the signature
  const { recipientPulicKey, amount, signature, recoveryId, messageHash} = req.body;
  const signatureRecovery = secp256k1.Signature.fromCompact(signature);
  signatureRecovery.recovery = recoveryId;
  const publicKey = signatureRecovery.recoverPublicKey(messageHash).toHex();
  if ( publicKey in balances ) {
    if (balances[publicKey] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      const transferAmount = parseFloat(amount);
      balances[publicKey] -= transferAmount;
      balances[recipientPulicKey] += transferAmount;
      res.send({ balance: balances[publicKey] });
      console.log(balances);
    }
  } else {
    res.status(400).send({ message: "invalid account, check your private key!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

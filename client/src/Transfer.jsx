import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

function Transfer({ sendAmount, setSendAmount, recipientAddress, setRecipientAddress, privateKey, setBalance, address, error, setError}) {

	function setValue(setter) {
		return function(evt) {
			setter(evt.target.value);
		}
	}

  const isValidPrivateKey = (value) => {
    const isHex = /^[0-9a-fA-F]+$/.test(value);
    return value.length === 64 && isHex;
  }
  const isValidRecipientAddress = (value) => {
    const isHex = /^[0-9a-fA-F]+$/.test(value);
    return value.length === 66 && isHex;
  }
  const isValidSendAmount = (value) => {
    const isFloat = /^[0-9]+(\.[0-9]+)?$/.test(value);
    return isFloat && parseFloat(value) > 0;
  }

  function formValidate() {
    if (!isValidPrivateKey(privateKey)) {
      return "Invalid private key!";
    }
    if (!isValidRecipientAddress(recipientAddress)) {
      return "Invalid recipient address!";
    }
    if (!isValidSendAmount(sendAmount)) {
      return "Invalid send amount!";
    }
    return null;
  }

  async function transfer(evt) {
    evt.preventDefault();
    const error = formValidate();
    if (error) {
      alert(error);
      return;
    }
		try {
			const transferMessage = {
				recipientPulicKey : recipientAddress,
				amount : sendAmount,
			}
			const transferMessageBytes = utf8ToBytes(JSON.stringify(transferMessage));
			const transferMessageHash = keccak256(transferMessageBytes);
			const signedMessage = secp256k1.sign(transferMessageHash, privateKey);
      const signatureCompactHex = signedMessage.toCompactHex();
      await server.post(`send`, {
        recipientPublicKey : recipientAddress,
				amount : sendAmount,
        signature : signatureCompactHex,
        recoveryId : signedMessage.recovery,
        messageHash: toHex(transferMessageHash)
      });
      const updateBalance = await server.get(`balance/${address}`);
      setBalance(updateBalance.data.balance)
		} catch (err) {
      alert(err.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipientAddress}
          onChange={setValue(setRecipientAddress)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

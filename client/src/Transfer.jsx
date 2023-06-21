import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

function Transfer({ sendAmount, setSendAmount, recipientAddress, setRecipientAddress, privateKey, setPrivateKey, balance, setBalance, address}) {

	function setValue(setter) {
		return function(evt) {
			setter(evt.target.value);
		}
	}

  async function transfer(evt) {
    evt.preventDefault();
		try {
			const transferMessage = {
				recipientPulicKey : recipientAddress,
				amount : sendAmount,
			}
			const transferMessageBytes = utf8ToBytes(JSON.stringify(transferMessage));
			const transferMessageHash = keccak256(transferMessageBytes);
			const signedMessage = secp256k1.sign(transferMessageHash, privateKey);
      console.log(signedMessage);
      const signatureCompactHex = signedMessage.toCompactHex();
      console.log(signatureCompactHex);
      await server.post(`send`, {
        recipientPulicKey : recipientAddress,
				amount : sendAmount,
        signature : signatureCompactHex,
        recoveryId : signedMessage.recovery,
        messageHash: toHex(transferMessageHash)
      });
      const updateBalance = await server.get(`balance/${address}`);
      setBalance(updateBalance.data.balance)
		} catch (err) {
      console.log(err);
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

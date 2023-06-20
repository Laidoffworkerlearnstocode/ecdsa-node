import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

function Transfer({ sendAmount, setSendAmount, recipientAddress, setRecipientAddress, privateKey, setPrivateKey, balance, setBalance}) {

	function setValue(setter) {
		return function(evt) {
			setter(evt.target.value);
		}
	}

  async function transfer(evt) {
    evt.preventDefault();
    // try {
    //   const {
    //     data: { balance },
    //   } = await server.post(`send`, {
    //     sender: address,
    //     amount: parseInt(sendAmount),
    //     recipient,
    //   });
    //   setBalance(balance);
    // } catch (ex) {
    //   alert(ex.response.data.message);
    // }
		try {
			const transferMessage = {
				recipientPulicKey : recipientAddress,
				amount : sendAmount,
			}
			const transferMessageBytes = utf8ToBytes(JSON.stringify(transferMessage));
			const transferMessageHash = keccak256(transferMessageBytes);
			const signedMessage = secp256k1.sign(transferMessageHash, privateKey);
      const signedMessageStr = {
        r: signedMessage.r.toString(),
        s: signedMessage.s.toString(),
        recovery: signedMessage.recovery
      }
      await server.post(`send`, {
        recipientPulicKey : recipientAddress,
				amount : sendAmount,
        signature : signedMessageStr
      });
		} catch (err) {
      console.log(err.message); 
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

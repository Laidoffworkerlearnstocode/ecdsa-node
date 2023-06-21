import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, error, setError }) {

  const isValidPrivateKey = (value) => {
    const isHex = /^[0-9a-fA-F]+$/.test(value);
    return value.length === 64 && isHex;
  };

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (!isValidPrivateKey(privateKey)) {
      setBalance(0);
      setAddress("");
      setError("Invalid private key!");
      console.log("Invalid private key!");
      return;
    }
    setError(null);
    try{
      const address = toHex(secp256k1.getPublicKey(privateKey));
      const res = await server.get(`/balance/${address}`);
      setBalance(res.data.balance);
      setAddress(address);
    } catch (err) {
        setAddress(err.response.data.message);
        setBalance(0);
      }
    }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

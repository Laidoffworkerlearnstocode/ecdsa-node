import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        error={error}
        setError={setError}
      />
      <Transfer 
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        balance={balance}
        setBalance={setBalance}
        address={address}
        error={error}
        setError={setError}
      />
    </div>
  );
}

export default App;

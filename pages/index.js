import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi } from "../constants/constants";

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const contractAddress = "0xD095976F35A1470814E39F6E1B944E2f082e8e2d";

let web3Modal;
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: { 4: RINKEBY_RPC_URL },
    },
  },
};

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, // required
  });
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum != "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum != "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        console.log("------\nprovider", provider);
        setSigner(provider.getSigner());
        console.log("------\nsigner", provider.getSigner);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  // Note that this abi is that of Fund Me deployed in mid June which does not
  // not have a getOwner(), so instead, we will test withdraw() one time.
  async function withdraw() {
    if (typeof window.ethereum != "undefined") {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const response = await contract.withdraw();
        console.log("response", response);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Please install Metamask");
    }
  }

  return (
    <div className={styles.container}>
      {hasMetamask ? (
        isConnected ? (
          <>
            "Connected to wallet"
            <button onClick={() => withdraw()}> Withdraw </button>
          </>
        ) : (
          <>
            A Nextjs and WebModal Frontend
            <button onClick={() => connect()}>Connect</button>
          </>
        )
      ) : (
        "Please install Metamask"
      )}
    </div>
  );
}

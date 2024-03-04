# Aleo Wallet Adapter

Modular TypeScript wallet adapters and components for Aleo applications.

- [Demo](https://doc.sotertech.io/)


## Quick Setup (using React UI)


### Install

Install these dependencies:

```shell
npm install --save \
    @soterhq/aleo-wallet-adapter-base \
    @soterhq/aleo-wallet-adapter-react \
    @soterhq/aleo-wallet-adapter-reactui \
    @soterhq/aleo-wallet-adapter-soter \
    react
```

### Setup

```tsx
import React, { FC, useMemo } from "react";
    import { WalletProvider } from "@soterhq/aleo-wallet-adapter-react";
    import { WalletModalProvider } from "@soterhq/aleo-wallet-adapter-reactui";
    import { SoterWalletAdapter } from "@soterhq/aleo-wallet-adapter-soter";
    import {
      DecryptPermission,
      WalletAdapterNetwork,
    } from "@soterhq/aleo-wallet-adapter-base";
    
    // Default styles that can be overridden by your app
    require("@soterhq/aleo-wallet-adapter-reactui/styles.css");
    
    export const Wallet: FC = () => {
      const wallets = useMemo(
        () => [
          new SoterWalletAdapter({
            appName: "Soter Demo App",
          }),
        ],
        []
      );
    
      return (
        <WalletProvider
          wallets={wallets}
          decryptPermission={DecryptPermission.UponRequest}
          network={WalletAdapterNetwork.Localnet}
          autoConnect
        >
          <WalletModalProvider>
            // Your app's components go here
          </WalletModalProvider>
        </WalletProvider>
      );
    };
```

### ✍🏻Signing

```tsx
import { WalletNotConnectedError } from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import { SoterWalletAdapter } from "@soterhq/aleo-wallet-adapter-soter";
import React, { FC, useCallback } from "react";

export const SignMessage: FC = () => {
  const { wallet, publicKey } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const message = "a message to sign";

    const bytes = new TextEncoder().encode(message);
    const signatureBytes = await (
      wallet?.adapter as SoterWalletAdapter
    ).signMessage(bytes);
    const signature = new TextDecoder().decode(signatureBytes);
    alert("Signed message: " + signature);
  }, [wallet, publicKey]);

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Sign message
    </button>
  );
};
```

### 🔓Decrypting

```tsx
import { WalletNotConnectedError } from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import React, { FC, useCallback } from "react";

export const DecryptMessage: FC = () => {
  const { publicKey, decrypt } = useWallet();

  const onClick = async () => {
    const cipherText = "record....";
    if (!publicKey) throw new WalletNotConnectedError();
    if (decrypt) {
      const decryptedPayload = await decrypt(cipherText);
      alert("Decrypted payload: " + decryptedPayload);
    }
  };

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Decrypt message
    </button>
  );
};
```

### 🗂️Requesting Records

```tsx
import { WalletNotConnectedError } from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import React, { FC, useCallback } from "react";

export const RequestRecords:FC = ()=>{
  const { publicKey, requestRecords } = useWallet();

  const onClick = async () => {
    const program = "credits.aleo";
    if (!publicKey) throw new WalletNotConnectedError();
    if (requestRecords) {
      const records = await requestRecords(program);
      console.log("Records: " + records);
    }
  };

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Request Records
    </button>
  )

}
```

### 📡Requesting Transactions

```tsx
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError
} from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import React, { FC, useCallback } from "react";

export const RequestTransaction: FC = () => {
  const { publicKey, requestTransaction } = useWallet();

  const onClick = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // The record here is an output from the Requesting Records above
    const record = `'{"id":"0f27d86a-1026-4980-9816-bcdce7569aa4","program_id":"credits.aleo","microcredits":"200000","spent":false,"data":{}}'`
    // Note that the inputs must be formatted in the same order as the Aleo program function expects, otherwise it will fail
    const inputs = [JSON.parse(record), "aleo1kf3dgrz9...", `${amount}u64`];
    const fee = 35_000; // This will fail if fee is not set high enough

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      'credits.aleo',
      'transfer',
      inputs,
      fee
    );

    if (requestTransaction) {
      // Returns a transaction Id, that can be used to check the status. Note this is not the on-chain transaction id
      await requestTransaction(aleoTransaction);
    }
  };

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Request Transaction
    </button>
  );
};
```

### 🗂️Requesting Record Plaintexts

```tsx
import {
  WalletNotConnectedError
} from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import React, { FC, useCallback } from "react";

export const RequestRecordPlaintexts: FC = () => {
  const { publicKey, requestRecordPlaintexts } = useWallet();

  const onClick = async () => {
    const program = "credits.aleo";
    if (!publicKey) throw new WalletNotConnectedError();
    if (requestRecordPlaintexts) {
      const records = await requestRecordPlaintexts(program);
      console.log("Records: " + records);
    }
  };

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Request Records Plaintexts
    </button>
  );
};
```

### 🗂️Requesting Transaction History

```tsx
import {
  WalletNotConnectedError
} from "@soterhq/aleo-wallet-adapter-base";
import { useWallet } from "@soterhq/aleo-wallet-adapter-react";
import React, { FC, useCallback } from "react";

export const RequestRecords: FC = () => {
  const { publicKey, requestTransactionHistory } = useWallet();

  const onClick = async () => {
    const program = "credits.aleo";
    if (!publicKey) throw new WalletNotConnectedError();
    if (requestTransactionHistory) {
      const transactions = await requestTransactionHistory(program);
      console.log("Transactions: " + transactions);
    }
  };

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Request Records Transaction History
    </button>
  );
};
```
 


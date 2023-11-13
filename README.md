# Aleo Wallet Adapter

Modular TypeScript wallet adapters and components for Aleo applications.

- [Demo](https://demo.aleo123.io/)


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
    import { WalletProvider } from "@aleo123/aleo-wallet-adapter-react";
    import { WalletModalProvider } from "@daleo123/aleo-wallet-adapter-reactui";
    import { LeoWalletAdapter } from "@aleo123/aleo-wallet-adapter-soter";
    import {
      DecryptPermission,
      WalletAdapterNetwork,
    } from "@aleo123/aleo-wallet-adapter-base";
    
    // Default styles that can be overridden by your app
    require("@aleo123/aleo-wallet-adapter-reactui/styles.css");
    
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
import { useWallet } from "@soterhq//aleo-wallet-adapter-react";
import { SoterWlletAdapter } from "@soterhq//aleo-wallet-adapter-soter";
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
 


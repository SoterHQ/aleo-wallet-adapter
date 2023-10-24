import React, { useCallback, useMemo } from 'react';
import { useWallet } from '@aleo123/aleo-wallet-adapter-react';
import { Button } from './Button';
import { WalletIcon } from './WalletIcon';
import { WalletAdapterNetwork } from '@aleo123/aleo-wallet-adapter-base';
export const WalletConnectButton = ({ children, disabled, onClick, decryptPermission, network, programs, ...props }) => {
    const { wallet, connect, connecting, connected } = useWallet();
    const handleClick = useCallback((event) => {
        if (onClick)
            onClick(event);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        //@ts-ignore
        if (!event.defaultPrevented)
            connect(decryptPermission || 'NO_DECRYPT', network || WalletAdapterNetwork.Testnet, programs ?? []).catch(() => { });
    }, [onClick, connect]);
    const content = useMemo(() => {
        if (children)
            return children;
        if (connecting)
            return 'Connecting ...';
        if (connected)
            return 'Connected';
        if (wallet)
            return 'Connect';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);
    return (React.createElement(Button, { className: 'wallet-adapter-button-trigger', disabled: disabled || !wallet || connecting || connected, startIcon: wallet ? React.createElement(WalletIcon, { wallet: wallet }) : undefined, onClick: handleClick, ...props }, content));
};
//# sourceMappingURL=WalletConnectButton.js.map
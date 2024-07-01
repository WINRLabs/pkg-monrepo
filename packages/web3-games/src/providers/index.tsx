import { GameProvider } from "@winrlabs/games";
import { GameSocketProvider } from "../games/hooks";
import {
  ContractConfig,
  ContractConfigProvider,
} from "../games/hooks/use-contract-config";
import { Config } from "wagmi";

export const WinrLabsWeb3GamesProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: {
    wagmiConfig: Config;
    bundlerWsUrl: string;
    contracts: ContractConfig;
  };
}) => {
  // for example game provider dynamic currency:
  // const selectedCurr = useAppUiTemplate() -> ...data  GameProvider;

  return (
    <ContractConfigProvider
      wagmiConfig={config.wagmiConfig}
      config={config.contracts}
    >
      <GameProvider
        options={{
          currency: {
            icon: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
            name: "Winr",
            symbol: "WINR",
          },
          account: {
            isLoggedIn: true,
            balance: 25,
          },
        }}
      >
        <GameSocketProvider bundlerWsUrl={config.bundlerWsUrl}>
          {children}
        </GameSocketProvider>
      </GameProvider>
    </ContractConfigProvider>
  );
};

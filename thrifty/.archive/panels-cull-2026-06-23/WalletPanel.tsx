
import { useState, useMemo } from "react"
import { SlidingPanels, SlidingPanel, SlidingPanelContent } from "../ui/sliding-panels"
import { ArrowUpRight, ArrowDownLeft, ChevronLeft } from "lucide-react"
import { cx } from "../../lib/utils"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import type { PanelProps } from "../../types/panel"

export interface WalletConfig {
  address: string
  network: string
}

interface Transaction {
  id: string
  type: "send" | "receive"
  label: string
  amount: string
  amountUSD: string
  date: string
  address: string
  hash: string
  gas: string
  block: string
  status: "confirmed" | "pending"
}

const WALLET_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
const BALANCE_ETH = "2.4182"
const BALANCE_USD = "$6,241.30"
const NETWORK = "ETH"

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "receive",
    label: "Received from Coinbase",
    amount: "+1.2 ETH",
    amountUSD: "+$3,098.40",
    date: "Feb 18",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    hash: "0x4c3f...a1b2",
    gas: "0.0021 ETH",
    block: "19,284,731",
    status: "confirmed",
  },
  {
    id: "2",
    type: "send",
    label: "Sent to Vault",
    amount: "-0.5 ETH",
    amountUSD: "-$1,290.50",
    date: "Feb 17",
    address: "0xAb5801a7D398351b8bE11C439e05C5B3259aec9B",
    hash: "0x9e1a...c3d4",
    gas: "0.0018 ETH",
    block: "19,271,042",
    status: "confirmed",
  },
  {
    id: "3",
    type: "receive",
    label: "NFT Sale",
    amount: "+0.8 ETH",
    amountUSD: "+$2,065.60",
    date: "Feb 15",
    address: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
    hash: "0x7b2c...e5f6",
    gas: "0.0024 ETH",
    block: "19,248,561",
    status: "confirmed",
  },
  {
    id: "4",
    type: "send",
    label: "Gas fee",
    amount: "-0.003 ETH",
    amountUSD: "-$7.74",
    date: "Feb 14",
    address: "0x000000000000000000000000000000000000dEaD",
    hash: "0x3a5d...b7c8",
    gas: "0.003 ETH",
    block: "19,235,118",
    status: "confirmed",
  },
  {
    id: "5",
    type: "receive",
    label: "Staking reward",
    amount: "+0.021 ETH",
    amountUSD: "+$54.18",
    date: "Feb 12",
    address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    hash: "0x6d8e...f9a0",
    gas: "0.0015 ETH",
    block: "19,212,897",
    status: "confirmed",
  },
]

function truncate(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as WalletConfig | undefined) ?? null
  const displayAddress = config?.address || WALLET_ADDRESS
  const displayNetwork = config?.network || NETWORK
  const [panelIndex, setPanelIndex] = useState(0)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const handleTxClick = (tx: Transaction) => {
    setSelectedTx(tx)
    setPanelIndex(1)
  }

  const handleBack = () => {
    setPanelIndex(0)
  }

  const footer = useMemo(
    () => (
      <>
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {BALANCE_ETH} ETH · {BALANCE_USD}
        </span>
        <button className="px-4 border-l border-line text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors">
          Send
        </button>
        <button className="px-4 border-l border-line text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg hover:text-foreground transition-colors">
          Receive
        </button>
      </>
    ),
    []
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  const listView = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center justify-between">
        <span className="text-[10px] font-mono text-mute-fg">
          {truncate(displayAddress)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg border border-line px-1.5 py-0.5">
            {displayNetwork}
          </span>
          <span className="text-[11px] font-(--theme-font-weight) text-foreground">
            {BALANCE_ETH} ETH
          </span>
        </div>
      </div>

      {/* Transaction list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {TRANSACTIONS.map((tx) => (
          <button
            key={tx.id}
            onClick={() => handleTxClick(tx)}
            className="w-full px-3 py-2.5 flex items-center gap-3 border-b border-line/40 hover:bg-mute/50 transition-colors text-left"
          >
            <div className={cx(
              "size-6 flex items-center justify-center shrink-0",
              tx.type === "receive" ? "text-foreground/70" : "text-mute-fg/60"
            )}>
              {tx.type === "receive"
                ? <ArrowDownLeft className="size-3.5" />
                : <ArrowUpRight className="size-3.5" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-(--theme-font-weight) text-foreground truncate">{tx.label}</div>
              <div className="text-[10px] text-mute-fg">{tx.date}</div>
            </div>
            <div className="text-right shrink-0">
              <div className={cx(
                "text-[11px] font-(--theme-font-weight)",
                tx.type === "receive" ? "text-foreground" : "text-mute-fg"
              )}>
                {tx.amount}
              </div>
              <div className="text-[10px] text-mute-fg">{tx.amountUSD}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const detailView = selectedTx ? (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center gap-2">
        <button
          onClick={handleBack}
          className="text-mute-fg hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          Transaction
        </span>
        <span className="ml-auto text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-foreground/60">
          {selectedTx.status}
        </span>
      </div>

      {/* Amount hero */}
      <div className="shrink-0 px-3 py-4 border-b border-line">
        <div className={cx(
          "text-[22px] font-(--theme-font-weight)",
          selectedTx.type === "receive" ? "text-foreground" : "text-mute-fg"
        )}>
          {selectedTx.amount}
        </div>
        <div className="text-[12px] text-mute-fg">{selectedTx.amountUSD}</div>
      </div>

      {/* Field rows */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {[
          { label: "Date", value: selectedTx.date },
          { label: "Label", value: selectedTx.label },
          { label: "Address", value: truncate(selectedTx.address) },
          { label: "Tx Hash", value: selectedTx.hash },
          { label: "Gas", value: selectedTx.gas },
          { label: "Block", value: selectedTx.block },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="px-3 py-2.5 flex items-center justify-between border-b border-line/40"
          >
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
              {label}
            </span>
            <span className="text-[11px] text-foreground font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="h-full">
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 h-full">
              {listView}
            </SlidingPanelContent>
          </SlidingPanel>
          <SlidingPanel>
            <SlidingPanelContent className="!p-0 h-full">
              {detailView}
            </SlidingPanelContent>
          </SlidingPanel>
        </SlidingPanels>
      </div>
      {footerEl}
    </div>
  )
}

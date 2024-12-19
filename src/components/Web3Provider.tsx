import { ReactNode } from 'react'
import Web3 from 'web3'

function Web3Provider({ children }: { children: ReactNode }) {
  if (window.ethereum === undefined) return

  return <div>{children}</div>
}
export default Web3Provider

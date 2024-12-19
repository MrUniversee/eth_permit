import { useEffect, useState } from 'react'
import { Address, Eip712TypedData, Web3 } from 'web3'
import { ethers } from 'ethers'

function App() {
  const [web3, setWeb3] = useState<Web3>()
  const [warning, setWarning] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>()
  const [contractAddress, setContractAddress] = useState<Address>(
    '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  )
  const [accountAddress, setAccountAddress] = useState<string>()
  const [spender, setSpender] = useState<string>()

  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    async function init() {
      if (window.ethereum) {
        const provider = new Web3(window.ethereum)

        // use the injected Ethereum provider to initialize Web3.js
        setWeb3(provider)

        // check if Ethereum provider comes from MetaMask
        // console.log(window.ethereum)
      } else {
        // no Ethereum provider - instruct user to install MetaMask
        setWarning('Please install MetaMask')
      }
    }
    init()
  }, [])

  useEffect(() => {
    async function getChainId() {
      if (!web3) {
        return
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`)
    }

    getChainId()
  }, [web3])

  async function connect() {
    // request wallet connection
    if (!web3) {
      return
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log(accounts)

      if (accounts.length < 1) {
        alert('NO WALLET ACCOUNT')
        return
      }

      setAccountAddress(accounts[0])
      setSpender(accounts[1])
      setIsConnected(true)
    } catch (error) {
      console.log(error, 'error caught')
    }
  }

  // async function approve(tokenAddresses: string) {
  //   if (!web3) return
  //   const tokenContract = new web3.eth.Contract(contractAbi, tokenAddresses)

  //   try {
  //     // Check for `nonces` (ERC-2612 support)
  //     const nonce = await tokenContract.methods.nonces(accountAddress).call()
  //     console.log(nonce)

  //     console.log(`The token supports permit (nonces: ${nonce}).`)
  //     return { supportsPermit: true }
  //   } catch (err) {
  //     console.log('The token does not support permit.', err)
  //   }

  //   try {
  //     // Check for `approve` (ERC-20 support)
  //     const spenderAddress = accountAddress && accountAddress[0]
  //     const allowance = await tokenContract.methods
  //       .approve('0x83C644620a095Fe7eF0217E6B947aC6B087343D2', 10)
  //       .send({ from: spenderAddress as string })
  //     console.log(`The token supports approve (allowance: ${allowance}).`)
  //     return { supportsPermit: false, supportsApprove: true }
  //   } catch (err) {
  //     console.log('The token does not support approve.', err)
  //   }

  //   // if (byteCode.includes(func2_selector)) {
  //   //   console.log(
  //   //     `The contract at ${tokenAddresses} supports the approve function.`
  //   //   )
  //   //   return true
  //   // } else {
  //   //   console.log(
  //   //     `The contract at ${tokenAddresses}  does not support the approve function.`
  //   //   )
  //   // }

  //   // const balance = await tokenContract.methods.balanceOf(tokenAddresses).call()
  // }

  // async function getPermitSignature(signer, token, spender, value, deadline) {
  //   const [nonce, name, version, chainId] = await Promise.all([
  //     token.nonces(signer.address),
  //     token.name(),
  //     '1',
  //     signer.getChainId(),
  //   ])

  //   return ethers.splitSignature(
  //     await signer._signTypedData(
  //       {
  //         name,
  //         version,
  //         chainId,
  //         verifyingContract: token.address,
  //       },
  //       {
  //         Permit: [
  //           {
  //             name: 'owner',
  //             type: 'address',
  //           },
  //           {
  //             name: 'spender',
  //             type: 'address',
  //           },
  //           {
  //             name: 'value',
  //             type: 'uint256',
  //           },
  //           {
  //             name: 'nonce',
  //             type: 'uint256',
  //           },
  //           {
  //             name: 'deadline',
  //             type: 'uint256',
  //           },
  //         ],
  //       },
  //       {
  //         owner: signer.address,
  //         spender,
  //         value,
  //         nonce,
  //         deadline,
  //       }
  //     )
  //   )
  // }

  async function getSignature(typedData?: Eip712TypedData) {
    if (!web3 || !accountAddress) return

    try {
      console.log('Getting signature...')
      const signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [accountAddress, typedData],
      })
      console.log('Signature:', signature)
      return signature
    } catch (err) {
      if (err.code === 4001) alert('Request rejected')
      console.error('Error signing typed data:', err)
      return null
    }
  }

  const splitSignature = (sig: string) => {
    if (!sig) return
    // splits the signature to r, s, and v values.
    // Splits the signature into r, s, and v values
    const signature = ethers.Signature.from(sig)
    return {
      r: signature.r,
      s: signature.s,
      v: signature.v,
    }
  }

  async function createPermit(spender, value) {
    if (!web3 || !accountAddress) return alert('please connect wallet')

    const deadline = Math.trunc((Date.now() + 120 * 1000) / 1000).toString()
    const nonce =
      (await web3.eth.getTransactionCount(accountAddress)).toString() || 1

    const permit = { owner: accountAddress, spender, value, nonce, deadline }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]

    const dataToSign = {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Permit,
      },
      primaryType: 'Permit',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: contractAddress,
      },
      message: permit,
    }

    const signature = await getSignature(dataToSign)

    const split = splitSignature(signature)
    console.log({ ...split, signature })
    return {
      ...split,
      signature,
    }
  }

  const permit = async () =>
    await createPermit(spender, ethers.MaxUint256.toString())

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {isConnected ? (
          <div>
            <button>Disconnect Wallet</button>
            {accountAddress && <p>address: {accountAddress}</p>}
          </div>
        ) : (
          <button onClick={connect}>Connect Wallet</button>
        )}
      </div>
      <div id="warn" style={{ color: 'red' }}>
        {warning}
      </div>
      <div id="chainId">{chainId}</div>
      <div style={{ marginTop: '.5rem' }}>
        <button onClick={permit}>Request signature</button>
      </div>
    </>
  )
}

export default App

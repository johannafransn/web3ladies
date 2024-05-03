import React, { useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import Button from '@/components/button'

import ApiService from '@/api/service'
//Viem imports
import {
	HDAccount,
	PublicClient,
	WalletClient,
	createPublicClient,
	createWalletClient,
	http,
	parseEther,
} from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//Ethers imports
import { HDNodeWallet, JsonRpcProvider, Wallet, ethers } from 'ethers'
import { WETH_ABI, WETH_CONTRACT_ADDRESS, shortenEthAddress } from './constants'

const Index = () => {
	const [dataFetched, setDataFetched] = useState<string | null>(null)

	const [viemWalletClient, setViemWalletClient] = useState<WalletClient | null>(
		null,
	)
	const [viemAccount, setViemAccount] = useState<HDAccount | null>(null)
	const [ethersWallet, setEthersWallet] = useState<HDNodeWallet | null>(null)

	const [viemPublicClient, setViemPublicClient] = useState<PublicClient | null>(
		null,
	)
	const [ethersProvider, setEthersProvider] = useState<JsonRpcProvider | null>(
		null,
	)

	const [wethBalance, setWethBalance] = useState<string>('')
	const [ethersWethContract, setEthersWethContract] = useState<any>(null)
	const [ethersWethContractWithSigner, setEthersWethContractWithSigner] =
		useState<any>(null)

	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			//set viem public client
			const publicClient = createPublicClient({
				chain: sepolia,
				transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
			})
			setViemPublicClient(publicClient)
			//set ethers provider
			const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!)
			setEthersProvider(provider)

			//Set ethers contract for read access
			const contract = new ethers.Contract(
				WETH_CONTRACT_ADDRESS,
				WETH_ABI,
				provider,
			)
			setEthersWethContract(contract)
		}
		fetchData()
	}, [])

	const handleReadData = async () => {
		try {
			if (viemPublicClient && ethersProvider) {
				const data = await viemPublicClient.readContract({
					address: WETH_CONTRACT_ADDRESS,
					abi: WETH_ABI,
					functionName: 'balanceOf',
					args: ['0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020'],
				})
				const stringifiedNumber = ethers.formatEther(data as bigint)
				setWethBalance(stringifiedNumber)

				//With ethers:
				const balance = await ethersWethContract.balanceOf(
					'0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
				)
			} else throw Error('Public client or Provider not defined!')
		} catch (err) {
			setError('Error occurred fetching')
		}
	}

	const handleInstantiateWallet = async () => {
		try {
			//Instantiating the wallet using Viem
			const account = mnemonicToAccount(
				process.env.NEXT_PUBLIC_SEED_PHRASE ?? '',
			)
			setViemAccount(account)
			const walletClient = createWalletClient({
				account,
				chain: sepolia,
				transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
			})
			setViemWalletClient(walletClient)

			//Instantiating Wallet using Ethers
			const ethersWallet = ethers.Wallet.fromPhrase(
				process.env.NEXT_PUBLIC_SEED_PHRASE ?? '',
			)
			setEthersWallet(ethersWallet)
			const contractWithSigner = ethersWethContract.connect(ethersWallet)
			setEthersWethContractWithSigner(contractWithSigner)
		} catch (err) {
			console.log(err, 'error instantiating wallet')
			setError('error instantiating wallet')
		}
	}
	const handleWriteData = async () => {
		try {
			//With viem:
			if (viemWalletClient && viemAccount) {
				console.log('COMING HERE')
				const hej = await viemWalletClient.writeContract({
					account: viemAccount,
					chain: sepolia,
					address: WETH_CONTRACT_ADDRESS,
					abi: WETH_ABI,
					functionName: 'deposit',
					value: parseEther('0.001'),
					// args: [arg1, arg2, ...]
				})
				console.log(hej, 'what is HEEJ?')
			}

			//With ethers:
			/* 	console.log('Calling deposit function...')
			const transactionResponse = await ethersWethContractWithSigner.deposit({
				value: ethers.parseEther('0.05'),
			})
			await transactionResponse.wait()
			console.log(`ETHERS Transaction hash: ${transactionResponse.hash}`) */
		} catch (err) {
			setError('Error occurred fetching')
		}
	}
	const handleSendTransaction = async () => {
		try {
			if (viemWalletClient && viemAccount) {
				console.log('COMING HERE')
				const hash = await viemWalletClient.sendTransaction({
					account: viemAccount,
					chain: sepolia,
					to: '0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
					value: parseEther('0.001'),
				})
				console.log(hash, 'Hash of sending viem transcation?')
			}

			if (ethersWallet) {
				const tx = await ethersWallet.sendTransaction({
					to: '0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
					value: ethers.parseUnits('0.001', 'ether'),
				})
			}
		} catch (err) {
			setError('Error occurred fetching')
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<Page>
				<Section>
					<div className='flex flex-col items-center justify-center gap-6 min-h-full'>
						<h4 className='font-gotham-regular text-white-700 lg:text-7s text-5s text-center  pb-1'>
							Interacting with smart contracts using
						</h4>
						<h2 className='font-gotham-regular text-purple-700 dark:text-purple-200 lg:text-7xl text-5xl text-center  pb-1'>
							Ethers & Viem
						</h2>

						<Button
							onClick={handleReadData}
							text={`Read data ${wethBalance && wethBalance}`}
						/>
						<Button
							onClick={handleInstantiateWallet}
							text={`Instantiate Wallet ${ethersWallet ? shortenEthAddress(viemAccount?.address) : ''}`}
						/>
						<Button onClick={handleWriteData} text={'Write data'} />
						<Button onClick={handleSendTransaction} text={'Send Transaction'} />
					</div>
				</Section>
			</Page>
		</div>
	)
}

export default Index

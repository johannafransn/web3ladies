import React, { useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import Button from '@/components/button'

import ApiService from '@/api/service'
//Viem imports
import {
	PublicClient,
	WalletClient,
	createPublicClient,
	createWalletClient,
	http,
} from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//Ethers imports
import { ethers } from 'ethers'
import { WETH_ABI, WETH_CONTRACT_ADDRESS } from './constants'

const Index = () => {
	const [dataFetched, setDataFetched] = useState<string | null>(null)
	const [viemWalletClient, setViemWalletClient] = useState<WalletClient | null>(
		null,
	)
	const [viemPublicClient, setViemPublicClient] = useState<PublicClient | null>(
		null,
	)

	const [wethBalance, setWethBalance] = useState<string>('')

	const [ethersWallet, setEthersWallet] = useState<any | null>(null)
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
		}
		fetchData()
	}, [])

	const handleReadData = async () => {
		try {
			if (viemPublicClient) {
				const data = await viemPublicClient.readContract({
					address: WETH_CONTRACT_ADDRESS,
					abi: WETH_ABI,
					functionName: 'balanceOf',
					args: ['0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020'],
				})
				const stringifiedNumber = ethers.formatEther(data as bigint)
				setWethBalance(stringifiedNumber)
			} else throw Error('Public client or Provider not defined!')
		} catch (err) {
			setError('Error occurred fetching')
		}
	}

	console.log(
		viemWalletClient,
		'viem wallet client',
		process.env.NEXT_PUBLIC_SEED_PHRASE,
	)
	console.log(ethersWallet, 'ethers wallet')
	const handleInstantiateWallet = async () => {
		try {
			//Instantiating the wallet using Viem
			const account = mnemonicToAccount(
				process.env.NEXT_PUBLIC_SEED_PHRASE ?? '',
			)
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
		} catch (err) {
			console.log(err, 'error instantiating wallet')
			setError('error instantiating wallet')
		}
	}
	const handleWriteData = async () => {
		try {
			const data = await ApiService.getAuthenticatedData()
			setDataFetched(data.data)
			setError(null)
		} catch (err) {
			setError('Error occurred fetching')
		}
	}
	const handleSendTransaction = async () => {
		try {
			const data = await ApiService.getAuthenticatedData()
			setDataFetched(data.data)
			setError(null)
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
							text={'Instantiate wallet'}
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

import React, { useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import Button from '@/components/button'

import ApiService from '@/api/service'
//Viem imports
import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//Ethers imports
import { ethers } from 'ethers'

const Index = () => {
	const [dataFetched, setDataFetched] = useState<string | null>(null)
	const [viemWalletClient, setViemWalletClient] = useState<any | null>(null)
	const [ethersWallet, setEthersWallet] = useState<any | null>(null)

	const [error, setError] = useState<string | null>(null)

	const handleReadData = async () => {
		try {
			const data = await ApiService.getAuthenticatedData()
			setDataFetched(data.data)
			setError(null)
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

						<Button onClick={handleReadData} text={'Read data'} />
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

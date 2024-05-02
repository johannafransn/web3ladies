// Import necessary dependencies
import ApiService from '@/api/service'
import React, { useEffect, useState } from 'react'
import Button from './button'
import { removeCookie, setCookie, shortenAddress } from '@/helper/utils'
import LoadingSpinner from './loading-spinner'

export function SignInButton({
	onSuccess,
	onError,
}: {
	onSuccess: (args: { publicAddress: string }) => void
	onError: (args: { error: Error }) => void
}) {
	const [state, setState] = useState({
		loading: false,
		nonce: '',
		error: null,
	})

	const fetchNonce = async () => {
		try {
			const nonceRes = await ApiService.getNonce()
			const nonce = nonceRes.nonce as string
			setState((prev) => ({ ...prev, nonce }))
		} catch (error) {
			//setState((prev) => ({ ...prev, error }))
		}
	}

	const logOut = async () => {
		try {
			removeCookie()
		} catch (error) {
			//setState((prev) => ({ ...prev, error }))
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			fetchNonce()
		}
	}, []) // Empty dependency array ensures this effect runs once after mount

	return (
		<>
			{!true ? (
				<Button
					text={'Sign In'}
					disabled={!state.nonce}
					onClick={() => console.log('HEJ')}
				/>
			) : (
				<>
					{state.loading ? (
						<LoadingSpinner />
					) : (
						<>
							<h4 className='font-gotham-regular text-white-700 lg:text-7s text-5s text-center px-8 md:p-20 pb-10'>
								Success you logged in and authenticated! <br />
							</h4>
							<Button text={'Log out'} onClick={logOut} />
						</>
					)}
				</>
			)}
		</>
	)
}

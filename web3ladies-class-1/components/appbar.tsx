import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'universal-cookie'

const Appbar = () => {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-purple-900 pt-safe'>
			<header className='border-b px-safe dark:border-b-2 purple:border-purple-800  pt-6'>
				<div className='mx-auto flex justify-around h-20 max-w-screen-md place-content-center place-items-center px-6'>
					<Link
						href='/'
						className='hover:cursor-pointer hover:opacity-80 justify-between items-center inline-flex'
					>
						<h1 className='font-medium text-4xl font-gotham-regular text-white'>
							web3ladies-class-1
						</h1>
					</Link>
				</div>
			</header>
		</div>
	)
}

export default Appbar

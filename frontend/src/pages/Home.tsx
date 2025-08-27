import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
	const navigate = useNavigate()
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) {
			setError('Please enter a topic or Wikipedia URL')
			return
		}
		
		setIsLoading(true)
		setError('')
		
		// Simulate a brief loading state for better UX
		await new Promise(resolve => setTimeout(resolve, 500))
		
		try {
			navigate(`/results?topic=${encodeURIComponent(input.trim())}`)
		} catch (err) {
			setError('Navigation failed. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value)
		if (error) setError('')
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			handleSubmit(e as any)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blackish via-gray-900 to-blackish flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<div className="mb-6">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange/20 to-orange/10 rounded-full mb-4">
							<svg className="w-10 h-10 text-orange" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
							</svg>
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
							Wiki Summarizer
						</h1>
						<p className="text-xl text-offwhite/80 max-w-2xl mx-auto leading-relaxed">
							Get comprehensive, AI-powered summaries of any Wikipedia topic. 
							Understand complex subjects in minutes, not hours.
						</p>
					</div>
				</div>

				{/* Search Form */}
				<div className="glass p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-semibold text-white mb-2">
								What would you like to learn about?
							</h2>
							<p className="text-offwhite/70">
								Enter a topic name or paste a Wikipedia URL
							</p>
						</div>

						<div className="space-y-4">
							<div className="relative">
								<input
									type="text"
									value={input}
									onChange={handleInputChange}
									onKeyPress={handleKeyPress}
									placeholder="e.g., Quantum Physics, Albert Einstein, or https://en.wikipedia.org/wiki/Artificial_intelligence"
									className="w-full rounded-xl px-6 py-4 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white/15 transition-all duration-300 text-lg border border-white/20"
									disabled={isLoading}
								/>
								<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
									<div className="w-6 h-6 bg-gradient-to-br from-orange/20 to-orange/10 rounded-lg flex items-center justify-center">
										<svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
										</svg>
									</div>
								</div>
							</div>

							{/* Error Display */}
							{error && (
								<div className="flex items-center gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
									<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
									</svg>
									<span className="text-sm">{error}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={isLoading || !input.trim()}
								className="w-full rounded-xl px-8 py-4 bg-gradient-to-r from-orange to-orange/80 text-blackish font-bold text-lg hover:from-orange/90 hover:to-orange/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange/25"
							>
								{isLoading ? (
									<div className="flex items-center justify-center gap-3">
										<div className="w-5 h-5 border-2 border-blackish border-t-transparent rounded-full animate-spin"></div>
										<span>Processing...</span>
									</div>
								) : (
									'Generate Summary'
								)}
							</button>
						</div>
					</form>

					{/* Examples */}
					<div className="mt-8 pt-6 border-t border-white/10">
						<div className="text-center mb-4">
							<p className="text-sm text-offwhite/60 mb-3">Try these fascinating topics:</p>
							<div className="flex flex-wrap justify-center gap-2">
								{[
									'Bermuda Triangle',
									'Voynich Manuscript', 
									'Illusion of Control',
									'Game Theory',
									'GameStop Short Squeeze'
								].map((example) => (
									<button
										key={example}
										onClick={() => setInput(example)}
										className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-offwhite/80 hover:text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 border border-white/10"
									>
										{example}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="mt-12 grid md:grid-cols-3 gap-6">
					{[
						{
							icon: '📚',
							title: 'Comprehensive Summaries',
							description: 'Get detailed breakdowns across multiple categories including history, controversies, and impact.'
						},
						{
							icon: '🤖',
							title: 'AI-Powered Analysis',
							description: 'Advanced AI processes complex information to deliver clear, structured insights.'
						},
						{
							icon: '⚡',
							title: 'Lightning Fast',
							description: 'Generate summaries in minutes, not hours. Perfect for research and learning.'
						}
					].map((feature, index) => (
						<div key={index} className="glass p-6 rounded-xl border border-white/10 text-center hover:border-white/20 transition-all duration-300 hover:scale-105">
							<div className="text-4xl mb-3">{feature.icon}</div>
							<h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
							<p className="text-sm text-offwhite/70 leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Home

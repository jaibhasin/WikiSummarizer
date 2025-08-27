import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

function SectionCard({ title, text }: { title: string; text: string }) {
	return (
		<div className="glass p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-orange/20 hover:scale-[1.02] cursor-pointer group">
			{/* Header with icon and title */}
			<div className="flex items-start justify-between mb-3 md:mb-4">
				<div className="flex items-center gap-2 md:gap-3">
					<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-orange/20 to-orange/10 flex items-center justify-center group-hover:from-orange/30 group-hover:to-orange/20 transition-all duration-300">
						<span className="text-orange text-base md:text-lg font-bold">
							{title.charAt(0)}
						</span>
					</div>
					<h3 className="text-lg md:text-xl font-bold text-white group-hover:text-orange transition-colors duration-300">
						{title}
					</h3>
				</div>
				<div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange/60 group-hover:bg-orange transition-colors duration-300"></div>
			</div>
			
			{/* Content */}
			<div className="space-y-3 md:space-y-4">
				<p className="text-sm md:text-base leading-6 md:leading-7 text-offwhite/90 whitespace-pre-wrap group-hover:text-white transition-colors duration-300">
					{text}
				</p>
				
				{/* Footer with stats and visual elements */}
				<div className="pt-3 md:pt-4 border-t border-white/10">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-offwhite/60">
							<span className="flex items-center gap-1.5 md:gap-2">
								<svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								{text.split(' ').length} words
							</span>
							<span className="flex items-center gap-1.5 md:gap-2">
								<svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
									<path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
								</svg>
								{text.length} chars
							</span>
						</div>
						<div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-orange/20 to-transparent group-hover:from-orange/30 transition-all duration-300"></div>
					</div>
				</div>
			</div>
		</div>
	)
}

function SwipeableCards({ data }: { data: any }) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [touchStart, setTouchStart] = useState(0)
	const [touchEnd, setTouchEnd] = useState(0)
	
	const sections = [
		{ title: "Quick Overview", text: data.Quick_Overview },
		{ title: "History & Timeline", text: data.History_n_Timeline },
		{ title: "Controversies & Debates", text: data.Controversies_n_Debates },
		{ title: "Impact & Legacy", text: data.Impact_n_Legacy },
		{ title: "Further Reading & References", text: data.Further_Reading_n_References }
	]

	const nextCard = () => {
		setCurrentIndex((prev) => (prev + 1) % sections.length)
	}

	const prevCard = () => {
		setCurrentIndex((prev) => (prev - 1 + sections.length) % sections.length)
	}

	// Touch handlers for swipe gestures
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX)
	}

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return
		
		const distance = touchStart - touchEnd
		const isLeftSwipe = distance > 50
		const isRightSwipe = distance < -50

		if (isLeftSwipe) {
			nextCard()
		}
		if (isRightSwipe) {
			prevCard()
		}

		// Reset values
		setTouchStart(0)
		setTouchEnd(0)
	}

	return (
		<div className="md:hidden">
			<div className="relative">
				{/* Card container */}
				<div 
					className="overflow-hidden rounded-2xl"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						{sections.map((section, index) => (
							<div key={index} className="w-full flex-shrink-0">
								<SectionCard title={section.title} text={section.text} />
							</div>
						))}
					</div>
				</div>
				
				{/* Enhanced navigation dots */}
				<div className="flex justify-center mt-4 md:mt-6 space-x-2 md:space-x-3">
					{sections.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
								index === currentIndex 
									? 'bg-orange scale-125 shadow-lg shadow-orange/50' 
									: 'bg-white/30 hover:bg-white/50'
							}`}
						/>
					))}
				</div>
				
				{/* Enhanced navigation arrows */}
				<button
					onClick={prevCard}
					className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-blackish/90 text-white p-2 md:p-3 rounded-full hover:bg-blackish transition-all duration-300 z-10 hover:scale-110 shadow-lg"
					aria-label="Previous card"
				>
					<svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					onClick={nextCard}
					className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-blackish/90 text-white p-2 md:p-3 rounded-full hover:bg-blackish transition-all duration-300 z-10 hover:scale-110 shadow-lg"
					aria-label="Next card"
				>
					<svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
				
				{/* Enhanced swipe hint */}
				<div className="text-center mt-3 md:mt-4 text-xs md:text-sm text-offwhite/60">
					<div className="flex items-center justify-center gap-1.5 md:gap-2">
						<svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
						</svg>
						Swipe left/right or use arrows
					</div>
				</div>
			</div>
		</div>
	)
}

function GridCards({ data }: { data: any }) {
	return (
		<div className="hidden md:block">
			<div className="grid grid-cols-12 gap-4 lg:gap-5 auto-rows-fr">
				{/* Top row - 2 cards side by side */}
				<div className="col-span-6">
					<SectionCard title="Quick Overview" text={data.Quick_Overview} />
				</div>
				<div className="col-span-6">
					<SectionCard title="History & Timeline" text={data.History_n_Timeline} />
				</div>
				
				{/* Middle row - 1 centered card spanning 6 columns for better balance */}
				<div className="col-span-3"></div>
				<div className="col-span-6">
					<SectionCard title="Controversies & Debates" text={data.Controversies_n_Debates} />
				</div>
				<div className="col-span-3"></div>
				
				{/* Bottom row - 2 cards side by side */}
				<div className="col-span-6">
					<SectionCard title="Impact & Legacy" text={data.Impact_n_Legacy} />
				</div>
				<div className="col-span-6">
					<SectionCard title="Further Reading & References" text={data.Further_Reading_n_References} />
				</div>
			</div>
		</div>
	)
}

function QnA({ topic }: { topic: string }) {
	const [question, setQuestion] = useState('')
	const [answer, setAnswer] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	
	const ask = async () => {
		if (!question.trim()) return
		setLoading(true)
		setError(null)
		setAnswer(null) // Clear previous answer
		
		try {
			const res = await axios.post(
				`${API_BASE}/wiki/get_response`,
				{ query: question },
				{ withCredentials: true, timeout: 60000 }
			)
			setAnswer(res.data.response)
		} catch (e: any) {
			let errorMessage = 'Error fetching answer'
			if (e.code === 'ECONNABORTED') {
				errorMessage = 'Request timed out. Please try again.'
			} else if (e.response?.status === 408) {
				errorMessage = 'Request timed out. Please try again.'
			} else if (e.response?.data?.detail) {
				errorMessage = e.response.data.detail
			} else if (e.message) {
				errorMessage = e.message
			}
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}
	
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !loading) {
			ask()
		}
	}
	
	const clearQuestion = () => {
		setQuestion('')
		setAnswer(null)
		setError(null)
	}
	
	return (
		<div className="fixed bottom-0 left-0 right-0 glass p-3 md:p-4 lg:p-6 border-t border-white/10 z-50 backdrop-blur-xl">
			<div className="max-w-6xl mx-auto">
				{/* Compact header for mobile */}
				<div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
					<div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-orange/20 to-orange/10 rounded-lg flex items-center justify-center">
						<svg className="w-3 h-3 md:w-5 md:h-5 text-orange" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
						</svg>
					</div>
					<h3 className="text-sm md:text-lg lg:text-xl font-bold text-white">Ask about "{topic}"</h3>
				</div>
				
				{/* Compact input and button for mobile */}
				<div className="flex gap-2 md:gap-4 mb-2 md:mb-4">
					<div className="flex-1 relative">
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your question..."
							className="w-full rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-4 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white/15 transition-all duration-300 text-sm md:text-base border border-white/20"
							maxLength={200}
						/>
						<div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-xs md:text-sm text-white/40 bg-blackish/50 px-1 md:px-2 py-0.5 md:py-1 rounded">
							{question.length}/200
						</div>
					</div>
					<button 
						onClick={ask} 
						disabled={loading || !question.trim()} 
						className="px-4 py-2 md:px-8 md:py-4 bg-gradient-to-r from-orange to-orange/80 text-blackish font-bold disabled:opacity-50 text-sm md:text-base transition-all duration-300 hover:from-orange/90 hover:to-orange/70 disabled:hover:from-orange disabled:hover:to-orange/80 rounded-lg md:rounded-xl hover:scale-105 shadow-lg shadow-orange/25"
					>
						{loading ? (
							<div className="flex items-center gap-1 md:gap-2">
								<div className="w-3 h-3 md:w-4 md:h-4 border-2 border-blackish border-t-transparent rounded-full animate-spin"></div>
								<span className="hidden md:inline">Asking...</span>
								<span className="md:hidden">...</span>
							</div>
						) : 'Ask'}
					</button>
					{answer && (
						<button 
							onClick={clearQuestion}
							className="px-3 py-2 md:px-6 md:py-4 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base transition-all duration-300 hover:scale-105 rounded-lg md:rounded-xl border border-white/20"
						>
							Clear
						</button>
					)}
				</div>
				
				{/* Compact error display */}
				{error && (
					<div className="mb-2 md:mb-4 p-2 md:p-4 bg-red-500/20 border border-red-500/30 rounded-lg md:rounded-xl text-red-400 text-xs md:text-sm flex items-center gap-2 md:gap-3">
						<div className="w-4 h-4 md:w-5 md:h-5 bg-red-500/20 rounded-full flex items-center justify-center">
							<svg className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
							</svg>
						</div>
						<span>{error}</span>
					</div>
				)}
				
				{/* Compact answer display */}
				{answer && (
					<div className="p-2 md:p-4 bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 rounded-lg md:rounded-xl">
						<div className="flex items-start gap-2 md:gap-3">
							<div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg className="w-3 h-3 md:w-5 md:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
								</svg>
							</div>
							<div className="flex-1">
								<div className="text-green-400 font-bold text-sm md:text-base mb-1 md:mb-2">Answer:</div>
								<div className="text-green-400/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{answer}</div>
								<div className="text-green-400/70 text-xs md:text-sm mt-2 md:mt-3 flex items-center gap-2 md:gap-4">
									<span className="flex items-center gap-1 md:gap-2">
										<svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
										</svg>
										{answer.split(' ').length} words
									</span>
									<span className="flex items-center gap-1 md:gap-2">
										<svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
											<path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
										</svg>
										{answer.length} chars
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

function Results() {
	const [params] = useSearchParams()
	const topicRaw = params.get('topic') ?? ''
	const topic = useMemo(() => {
		try {
			const url = new URL(topicRaw)
			if (url.hostname.includes('wikipedia.org')) {
				const slug = decodeURIComponent(url.pathname.split('/').pop() || '')
				return slug.replaceAll('_', ' ')
			}
			return topicRaw
		} catch {
			return topicRaw
		}
	}, [topicRaw])

	const [data, setData] = useState<any | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const fetchData = async () => {
		if (!topic) return
		setLoading(true)
		setError(null)
		try {
			const res = await axios.post(
				`${API_BASE}/wiki/fetch_page`,
				{ topic },
				{ withCredentials: true, timeout: 300000 } // 5 minute timeout
			)
			setData(res.data)
		} catch (e: any) {
			let errorMessage = 'Error fetching summaries'
			if (e.code === 'ECONNABORTED') {
				errorMessage = 'Request timed out. The backend is taking longer than expected. Please try again.'
			} else if (e.response?.status === 408) {
				errorMessage = 'Request timed out. The backend is taking longer than expected. Please try again.'
			} else if (e.response?.status === 500) {
				errorMessage = 'Backend error. Please try again or contact support if the issue persists.'
			} else if (e.response?.data?.detail) {
				errorMessage = e.response.data.detail
			} else if (e.message) {
				errorMessage = e.message
			}
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [topic])

	return (
		<div className="min-h-screen bg-blackish p-4 md:p-6 lg:p-8 pb-28 md:pb-32 lg:pb-36">
			<div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
				{/* Enhanced Header */}
				<header className="text-center space-y-3 md:space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
							Summaries for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange/80">{topic}</span>
						</h1>
						<a 
							href="/" 
							className="px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 text-sm md:text-base"
						>
							New Search
						</a>
					</div>
					<div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-orange to-orange/60 rounded-full mx-auto"></div>
				</header>

				{/* Loading State */}
				{loading && (
					<div className="glass p-6 md:p-8 text-center rounded-xl md:rounded-2xl border border-white/10">
						<div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-orange border-t-transparent rounded-full mx-auto mb-3 md:mb-4"></div>
						<div className="text-lg md:text-xl font-semibold text-white mb-2">Generating summaries...</div>
						<div className="text-sm md:text-base text-offwhite/70">This may take a few minutes for complex topics</div>
					</div>
				)}
				
				{/* Error State */}
				{error && (
					<div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl border border-red-500/30 bg-red-500/10">
						<div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
							<div className="w-6 h-6 md:w-8 md:h-8 bg-red-500/20 rounded-full flex items-center justify-center">
								<svg className="w-3 h-3 md:w-5 md:h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
								</svg>
							</div>
							<div className="text-red-400 font-semibold text-sm md:text-base">{error}</div>
						</div>
						<button 
							onClick={fetchData}
							className="px-4 py-2 md:px-6 md:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg md:rounded-xl transition-colors duration-300 font-medium text-sm md:text-base"
						>
							Try Again
						</button>
					</div>
				)}

				{/* Content */}
				{data && (
					<div className="space-y-6 md:space-y-8">
						{/* Mobile: Swipeable cards */}
						<SwipeableCards data={data} />
						
						{/* Desktop: Grid layout */}
						<GridCards data={data} />
					</div>
				)}
			</div>
			
			{data && <QnA topic={topic} />}
		</div>
	)
}

export default Results

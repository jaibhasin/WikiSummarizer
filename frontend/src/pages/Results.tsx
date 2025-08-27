import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

function SectionCard({ title, text }: { title: string; text: string }) {
	return (
		<div className="glass p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange/20 hover:scale-[1.01] cursor-pointer group">
			{/* Compact header */}
			<div className="flex items-center gap-3 mb-3">
				<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange/20 to-orange/10 flex items-center justify-center group-hover:from-orange/30 transition-all duration-300">
					<span className="text-orange text-sm font-bold">{title.charAt(0)}</span>
				</div>
				<h3 className="text-lg font-bold text-white group-hover:text-orange transition-colors duration-300 flex-1">
					{title}
				</h3>
				<div className="w-2 h-2 rounded-full bg-orange/60 group-hover:bg-orange transition-colors duration-300"></div>
			</div>
			
			{/* Content */}
			<p className="text-sm leading-6 text-offwhite/90 whitespace-pre-wrap group-hover:text-white transition-colors duration-300 mb-3">
				{text}
			</p>
			
			{/* Compact footer */}
			<div className="flex items-center justify-between text-xs text-offwhite/60">
				<div className="flex items-center gap-3">
					<span className="flex items-center gap-1">
						<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						{text.split(' ').length} words
					</span>
					<span className="flex items-center gap-1">
						<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
							<path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
						</svg>
						{text.length} chars
					</span>
				</div>
				<div className="w-5 h-5 rounded bg-gradient-to-br from-orange/20 to-transparent group-hover:from-orange/30 transition-all duration-300"></div>
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

	const nextCard = () => setCurrentIndex((prev) => (prev + 1) % sections.length)
	const prevCard = () => setCurrentIndex((prev) => (prev - 1 + sections.length) % sections.length)

	const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
	const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return
		const distance = touchStart - touchEnd
		if (distance > 50) nextCard()
		if (distance < -50) prevCard()
		setTouchStart(0)
		setTouchEnd(0)
	}

	return (
		<div className="md:hidden">
			<div className="relative">
				<div 
					className="overflow-hidden rounded-xl"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						{sections.map((section, index) => (
							<div key={index} className="w-full flex-shrink-0">
								<SectionCard title={section.title} text={section.text} />
							</div>
						))}
					</div>
				</div>
				
				{/* Compact navigation */}
				<div className="flex justify-center mt-4 space-x-2">
					{sections.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${
								index === currentIndex ? 'bg-orange scale-110' : 'bg-white/30 hover:bg-white/50'
							}`}
						/>
					))}
				</div>
				
				{/* Navigation arrows */}
				<button
					onClick={prevCard}
					className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blackish/90 text-white p-2 rounded-full hover:bg-blackish transition-all duration-300 z-10 hover:scale-110 shadow-lg"
					aria-label="Previous card"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					onClick={nextCard}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blackish/90 text-white p-2 rounded-full hover:bg-blackish transition-all duration-300 z-10 hover:scale-110 shadow-lg"
					aria-label="Next card"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
				
				<div className="text-center mt-3 text-xs text-offwhite/60">
					Swipe left/right or use arrows
				</div>
			</div>
		</div>
	)
}

function GridCards({ data }: { data: any }) {
	return (
		<div className="hidden md:block">
			<div className="grid grid-cols-12 gap-4 auto-rows-fr">
				{/* Top row */}
				<div className="col-span-6">
					<SectionCard title="Quick Overview" text={data.Quick_Overview} />
				</div>
				<div className="col-span-6">
					<SectionCard title="History & Timeline" text={data.History_n_Timeline} />
				</div>
				
				{/* Middle row - centered */}
				<div className="col-span-3"></div>
				<div className="col-span-6">
					<SectionCard title="Controversies & Debates" text={data.Controversies_n_Debates} />
				</div>
				<div className="col-span-3"></div>
				
				{/* Bottom row */}
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
		setAnswer(null)
		
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
		if (e.key === 'Enter' && !loading) ask()
	}
	
	const clearQuestion = () => {
		setQuestion('')
		setAnswer(null)
		setError(null)
	}
	
	return (
		<div className="fixed bottom-0 left-0 right-0 glass p-3 md:p-4 border-t border-white/10 z-50 backdrop-blur-xl">
			<div className="max-w-5xl mx-auto">
				{/* Compact header */}
				<div className="flex items-center gap-2 mb-3">
					<div className="w-6 h-6 bg-gradient-to-br from-orange/20 to-orange/10 rounded-lg flex items-center justify-center">
						<svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
						</svg>
					</div>
					<h3 className="text-sm md:text-base font-bold text-white">Ask about "{topic}"</h3>
				</div>
				
				{/* Input and button */}
				<div className="flex gap-2 mb-3">
					<div className="flex-1 relative">
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your question..."
							className="w-full rounded-lg px-3 py-2 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white/15 transition-all duration-300 text-sm border border-white/20"
							maxLength={200}
						/>
						<div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white/40 bg-blackish/50 px-1 py-0.5 rounded">
							{question.length}/200
						</div>
					</div>
					<button 
						onClick={ask} 
						disabled={loading || !question.trim()} 
						className="px-4 py-2 bg-gradient-to-r from-orange to-orange/80 text-blackish font-bold disabled:opacity-50 text-sm transition-all duration-300 hover:from-orange/90 hover:to-orange/70 rounded-lg hover:scale-105 shadow-lg shadow-orange/25"
					>
						{loading ? (
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 border-2 border-blackish border-t-transparent rounded-full animate-spin"></div>
								<span className="hidden md:inline">Asking...</span>
								<span className="md:hidden">...</span>
							</div>
						) : 'Ask'}
					</button>
					{answer && (
						<button 
							onClick={clearQuestion}
							className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300 hover:scale-105 rounded-lg border border-white/20"
						>
							Clear
						</button>
					)}
				</div>
				
				{/* Error display */}
				{error && (
					<div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
						<div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
							<svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
							</svg>
						</div>
						<span>{error}</span>
					</div>
				)}
				
				{/* Answer display */}
				{answer && (
					<div className="p-3 bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 rounded-lg">
						<div className="flex items-start gap-2">
							<div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
								<svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
								</svg>
							</div>
							<div className="flex-1">
								<div className="text-green-400 font-bold text-sm mb-1">Answer:</div>
								<div className="text-green-400/90 text-sm leading-relaxed whitespace-pre-wrap">{answer}</div>
								<div className="text-green-400/70 text-xs mt-2 flex items-center gap-3">
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
										</svg>
										{answer.split(' ').length} words
									</span>
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
				{ withCredentials: true, timeout: 300000 }
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
		<div className="min-h-screen bg-blackish p-4 md:p-6 pb-24 md:pb-28">
			<div className="max-w-5xl mx-auto space-y-6">
				{/* Compact Header */}
				<header className="text-center space-y-3">
					<div className="flex items-center justify-between">
						<h1 className="text-xl md:text-2xl font-bold text-white">
							Summaries for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange/80">{topic}</span>
						</h1>
						<a 
							href="/" 
							className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 text-sm"
						>
							New Search
						</a>
					</div>
					<div className="w-16 h-0.5 bg-gradient-to-r from-orange to-orange/60 rounded-full mx-auto"></div>
				</header>

				{/* Loading State */}
				{loading && (
					<div className="glass p-6 text-center rounded-xl border border-white/10">
						<div className="animate-spin w-10 h-10 border-4 border-orange border-t-transparent rounded-full mx-auto mb-3"></div>
						<div className="text-lg font-semibold text-white mb-2">Generating summaries...</div>
						<div className="text-sm text-offwhite/70">This may take a few minutes for complex topics</div>
					</div>
				)}
				
				{/* Error State */}
				{error && (
					<div className="glass p-4 rounded-xl border border-red-500/30 bg-red-500/10">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
								<svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
								</svg>
							</div>
							<div className="text-red-400 font-semibold text-sm">{error}</div>
						</div>
						<button 
							onClick={fetchData}
							className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 font-medium text-sm"
						>
							Try Again
						</button>
					</div>
				)}

				{/* Content */}
				{data && (
					<div className="space-y-6">
						<SwipeableCards data={data} />
						<GridCards data={data} />
					</div>
				)}
			</div>
			
			{data && <QnA topic={topic} />}
		</div>
	)
}

export default Results

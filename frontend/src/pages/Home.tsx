import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
	const navigate = useNavigate()
	const [input, setInput] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return
		navigate(`/results?topic=${encodeURIComponent(input.trim())}`)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-blackish">
			<div className="glass w-full max-w-2xl p-8 mx-4">
				<h1 className="text-3xl font-semibold mb-2">Wiki Summarizer</h1>
				<p className="text-sm text-offwhite/70 mb-6">Enter a Wikipedia topic or URL</p>
				<form onSubmit={handleSubmit} className="flex gap-3">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="e.g., Alan Turing or https://en.wikipedia.org/wiki/Alan_Turing"
						className="flex-1 rounded-lg px-4 py-3 bg-white/10 text-offwhite placeholder:text-offwhite/50 focus:outline-none focus:ring-2 focus:ring-orange"
					/>
					<button
						type="submit"
						className="rounded-lg px-6 py-3 bg-orange text-blackish font-medium hover:opacity-90 transition"
					>
						Summarize
					</button>
				</form>
			</div>
		</div>
	)
}

export default Home

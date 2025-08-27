import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

function SectionCard({ title, text }: { title: string; text: string }) {
	return (
		<div className="glass p-5">
			<h3 className="text-xl font-semibold mb-2 accent-orange">{title}</h3>
			<p className="whitespace-pre-wrap leading-7 text-offwhite/90">{text}</p>
		</div>
	)
}

function QnA({ topic }: { topic: string }) {
	const [question, setQuestion] = useState('')
	const [answer, setAnswer] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const ask = async () => {
		if (!question.trim()) return
		setLoading(true)
		try {
			const res = await axios.post(
				`${API_BASE}/wiki/get_response`,
				{ query: question },
				{ withCredentials: true }
			)
			setAnswer(res.data.response)
		} catch (e: any) {
			setAnswer(e?.response?.data?.detail ?? 'Error fetching answer')
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="glass p-5">
			<h3 className="text-xl font-semibold mb-3">Ask a question about "{topic}"</h3>
			<div className="flex gap-3">
				<input
					type="text"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder="Type your question..."
					className="flex-1 rounded-lg px-4 py-3 bg-white/10 text-offwhite placeholder:text-offwhite/50 focus:outline-none focus:ring-2 focus:ring-orange"
				/>
				<button onClick={ask} disabled={loading} className="rounded-lg px-6 py-3 bg-orange text-blackish font-medium disabled:opacity-50">
					{loading ? 'Asking...' : 'Ask'}
				</button>
			</div>
			{answer && (
				<div className="mt-4 whitespace-pre-wrap text-offwhite/90">{answer}</div>
			)}
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

	useEffect(() => {
		if (!topic) return
		setLoading(true)
		setError(null)
		axios
			.post(
				`${API_BASE}/wiki/fetch_page`,
				{ topic },
				{ withCredentials: true }
			)
			.then((res) => setData(res.data))
			.catch((e) => setError(e?.response?.data?.detail ?? 'Error fetching summaries'))
			.finally(() => setLoading(false))
	}, [topic])

	return (
		<div className="min-h-screen bg-blackish p-6 md:p-10">
			<div className="max-w-5xl mx-auto space-y-6">
				<header className="flex items-center justify-between">
					<h1 className="text-2xl md:text-3xl font-semibold">
						Summaries for <span className="accent-orange">{topic}</span>
					</h1>
					<a href="/" className="text-offwhite/70 hover:text-offwhite">New search</a>
				</header>

				{loading && <div className="glass p-5">Generating summaries...</div>}
				{error && <div className="glass p-5 text-red-400">{error}</div>}

				{data && (
					<div className="grid gap-4">
						<SectionCard title="Quick Overview" text={data.Quick_Overview} />
						<SectionCard title="History & Timeline" text={data.History_n_Timeline} />
						<SectionCard title="Controversies & Debates" text={data.Controversies_n_Debates} />
						<SectionCard title="Impact & Legacy" text={data.Impact_n_Legacy} />
						<SectionCard title="Further Reading & References" text={data.Further_Reading_n_References} />
						<QnA topic={topic} />
					</div>
				)}
			</div>
		</div>
	)
}

export default Results

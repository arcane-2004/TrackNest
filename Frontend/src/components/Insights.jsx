import React from 'react'
import { useState, useContext } from 'react'
import axios from 'axios'
import { AccountContext } from '../context/AccountContext';

const Insights = () => {

    const { selectedAccountId, } = useContext(AccountContext);

    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchBudgetInsights = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/analysis/complete-insights/${selectedAccountId}`,
                {
                    withCredentials: true
                }
            )
            setInsights(response.data.insights);


        } catch (error) {
            console.log('Error fetching insights: ', error.response)
        } finally {
            setLoading(false)
        }

    }



    return (
        <div>
            <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/60 px-5 py-4  mb-5">
                <div className='flex items-center justify-between gap-4'>
                    <div>
                        <p className="text-sm font-medium text-white">
                            AI Overview
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Generate a smart summary of your recent income & spending
                        </p>
                    </div>

                    <button
                        className="flex items-center gap-2 rounded-xl bg-orange-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-orange-500 transition"

                        onClick={() => { fetchBudgetInsights() }}
                    >
                        {
                            loading ? '✨ Generating...'
                                : '✨ Generate'
                        }

                    </button>
                </div>

                {/* ============== overview display =================== */}
                <div className="mt-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Tone indicator */}
                    <div className="flex items-center gap-2 mb-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${insights.tone === "positive"
                                    ? "bg-green-500/20 text-green-400"
                                    : insights.tone === "warning"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                }`}
                        >
                            {insights.tone?.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-white">AI Overview</span>
                    </div>

                    {/* Summary */}
                    <p className="text-white text-sm leading-relaxed mb-4">
                        {insights.summary}
                    </p>

                    {/* Highlights */}
                    {insights.highlights?.length > 0 && (
                        <ul className="space-y-1 mb-4">
                            {insights.highlights.map((h, idx) => (
                                <li key={idx} className="text-sm text-zinc-300">
                                    • {h}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Tips */}
                    {insights.tips?.length > 0 && (
                        <div className="pt-3 border-t border-orange-500/20">
                            <p className="text-xs text-zinc-400 mb-1">Suggestions</p>
                            <ul className="space-y-1">
                                {insights.tips.map((t, idx) => (
                                    <li key={idx} className="text-xs text-zinc-300">
                                        – {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </div>




        </div>
    )
}

export default Insights

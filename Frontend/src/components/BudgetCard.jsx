import React from 'react'

import { Icons } from "../assets/CategoryIcons"
import { SquarePen, Trash2 } from "lucide-react"
import SimpleGauge from '../components/ProgressGauge';

import { AccountContext } from '../context/AccountContext';

const BudgetCard = ({ bgt, setEditBudget, handleDelete, setOpen }) => {

    return (
        <div
            key={bgt.budgetId}
            className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur hover:border-white/30 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
        >
            <div className="p-6 flex items-center justify-between gap-8">

                {/* LEFT: Budget info */}
                <div className="flex items-start gap-8 w-full">

                    {/* INFO BLOCK */}
                    <div className="min-w-[240px] space-y-3">
                        <div className="flex items-center gap-4">
                            <div
                                className="h-11 w-11 rounded-xl flex items-center justify-center border"
                                style={{
                                    color: bgt.categoryId?.color,
                                    backgroundColor: `${bgt.categoryId?.color}22`,
                                    borderColor: `${bgt.categoryId?.color}55`,
                                }}
                            >
                                {bgt.categoryId?.icon && Icons[bgt.categoryId.icon] ? (
                                    (() => {
                                        const Icon = Icons[bgt.categoryId.icon];
                                        return <Icon className="h-6 w-6" />;
                                    })()
                                ) : (
                                    <span className="text-sm font-semibold">₹</span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white leading-tight">
                                    {bgt.categoryId?.name || "Overall Budget"}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    {bgt.period} budget
                                </p>
                            </div>
                        </div>

                        {/* NUMBERS */}
                        <div className="space-y-1">
                            <p className="text-sm text-zinc-400">
                                Limit
                                <span className="ml-2 text-zinc-100 font-medium">
                                    ₹{bgt.limit}
                                </span>
                            </p>

                            <p className="text-sm text-zinc-400">
                                Spent
                                <span
                                    className={`ml-2 font-medium ${bgt.spent > bgt.limit
                                            ? "text-red-500"
                                            : "text-orange-400"
                                        }`}
                                >
                                    ₹{bgt.spent || 0}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* CENTER: Gauge + messages */}
                    <div className="flex-1 flex items-center gap-6">
                        <SimpleGauge value={bgt.percentUsed} />

                        {/* MESSAGES */}
                        <div className="space-y-2 max-w-md">
                            {bgt.messages?.map((msg, index) => (
                                <div
                                    key={index}
                                    className=" px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700 text-sm text-zinc-200"
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex flex-col items-center gap-4 pl-5 border-l border-zinc-800">
                    <button
                        className="p-2.5 rounded-xl text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition "
                        onClick={() => {
                            setEditBudget(bgt);
                            setOpen(true);
                        }}
                    >
                        <SquarePen size={18} />
                    </button>

                    <button
                        onClick={() => handleDelete(bgt.budgetId)}
                        className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>

    )
}

export default BudgetCard

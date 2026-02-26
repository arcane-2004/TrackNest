import React from 'react'
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash2, Info } from 'lucide-react';
import CreateTransaction from "../components/createTransaction";
import { Icons } from "../assets/CategoryIcons"
import TransactionDescription from './TransactionDescription';
import {
    TableCell,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";



const TransactionCard = ({ handelDelete, t, i, onSuccess }) => {

    const [open, setOpen] = useState(false)

    return (

        <TableRow key={i} className="hover:bg-zinc-800/50 transition-colors"

        >

            <TableCell className="font-medium text-white">
                {t.name || "Untitled"}
            </TableCell>
            <TableCell className="text-zinc-300">
                {t.dateTime ? (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-300">
                            {new Date(t.dateTime).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                        <span className="text-xs text-zinc-500">
                            {new Date(t.dateTime).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </span>
                    </div>
                ) : (
                    <span className="text-zinc-500">N/A</span>
                )}
            </TableCell>
            <TableCell className="text-zinc-300 ">
                {/* <div
            className="rounded-xl w-fit h-7 p-4 shadow-md flex items-center justify-center gap-4"
            style={{
                backgroundColor: `${t.categoryId.color}22`,
                border: `1px solid ${t.categoryId.color}55`,
            }}
        > */}
                <div className=' w-full'>
                    <div className='h-10 w-10 rounded-full flex items-center justify-center'
                        style={{
                            // backgroundColor: t.categoryId.color,
                            borderColor: t.categoryId.color,
                            color: t.categoryId.color,
                            backgroundColor: `${t.categoryId.color}22`,
                            border: `1px solid ${t.categoryId.color}55`,
                        }}
                    >
                        {(() => {
                            const Icon = Icons[t.categoryId.icon];
                            return (
                                <Icon style={{ height: "25px", width: "25px" }} />
                            );
                        })()}
                    </div>
                </div>
                {/* <h4 className="font-semibold text-md text-white mt-2 text-center">
                {t.categoryId.name}
            </h4> */}

                {/* </div> */}
            </TableCell>
            <TableCell className="text-zinc-300">
                {t.accountId.name || "—"}
            </TableCell>
            <TableCell className="text-zinc-300">
                {t.paymentMethod || "—"}
            </TableCell>
            <TableCell
                className={`font-semibold ${!t.isExpense
                    ? "text-emerald-400"
                    : "text-rose-400"}`}
            >
                {t.amount < 0 ? `-₹${Math.abs(t.amount)}` : `+₹${t.amount}`}
            </TableCell>

            <TableCell>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(true)}
                                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                            >
                                <Info className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>

                        <TooltipContent
                            side="top"
                            className="px-3 py-2 text-sm rounded-md bg-zinc-900 text-zinc-200 border-l-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.25)]"

                        >
                            View details
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </TableCell>
            <TransactionDescription
                transaction={t}
                open={open}
                setOpen={setOpen}
                handelDelete={handelDelete}
                onSuccess={onSuccess}

            ></TransactionDescription>
        </TableRow >




    )
}

export default TransactionCard

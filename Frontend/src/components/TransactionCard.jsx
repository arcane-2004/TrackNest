import React from 'react'
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash2, } from 'lucide-react';
import CreateTransaction from "../components/createTransaction";
import { Icons } from "../assets/CategoryIcons"
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




const TransactionCard = ({ handelDelete, t, i, onSuccess }) => {
    console.log('tra', t)
    return (
        <TableRow key={i} className="hover:bg-zinc-800/50 transition-colors">

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>

                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        // align="end"
                        className="w-40 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl shadow-lg p-1"
                    >
                        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-zinc-500 px-2 py-1">
                            Actions
                        </DropdownMenuLabel>
                        {/* Edit transaction button */}
                        <CreateTransaction transaction={t} onSuccess={onSuccess}>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-zinc-800 hover:text-orange-400 cursor-pointer transition-colors"
                            >

                                <Pencil className="h-4 w-4 text-zinc-400 group-hover:text-orange-400" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </CreateTransaction>
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-red-600/10 hover:text-red-400 cursor-pointer transition-colors"
                            onClick={() => {
                                handelDelete(t._id);
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-zinc-400 group-hover:text-red-400" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            </TableCell>

        </TableRow >




    )
}

export default TransactionCard

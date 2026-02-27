"use client";
import { Icons } from "../assets/CategoryIcons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import CreateTransaction from "../components/CreateTransaction";
import { X, Pencil, Trash2 } from "lucide-react";

const TransactionDescription = ({ transaction, open, setOpen, handelDelete, onSuccess }) => {
    const Icon = Icons[transaction.categoryId.icon];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="
          max-w-lg
          p-0
          overflow-hidden
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          rounded-3xl
          shadow-[0_0_60px_rgba(249,115,22,0.15)]
        "
            >
                {/* Glow Accent */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />

                {/* Header */}
                <DialogHeader className="relative p-6 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-white tracking-wide">
                            Transaction Details
                        </DialogTitle>

                        <DialogClose asChild>
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                                <X className="h-4 w-4 text-white/60 hover:text-orange-400 transition" />
                            </button>
                        </DialogClose>
                    </div>

                    <DialogDescription className="sr-only">
                        Transaction information
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content */}
                <div className="relative px-6 py-6 space-y-6">

                    {/* Top Summary Section */}
                    <div className="flex items-center gap-4">

                        {/* Icon Glass Badge */}
                        <div
                            className="h-16 w-16 rounded-2xl flex items-center justify-center backdrop-blur-xl border"
                            style={{
                                backgroundColor: `${transaction.categoryId.color}22`,
                                borderColor: `${transaction.categoryId.color}55`,
                                color: transaction.categoryId.color,
                            }}
                        >
                            <Icon className="h-8 w-8" />
                        </div>

                        {/* Amount + Category */}
                        <div>
                            <p
                                className={`text-2xl font-bold ${transaction.isExpense
                                        ? "text-rose-400"
                                        : "text-emerald-400"
                                    }`}
                            >
                                {transaction.amount < 0 ? `-₹${Math.abs(transaction.amount)}` : `+₹${transaction.amount}`}
                            </p>
                            <p className="text-sm text-white/60 mt-1">
                                {transaction.categoryId.name}
                            </p>
                        </div>
                    </div>

                    {/* Glass Info Grid */}
                    <div className="grid grid-cols-2 gap-4">

                        <GlassItem label="Type" value={transaction.isExpense ? "Expense" : "Income"} />
                        <GlassItem label="Account" value={transaction.accountId.name} />
                        <GlassItem label="Payment" value={transaction.paymentMethod} />
                        <GlassItem
                            label="Date"
                            value={new Date(transaction.dateTime).toLocaleDateString("en-IN")}
                        />

                    </div>

                    {/* Description Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-wider text-white/40 mb-2">
                            Description
                        </p>
                        <p className="text-sm text-white/80 leading-relaxed">
                            {transaction.description || "No description provided"}
                        </p>
                    </div>
                </div>
                <DialogFooter className="px-6 pb-6 pt-4 border-t border-white/10 flex items-center justify-between">

                    {/* Left Side - Edit */}
                    <CreateTransaction transaction={transaction} onSuccess={onSuccess}>
                        <button
                            className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        bg-white/5
        border border-white/10
        text-white/70
        hover:text-orange-400
        hover:border-orange-500/40
        hover:bg-orange-500/10
        transition-all
        backdrop-blur-md
      "
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                    </CreateTransaction>

                    {/* Right Side - Delete */}
                    <button
                        onClick={() => {
                            handelDelete(transaction._id);
                            setOpen(false);
                        }}
                        className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-red-500/10
      border border-red-500/30
      text-red-400
      hover:bg-red-500/20
      hover:border-red-500/50
      transition-all
      backdrop-blur-md
    "
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const GlassItem = ({ label, value }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md">
        <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
            {label}
        </p>
        <p className="text-sm font-medium text-white/90">
            {value}
        </p>
    </div>
);

export default TransactionDescription;

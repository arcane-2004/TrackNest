'use client'
import React, { useState, useEffect } from "react"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import axios from "axios"

const CreateTransaction = ({ onSuccess, children, transaction }) => {
    const [categories, setCategories] = useState([])
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/category/get-categories`,
                    { withCredentials: true }
                )
                setCategories(response.data.categories || [])
            } catch (error) {
                console.error(error.response?.data || "Something went wrong")
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/account/get-accounts`,
                    { withCredentials: true }
                )
                setAccounts(response.data.accounts || [])
            } catch (error) {
                console.error(error.response?.data || "Failed to fetch accounts")
            }
        }
        fetchAccounts()
    }, [])

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        amount: Yup.number().required("Amount is required").positive("Must be positive"),
        description: Yup.string().max(200, "Max 200 characters"),
        category: Yup.string().required("Select a category"),
        accountId: Yup.string(),
        date: Yup.date(),
        time: Yup.string(),
    })

    // safe helpers — preserves local timezone
    function formatDateForInput(dateLike) {
        if (!dateLike) return "";
        const d = new Date(dateLike);
        const pad = (n) => String(n).padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        return `${year}-${month}-${day}`; // YYYY-MM-DD for <input type="date">
    }

    function formatTimeForInput(dateLike) {
        if (!dateLike) return "";
        const d = new Date(dateLike);
        const pad = (n) => String(n).padStart(2, "0");
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${hours}:${minutes}`; // HH:MM for <input type="time">
    }


    const initialValues = transaction ? {
        name: transaction.name,
        amount: Math.abs(transaction.amount),
        description: transaction.description || "",
        category: String(transaction.categoryId?._id || ""),
        accountId: String(transaction.accountId?._id || ""),
        paymentMethod: transaction.paymentMethod || "",
        date: formatDateForInput(transaction.dateTime),
        time: formatTimeForInput(transaction.dateTime),
        isExpense: transaction.amount < 0,
    } : {
        name: "",
        amountId: "",
        description: "",
        category: "",
        accountId: "",
        paymentMethod: "upi",
        date: "",
        time: "",
        isExpense: true,
    }

    const paymentMethods = ['cash', 'credit card', 'debit card', 'bank transfer', 'upi', 'auto debit', 'other']

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const data = {
                ...values,
                amount: values.isExpense ? -Math.abs(values.amount) : Math.abs(values.amount),
            }

            let response;

            if (transaction) {
                //  Edit existing transaction
                console.log("data", data)
                response = await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/transaction/update/${transaction._id}`,
                    {data},
                    { withCredentials: true }
                );
                toast.success(response.data.message);
                resetForm()
                onSuccess()
            } else {
                // Create new transaction
                response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/transaction/add`,
                    data,
                    { withCredentials: true }
                );

                toast.success(response.data.message)
                resetForm()
                onSuccess()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create transaction")
        } finally {
            setSubmitting(false)
        }
    }

    

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent
                side="right"
                className="bg-zinc-900/90 backdrop-blur-2xl border-l border-zinc-800 text-white overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-emerald-400">
                        {transaction ? "Edit Transaction" : "Add Transaction"}
                    </SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        Fill in the transaction details below.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => {
                            const filteredCategories = categories.filter(
                                (cat) => cat.type === (values.isExpense ? "expense" : "income")
                            )

                            return (
                                <Form className="space-y-6">
                                    {/* Transaction Type Toggle */}
                                    <div className="p-4 rounded-xl bg-zinc-800/60 flex items-center justify-between border border-zinc-700">
                                        <span className="font-medium text-zinc-200">
                                            Type:{" "}
                                            <span
                                                className={`font-semibold ${values.isExpense ? "text-rose-400" : "text-emerald-400"
                                                    }`}
                                            >
                                                {values.isExpense ? "Expense" : "Income"}
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <Label>Expense</Label>
                                            <Switch
                                                checked={values.isExpense}
                                                onCheckedChange={(val) => setFieldValue("isExpense", val)}
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Field as={Input} name="name" placeholder="Enter name" />
                                        <ErrorMessage
                                            name="name"
                                            component="p"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <Label htmlFor="amount">Amount</Label>
                                        <Field as={Input} name="amount" type="number" placeholder="₹ 0.00" />
                                        <ErrorMessage
                                            name="amount"
                                            component="p"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Field as={Input} name="description" placeholder="Optional details" />
                                    </div>

                                    <div className="flex justify-around">
                                        {/* Category */}
                                        <div>
                                            <Label>Category</Label>
                                            <Select
                                                onValueChange={(val) => setFieldValue("category", val)}
                                                value={values.category}
                                            >
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                                                    {filteredCategories.length === 0 ? (
                                                        <p className="text-zinc-400 text-sm p-2">
                                                            No categories found for this type.
                                                        </p>
                                                    ) : (
                                                        filteredCategories.map((cat) => (
                                                            <SelectItem key={cat._id} value={cat._id}>
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{ backgroundColor: cat.color }}
                                                                    ></span>
                                                                    {cat.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <ErrorMessage
                                                name="category"
                                                component="p"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>

                                        {/* Account */}
                                        <div>
                                            <Label>Account</Label>
                                            <Select
                                                onValueChange={(val) => setFieldValue("accountId", val)}
                                                value={values.accountId}

                                            >
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectValue placeholder="Select Account" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                                                    {accounts.map((acc) => (
                                                        <SelectItem key={acc._id} value={acc._id}>
                                                            {acc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <ErrorMessage
                                                name="account"
                                                component="p"
                                                className="text-red-400 text-sm mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* paymentMethod */}
                                    <div>
                                        <Label>Payment Method</Label>
                                        <Select
                                            onValueChange={(val) => setFieldValue("paymentMethod", val)}
                                            value={values.paymentMethod}
                                        >   
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectValue placeholder="Select Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                                                {paymentMethods.map((py) => (
                                                    <SelectItem key={py} value={py}>
                                                        {py}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <ErrorMessage
                                            name="account"
                                            component="p"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <Label>Date</Label>
                                            <Field
                                                as={Input}
                                                type="date"
                                                name="date"
                                                className="bg-zinc-800 border-zinc-700 text-white"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label>Time</Label>
                                            <Field
                                                as={Input}
                                                type="time"
                                                name="time"
                                                className="bg-zinc-800 border-zinc-700 text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        className={`w-full ${values.isExpense
                                            ? "bg-rose-600 hover:bg-rose-700"
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            transaction ? "Update Transaction" : "Create Transaction"
                                        )}
                                    </Button>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>

                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CreateTransaction

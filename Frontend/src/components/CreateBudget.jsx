import React from 'react'
import { useState, useEffect, useContext } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "./ui/drawer";
import { Switch } from "./ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2, PlusCircle, Pencil } from "lucide-react";
// import { toast } from "react-hot-toast";
import axios from "axios";
import { AccountContext } from "../context/AccountContext"

const CreateBudget = ({ children, budget, fetchBudget }) => {

    const {selectedAccountId} = useContext(AccountContext)

    const [open, setOpen] = useState(false);
    const [isCreating, setCreating] = useState(false);
    const [categories, setCategories] = useState([])

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

    const validationSchema = Yup.object({
        // categoryId: Yup.string(),
        isCategoryBudget: Yup.boolean(),
        limit: Yup.number().required("Limit is required").min(0, "Limit must be a positive number"),
        period: Yup.string().required("Period is required").oneOf(['Daily', 'Weekly', 'Monthly', 'Yearly']),


    });

    const initialValues = budget ? {

        isCategoryBudget: budget.isCategoryBudget,
        limit: budget.limit,
        period: budget.period

    } : {
        isCategoryBudget: false,
        limit: "",
        period: "Monthly"
    }

    // ✅ Submit Handler
    const handleSubmit = async (values, { resetForm }) => {

        try{
            setCreating(true);
            console.log(values)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/budget/create/${selectedAccountId}`, values, {
                withCredentials: true
            })
            console.log(response.data);
            resetForm()
            setOpen(false);

        }catch(error){
            console.log(error.response?.data)
        }
        finally{
            setCreating(false)
            fetchBudget()
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>

            <DrawerContent className="bg-[#121212]/90 backdrop-blur-2xl border border-gray-800 shadow-2xl rounded-t-2xl text-gray-200">
                <DrawerHeader className="pb-2 border-b border-gray-700">
                    <DrawerTitle className="text-2xl font-semibold flex items-center gap-2">
                        {budget ? (
                            <>
                                <Pencil className="w-5 h-5 text-orange-400" />
                                Edit Budget
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5 text-orange-400" />
                                Create Budget
                            </>
                        )}
                    </DrawerTitle>
                </DrawerHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="space-y-6 p-8">
                            {/* select category or overall budget

                            <div className="flex items-center justify-between border rounded-lg p-4 border-gray-700 bg-[#1b1b1b]/60">
                                <span>
                                    {values.isCategoryBudget ?
                                        <Label htmlFor="isCategoryBudget" className="text-lg font-medium">Category Budget</Label>
                                        : <Label htmlFor="isCategoryBudget" className="text-lg font-medium">Overall Budget</Label>
                                    }

                                </span>

                                <Switch
                                    id="isDefault"
                                    checked={values.isCategoryBudget}
                                    onCheckedChange={(val) => setFieldValue("isCategoryBudget", val)}
                                />
                            </div> */}

                            {/* category */}
                            {/* {values.isCategoryBudget ?

                                <div>
                                    <Label htmlFor="type" className="text-lg font-medium">Category</Label>
                                    <Select
                                        default={'Monthly'}
                                        onValueChange={(val) => setFieldValue("categoryId", val)}
                                        value={values.categoryId}
                                    >
                                        <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-gray-300 py-6">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e1e1e] text-gray-300 border-gray-700">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                            ))

                                            }

                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage name="type" component="p" className="text-red-400 text-sm mt-1" />
                                </div>

                                : ''
                            } */}

                            {/* Limit */}
                            <div>
                                <Label htmlFor="name" className="text-lg font-medium">Set Limit</Label>
                                <Field
                                    as={Input}
                                    id="limit"
                                    name="limit"
                                    placeholder="e.g. 1000.00"
                                    className="bg-[#1e1e1e] border-gray-700 text-gray-200 focus:ring-2 focus:ring-orange-400"
                                />
                                <ErrorMessage name="limit" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Type */}
                            <div>
                                <Label htmlFor="type" className="text-lg font-medium">Period</Label>
                                <Select
                                    default={'Monthly'}
                                    onValueChange={(val) => setFieldValue("period", val)}
                                    value={values.period}
                                >
                                    <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-gray-300 py-6">
                                        <SelectValue placeholder="Select Period" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e1e] text-gray-300 border-gray-700">
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="type" component="p" className="text-red-400 text-sm mt-1" />
                            </div>



                            {/* Buttons */}
                            <div className="flex justify-end items-center gap-4 pt-4">
                                <DrawerClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </DrawerClose>

                                <Button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-medium"
                                    disabled={isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5" />
                                            {budget ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {budget ? "Update Budget" : "Create Budget"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateBudget

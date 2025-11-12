import React, { useState } from "react";
import axios from 'axios'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast'
import { Loader2, PlusCircle, Pencil } from "lucide-react";

const CreateAccount = ({ children, onAccountAdded, account, onUpdateAccount, id }) => {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(null);

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().oneOf(['Savings', 'Current', 'Credit', 'Loan', 'Investment', 'Other'], "Invalid type").required("Account type is required"),
        isDefault: Yup.boolean(),
    });

    const initialValues = account ? {
        name: account.name,
        type: account.type,
        balance: account.balance,
        isDefault: account.isDefault
    } : {
        name: "",
        type: "",
        balance: "",
        isDefault: false
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsCreating(true);

            let response;
            if (account) {
                response = await axios.put(`${import.meta.env.VITE_BASE_URL}/account/update/${id}`, { values }, { withCredentials: true });
                console.log("response", response);
                toast.success(response.data.message);
                resetForm();
                onUpdateAccount();
            } else {
                response = await axios.post(`${import.meta.env.VITE_BASE_URL}/account/add`, values, { withCredentials: true });
                toast.success(response.data.message);
                console.log("response 1", response);
                resetForm();
                onAccountAdded();
            }
        } catch (error) {
            toast.error(error.response?.data.message || "Something went wrong");
            console.log("response 3", error.response);
        } finally {
            setIsCreating(false);
            setOpen(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>

            <DrawerContent className="bg-[#121212]/90 backdrop-blur-2xl border border-gray-800 shadow-2xl rounded-t-2xl text-gray-200">
                <DrawerHeader className="pb-2 border-b border-gray-700">
                    <DrawerTitle className="text-2xl font-semibold flex items-center gap-2">
                        {account ? (
                            <>
                                <Pencil className="w-5 h-5 text-orange-400" />
                                Edit Account
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5 text-orange-400" />
                                Create Account
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
                            {/* Name */}
                            <div>
                                <Label htmlFor="name" className="text-lg font-medium">Account Name</Label>
                                <Field
                                    as={Input}
                                    id="name"
                                    name="name"
                                    placeholder="e.g. My Savings Account"
                                    className="bg-[#1e1e1e] border-gray-700 text-gray-200 focus:ring-2 focus:ring-orange-400"
                                />
                                <ErrorMessage name="name" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Type */}
                            <div>
                                <Label htmlFor="type" className="text-lg font-medium">Account Type</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("type", val)}
                                    value={values.type}
                                >
                                    <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-gray-300 py-6">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e1e] text-gray-300 border-gray-700">
                                        <SelectItem value="Current">Current</SelectItem>
                                        <SelectItem value="Savings">Savings</SelectItem>
                                        <SelectItem value="Investment">Investment</SelectItem>
                                        <SelectItem value="Credit">Credit</SelectItem>
                                        <SelectItem value="Loan">Loan</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="type" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Balance */}
                            <div>
                                <Label htmlFor="balance" className="text-lg font-medium">Initial Balance</Label>
                                <Field
                                    as={Input}
                                    id="balance"
                                    name="balance"
                                    type="number"
                                    placeholder="0.00"
                                    className="bg-[#1e1e1e] border-gray-700 text-gray-200 focus:ring-2 focus:ring-orange-400"
                                />
                                <ErrorMessage name="balance" component="p" className="text-red-400 text-sm mt-1" />
                            </div>

                            {/* Default Switch */}
                            {!account && 
                            
                            <div className="flex items-center justify-between border rounded-lg p-4 border-gray-700 bg-[#1b1b1b]/60">
                                <div>
                                    <Label htmlFor="isDefault" className="text-lg font-medium">Set as Default Account</Label>
                                    <p className="text-sm text-gray-400">This account will be used as the default for transactions.</p>
                                </div>

                                <Switch
                                    id="isDefault"
                                    checked={values.isDefault}
                                    onCheckedChange={(val) => setFieldValue("isDefault", val)}
                                />
                            </div>}

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
                                            {account ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {account ? "Update Account" : "Create Account"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateAccount;

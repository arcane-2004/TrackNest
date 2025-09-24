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
import { Loader2 } from "lucide-react";
import HoverBorderGradient from "./ui/hover-border-gradient";



const CreateAccount = ({ children, onAccountAdded }) => {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(null);

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().oneOf(['Savings', 'Current', 'Credit', 'Loan', 'Investment', 'Other'], "Invalid type").required("Account type is required"),
        isDefault: Yup.boolean(),
    });

    const initialValues = {
        name: "",
        type: "",
        initialBalance: "",
        isDefault: false
    }

    const handleSubmit = async (values, { resetForm }) => {
        console.log("Form Submitted:", values);
        try {
            setIsCreating(true);
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/account/add`, values, { withCredentials: true });
            resetForm();
            if (response.status === 201) {
                toast.success(response.data.message)
                onAccountAdded()

            }
        } catch (err) {
            toast.error(err.response?.data.error || "Something went wrong");
        } finally {
            setIsCreating(false);
            setOpen(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent className="bg-white/5 backdrop-blur-2xl shadow-2xl">
                <DrawerHeader>
                    <DrawerTitle>Create Account</DrawerTitle>
                </DrawerHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="space-y-4 p-10">
                            {/* Name */}
                            <div className="">
                                <Label htmlFor="name" className=" text-lg font-medium">Account Name</Label>
                                <Field
                                    as={Input}
                                    id="name"
                                    name="name"
                                    placeholder="e.g. My Savings Account"
                                />
                                <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                            </div>

                            {/* Type (Select) */}
                            <div className="w-full">
                                <Label htmlFor="type" className="mb-5 text-lg font-medium">Account Type</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("type", val)}
                                    value={values.type}

                                >
                                    <SelectTrigger className={'bg-[#27272a] w-full py-6 text-[#939393]'}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className={'bg-[#27272a] text-[#a4a4a4]'}>
                                        <SelectItem value="Current">Current</SelectItem>
                                        <SelectItem value="Savings">Savings</SelectItem>
                                        <SelectItem value="Investment">Investment</SelectItem>
                                        <SelectItem value="Credit">Credit</SelectItem>
                                        <SelectItem value="Loan">Loan</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="type" component="p" className="text-red-500 text-sm" />
                            </div>

                            {/* Initial Balance */}
                            <div>
                                <Label htmlFor="initialBalance" className="mb-5 text-lg font-medium">Initial Balance</Label>
                                <Field
                                    as={Input}
                                    id="initialBalance"
                                    name="initialBalance"
                                    type="number"
                                    placeholder="0.00"
                                />
                                <ErrorMessage name="initialBalance" component="p" className="text-red-500 text-sm" />
                            </div>

                            {/* Is Default (Switch) */}
                            <div className="flex items-center justify-between border rounded-lg p-4 border-gray-700">
                                <div>
                                    <Label htmlFor="isDefault" className="mb-5 text-lg font-medium">Set as Default Account</Label>
                                    <p className="text-white font-medium text-sm">This account will be used as the default account for transactions.</p>
                                </div>

                                <Switch
                                    id="isDefault"
                                    checked={values.isDefault}
                                    onCheckedChange={(val) => setFieldValue("isDefault", val)}
                                    className={' text-white border border-gray-400'}
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center items-center gap-3 text-lg font-medium ">
                                <DrawerClose asChild>
                                    <button type='button' variant='outline'
                                        className=" bg-[#fff] rounded-full p-3 "
                                        onClick={() => setOpen(false)}>
                                        Cancle
                                    </button>
                                </DrawerClose>
                                {/* <HoverBorderGradient> */}
                                    <button type="submit" className=" bg-[#e9700e] rounded-full p-3 text-[#f6ece3] "
                                        disabled={isCreating}
                                    >
                                        {
                                            isCreating ?
                                                (<>
                                                    <Loader2 className="animate-spin" />
                                                    Creating...
                                                </>) :
                                                (
                                                    "Create Account"
                                                )
                                        }
                                    </button>
                                {/* </HoverBorderGradient> */}
                            </div>
                        </Form>
                    )}
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateAccount;

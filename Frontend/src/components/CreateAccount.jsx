import React, { useState } from "react";
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


const CreateAccount = ({ children }) => {
    const [open, setOpen] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().oneOf(['savings', 'checking', 'credit', 'loan', 'investment', 'other'], "Invalid type").required("Account type is required"),
        isDefault: Yup.boolean(),
    });

    const initialValues = {
        name: "",
        type: "", initialBalance: "",
        isDefault: false
    }

    const handleSubmit = (values, { resetForm }) => {
        console.log("Form Submitted:", values);
        resetForm();
        setOpen(false); // close drawer on submit
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
                                        <SelectItem value="current">Current</SelectItem>
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="investment">Investment</SelectItem>
                                        <SelectItem value="credit">Credit</SelectItem>
                                        <SelectItem value="loan">Loan</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
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
                            <DrawerClose className="flex gap-4 justify-center items-center w-full">
                                <Button type='button' variant='outline' className=" bg-gray-600" onClick={() => setOpen(false)}>
                                    Cancle
                                </Button>
                                <Button type="submit" className=" bg-gray-600">
                                    Create Account
                                </Button>
                            </DrawerClose>

                        </Form>
                    )}
                </Formik>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateAccount;

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const CreateCategory = ({ children, onCategoryAdded, category, fetchCategories }) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colors = [
        "#ef4444",
        "#f97316",
        "#facc15",
        "#10b981",
        "#3b82f6",
        "#8b5cf6",
        "#6b7280",
    ]

    const icons = ["💰", "🍔", "🏠", "🚗", "🎁", "🎓", "🛒", "💳", "📈", "📚"]

    // ✅ Validation Schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, "Too short!")
            .max(50, "Too long!")
            .required("Category name is required"),
        type: Yup.string()
            .oneOf(["income", "expense"], "Invalid type")
            .required("Category type is required"),
        color: Yup.string()
            .oneOf(colors, "Invalid color")
            .required("Category color is required"),
        icon: Yup.string()
            .oneOf(icons, "Invalid icon")
            .required("Category icon is required"),
    });

    // ✅ Initial Values
    const initialValues = category ?
        {
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon
        } : {
            name: "",
            type: "",
            color: "",
            icon: ""
        };

    // ✅ Submit Handler
    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsSubmitting(true);

            if (category) {
                const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/category/update/${category._id}`,
                    {values},
                    { withCredentials: true }
                );
                toast.success(response.data.message);
                fetchCategories()

                resetForm();
                setOpen(false);

            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/category/add`,
                    values,
                    { withCredentials: true }
                );

                toast.success(response.data.message || "Category created successfully!");
                onCategoryAdded?.(response.data.category);

                resetForm();
                setOpen(false);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl text-white">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-white">
                        {category ? "Edit Category " : "Create New Category"}
                    </SheetTitle>
                </SheetHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="mt-6 space-y-5">
                            {/* Category Name */}
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Category Name
                                </Label>
                                <Field
                                    as={Input}
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Food, Rent, Salary"
                                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>

                            {/* Type */}
                            {!category &&
                                <div>
                                    <Label htmlFor="type" className="text-sm font-medium">
                                        Category Type
                                    </Label>
                                    <Select
                                        value={values.type}
                                        onValueChange={(val) => setFieldValue("type", val)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                        name="type"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            }

                            {/* Color Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="color" className="text-sm font-medium">
                                    Color
                                </Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("color", val)}
                                    value={values.color}
                                >
                                    <SelectTrigger className="bg-[#27272a] w-full py-6 text-[#939393]">
                                        <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] text-white border border-zinc-700">
                                        {colors.map((color, i) => (
                                            <SelectItem key={i} value={color}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-15 h-8 rounded-4xl border border-zinc-600"
                                                        style={{ backgroundColor: color }}
                                                    ></span>
                                                </div>

                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>
                                <ErrorMessage name="color" component="p" className="text-red-500 text-xs mt-1" />
                            </div>


                            {/* Icon Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="icon" className="text-sm font-medium">
                                    Icon
                                </Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("icon", val)}
                                    value={values.icon}
                                >
                                    <SelectTrigger className="bg-[#27272a] w-full py-6 text-[#939393]">
                                        <SelectValue placeholder="Select icon" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] text-white border border-zinc-700">
                                        <div className="grid grid-cols-4 p-3">
                                            {icons.map((icon) => (
                                                <SelectItem key={icon} value={icon}>
                                                    <span className="flex justify-center items-center text-2xl p-2 hover:bg-zinc-800 rounded-lg cursor-pointer">{icon}</span>
                                                </SelectItem>
                                            ))}
                                        </div>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="icon" component="p" className="text-red-500 text-xs mt-1" />
                            </div>


                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <SheetClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </SheetClose>

                                <Button
                                    type="submit"
                                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4" />
                                            Saving...
                                        </>
                                    ) : (
                                        category ? "Update Category" :
                                        "Create Category"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </SheetContent>
        </Sheet>
    );
};

export default CreateCategory;

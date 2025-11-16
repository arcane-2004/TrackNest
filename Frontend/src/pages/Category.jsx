import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CreateCategory from "../components/CreateCategory";
import { Icons } from "../assets/icons/CategoryIcons";


const Category = () => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [sheetOpen, setSheetOpen] = useState(false);


	const fetchCategories = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/category/get-categories`,
				{ withCredentials: true }
			);
			setCategories(response.data.categories || []);
		} catch (error) {
			console.log(
				error.response?.data?.message || "Failed to fetch categories"
			);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);


	const handleCategoryAdded = (newCategory) => {
		setCategories((prev) => [...prev, newCategory]);
	};

	const incomeCategories = categories.filter(
		(cat) => cat.type === "income"
	);
	const expenseCategories = categories.filter(
		(cat) => cat.type === "expense"
	);

	return (
		<div className="flex h-full w-full bg-[#111010] text-white">
			<Sidebar />

			<div className="w-full text-white p-10 font-sans">
				{/* Header */}
				<header className="flex justify-between items-center mb-10">
					<h2 className="font-bold text-3xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
						Categories
					</h2>
					<CreateCategory
						onCategoryAdded={handleCategoryAdded}
					>
						<button className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-semibold text-white hover:scale-[1.03] transition-transform duration-300 shadow-md shadow-orange-500/20 hover:cursor-pointer">
							Add Category
						</button>
					</CreateCategory>
				</header>

				<hr className="border-zinc-800 mb-10" />

				{/* Income Categories */}
				<section className="mb-12">
					<h3 className="text-xl font-semibold mb-6 text-amber-400 tracking-wide">
						Income Categories
					</h3>

					{incomeCategories.length === 0 ? (
						<p className="text-zinc-400 italic text-sm">
							No income categories found.
						</p>
					) : (



						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
							{incomeCategories.map((cat) => (
								<div
									key={cat._id}
									onClick={() => {
										setSelectedCategory(cat)
										setSheetOpen(true);
									}}
									className="rounded-xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200"
									style={{
										backgroundColor: `${cat.color}22`, // translucent color bg
										border: `1px solid ${cat.color}55`,
									}}
								>
									<div className="flex flex-col items-center gap-2">
										<div
											className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
											style={{
												backgroundColor: cat.color,
												color: cat.color,
											}}
										>
											{(() => {
												const Icon = Icons[cat.icon];
												console.log("Icon", Icon)
												return (
													<Icon className="brightness-40 size-8 " />
												)
											})()}
										</div>
										<h4 className="font-semibold text-lg text-white mt-2 text-center">
											{cat.name}
										</h4>
									</div>
								</div>

							))}
						</div>



					)}
				</section>

				{/* Expense Categories */}
				<section>
					<h3 className="text-xl font-semibold mb-6 text-orange-500 tracking-wide">
						Expense Categories
					</h3>

					{expenseCategories.length === 0 ? (
						<p className="text-zinc-400 italic text-sm">
							No expense categories found.
						</p>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
							{expenseCategories.map((cat) => (
								<div
									key={cat._id}
									onClick={() => {
										setSelectedCategory(cat)
										setSheetOpen(true);
									}}
									className="rounded-xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200"
									style={{
										backgroundColor: `${cat.color}22`,
										border: `1px solid ${cat.color}55`,
									}}
								>
									<div className="flex flex-col items-center gap-2">
										<div
											className="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
											style={{
												backgroundColor: cat.color,
												color: cat.color,
											}}
										>
											{(() => {
												const Icon = Icons[cat.icon];
												console.log("Icon", Icon)
												return (
													<Icon className="brightness-40 size-8 " />
												)
											})()}
										</div>
										<h4 className="font-semibold text-lg text-white mt-2 text-center">
											{cat.name}
										</h4>
									</div>
								</div>

							))}
						</div>
					)}
				</section>
				<CreateCategory
					category={selectedCategory}
					open={sheetOpen}
					setOpen={setSheetOpen}
					onCategoryAdded={handleCategoryAdded}
				/>
			</div >
		</div >
	);
};

export default Category;

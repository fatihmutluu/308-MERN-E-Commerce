import React  from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { fetchBrandsAction } from "../../../redux/slices/categories/brandsSlice";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
import { fetchColorsAction } from "../../../redux/slices/categories/colorsSlice";
import { createProductAction } from "../../../redux/slices/products/productSlices";

import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";

//animated components for react-select
const animatedComponents = makeAnimated();

export default function AddProduct() {
  const dispatch = useDispatch();
  
// Sizes
const sizes = [37,38,39,40,41,42,43];
const [sizeOption, setSizeOption] = useState([]);
const handleSizeChange = (selectedSizes) => {
  setSizeOption(selectedSizes);
};

// Converted sizes
const sizeOptionsCoverted = sizes?.map((size) => {
  return {
    value: size,
    label: size,
  };
});

// Gender
const genders = ["women", "men"];
const [genderOption, setGenderOption] = useState("");
const handleGenderChange = (selectedGenders) => {
  setGenderOption(selectedGenders);
};

// Converted gender
const genderOptionsCoverted = genders?.map((gender) => {
  return {
    value: gender,
    label: gender,
  };
});

  //categories
  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);
  //select data from store
  const { categories } = useSelector((state) => state?.categories?.categories);

  //brands
  useEffect(() => {
    dispatch(fetchBrandsAction());
  }, [dispatch]);
  //select data from store
  const {
    brands: { brands },
  } = useSelector((state) => state?.brands);

  //colors
  const [colorsOption, setColorsOption] = useState([]);

  const {
    colors: { colors },
  } = useSelector((state) => state?.colors);
  useEffect(() => {
    dispatch(fetchColorsAction());
  }, [dispatch]);

  const handleColorChange = (colors) => {
    setColorsOption(colors);
  };
  //converted colors
  const colorsCoverted = colors?.map((color) => {
    return {
      value: color?.name,
      label: color?.name,
    };
  });


  //---form data---
  const [formData, setFormData] = useState({
    name:"",
    description: "",
    brand:"",
    category: "",
    gender:"",
    sizes: [],
    color: "",
    images: "",
    totalQty: 0,
    cost: 0,
  });

  //onChange
  const handleOnChange = (e) => {
    if (e.name === "totalQty"||e.name === "cost") {
      e.AddProductparsedValue = parseInt(e.value, 10);
      if (isNaN(e.parsedValue)) {
        e.parsedValue = 0; // Set empty string if the input cannot be parsed as an integer
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //get product from store
  const { product, isAdded, loading, error } = useSelector(
    (state) => state?.products
  );

  //onSubmit
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProductAction({
        ...formData,
        sizes: sizeOption?.map((size) => size.label),
        gender: genderOption ? genderOption.label.toString() : "",
      })
    );

    //reset form data
    setFormData({
      name:"",
      description: "",
      brand:"",
      category: "",
      gender:"",
      sizes: [],
      color: "",
      images: "",
      totalQty: 0,
      cost: 0,
    });


  };


  return (
    <>
      {/* {error && <ErrorMsg message={error?.message} />} */}
      {/* {fileErrs?.length > 0 && (
        <ErrorMsg message="file too large or upload an image" />
      )} */}
      {isAdded && <SuccessMsg message="Product Added Successfully" />}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create New Product
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Products
            </p>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    name="name"
                    value={formData?.name}
                    onChange={handleOnChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* size option */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Size
                </label>
                <Select
                  components={animatedComponents}
                  isMulti
                  name="sizes"
                  options={sizeOptionsCoverted}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isLoading={false}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  onChange={(item) => handleSizeChange(item)}
                />
              </div>
              {/* gender option */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Gender
                </label>
                <Select
                  components={animatedComponents}
                  // isMulti
                  name="gender"
                  options={genderOptionsCoverted}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isLoading={false}
                  isSearchable={true}
                  closeMenuOnSelect={true}
                  onChange={(item) => handleGenderChange(item)}
                />
              </div>
              {/* Select category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleOnChange}
                  className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                  defaultValue="Canada"
                >
                  <option>-- Select Category --</option>
                  {categories?.map((category) => (
                    <option key={category?._id} value={category?.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleOnChange}
                  className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                  defaultValue="Canada"
                >
                  <option>-- Select Brand --</option>
                  {brands?.map((brand) => (
                    <option key={brand?._id} value={brand?.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Color
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleOnChange}
                  className="mt-1  block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                  defaultValue="Canada"
                >
                  <option>-- Select Color --</option>
                  {colors?.map((color) => (
                    <option key={color?._id} value={color?.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              

              {/* images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <div className="mt-1">
                  <input
                    name="images"
                    value={formData.images}
                    onChange={handleOnChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost
                </label>
                <div className="mt-1">
                  <input
                    name="cost"
                    value={formData.cost}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Quantity
                </label>
                <div className="mt-1">
                  <input
                    name="totalQty"
                    value={formData.totalQty}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Product Description
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                    // disabled={fileErrs?.length > 0}
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate} from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { fetchBrandsAction } from "../../../redux/slices/categories/brandsSlice";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
import { fetchColorsAction } from "../../../redux/slices/categories/colorsSlice";
import {
  createProductAction,
  fetchProductAction,
  updateProductActionSM,
  updateSingleProductDiscountAction ,
} from "../../../redux/slices/products/productSlices";

import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import { Link } from 'react-router-dom';

//animated components for react-select
const animatedComponents = makeAnimated();


export default function ProductUpdate() {
  const navigate = useNavigate(); // Access the history object

  //dispatch
  const dispatch = useDispatch();
  //get id from params
  const { id } = useParams();
  //fetch single product
  useEffect(() => {
    dispatch(fetchProductAction(id));
  }, [id, dispatch]);


  //get product from store
  const { product, isUpdated, loading, error } = useSelector(
    (state) => state?.products
  );
  //---form data---
  const [formData, setFormData] = useState({
    // name: product?.product?.name,
    // description: product?.product?.description,
    // category: "",
    // sizes: "",
    // brand: "",
    // colors: "",
    discountRate: product?.product?.discountRate,
    price: product?.product?.price,
    // totalQty: product?.product?.totalQty,
  });

  //onChange
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //onSubmit
  const handleOnSubmitPrice = (e) => {
    e.preventDefault();
    //dispatch
    dispatch(
      updateProductActionSM({
        ...formData,
        id,
      })
    );

    //reset form data
    setFormData({
      price: "",
    });

    // Redirect to "sm/manage-products" page
    navigate("/sm/manage-products");
  };

  //onSubmit
  const handleOnSubmitRate = (e) => {
    e.preventDefault();
    //dispatch
    dispatch(
      updateSingleProductDiscountAction ({
        ...formData,
        id,
      })
    );

    //reset form data
    setFormData({
      discountRate: "",
    });

    // Redirect to "sm/manage-products" page
    navigate("/sm/manage-products");
  };


  return (
    <>
      {error && <ErrorMsg message={error?.message} />}
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sales Manager Product Update 
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Products
            </p>
          </p> */}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmitPrice}>
              {/* price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="mt-1">
                  <input
                    name="price"
                    // value={formData.price}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Update Price
                </button>

                )}
                
              </div>
            </form>
            <form className="space-y-6" onSubmit={handleOnSubmitRate}>
              {/* rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Rate
                </label>
                <div className="mt-1">
                  <input
                    name="rate"
                    // value={formData.price}
                    onChange={handleOnChange}
                    type="number"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                {loading ? (
                  <LoadingComponent />
                ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Update Discount Rate
                </button>

                )}
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
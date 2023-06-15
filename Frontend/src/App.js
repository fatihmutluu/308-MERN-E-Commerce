import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import SMDashboard from "./components/SalesManager/SMDashboard";
import PMDashboard from "./components/ProductManager/PMDashboard";
// import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
// import AddCoupon from "./components/Admin/Coupons/AddCoupon";
import Login from "./components/Users/Forms/Login";
import AddProduct from "./components/ProductManager/Products/AddProduct";
import Products from "./components/Users/Products/Products";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import OrderHistory from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/Users/Products/OrderPayment";
import ManageCategories from "./components/ProductManager/Categories/ManageCategories";
import ManageStocksAdmin from "./components/Admin/Products/ManageStocks";
import ManageStocksSM from "./components/SalesManager/Products/ManageStocks";
import ManageStocksPM from "./components/ProductManager/Products/ManageStocks";
import ManageReviews from "./components/Admin/Reviews/ManageReviews";
import CategoryToAdd from "./components/ProductManager/Categories/CategoryToAdd";
import AddCategory from "./components/ProductManager/Categories/AddCategory";
import AddBrand from "./components/ProductManager/Categories/AddBrand";
import AddColor from "./components/ProductManager/Categories/AddColor";
import AllCategories from "./components/HomePage/AllCategories";
import Wishlist from "./components/Users/Profile/Wishlist";
// import UpdateCoupon from "./components/Admin/Coupons/UpdateCoupon";
import Product from "./components/Users/Products/Product";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import CustomerOrder from "./components/Users/Profile/CustomerOrder";
import AddReview from "./components/Users/Reviews/AddReview";
import UpdateCategory from "./components/Admin/Categories/UpdateCategory";
import OrdersList from "./components/Admin/Orders/OdersList";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import Customers from "./components/Admin/Orders/Customers";
import BrandsList from "./components/ProductManager/Categories/BrandsList";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AdminRoutes from "./components/AuthRoute/AdminRoutes";
import ThanksForOrdering from "./components/Users/Products/ThanksForOrdering";
import UpdateProduct from "./components/Admin/Products/UptadeProduct.js";
import UpdateProductSM from "./components/SalesManager/Products/UpdateProduct";
import UpdateProductPM from "./components/ProductManager/Products/UpdateProduct";
import UpdateOrders from "./components/Admin/Orders/UpdateOrders";
import CommentsList from "./components/ProductManager/Reviews/CommentsList";
import ColorsList from "./components/Admin/Categories/ColorsList";
import ManageOrdersSM from "./components/SalesManager/Orders/ManageOrders";
import { useDispatch, useSelector } from "react-redux";
import NoDataFound from "./components/NoDataFound/NoDataFound";
import LoadingComponent from "./components/LoadingComp/LoadingComponent";
import ErrorMsg from "./components/ErrorMsg/ErrorMsg";
import ManageOrdersPM from "./components/ProductManager/Orders/ManageOrders";
import RefundRequestsList from "./components/SalesManager/RefundRequests/RefundRequestsList";
import ChartComponent from "./components/SalesManager/Orders/ChartComponent";





const App = () => {

  const {
    products: { products },
    loading,
    error,
  } = useSelector((state) => state?.products);


  return (
    <BrowserRouter>
      <Navbar />

      {/* hide navbar if admin */}
      
        {/* admin route */}
        
        <Routes>
        {/* admin route */}
        <Route
          path="admin"
          element={
            <AdminRoutes>
              <AdminDashboard />
            </AdminRoutes>
          }
        >
          {/* products */}
          <Route
            path=""
            element={
              <AdminRoutes>
                <OrdersList />
              </AdminRoutes>
            }
          />
          <Route
            path="add-product"
            element={
              <AdminRoutes>
                <AddProduct />
              </AdminRoutes>
            }
          />
          <Route
            path="manage-products"
            element={
              <AdminRoutes>
                <ManageStocksAdmin />
              </AdminRoutes>
            }
          />
          <Route
            path="manage-reviews"
            element={
              <AdminRoutes>
                 <ManageReviews /> 
              </AdminRoutes>
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <AdminRoutes>
                <UpdateProduct />
              </AdminRoutes>
            }
          />
          
          {/* Category */}
          <Route
            path="category-to-add"
            element={
              <AdminRoutes>
                <CategoryToAdd />
              </AdminRoutes>
            }
          />
          <Route path="add-category" element={<AddCategory />} />
          <Route
            path="manage-category"
            element={
              <AdminRoutes>
                <ManageCategories />
              </AdminRoutes>
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <AdminRoutes>
                <UpdateCategory />
              </AdminRoutes>
            }
          />
          {/* brand category */}
          <Route
            path="add-brand"
            element={
              <AdminRoutes>
                <AddBrand />
              </AdminRoutes>
            }
          />
          <Route path="all-brands" element={<BrandsList />} />
          {/* color category */}
          <Route
            path="add-color"
            element={
              <AdminRoutes>
                <AddColor />
              </AdminRoutes>
            }
          />
          <Route path="all-colors" element={<ColorsList />} />
          {/* Orders */}
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route
            path="orders/:id"
            element={
              <AdminRoutes>
                <UpdateOrders />
              </AdminRoutes>
            }
          />
          <Route
            path="customers"
            element={
              <AdminRoutes>
                <Customers />
              </AdminRoutes>
            }
          />
        </Route>

        {/*PM Route*/}
        <Route
          path="pm"
          element={
            <AdminRoutes>
              <PMDashboard />
            </AdminRoutes>
          }
        >
          <Route
            path="delivery-department"
            element={
              <AdminRoutes>
                {/* <ManageStocks /> */}
                <ManageOrdersPM />
              </AdminRoutes>
            }
          />
          {/* products */}
          {/* <Route
            path=""
            element={
              <AdminRoutes>
                <OrdersList />
              </AdminRoutes>
            }
          /> */}
          {/* <Route
            path="customers"
            element={
              <AdminRoutes>
                <Customers />
              </AdminRoutes>
            }
          /> */}
          <Route
            path="products"
            element={
              <AdminRoutes>
                {/* <AddProduct /> */}
                <ManageStocksPM />
              </AdminRoutes>
            }
          />
          <Route
            path="add-product"
            element={
              <AdminRoutes>
                <AddProduct />
              </AdminRoutes>
            }
          />
          <Route
            path="manage-products"
            element={
              <AdminRoutes>
                <ManageStocksPM />
              </AdminRoutes>
            }
          />
          <Route
            path="comments"
            element={
              <AdminRoutes>
                <CommentsList/>
              </AdminRoutes>
            }
          />

          { <Route
            path="products/edit/:id"
            element={
              <AdminRoutes>
                <UpdateProductPM />
              </AdminRoutes>
            }
          />}
          
          {/* Category */}

          {/* <Route
            path="manage-reviews"
            element={
              <AdminRoutes>
                 <ManageReviews /> 
              </AdminRoutes>
            }
          /> */}

          <Route
            path="category-to-add"
            element={
              <AdminRoutes>
                <CategoryToAdd />
              </AdminRoutes>
            }
          />
          <Route 
            path="add-category" 
            element={
              <AdminRoutes>
                <AddCategory />
              </AdminRoutes>
            } />
          <Route
            path="manage-category"
            element={
              <AdminRoutes>
                <ManageCategories />
              </AdminRoutes>
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <AdminRoutes>
                <UpdateCategory />
              </AdminRoutes>
            }
          />
          {/* brand category */}
          <Route
            path="add-brand"
            element={
              <AdminRoutes>
                <AddBrand />
              </AdminRoutes>
            }
          />
          <Route
            path="all-brands"
            element={
              <AdminRoutes>
                <BrandsList />
              </AdminRoutes>
            }
          />
          {/* color category */}
          <Route
            path="add-color"
            element={
              <AdminRoutes>
                <AddColor />
              </AdminRoutes>
            }
          />
          <Route
            path="all-colors"
            element={
              <AdminRoutes>
                <ColorsList />
              </AdminRoutes>
            }
          />
          <Route
            path="manage-orders"
            element={
              <AdminRoutes>
                <ManageOrders />
              </AdminRoutes>
            }
          />
          {/* Orders */}
          <Route
            path="orders/:id"
            element={
              <AdminRoutes>
                <UpdateOrders />
              </AdminRoutes>
            }
          />
          <Route
            path="invoices"
            element={
              <AdminRoutes>
                <ManageOrdersSM />
              </AdminRoutes>
            }
          />
          {/* <Route
            path="customers"
            element={
              <AdminRoutes>
                <Customers />
              </AdminRoutes>
            }
          /> */}
        </Route>

        {/*SM Route*/}
        <Route
          path="sm"
          element={
            <AdminRoutes>
              <SMDashboard />
            </AdminRoutes>
          }
        >
          <Route
            path="chart"
            element={
              <AdminRoutes>
                <ChartComponent />
              </AdminRoutes>
            }
          />
          {/* products */}
          {/* <Route
            path="products"
            element={
              <AdminRoutes>
                {  <div className="grid grid-cols-5 mt-5">
                  {loading ? (
                    <LoadingComponent />
                  ) : error ? (
                    <ErrorMsg message={error?.message} />
                  ) : products?.length <= 0 ? (
                    <NoDataFound />
                  ) : (
                    <Products products={products}/>
                  )}
                  </div> }
              </AdminRoutes>
            }
          /> */}
          <Route
            path="manage-products"
            element={
              <AdminRoutes>
                <ManageStocksSM />
              </AdminRoutes>
            }
          />

          <Route
            path="products/edit/:id"
            element={
              <AdminRoutes>
                <UpdateProductSM />
              </AdminRoutes>
            }
          />

          <Route
            path="invoice"
            element={
              <AdminRoutes>
                {/* <ManageStocks /> */}
                <ManageOrdersSM />
              </AdminRoutes>
            }
          />

          <Route
            path="refund-request"
            element={
              <AdminRoutes>
                <RefundRequestsList />
              </AdminRoutes>
            }
          />
          
        </Route>
        
        {/* public links */}
        {/* Products */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/success" element={<ThanksForOrdering />} />
        {/* review */}
        <Route
          path="/add-review/:id"
          element={
            <AuthRoute>
              <AddReview />
            </AuthRoute>
          }
        />


        {/* shopping cart */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route
          path="/order-payment"
          element={
            <AuthRoute>
              <OrderPayment />
            </AuthRoute>
          }
        />
        {/* users */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/customer-profile"
          element={
            <AuthRoute>
              <CustomerProfile />
            </AuthRoute>
          }
        ></Route>

        <Route
          path="/customer-order"
          element={
            <AuthRoute>
              <CustomerOrder />
            </AuthRoute>
          }
        ></Route>

        <Route
          path="/wishlist"
          element={
            <AuthRoute>
              <Wishlist />
            </AuthRoute>
          }
        ></Route>




        <Route
          path="/customer-order"
          element={
            <AuthRoute>
              <CustomerOrder />
            </AuthRoute>
          }
        ></Route>


      </Routes>
    </BrowserRouter>
  );
};

export default App;
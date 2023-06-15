import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToWishlist, deleteFromWishlist, fetchWishlist } from "../../../redux/slices/wishlist/wishlistSlices";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "@heroicons/react/24/outline";
import baseURL from "../../../utils/baseURL";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";

const user = JSON.parse(localStorage.getItem("userInfo"));
const isLoggedIn = user?.token ? true : false;

function WishlistItem({ id, name }) {
  const dispatch = useDispatch();




  const [clicked, setClicked] = useState(false);
  let wishlistUrl = `${baseURL}/users/wishlist`;
  const [wishlist, setWishlist] = useState([]);


  const { error: userError, loading: userLoading, profile } = useSelector((state) => state?.users);
  const userName = profile?.user?.fullname;
  
  
  


  const handleClick = () => {
    dispatch(addToWishlist(id));
    setClicked(true);
  };






  


  return (
    <>
{isLoggedIn && (
  <div className="flow-roo">
    <div className="group flex items-center">
      <button
        className={`h-6 w-6 flex-shrink-0 text-purple-400 group-hover:text-purple-500 hover:fill-current: ''
        }`}
        onClick={handleClick}
        
        aria-label="Add to Wishlist"
        
      >
        <HeartIcon className={`${clicked ? 'fill-current text-purple-500' : ''}`} />
      </button>
    </div>
  </div>
)}
    </>
  );
}



const Products = ({ products }) => {

  const dispatch = useDispatch();
  let wishlistUrl = `${baseURL}/users/wishlist`;
  const [wishlist, setWishlist] = useState([]);
  const [clicked, setClicked] = useState(false);




  return (
    <>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
     
        {products?.map((product) => (
          <>
          
            {/* new */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <div className="relative bg-gray-50">
                
                {/*  <span className="absolute top-0 left-0 ml-6 mt-6 px-2 py-1 text-xs font-bold font-heading bg-white border-2 border-red-500 rounded-full text-red-500">
                  -15%
                </span> */}
               
                <Link
                  className="block"
                  to={{
                    pathname: `/products/${product?.id}`,
                    // state: {
                    //   product: product,
                    // },
                  }}>
                  <img
                    className="w-full h-64 object-cover"
                    src={product?.images}
                    alt
                  />
                </Link>
                <div className="px-6 pb-6 mt-8">
                  <a className="block px-6 mb-2" href="#">
                    <h3 className="mb-2 text-xl font-bold font-heading">
                      {product?.name}
                    </h3>
                    

                    <p className="text-lg font-bold font-heading text-blue-500">  
                    <span>${product?.price}</span>
                  </p>
                  {product.hasDiscount && (
                    <>   
                      <span className="text-xs text-gray-500 font-semibold font-heading line-through">
                        ${(product?.cost * 1.25).toFixed(2)}
                        
                      </span>
                      
                      <span className="rounded-full bg-red-500 font-bold text-white text-sm px-2 py-1 absolute right-8">       
                  {product?.discountRate}% off   
                </span>   
                      
                           
                    </>
                  )}
                    
                  </a>
                  
                  <a
                    className={`ml-auto mr-2 flex items-center justify-center w-60 h-12 ${
                      product?.qtyLeft > 1 ? 'bg-blue-400 hover:bg-blue-500 text-white font-bold' : ' hover:bg-burgundy-400'}
                    rounded-md : ${product?.qtyLeft < 1 && 'bg-gray-300 cursor-not-allowed'}
                    ${product?.qtyLeft == 1 && 'bg-red-500 hover:bg-red-700 text-white font-bold'}`}
                    href={product?.qtyLeft >= 1 ? `/products/${product?.id}` : '#'}
                    onClick={(e) => product?.qtyLeft < 1 && e.preventDefault()}
                  >
                        {product?.qtyLeft > 1 ? (
                          <span className="font-bold">In Stock</span>
                        ) : product?.qtyLeft === 1 ? (
                          <span className="font-bold">Last Item</span>
                        ) : (
                          <span className="text-black font-bold">Out of Stock</span>
                        )}
                  </a>
                  <WishlistItem key={product?.id} id={product?._id} name={product?.name} />


                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Products;

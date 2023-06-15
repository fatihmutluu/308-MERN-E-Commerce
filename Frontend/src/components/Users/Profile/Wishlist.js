import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import CustomerDetails from "./CustomerDetails";
import ShippingAddressDetails from "./ShippingAddressDetails";
import baseURL from "../../../utils/baseURL";
import { fetchWishlist, deleteFromWishlist } from "../../../redux/slices/wishlist/wishlistSlices";
import { changeOrderItemQty,removeOrderItemQtyHandler } from "../../../redux/slices/cart/cartSlices";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";



function WishlistItem({ id, name }) {
  const dispatch = useDispatch();



  const handleDeleteClick = () => {
    dispatch(deleteFromWishlist(id));
    window.location.reload();
  };

  return (
    <>
      <button onClick={handleDeleteClick}><XMarkIcon className="h-5 w-5" /></button>
    </>
  );
}







export default function Wishlist() {
  //dispatch


  
  let productUrl = `${baseURL}/users/wishlist`;


  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);


  useEffect(() => {
    dispatch(fetchWishlist({
      url: productUrl,
    })).then((response) => {
      setProducts(response?.payload);
    });
    dispatch(getUserProfileAction());
  }, [dispatch]);

  
  const { error, loading, profile } = useSelector((state) => state?.users);
  const userName = profile?.user?.fullname;
  
  
 

  
  const orders = profile?.user?.wishlist;


  async function clearWishlist() {
    for (const order of orders) {
      try {
        // console.log("deleting order", order);
        await dispatch(deleteFromWishlist(order));
      } catch (error) {
        // console.error(`Failed to delete order ${order}:`, error);
      }
    }

    window.location.reload();
  }
  

  function ClearWishlistModal() {
    const [show, setShow] = useState(false);
  
    return (
      <>
        <button
          onClick={() => setShow(true)}
          className="rounded-md border border-transparent bg-red-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 mr-4"
        >
          Clear Wishlist
        </button>
  
        {show && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
  
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
              <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* <!-- Heroicon name: outline/exclamation --> */}
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                        Clearing your Wishlist
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Please wait, your wishes will go away! Are you sure?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button onClick={() => setShow(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                  <button onClick={() => {
                    setShow(false);
                    clearWishlist();
                  }} className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Clear Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  


  console.log("Wishlist",orders);
  return (
    <>
    
    <div className="flex flex-wrap justify-center items-center -mx-3 -mb-3 md:mb-0">
  <h1 className="text-lg font-bold mt-10">Welcome to Your Wishlist {userName}!</h1>
  
    </div>


      {loading ? (
        <h2>Loading...</h2>
        
      ) : error ? (
        <h2>{error?.message}</h2>
      ) : orders?.length <= 0 ? (
        <Link to="/products-filters">
        <h2 className="font-semibold text-center mt-10">Click here to send a wish to your wishlist and pay to us for make it real!  <span role="img" aria-label="wish">🧞</span></h2>
      </Link>
      ) : (
        
        <div>
              <h2 className="text-center mb-10">We will let you know when the prices of your favourite shoes have dropped! <span role="img" aria-label="sale">💸</span></h2>
              




<div style={{margin: "0 auto", width: "90%"}}>
  <table className="min-w-full divide-y divide-gray-200 border-t border-b">
    <thead>
      <tr>
        <th className="py-3 px-6 text-center bg-gray-50 uppercase tracking-wider text-xs font-bold text-gray-500">IMAGE</th>
        <th className="py-3 px-6 text-center bg-gray-50 uppercase tracking-wider text-xs font-bold text-gray-500">PRODUCT NAME</th>
        <th className="py-3 px-6 text-center bg-gray-50 uppercase tracking-wider text-xs font-bold text-gray-500">UNIT PRICE</th>
        <th className="py-3 px-6 text-center bg-gray-50 uppercase tracking-wider text-xs font-bold text-gray-500">ADD TO BUTTON</th>
        <th className="py-3 px-6 text-center bg-gray-50 uppercase tracking-wider text-xs font-bold text-gray-500">ACTION</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {products?.map((product) => (
        <tr key={product.id}>
          <td className="items-center justify-center py-4 px-6"><Link to={`/products/${product._id}`}><img src={product.images} alt={product.name} className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"/></Link></td>
          <td className="text-left py-4 px-6 font-semibold"><Link to={`/products/${product._id}`}>{product.name}</Link></td>
          <td className="text-left py-4 px-6 font-semibold">${product.price}</td>
          <td className="text-center py-4 px-6">
          <a href={`/products/${product._id}`}>
            <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">SELECT OPTION</button>
          </a>
        </td>
        <td className="py-4 px-6 items-center justify-center text-center"><WishlistItem key={product.id} id={product._id} name={product.name} /></td>
        </tr>
      ))}
    </tbody>
  </table>

</div>

<div>

  
</div>
{/* <div style={{width: "90%"}} className="mt-10 mx-auto text-left">
  <button className="rounded-md border border-transparent bg-gray-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 mr-auto">
    Clear Wishlist
  </button>
</div> */}
<div style={{ width: "90%" }} className="mt-10 mb-10 mx-auto text-right">
  <ClearWishlistModal />
  <Link
    to="/products-filters"
    className="rounded-md border border-transparent bg-gray-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
  >
    Continue Shopping
  </Link>
</div>



        </div>

        

        
        
        


        )
      }
    </>
  );
}

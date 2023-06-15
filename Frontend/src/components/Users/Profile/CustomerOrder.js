import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import CustomerDetails from "./CustomerDetails";
import ShippingAddressDetails from "./ShippingAddressDetails";
import {emptyCart} from "../../../redux/slices/cart/cartSlices";
import { DownloadInvoiceLink } from "../../../redux/slices/orders/downloadInvoice";
import { cancelOrderAction } from "../../../redux/slices/orders/ordersSlices";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";



export default function CustomerOrder() {
  //dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserProfileAction());
    dispatch(emptyCart());
  }, [dispatch]);
  //get data from store
  const { error, loading, profile } = useSelector((state) => state?.users);
  //get orders
  const orders = profile?.user?.orders;

  // const order = profile?.user?.orders[profile?.user?.orders.length - 1];
 
  // console.log(orders);

  const cancelOrderHandler = (id) => {
    dispatch(
      cancelOrderAction({id})
    );
    // SuccessMsg({"Cancel ordered successfully"});
    window.location.reload();
  }
  
  return (
    <>
    
    <div className="mt-3 flex items-center justify-center text-center  flex-wrap -mx-3 -mb-3 md:mb-0">
        
        <CustomerDetails
          email={profile?.user?.email}
          dateJoined={new Date(profile?.user?.createdAt).toDateString()}
          fullName={profile?.user?.fullname}
          taxID={profile?.user?.TaxID}
        />
    </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error?.message}</h2>
      ) : orders?.length <= 0 ? (
        <h2 className="text-center mt-10">No Order Found</h2>
      ) : (
        orders?.map((order) => (
          <div className="bg-gray-50">
          <div className="mx-auto max-w-2xl pt-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
              <div className="flex sm:items-baseline sm:space-x-4">
                <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                  <div>
                    <dt className="font-medium text-gray-900">Order number</dt>
                      <dd className="mt-1 text-gray-500">{order?.orderNumber}</dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="font-medium text-gray-900">Date placed</dt>
                    <dd className="mt-1 text-gray-500"><time>{new Date(order?.createdAt).toDateString()}</time></dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">Total amount</dt>
                    <dd className="mt-1 font-medium text-gray-900">${order?.totalPrice}</dd>
                  </div>
                  {
                    order?.status == "processing"
                    ? <button className="bg-blue-500 hover:bg-red-600 text-white font-bold py-1 px-2 mt-3 rounded" onClick={() => cancelOrderHandler(order?._id)}>Cancel order!</button>
                    : null
                  }
                </dl>
              </div>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <time dateTime="2021-03-22" className="font-medium text-gray-900">{order?.status}</time>
              </p>
        
              {/* payment method */}
              <div>
                <dt className="font-medium text-gray-900">Payment Method</dt>
                <dd className="mt-1 font-medium text-gray-900">{order?.paymentMethod}</dd>
              </div>
            </div>
        
            {/* Products */}
            <div className="mt-6">
              <h2 className="sr-only">Products purchased</h2>
        
              <div className="space-y-8">
                {order?.orderItems?.map((product) => (
                  <div
                    key={product.id}
                    className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex lg:col-span-7">
                        <div className="aspect-w-1 aspect-h-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                          <img
                            src={product.image}
                            alt={product.image}
                            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                          />
                        </div>
        
                        <div className="mt-6 sm:mt-0 sm:ml-6">
                          <h3 className="text-base font-medium text-gray-900">
                            <a href={product.href}>{product.name}</a>
                          </h3>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            ${product.price}
                          </p>
                          <p className="mt-3 text-sm text-gray-500">{product.description}</p>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            x {product.qty}
                          </p>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            Subtotal: ${product.qty*product.price}
                          </p>
                        </div>
                      </div>
                    </div>
        
                    {/* payment status icon */}
                    <div className="flex items-center mb-3 ml-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="ml-2 text-sm font-medium text-gray-500">
                        Payment Status: {order.paymentStatus}
                      </p>
                    </div>

                    <div className="flex items-center mb-3 ml-3">
                                        <svg
                        className="h-5 w-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 2H8C5.243 2 3 4.243 3 7v10c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5zM12 17a2 2 0 100-4 2 2 0 000 4z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2v6h6"
                        />
                      </svg>
                      <p className="ml-2  text-sm font-medium text-gray-500">
                        
                        <DownloadInvoiceLink orderID={order._id} orderNum = {order.orderNumber}/>
                      </p>
                      
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ShippingAddressDetails
                shippingAddress={order?.shippingAddress}
              />
        </div>
        )).reverse()
        )
      }
    </>
  );
}

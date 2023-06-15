import React, { useEffect }  from 'react';
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import UpdateOrders from "./UpdateOrders";
import baseURL from '../../../utils/baseURL';
import { fetchProductsAction } from '../../../redux/slices/products/productSlices';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadInvoiceLink } from '../../../redux/slices/orders/downloadInvoice';
import { updateOrderAction } from '../../../redux/slices/orders/ordersSlices';
import ErrorMsg from '../../ErrorMsg/ErrorMsg';

export default function ManageOrdersPM() {
  //get orders
  let loading, error, allOrders;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchProductsAction({
        url: `${baseURL}/pm/orders`,
      })
    );
  }, [dispatch]);

  const { products, loading: productLoading, error: productError } = useSelector((state) => state?.products);
  const orders = products.orders;
  
  const updateClickHandler = (id, status) => {
    if (status === "processing") {
      dispatch(
        updateOrderAction({
          status: "in-transit",
          id,
        })
      );
    }

    else {
      dispatch(
        updateOrderAction({
          status: "delivered",
          id,
        })
      );
    }

    window.location.href = "/pm/delivery-department";
  };

  console.log(orders);
  return (
    <>
      <div className="bg-gray-50">
        <main className="py-10">
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Manage Orders
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                See the invoices and download, also update the delivery status
              </p>
            </div>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
              <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                {loading ? (
                  <h2>Loading...</h2>
                ) : error ? (
                  <h2><ErrorMsg message={error?.message} /></h2>
                ) : (
                  orders?.map((order) => (
                    <div
                      key={order.number}
                      className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                      <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:p-6">
                        <div className="flex-cols justify-content space-between gap-y-3">
                          <p  className="font-medium text-gray-900">Delivery ID</p>
                          <p  className="mt-1 text-gray-500">{order?._id}</p>
                          <p  className="font-medium text-gray-900">Customer ID</p>
                          <p  className="mt-1 text-gray-500">{order?.user?._id}</p>
                          <p  className="font-medium text-gray-900">Order Number</p>
                          <p  className="mt-1 text-gray-500">{order?.orderNumber}</p>
                          <div className="flex items-center gap-x-3 mt-2">
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
                            <p className="font-medium text-gray-900">
                              <DownloadInvoiceLink orderID={order._id} orderNum = {order.orderNumber}/>
                            </p>
                          </div>
                        </div>
                        <div>
                          <p  className="font-medium text-gray-900">Order Owner</p>
                          <p  className="mt-1 text-gray-500">{order?.user?.fullname}</p>
                          <p  className="font-medium text-gray-900">Date Placed</p>
                          <p  className="mt-1 text-gray-500">{new Date(order?.createdAt).toLocaleString()}</p>
                          <p  className="font-medium text-gray-900">Total Amount</p>
                          <p  className="mt-1 text-gray-500">${order?.totalPrice}</p>
                          <p  className="font-medium text-gray-900">Payment Method</p>
                          <p  className="mt-1 text-gray-500">{order?.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Country</p>
                          <p className="mt-1 text-gray-500">{order?.shippingAddress?.country}</p>
                          <p className="font-medium text-gray-900">City</p>
                          <p className="mt-1 text-gray-500">{order?.shippingAddress?.city}</p>
                          <p className="font-medium text-gray-900">Address</p>
                          <p className="mt-1 text-gray-500">{order?.shippingAddress?.address}</p>
                          <p className="font-medium text-gray-900">Postal Code</p>
                          <p className="mt-1 text-gray-500">{order?.shippingAddress?.postalCode}</p>
                        </div>
                      </div>

                      {/* Products */}

                      <ul role="list" className="divide-y divide-gray-200">
                        {order?.orderItems?.map((product) => (
                          <li key={product?.id} className="p-4 sm:p-6">
                            <div className="flex items-center sm:items-start">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                                <img
                                  src={product?.image}
                                  
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-6 flex-1 text-sm">
                                <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                  <h5>{product?.name}</h5>
                                  <p className="mt-2 sm:mt-0">
                                    ${product?.price}
                                  </p>
                                </div>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                  {product?.description}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                  Product ID: {product?._id}
                                </p>
                                <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                  Quantity: {product?.qty}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 sm:flex sm:justify-between">
                              <div className="flex items-center">
                                <CheckCircleIcon
                                  className="h-5 w-5 text-yellow-500"
                                  aria-hidden="true"
                                />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Status: {order.status}
                                </p>
                                {
                                  order?.status !== "delivered"
                                    ? <button onClick={() => updateClickHandler(order._id, order.status)} className="bg-yellow-500 hover:bg-blue-600 text-white font-bold py-1 px-2 ml-3 rounded">Update!</button>
                                    : null
                                }
                                
                              </div>
                              {/* payment status icon */}

                              <div className="flex items-center">
                                <svg
                                  className="h-5 w-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Payment Status: {order.paymentStatus}
                                </p>
                              </div>

                              {/* update order */}
                              {/* <UpdateOrders id={order?._id} /> */}
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                    </div>
                  )).reverse()
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

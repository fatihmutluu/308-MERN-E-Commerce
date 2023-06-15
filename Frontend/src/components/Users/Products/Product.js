import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import Swal from "sweetalert2";
import { getUserById, getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import {
  HeartIcon,
} from "@heroicons/react/24/outline";

import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductAction } from "../../../redux/slices/products/productSlices";
import {
  addOrderToCartaction,
  getCartItemsFromLocalStorageAction,
} from "../../../redux/slices/cart/cartSlices";
import { addToWishlist, deleteFromWishlist, fetchWishlist } from "../../../redux/slices/wishlist/wishlistSlices";
import baseURL from "../../../utils/baseURL";





const user = JSON.parse(localStorage.getItem("userInfo"));
const isLoggedIn = user?.token ? true : false;

const product = {
  name: "Basic Tee",
  price: "$35",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Women", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      id: 1,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
      imageAlt: "Back of women's Basic Tee in black.",
      primary: true,
    },
    {
      id: 2,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-01.jpg",
      imageAlt: "Side profile of women's Basic Tee in black.",
      primary: false,
    },
    {
      id: 3,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-02.jpg",
      imageAlt: "Front of women's Basic Tee in black.",
      primary: false,
    },
  ],
  colors: [
    { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
    {
      name: "Heather Grey",
      bgColor: "bg-gray-400",
      selectedColor: "ring-gray-400",
    },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: false },
  ],
  description: `
    <p>The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.</p>
    <p>Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.</p>
  `,
  details: [
    "Only the best materials",
    "Ethically and locally made",
    "Pre-washed and pre-shrunk",
    "Machine wash cold with similar colors",
  ],
};




const policies = [
  {
    name: "International delivery",
    icon: GlobeAmericasIcon,
    description: "Get your order in 2 years",
  },
  {
    name: "Loyalty rewards",
    icon: CurrencyDollarIcon,
    description: "Don't look at other shoes",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const Review = ({ review }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (review?.user) {
      fetch(`${baseURL}/pm/getUsernameById/${review.user}`)
        .then((response) => response.text())
        .then((data) => setUsername(data));
    }
  }, [review]);

  return (
    username
  );
};



export default function Product() {
  //dispatch
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  let wishlistUrl = `${baseURL}/users/wishlist`;
  const [wishlist, setWishlist] = useState([]);


  const { id } = useParams();


  const [clicked, setClicked] = useState(false);

  



 

  
  let productDetails = {};


  
  //get id from params
  

  useEffect(() => {
    dispatch(fetchProductAction(id));
    dispatch(getUserProfileAction());
    if (isLoggedIn) {
      dispatch(fetchWishlist({
        url: wishlistUrl,
      })).then((response) => {
        setWishlist(response?.payload);
      });
    }
  }, [id, isLoggedIn, dispatch]);


  const { error: userError, loading: userLoading, profile } = useSelector((state) => state?.users);
  const userName = profile?.user?.fullname;
  
  
  const {
    loading: productLoading,
    error: productError,
    product: { product },
  } = useSelector((state) => state?.products);
  

  
  const userWishlist = profile?.user?.wishlist;

  //Get cart items
  useEffect(() => {
    dispatch(getCartItemsFromLocalStorageAction());
    setSelectedColor(product?.color);
  }, []);
  //get data from store
  const { cartItems } = useSelector((state) => state?.carts);
  const productExists = cartItems?.find(
    (item) => item?._id?.toString() === product?._id.toString()
  );

  //Add to cart handler
  const addToCartHandler = () => {
    //check if product is in cart
    if (productExists) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This product is already in cart",
      });
    }
    //check if color/size selected
    if (selectedColor === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...!",
        text: "Please select product color",
      });
    }
    if (selectedSize === "") {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select  product size",
      });
    }
    dispatch(
      addOrderToCartaction({
        _id: product?._id,
        name: product?.name,
        qty: 1,
        price: product?.price,
        description: product?.description,
        color: selectedColor,
        size: selectedSize,
        image: product?.images,
        totalPrice: product?.price,
        qtyLeft: product?.qtyLeft,
      })
    );
    Swal.fire({
      icon: "success",
      title: "Good Job",
      text: "Product added to cart successfully",
    });
    return dispatch(getCartItemsFromLocalStorageAction());
  };


  const [wishlistUser, setWishlistUser] = useState([]);

  useEffect(() => {
    if (userWishlist) {
      setWishlistUser([...userWishlist]);
    }
  }, [userWishlist]);

  const isItemInWishlist = isInWishlist(id, wishlistUser);
 
  

  function isInWishlist(id, wishlistUser) {
    return wishlistUser?.includes(id);
  }

  const handleClick = () => {
    if (isItemInWishlist) {
      dispatch(deleteFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
    setWishlistUser(updatedWishlistUser => {
      const updatedItems = isInWishlist(id, updatedWishlistUser)
        ? updatedWishlistUser.filter(itemId => itemId !== id)
        : [...updatedWishlistUser, id];
      return updatedItems;
    });
    setClicked(!clicked);
  };

  
  return (
    
    <div className="bg-white">
      
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
          <div className="flex justify-between">


          <h1 className="text-xl font-medium text-gray-900">
            {product?.name}  
          </h1>  
          <div>      
          <p className="text-xl font-medium text-gray-900">
              ${product?.price?.toFixed(2)}
            </p>
            {product?.hasDiscount && (     
              <>      
                <span className="text-sm text-gray-500 line-through">
                  ${(product?.cost * 1.25).toFixed(2)}     
                </span>        
                              
              </>  
            )}        
          </div>        
        </div>
        
            {/* Reviews */}
             
            <div className="mt-3">           
            {product?.hasDiscount && (     
              <>      
                
            <span className="rounded-full font-semibold bg-red-500 text-white text-sm px-2 py-1">       
                  {product?.discountRate}% off   
                </span>        
                              
              </>  
            )}        
          </div>  
          


            <div className="mt-4">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {product?.reviews?.length > 0 ? product?.averageRating : 0}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        +product?.averageRating > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="ml-1 text-sm text-gray-300"></div>

{isLoggedIn && (
  <div className="flow-roo">
    <div className="group flex items-center">
      <button
        className={`h-6 w-6 flex-shrink-0 text-purple-400 group-hover:text-purple-500 hover:fill-current: ''
        }`}
        onClick={handleClick}
        
        aria-label="Add to Wishlist"
        
      >
        <HeartIcon className={`${isItemInWishlist ? 'fill-current text-purple-500' : ''}`} />
      </button>
    </div>
  </div>
)}
                          
              
                          
                              
              </div>

  


              {/* leave a review */}
              <div className="mt-4">
                <Link to={`/add-review/${product?._id}`}>
                  <h3 className="text-sm font-medium text-blue-600">
                    Leave a review
                  </h3>
                </Link>
              </div>
              <div className="mt-3">
                {product?.qtyLeft === 1 && (
                  <p style={{color: 'red', fontWeight: 'bold'}}>ONLY ONE LEFT IN STOCKS!</p>
                )}
                {product?.qtyLeft < 8 && product?.qtyLeft > 1 && (
                  <p style={{color: 'red', fontWeight: 'bold'}}>
                    ONLY {product.qtyLeft} LEFT IN STOCKS, HURRY UP!
                  </p>
                )}
                {product?.qtyLeft >= 8 && (
                  <p style={{color: 'blue', fontWeight: 'bold'}}>
                    Stock Size: <span style={{fontWeight: 'normal'}}>{product.qtyLeft}</span>
                  </p>
                )}
            </div>

            </div>
          </div>

          {/* Image gallery */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>

            <img src={product?.images} alt={product?.name} />
            {/*}<div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
              

            </div>
          
                      {*/}
        </div>
          <div className="mt-8 lg:col-span-5">
            <>
              {/* Color picker */}
              <div>
                <h2 className="text-sm font-medium text-gray-900">Color</h2>
                <div className="flex items-center space-x-3">
                  <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                    <div className="mt-4 flex items-center space-x-3">
                    <RadioGroup.Option
                          key={product?.color}
                          value={product?.color}
                          defaultChecked={true} 
                          
                          className={({ active, checked }) =>
                            classNames(
                              
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                            )
                          }>
                          <RadioGroup.Label as="span" className="sr-only">
                            {product?.color}
                          </RadioGroup.Label>
                          <span
                            style={{ backgroundColor: product?.color }}
                            aria-hidden="true"
                            className={classNames(
                              "h-8 w-8 border border-black border-opacity-10 rounded-full"
                            )}
                          />
                        </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Size picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">Size</h2>
                </div>
                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="mt-2">
                  {/* Choose size */}
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {product?.sizes?.map((size) => (
                      <RadioGroup.Option
                        key={size}
                        value={size}
                        className={({ active, checked }) => {
                          return classNames(
                            checked
                              ? "bg-indigo-600 border-transparent  text-white hover:bg-indigo-700"
                              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                            "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer"
                          );
                        }}>
                        <RadioGroup.Label as="span">{size}</RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                
              </div>




              {/* add to cart */}
              {product?.qtyLeft <= 0 ? (
                <button
                  style={{ cursor: "not-allowed" }}
                  disabled
                  className="mt-8 flex w-full text-white items-center justify-center rounded-md border border-transparent bg-gray-600 py-3 px-8 text-base font-medium text-whitefocus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Out of Stock
                </button>
              ) : (
            <div style={{display: 'flex'}}>
              <button
                onClick={() => addToCartHandler()}
                className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Add to cart
              </button>



            </div>
              )}
              {/* proceed to check */}

              {cartItems.length > 0 && (
                <Link
                  to="/shopping-cart"
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green-800 py-3 px-8 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Proceed to checkout
                </Link>
              )}
            </>

            {/* Product details */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <div className="prose prose-sm mt-4 text-gray-500">
                {product?.description}
              </div>
            </div>

            {/* Policies */}
            <section aria-labelledby="policies-heading" className="mt-10">
              <h2 id="policies-heading" className="sr-only">
                Our Policies
              </h2>

              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {policies.map((policy) => (
                  <div
                    key={policy.name}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                    <dt>
                      <policy.icon
                        className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="mt-4 text-sm font-medium text-gray-900">
                        {policy.name}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {policy.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Reviews */}
        <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-24">
          <h2
            id="reviews-heading"
            className="text-lg font-medium text-gray-900">
            Reviews
          </h2>
          
            {product?.reviews?.length === 0 && (
              <div className="mt-6">
              <p><strong>Be the first one to leave a review, you can buy the product to do so! </strong></p>
              </div>
            )}


          <div className="mt-6 space-y-10 divide-y divide-gray-200 border-t border-b border-gray-200 pb-10">
            {product?.reviews.map((review) => {
              return (

                // Buraya if review.approved = true koşulu eklenecek EDIT
                <div
                  key={review._id}
                  className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                    <div className="flex items-center xl:col-span-1">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              review.rating > rating
                                ? "text-yellow-400"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0"
                            )}
                            aria-hidden="true" />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-700">
                        {review.rating}
                        <span className="sr-only"> out of 5 stars</span>
                      </p>
                    </div>

                   <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
  <h3 className="text-sm font-medium text-gray-900">
    {review.reviewApproved ? review?.message : "The comment is waiting for admin's approval, thank you for your patience!"}
  </h3>
</div>
                  </div>

                  <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                    <p className="font-medium text-gray-900">
                      
                    <Review key={review.user} review={review} />

                    </p>
                    <time
                      dateTime={review.datetime}
                      className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              );
            }).reverse()}
          </div>
        </section>
      </main>
    </div>
  );
}

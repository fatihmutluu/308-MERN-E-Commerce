import axios from "axios";
import { act } from "react-dom/test-utils";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");



//initalsState
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};



const user = JSON.parse(localStorage.getItem("userInfo"));

//fetch wishlisted action
export const fetchWishlist = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    
    try {
      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${url}`, config);
      
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);



//add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //Images
      const { data } = await axios.post(
        `${baseURL}/products/wishlist`,
        {
          id,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);



//deleteFrom wishlist
export const deleteFromWishlist = createAsyncThunk(
  "wishlist/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {

    //Token - Authenticated
    
    const token = getState()?.users?.userAuth?.userInfo?.token;
    const url = `${baseURL}/products/wishlist`;
    const config = {
      url,
      method: 'DELETE',
      data: {
        id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const res = await axios(config);
      
  }
);


//add product to cart
export const addOrderToCartaction = createAsyncThunk(
  "wishlist/add-to-wishlist",
  async (cartItem) => {
    const cartItems = localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [];
    //push to storage
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
);
//add product to cart
export const getCartItemsFromLocalStorageAction = createAsyncThunk(
  "cart/get-order-items",
  async () => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    return cartItems;
  }
);

//add product to cart
export const changeOrderItemQty = createAsyncThunk(
  "cart/change-item-qty",
  async ({ productId, qty }) => {
    console.log(productId, qty);
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    const newCartItems = cartItems?.map((item) => {
      if (item?._id?.toString() === productId?.toString()) {
        //get new price
        const newPrice = item?.price * qty;
        item.qty = +qty;
        item.totalPrice = newPrice;
      }
      return item;
    });
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  }
);

//remove from cart
export const removeOrderItemQty = createAsyncThunk(
  "cart/removeOrderItem",
  async (productId) => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    const newItems = cartItems?.filter((item) => item?._id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
  }
);


//clear cart
export const emptyCart = createAsyncThunk(
  "cart/emptyCart",
  async () => {
  localStorage.setItem("cartItems", JSON.stringify([]));
  }
  );



  //slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  extraReducers: (builder) => {

    //fetch all
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.orders = null;
      state.error = action.payload;
    });
    
  },
});

//generate the reducer
const wishlistReducer = wishlistSlice.reducer;

export default wishlistReducer;

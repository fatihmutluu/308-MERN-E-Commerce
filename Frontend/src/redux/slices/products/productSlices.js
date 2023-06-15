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
  products: [],
  product: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create product action
export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        name,
        description,
        brand,
        category,
        gender,
        sizes,
        color,
        images,
        totalQty,
        cost,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(
        {
          name,
          description,
          brand,
          category,
          gender,
          sizes,
          color,
          images,
          totalQty,
          cost,
        });

      const { data } = await axios.post(
        `${baseURL}/pm/createProduct`,
        {
          name,
          description,
          brand,
          category,
          gender,
          sizes,
          color,
          images,
          totalQty,
          cost,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action
export const updateProductAction = createAsyncThunk(
  "product/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        name,
        description,
        category,
        sizes,
        brand,
        colors,
        price,
        totalQty,
        id,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/products/${id}`,
        {
          name,
          description,
          category,
          sizes,
          brand,
          colors,
          price,
          totalQty,
        },
        config
      );
      console.log("update product admin",data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action SM
export const updateProductActionSM = createAsyncThunk(
  "product/updatesm",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        price,
        id,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/sm/updateProduct/${id}`,
        {
          price,
        },
        config
      );
      console.log("update product price sales manager",data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action SM
export const updateSingleProductDiscountAction = createAsyncThunk(
  "product/updatesmdiscount",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        rate,
        id,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(`${baseURL}/sm/setSingleDiscount/${id}`,rate, token);
      const { data } = await axios.post(
        `${baseURL}/sm/setSingleDiscount/${id}`,
        {
          rate,
        },
        config
      );
      console.log("update single product discount rate sales manager",data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action PM
export const updateProductActionPM = createAsyncThunk(
  "product/updatepm",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        totalQty,
        id,
      } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/pm/updateProduct/${id}`,
        {
          totalQty,
        },
        config
      );
      console.log("update product product manager",data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


//fetch products action
export const fetchProductsAction = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    try {
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


//fetch products action
export const fetchSingleProductByURL = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    try {
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

//fetch product action
export const fetchProductActionbyID = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}/products/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete product action
export const DeleteProductAction = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(`${baseURL}/pm/deleteProduct/${id.id}`);
      const { data } = await axios.delete(
        `${baseURL}/pm/deleteProduct/${id.id}`,
        config
      );
      
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


//fetch product action
export const fetchProductAction = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}/products/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//slice
const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    //create
    builder.addCase(createProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createProductAction.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //update 
    builder.addCase(updateProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateProductAction.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    //update SM
    builder.addCase(updateProductActionSM.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductActionSM.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateProductActionSM.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    //update SM rate
    builder.addCase(updateSingleProductDiscountAction .pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSingleProductDiscountAction .fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateSingleProductDiscountAction .rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    //updatePM
    builder.addCase(updateProductActionPM.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductActionPM.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(updateProductActionPM.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    // DeleteProductAction
    builder.addCase(DeleteProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(DeleteProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isUpdated = true;
    });
    builder.addCase(DeleteProductAction.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
      state.error = action.payload;
    });
    //fetch all
    builder.addCase(fetchProductsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      // state.isAdded = false;
    });
    builder.addCase(fetchProductsAction.rejected, (state, action) => {
      state.loading = false;
      state.products = null;
      // state.isAdded = false;
      state.error = action.payload;
    });
    //fetch all
    builder.addCase(fetchProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.isAdded = true;
    });
    builder.addCase(fetchProductAction.rejected, (state, action) => {
      state.loading = false;
      state.product = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //reset error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
    //reset success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });
  },
});

//generate the reducer
const productReducer = productSlice.reducer;

export default productReducer;

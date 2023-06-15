
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initalsState
const initialState = {
  reviews: [],
  review: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create review action
export const createReviewAction = createAsyncThunk(
  "review/create",
  async ({ rating, message, id }, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //request
      const { data } = await axios.post(
        `${baseURL}/reviews/${id}`,
        {
          rating,
          message,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get all unapproved reviews action
export const getUnapprovedReviewsAction = createAsyncThunk(
  "review/unapprovedList",
  async ({ url }, { rejectWithValue, getState, dispatch}) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(url, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// approve review action
export const approveReviewAction = createAsyncThunk(
  "review/approve",
  async ( { id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      const { data } = await axios.put(`${baseURL}/pm/approveReview/${id}`, {} , config)
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


// cancel review action
export const cancelReviewAction = createAsyncThunk(
  "review/cancel",
  async ( { id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      const { data } = await axios.put(`${baseURL}/pm/cancelReview/${id}`, {} , config)
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//slice
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  extraReducers: (builder) => {
    //create review action
    builder.addCase(createReviewAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createReviewAction.fulfilled, (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createReviewAction.rejected, (state, action) => {
      state.loading = false;
      state.coupon = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    //get all unapproved reviews action
    builder.addCase(getUnapprovedReviewsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUnapprovedReviewsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(getUnapprovedReviewsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // approve review action
    builder.addCase(approveReviewAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(approveReviewAction.fulfilled, (state, action) => {
      state.isUpdated = true;
      state.loading = false;
    });
    builder.addCase(approveReviewAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //cancel review action
    builder.addCase(cancelReviewAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cancelReviewAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDelete = true;
    });
    builder.addCase(cancelReviewAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });



    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.isAdded = false;
      state.isDelete = false;
      state.isUpdated = false;
      state.error = null;
    });
    //reset success action
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.isDelete = false;
      state.isUpdated = false;
      state.error = null;
    });
  },
});

//generate the reducer
const reviewsReducer = reviewsSlice.reducer;

export default reviewsReducer;

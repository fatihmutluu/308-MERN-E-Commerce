import axios from "axios";
import ErrorMsg from "../../../components/ErrorMsg/ErrorMsg";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const initialState = {
    loading: false,
    error: false,
    isAdded: false,
    requests: [],
};


// create refund request action
export const createRRaction = createAsyncThunk(
    "refundRequest/create",
    async ( { orderID, itemIds, refundReasons }, { rejectWithValue, getState, dispatch }) => {
      try {
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        console.log(`${baseURL}/refund/${orderID}`,
        {
          itemIds,
          refundReasons,
        });
        const { data } = await axios.post(
          `${baseURL}/refund/${orderID}`,
          {
            itemIds,
            refundReasons,
          },
          config
        );
        return data;
      } catch (error) {
        return rejectWithValue(error?.response?.data); 
      }
    },
);


// fetch all unevaluated refund requests action
export const fetchRRaction = createAsyncThunk(
  "refundRequest/getList",
  async ( { url }, { rejectWithValue, getState, dispatch }) => {
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
  },
);


// approve refund request action
export const approveRRaction = createAsyncThunk(
  "refundRequest/approve",
  async ( { id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };

      const { data } = await axios.put(`${baseURL}/sm/approveRefund/${id}`, {}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

// disapprove refund request action
export const cancelRRaction = createAsyncThunk(
  "refundRequest/disapprove",
  async ( { id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };

      const { data } = await axios.put(`${baseURL}/sm/disapproveRefund/${id}`, {}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

// slice
const refundRequestsSlice = createSlice({
  name: "refundRequests",
  initialState,
  extraReducers: (builder) => {
    // create refund request action
    builder.addCase(createRRaction.pending, (state) => {
      state.loading = true;
      state.isAdded = false;
    });
    builder.addCase(createRRaction.fulfilled, ( state, action ) => {
      state.loading = true;
      state.isAdded = true;
    });
    builder.addCase(createRRaction.rejected, ( state, action ) => {
      state.error = action.payload;
      state.loading = false;
      state.isAdded = false;
    });
    
    // fetch all unevaluated refund requests action
    builder.addCase(fetchRRaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRRaction.fulfilled, (state, action) => {
      state.loading = false;
      state.requests = action.payload.refundRequests;
    });
    builder.addCase(fetchRRaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // approve refund request action
    builder.addCase(approveRRaction.pending, ( state, action ) => {
      state.loading = true;
    });
    builder.addCase(approveRRaction.fulfilled, (state, action ) => {
      state.loading = false;
    });
    builder.addCase(approveRRaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // disapprove refund request action
    builder.addCase(cancelRRaction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(cancelRRaction.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(cancelRRaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // reset error action
    builder.addCase(resetErrAction.pending, (state) => {
      state.loading = false;
      state.error = null;
    });

    // reset success action
    builder.addCase(resetSuccessAction.pending, (state) => {
      state.loading = false;
      state.error = null;
    });
  },
});

const refundRequestsReducer = refundRequestsSlice.reducer;

export default refundRequestsReducer;
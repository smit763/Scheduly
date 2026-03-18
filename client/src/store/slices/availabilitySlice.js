import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchAvailability = createAsyncThunk(
  "availability/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/availability");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveAvailability = createAsyncThunk(
  "availability/save",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/availability", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateLink = createAsyncThunk(
  "availability/generateLink",
  async ({ availabilityId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/booking-links/generate", {
        availabilityId
      });
      return { availabilityId, ...data.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAvailability = createAsyncThunk(
  "availability/delete",
  async (availabilityId, { rejectWithValue }) => {
    try {
      await api.delete(`/availability/${availabilityId}`);
      return availabilityId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState: {
    list: [],
    fetching: false,
    fetchError: null,
    loading: false,
    error: null,
    successMessage: null,
    generatingLinkId: null,
    linkError: null,
    deletingId: null
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
      state.linkError = null;
      state.fetchError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.fetching = true;
        state.fetchError = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.fetching = false;
        state.list = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.fetching = false;
        state.fetchError = action.payload;
      })
      .addCase(saveAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift({ ...action.payload, generatedLink: null });
        state.successMessage = "Availability saved successfully!";
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateLink.pending, (state, action) => {
        state.generatingLinkId = action.meta.arg.availabilityId;
        state.linkError = null;
      })
      .addCase(generateLink.fulfilled, (state, action) => {
        state.generatingLinkId = null;
        const item = state.list.find(
          (a) => a._id === action.payload.availabilityId
        );
        if (item) item.generatedLink = action.payload.url;
      })
      .addCase(generateLink.rejected, (state, action) => {
        state.generatingLinkId = null;
        state.linkError = action.payload;
      })
      .addCase(deleteAvailability.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteAvailability.fulfilled, (state, action) => {
        state.deletingId = null;
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAvailability.rejected, (state) => {
        state.deletingId = null;
      });
  }
});

export const { clearMessages } = availabilitySlice.actions;
export default availabilitySlice.reducer;

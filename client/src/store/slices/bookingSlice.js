import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchBookingLink = createAsyncThunk(
  "booking/fetchLink",
  async (uniqueId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/booking-links/${uniqueId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBookedSlots = createAsyncThunk(
  "booking/fetchSlots",
  async ({ bookingLinkId, date }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookings/slots", {
        params: { bookingLinkId, date }
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/bookings", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    linkData: null,
    linkLoading: false,
    linkError: null,
    bookedSlots: [],
    slotsLoading: false,
    bookingLoading: false,
    bookingError: null,
    bookedSlot: null,
    bookerName: null
  },
  reducers: {
    clearBookingMessages(state) {
      state.bookingError = null;
    },
    resetBookedSlots(state) {
      state.bookedSlots = [];
    },
    resetBookingSuccess(state) {
      state.bookedSlot = null;
      state.bookerName = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingLink.pending, (state) => {
        state.linkLoading = true;
        state.linkError = null;
        state.linkData = null;
      })
      .addCase(fetchBookingLink.fulfilled, (state, action) => {
        state.linkLoading = false;
        state.linkData = action.payload;
      })
      .addCase(fetchBookingLink.rejected, (state, action) => {
        state.linkLoading = false;
        state.linkError = action.payload;
      })
      .addCase(fetchBookedSlots.pending, (state) => {
        state.slotsLoading = true;
        state.bookedSlots = [];
      })
      .addCase(fetchBookedSlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.bookedSlots = action.payload;
      })
      .addCase(fetchBookedSlots.rejected, (state) => {
        state.slotsLoading = false;
      })
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookedSlot = action.payload.timeSlot;
        state.bookerName = action.payload.bookerName;
        state.bookedSlots.push(action.payload.timeSlot);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      });
  }
});

export const {
  clearBookingMessages,
  resetBookedSlots,
  resetBookingSuccess
} = bookingSlice.actions;
export default bookingSlice.reducer;

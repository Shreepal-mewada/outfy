import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.loading = false;
            state.error = null;
        },
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        updateItem: (state, action) => {
            const item = state.items.find(item => item.product._id === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.product._id !== action.payload.productId);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearCart: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    }
})

export const { setCart, addItem, updateItem, removeItem, setLoading, setError, clearCart } = cartSlice.actions
export default cartSlice.reducer

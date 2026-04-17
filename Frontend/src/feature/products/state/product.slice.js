import {createSlice} from "@reduxjs/toolkit";


const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProducts:[],
        allproducts:[]
    },
    reducers:{
        setProducts:(state,action)=>{
            state.sellerProducts=action.payload
        },
        setAllProducts:(state,action)=>{
            state.allproducts=action.payload
        }
    }
})

export const {setProducts, setAllProducts} = productSlice.actions
export default productSlice.reducer 
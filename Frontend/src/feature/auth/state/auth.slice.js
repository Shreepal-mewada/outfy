import { createSlice } from "@reduxjs/toolkit"; 


const savedUser = localStorage.getItem("outfy_user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

const authSlice = createSlice({
    name:"auth",
    initialState:{
      user: initialUser,
      error:null,
      loading:false
    },


  reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("outfy_user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("outfy_user");
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
        }
})

export const { setError, setLoading, setUser } = authSlice.actions
export default authSlice.reducer
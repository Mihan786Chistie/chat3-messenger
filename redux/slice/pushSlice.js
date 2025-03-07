import { createSlice } from "@reduxjs/toolkit";

const pushSlice = createSlice({
  name: "default",

  initialState: {
    user: null,
    chats: null,
    requests: null,
    stream: null,
    data: null,
    addDialog: false,
    profileDialog: false,
    profile: {
      name: '',
      image: ''
    },
    createGroupDialog: false,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setStream: (state, action) => {
      state.stream = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    handleAddDialog: (state, action) => {
      state.addDialog = !state.addDialog;
    },
    handleProfileDialog: (state) => {
      state.profileDialog = !state.profileDialog;
    },
    handleCreateGroupDialog: (state) => {
      state.createGroupDialog = !state.createGroupDialog;
    },
    
    setProfile: (state, action) => {
      state.profile = action.payload;
    }
  },
});

export const {
  setUser,
  setChats,
  setRequests,
  setStream,
  setData,
  handleAddDialog,
  handleProfileDialog,
  handleCreateGroupDialog,
  setProfile
} = pushSlice.actions;

export default pushSlice.reducer;

"use client";

import {
  setChats,
  setData,
  setRequests,
  setStream,
  setProfile
} from "@/redux/slice/pushSlice";
import { CONSTANTS } from "@pushprotocol/restapi";
import { useDispatch, useSelector } from "react-redux";

export default function usePush() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.push.user);

  const fetchChats = async () => {
    const chat = await user.chat.list("CHATS");
    dispatch(setChats(chat));
  };

  const fetchRequests = async () => {
    const requests = await user.chat.list("REQUESTS");
    dispatch(setRequests(requests));
  };

  const acceptRequest = async (walletAddress) => {
    await user.chat.accept(walletAddress);
    fetchChats();
    fetchRequests();
  };

  const rejectRequest = async (walletAddress) => {
    await user.chat.reject(walletAddress);
    fetchChats();
    fetchRequests();
  };

  const streamChat = async (user) => {
    const stream = await user.initStream(
      [CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS],
      {
        filter: {
          channels: ["*"],
          chats: ["*"],
        },
        connection: {
          retries: 3,
        },
        raw: false,
      }
    );

    stream.on(CONSTANTS.STREAM.CHAT, (data) => {
      dispatch(setData(data));
    });

    stream.on(CONSTANTS.STREAM.CHAT_OPS, (data) => {
      dispatch(setData(data));
    });

    stream.connect();

    dispatch(setStream(stream));
  };

  const fetchUserProfile = async (address) => {
    try {
      if(!user) return;
      const profile = await user.profile.get(address);
      dispatch(setProfile(profile));
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const createGroup = async (groupName, options) => {
    try {
      await user.chat.group.create(groupName, options);
      await fetchChats(); // Refresh chat list after group creation
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  return {
    fetchChats,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    streamChat,
    fetchUserProfile,
    createGroup,
  };
}

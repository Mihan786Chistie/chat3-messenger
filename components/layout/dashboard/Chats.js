"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { handleAddDialog, setChats, handleCreateGroupDialog } from "@/redux/slice/pushSlice";
import ChatBox from "./ChatBox";
import { Button } from "@material-tailwind/react";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Poppins } from "next/font/google";
import usePush from "@/hooks/usePush";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Chats() {
  const user = useSelector((state) => state.push.user);
  const chats = useSelector((state) => state.push.chats);
  const { fetchChats } = usePush();
  const data = useSelector((state) => state.push.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (data && user) {
      fetchChats();
    }
  }, [data]);

  return (
    chats && (
      <div className="w-full h-full flex flex-col items-center gap-3">
        <div className="w-full flex gap-2">
          <Button
            size="lg"
            className={
              "flex items-center justify-center flex-1 rounded-2xl normal-case " +
              poppins.className
            }
            onClick={() => {
              dispatch(handleAddDialog());
            }}
          >
            Add Contact
            <PlusIcon className="h-5 w-5 ml-2" />
          </Button>
          <Button
            size="lg"
            className={
              "flex items-center justify-center flex-1 rounded-2xl normal-case " +
              poppins.className
            }
            onClick={() => {
              dispatch(handleCreateGroupDialog());
            }}
          >
            Create Group
            <UserGroupIcon className="h-5 w-5 ml-2" />
          </Button>
        </div>
        <div className="flex-1 w-full overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {chats.map((chat) => (
              <ChatBox key={chat.chatId} chat={chat} />
            ))}
          </div>
        </div>
      </div>
    )
  );
}

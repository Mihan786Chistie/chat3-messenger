"use client";

import Navbar from "@/components/layout/dashboard/Navbar";
import { Button } from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/solid";
import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import ChatBubble from "@/components/layout/chat/ChatBubble";
import usePush from "@/hooks/usePush";
import Image from "next/image";

export default function Chat({ params }) {
  const router = useRouter();
  const user = useSelector((state) => state.push.user);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const { isConnected } = useAccount();
  const data = useSelector((state) => state.push.data);
  const fileInputRef = useRef(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const { fetchUserProfile } = usePush();
  const myProfile = useSelector((state) => state.push.profile);

  useEffect(() => {
    if (user && isConnected) {
      fetchHistory();
    }
  }, [user, isConnected]);

  useEffect(() => {
    if (data && user && isConnected) {
      fetchHistory();
    }
  }, [data]);

  const fetchHistory = async () => {
    const history = await user.chat.history(params.id.replace("%3A", ":"));
    setHistory(history);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64String = event.target?.result;
          if (typeof base64String === 'string') {
            await sendMessage(base64String);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
      }
    }
  };

  const sendMessage = async (content) => {
    try {
      if (!content && message.trim()) {
        // Handle text message
        await user.chat.send(params.id.replace("%3A", ":"), {
          type: 'Text',
          content: message,
        });
        setMessage("");
      } else if (content) {
        // Handle image message - ensure content is base64
        if (!content.startsWith('data:image')) {
          throw new Error('Invalid image format');
        }
        
        await user.chat.send(params.id.replace("%3A", ":"), {
          type: 'Image',
          content: content, // Send the base64 string directly
        });
      }
      fetchHistory();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const partnerId = params.id.replace("%3A", ":");
        
        // Check if this is a group chat
        if (partnerId.includes('group')) {
          const groupData = await user.chat.group.info(partnerId);
          setPartnerProfile({
            name: groupData.groupName,
            picture: groupData.groupImage,
            isGroup: true
          });
          return;
        }

        // Regular user chat
        const partnerAddress = partnerId.split(":")[1];
        if (!partnerAddress) return;

        const profile = await fetchUserProfile(partnerAddress);
        setPartnerProfile({
          ...profile,
          isGroup: false
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user && isConnected) {
      fetchProfile();
    }
  }, [params.id, user, isConnected]);

  const renderAvatar = () => {
    if (!partnerProfile) return null;

    const profilePicture = partnerProfile.picture;
    const displayName = partnerProfile.name || params.id.split("%3A")[1];

    if (profilePicture) {
      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={profilePicture}
            alt={displayName}
            width={40}
            height={40}
            className="object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-avatar').style.display = 'block';
            }}
          />
          <div className="fallback-avatar" style={{ display: 'none' }}>
            <Avatar
              size={40}
              name={displayName}
              variant="marble"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </div>
        </div>
      );
    }

    return (
      <Avatar
        size={40}
        name={displayName}
        variant="marble"
        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
      />
    );
  };

  return (
    <div className="w-[1024px] h-screen flex flex-col items-center">
      <Navbar />

      <div className="w-full flex items-center justify-between gap-4 rounded-2xl bg-gray-900 p-3 px-5 mt-5">
        <div className="flex gap-4 items-center">
        <Button
            size="lg"
            className="rounded-2xl flex items-center justify-center gap-2 bg-gray-800"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <ArrowLeftIcon className="h-4 w-4 -mt-0.5" />
            Back
          </Button>
          {renderAvatar()}
          <div className="flex flex-col">
            <h2 className="text-lg text-white">
              {partnerProfile?.name || params.id.split("%3A")[1]}
            </h2>
            
          </div>
        </div>
        <div className="flex gap-4 items-center">
        </div>
      </div>

      <div className="w-full h-full flex flex-col-reverse items-center gap-3 mt-5">
        <div className="w-full flex items-center justify-between gap-4 rounded-2xl bg-gray-900 p-3 px-5 mb-5">
        <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button
            size="sm"
            className="rounded-2xl bg-gray-800"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperClipIcon className="h-6 w-6 -mt-0.5" />
          </Button>
          <input
            type="text"
            className="w-full h-full bg-gray-900 text-white/80 outline-none"
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          ></input>
          <Button
            size="lg"
            className="rounded-2xl flex items-center justify-center gap-2 px-5 bg-blue-400"
            disabled={message === ""}
            onClick={() => {
              sendMessage();
            }}
          >
            <PaperAirplaneIcon className="h-6 w-6 -mt-0.5" />
          </Button>
        </div>
        <div className="w-full flex-grow flex relative">
          <div className="w-full h-full flex flex-col-reverse gap-2 overflow-auto absolute">
            {history.map((message, index) => (
              <ChatBubble
                key={index}
                message={message}
                isMe={message.fromDID.split(":")[1] === user.account}
                senderName={
                  message.fromDID.split(":")[1] === user.account
                    ? "You"
                    : partnerProfile?.isGroup
                    ? message.fromCAIP10?.split(":")[1] // Use CAIP10 for group messages
                    : (partnerProfile?.name || message.fromDID.split(":")[1])
                }
                timestamp={message.timestamp}
                profilePicture={
                  message.fromDID.split(":")[1] === user.account
                    ? myProfile?.picture
                    : partnerProfile?.isGroup
                    ? null // Let ChatBubble handle group member avatars
                    : partnerProfile?.picture
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

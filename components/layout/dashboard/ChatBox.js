import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import usePush from "@/hooks/usePush";

export default function ChatBox({ chat }) {
  const router = useRouter();
  const [partnerProfile, setPartnerProfile] = useState(null);
  const { fetchUserProfile } = usePush();
  const myProfile = useSelector((state) => state.push.profile);
  const user = useSelector((state) => state.push.user);

  useEffect(() => {
    const fetchProfile = async () => {
      if (chat.groupInformation) return;
      
      try {
        let partnerAddress;
        if (chat.did) {
          partnerAddress = chat.did.split(':')[1];
        } else if (chat.msg) {
          const fromAddress = chat.msg.fromDID.split(':')[1];
          const toAddress = chat.msg.toDID.split(':')[1];
          partnerAddress = fromAddress === user.account ? toAddress : fromAddress;
        }
        
        if (partnerAddress) {
          const profile = await fetchUserProfile(partnerAddress);
          setPartnerProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching partner profile:', error);
      }
    };

    fetchProfile();
  }, [chat, user]);

  const getAvatarName = () => {
    if (chat.groupInformation) {
      return chat.groupInformation.groupName;
    }
    if (chat.did) {
      return chat.did.split(':')[1];
    }
    if (chat.msg?.fromDID) {
      const fromAddress = chat.msg.fromDID.split(':')[1];
      const toAddress = chat.msg.toDID.split(':')[1];
      return fromAddress === user.account ? toAddress : fromAddress;
    }
    return 'Unknown';
  };

  const getName = () => {
    if (chat.groupInformation) {
      return chat.groupInformation.groupName;
    }
    if (partnerProfile?.name) {
      return partnerProfile.name;
    }
    return getAvatarName();
  };

  const getChatId = () => {
    if (chat.chatId) return chat.chatId;
    if (chat.did) return chat.did;
    if (chat.msg?.fromDID) {
      const fromAddress = chat.msg.fromDID.split(':')[1];
      const toAddress = chat.msg.toDID.split(':')[1];
      return fromAddress === user.account ? 
        `eip155:${toAddress}` : 
        `eip155:${fromAddress}`;
    }
    return null;
  };

  const chatId = getChatId();
  if (!chatId) return null;

  return (
    <div
      className="w-full flex items-center gap-4 rounded-2xl bg-gray-900 hover:bg-gray-800 transition-colors duration-300 hover:cursor-pointer p-3 px-5"
      onClick={() => {
        router.push(`/chat/${chatId}`);
      }}
    >
      {chat.groupInformation?.groupImage ? (
        <img 
          src={chat.groupInformation.groupImage} 
          alt="group" 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : partnerProfile?.picture ? (
        <img 
          src={partnerProfile.picture} 
          alt="profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <Avatar
          size={40}
          name={getAvatarName()}
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-lg text-white">{getName()}</h2>
        <h3 className="text-sm text-white/40">
          {chat.msg?.messageType === 'Image' ? (
            <PhotoIcon className="h-4 w-4 inline" />
          ) : chat.msg?.messageContent}
        </h3>
      </div>
    </div>
  );
}

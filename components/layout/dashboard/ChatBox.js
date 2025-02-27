import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import usePush from "@/hooks/usePush";

export default function ChatBox({ chat }) {
  const router = useRouter();
  const [partnerProfile, setPartnerProfile] = useState(null);
  const { fetchUserProfile } = usePush();
  const myProfile = useSelector((state) => state.push.profile);
  const user = useSelector((state) => state.push.user);

  useEffect(() => {
    const fetchProfile = async () => {
      // Determine which DID is the chat partner
      const partnerDID = chat.msg.fromDID === user.did 
        ? chat.msg.toDID 
        : chat.msg.fromDID;
      
      const address = partnerDID.split(":")[1];
      const profile = await fetchUserProfile(address);
      setPartnerProfile(profile);
    };

    fetchProfile();
  }, [chat]);

  return (
    <div
      className="w-full flex items-center gap-4 rounded-2xl bg-gray-900 hover:bg-gray-800 transition-colors duration-300 hover:cursor-pointer p-3 px-5"
      onClick={() => {
        router.push(`/chat/${chat.did}`);
      }}
    >
      {partnerProfile?.picture ? (
        <img 
          src={partnerProfile.picture} 
          alt="profile" 
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <Avatar
          size={40}
          name={chat.did.split(":")[1]}
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-lg text-white">
          {partnerProfile?.name || chat.did.split(":")[1]}
        </h2>
        <h3 className="text-sm text-white/40">{chat.msg.messageContent}</h3>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@material-tailwind/react";
import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { handleProfileDialog } from "@/redux/slice/pushSlice";

export default function Navbar() {
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { address, connector } = useAccount();
  const [client, setClient] = useState(false);
  const stream = useSelector((state) => state.push.stream);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.push.profile);


  useState(() => {
    setClient(true);
  }, []);

  return (
    client && (
      <div className="w-full flex items-center justify-between mt-5">
      <div className="flex justify-center items-center gap-4 rounded-2xl bg-gray-900 p-3 px-5">
      {profile?.image ? (
        <img src={profile.image} alt="profile" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
        ) : (
        <Avatar
          size={40}
          name={address}
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
        )}
        <div className="flex flex-col">
          <h2
            className="text-lg text-white hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(address);
              alert("Copied to clipboard!");
            }}
          >
            {profile?.name || (address
              ? address.slice(0, 4) + "..." + address.slice(-4)
              : "0x00...0000")}
          </h2>
          <h3 className="text-sm text-white/40">
            {connector && connector.name === "MetaMask"
              ? "Metamask"
              : "Coinbase"}
          </h3>
        </div>
        <Button
          variant="text"
          className="ml-2 p-2 text-white"
          onClick={() => dispatch(handleProfileDialog())}
        >
          Edit
        </Button>
      </div>


        <div className="flex flex-col items-center -ml-16">
          <h1 className="font-bold text-5xl">3Chat</h1>
        </div>

        <Button
          className="h-full rounded-2xl normal-case"
          size="lg"
          onClick={() => {
            disconnect();
            if (stream) {
              stream.disconnect();
            }
            router.push("/");
          }}
        >
          Disconnect
        </Button>
      </div>
    )
  );
}

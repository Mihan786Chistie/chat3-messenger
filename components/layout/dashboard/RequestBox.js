"use client";
import usePush from "@/hooks/usePush";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import Avatar from "boring-avatars";
import { useAccount } from 'wagmi';

export default function RequestBox({ request }) {
  const { acceptRequest, rejectRequest } = usePush();
  const { address } = useAccount();

  // Early return if no request or no address
  if (!request || !address) {
    return null;
  }

  const getRequestParties = () => {
    try {
      // Handle group chat requests
      if (request.groupInformation) {
        return {
          fromAddress: request.intentSentBy?.split(":")[1],
          toAddress: request.groupInformation.chatId,
          isGroup: true
        };
      }

      // Handle direct chat requests
      if (request.combinedDID) {
        const [from, to] = request.combinedDID.split("_");
        return {
          fromAddress: from.split(":")[1],
          toAddress: to.split(":")[1],
          isGroup: false
        };
      }
      return null;
    } catch (error) {
      console.error("Error parsing request addresses:", error);
      return null;
    }
  };

  const handleAccept = async () => {
    try {
      const parties = getRequestParties();
      if (!parties) {
        throw new Error("Cannot parse request addresses");
      }

      const { fromAddress, toAddress, isGroup } = parties;

      // For group requests, use the group chatId
      const targetAddress = isGroup 
        ? toAddress 
        : (address?.toLowerCase() === fromAddress?.toLowerCase() ? toAddress : fromAddress);

      if (!targetAddress) {
        throw new Error("Cannot determine target address");
      }

      console.log("Accepting request for target:", targetAddress, isGroup ? "(group)" : "(user)");
      await acceptRequest(targetAddress);
    } catch (error) {
      console.error("Error accepting request:", error);
      alert(error.message || "Failed to accept request");
    }
  };

  const handleReject = async () => {
    try {
      const parties = getRequestParties();
      if (!parties) {
        throw new Error("Cannot parse request addresses");
      }

      const { fromAddress, toAddress, isGroup } = parties;

      // For group requests, use the group chatId
      const targetAddress = isGroup 
        ? toAddress 
        : (address?.toLowerCase() === fromAddress?.toLowerCase() ? toAddress : fromAddress);

      if (!targetAddress) {
        throw new Error("Cannot determine target address");
      }

      console.log("Rejecting request for target:", targetAddress, isGroup ? "(group)" : "(user)");
      await rejectRequest(targetAddress);
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert(error.message || "Failed to reject request");
    }
  };

  const getDisplayName = () => {
    const parties = getRequestParties();
    if (!parties) return "Unknown";

    if (parties.isGroup) {
      return request.groupInformation?.groupName || "Group Chat";
    }

    return parties.fromAddress || "Unknown";
  };

  const displayName = getDisplayName();

  // Don't show own requests
  if (!displayName || (!request.groupInformation && displayName.toLowerCase() === address?.toLowerCase())) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between gap-4 rounded-2xl bg-gray-900 p-3 px-5">
      <div className="flex gap-4 items-center">
        <Avatar
          size={40}
          name={displayName}
          variant="marble"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
        <div className="flex flex-col">
          <h2 className="text-lg text-white">{displayName}</h2>
          <h3 className="text-sm text-white/40">
            {request.groupInformation ? "Group Chat Request" : "Chat Request"}
          </h3>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          color="green"
          size="lg"
          className="rounded-2xl flex items-center justify-center gap-2"
          onClick={handleAccept}
        >
          <CheckIcon className="h-4 w-4 -mt-0.5" />
          Accept
        </Button>
        <Button
          color="red"
          size="lg"
          className="rounded-2xl flex items-center justify-center gap-2"
          onClick={handleReject}
        >
          <XMarkIcon className="h-4 w-4 -mt-0.5" />
          Reject
        </Button>
      </div>
    </div>
  );
}

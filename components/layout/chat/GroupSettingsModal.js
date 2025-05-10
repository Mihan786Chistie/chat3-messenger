import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { UserPlusIcon, UserMinusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import usePush from "@/hooks/usePush";

export default function GroupSettingsModal({ open, handleOpen, chatId, groupInfo }) {
    const { addToGroup, removeFromGroup } = usePush();
    const [members, setMembers] = useState([]);
    const [memberAddress, setMemberAddress] = useState('');
    const initialMount = useRef(true);

    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false;
            if (groupInfo?.members) {
                setMembers(groupInfo.members);
            }
            return;
        }

        if (groupInfo?.members) {
            const newMembers = JSON.stringify(groupInfo.members);
            const currentMembers = JSON.stringify(members);
            if (newMembers !== currentMembers) {
                setMembers(groupInfo.members);
            }
        }
    }, [groupInfo]); // Remove members from dependency to avoid loops

    const handleAddMember = async () => {
        if (!memberAddress.startsWith('0x')) {
          alert('Please enter a valid wallet address');
          return;
        }
        try {
            await addToGroup(chatId, memberAddress);
            setMembers([...members, { wallet: memberAddress }]);
            setMemberAddress('');
        } catch (error) {
            console.error("Error adding member: ", error);
        }
    };
    
    const handleRemoveMember = async (address) => {
        try {
            await removeFromGroup(chatId, address);
            setMembers(members.filter(member => member.wallet !== address));
        } catch (error) {
            console.error("Error removing member: ", error);
        }
    };

    return (
        <Dialog
            size="sm"
            open={open}
            handler={handleOpen}
            className="bg-gray-900 text-white"
        >
            <DialogHeader className="text-white">Group Settings</DialogHeader>
            <DialogBody className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add Member (0x...) *"
                        className="bg-gray-900 text-white p-3 rounded-xl flex-1"
                        value={memberAddress}
                        onChange={(e) => setMemberAddress(e.target.value)}
                    />
                    <Button 
                        className="bg-blue-400"
                        onClick={handleAddMember}
                    >
                        Add
                    </Button>
                </div>

                <div className="text-xl font-bold text-white mt-4">
                    Members
                </div>

                <div className="flex flex-col gap-2">
                    {members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                {member.image && (
                                    <img 
                                        src={member.image} 
                                        alt="Profile" 
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <span>{member.wallet?.slice(0, 6)}...{member.wallet?.slice(-4)}</span>
                                {member.isAdmin && (
                                    <span className="text-xs bg-blue-500 rounded px-2 py-1 text-white">Admin</span>
                                )}
                            </div>
                            {!member.isAdmin && (
                                <Button
                                    variant="text"
                                    className="p-2 text-red-400 hover:text-red-600"
                                    onClick={() => handleRemoveMember(member.wallet)}
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </DialogBody>
        </Dialog>
    );
}
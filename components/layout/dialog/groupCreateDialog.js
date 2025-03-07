"use client";

import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog } from "@material-tailwind/react";
import { handleCreateGroupDialog } from "@/redux/slice/pushSlice";
import Avatar from "boring-avatars";
import usePush from "@/hooks/usePush";

export default function CreateGroupDialog() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.push.user);
  const createGroupDialog = useSelector((state) => state.push.createGroupDialog);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberAddress, setMemberAddress] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const fileInputRef = useRef(null);
  const { fetchChats } = usePush();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGroupImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMember = () => {
    if (!memberAddress.startsWith('0x')) {
      alert('Please enter a valid wallet address');
      return;
    }
    if (!members.includes(memberAddress)) {
      setMembers([...members, memberAddress]);
      setMemberAddress('');
    }
  };

  const removeMember = (address) => {
    setMembers(members.filter(member => member !== address));
  };

  const createGroup = async () => {
    try {
      if (!groupName || members.length === 0) {
        alert('Please fill in group name and add at least one member');
        return;
      }

      const options = {
        description: groupDescription || '',
        image: groupImage || '',
        members: members,
        private: false
      };

      await user.chat.group.create(groupName, options);
      
      setGroupName('');
      setGroupDescription('');
      setMembers([]);
      setGroupImage(null);
      dispatch(handleCreateGroupDialog());
      fetchChats();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group: ' + error.message);
    }
  };

  return (
    <Dialog
      open={createGroupDialog}
      handler={() => dispatch(handleCreateGroupDialog())}
      className="bg-black p-5 rounded-3xl"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white">Create Group</h2>
        
        <div className="flex items-center gap-4">
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            {groupImage ? (
              <img src={groupImage} alt="group" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <Avatar
                size={80}
                name="group"
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        <input
          type="text"
          placeholder="Group Name *"
          className="bg-gray-900 text-white p-3 rounded-xl"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <textarea
          placeholder="Group Description (Optional) *"
          className="bg-gray-900 text-white p-3 rounded-xl min-h-[100px]"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add Member (0x...) *"
            className="bg-gray-900 text-white p-3 rounded-xl flex-1"
            value={memberAddress}
            onChange={(e) => setMemberAddress(e.target.value)}
          />
          <Button onClick={addMember}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <div key={member} className="bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2">
              <span>{member.slice(0, 6)}...{member.slice(-4)}</span>
              <button onClick={() => removeMember(member)} className="text-red-500">×</button>
            </div>
          ))}
        </div>

        <Button onClick={createGroup} className="mt-4">
          Create Group
        </Button>
      </div>
    </Dialog>
  );
}
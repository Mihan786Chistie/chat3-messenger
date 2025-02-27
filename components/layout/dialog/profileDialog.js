"use client";

import { handleProfileDialog, setProfile } from "@/redux/slice/pushSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog } from "@material-tailwind/react";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function ProfileDialog() {
  const user = useSelector((state) => state.push.user);
  const profileDialog = useSelector((state) => state.push.profileDialog);
  const profile = useSelector((state) => state.push.profile);
  const dispatch = useDispatch();
  
  const [name, setName] = useState(profile.name || '');
  const [image, setImage] = useState(profile.image || '');

  const updateProfile = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    try {
      // Update Push Protocol profile
      await user.profile.update({
        name: name,
        picture: image
      });

      // Update Redux state
      dispatch(setProfile({ name, image }));
      dispatch(handleProfileDialog());
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <Dialog
      open={profileDialog}
      handler={() => dispatch(handleProfileDialog())}
      className="outline-none bg-transparent flex items-center justify-center"
    >
      <div className={
        "w-[400px] border-[1px] border-white/30 rounded-3xl flex flex-col items-center p-5 pb-7 text-white " +
        poppins.className
      }>
        <h1 className="font-bold text-5xl">Profile</h1>
        <div className="w-full">
          <p className="mt-5 font-semibold text-xl ml-1">Name</p>
          <input
            type="text"
            className="w-full border-[1px] border-white/30 bg-transparent rounded-xl p-2 outline-none mt-2"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <p className="mt-5 font-semibold text-xl ml-1">Profile Image URL</p>
          <input
            type="text"
            className="w-full border-[1px] border-white/30 bg-transparent rounded-xl p-2 outline-none mt-2"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <Button
          size="lg"
          className="mt-5 w-full rounded-2xl"
          onClick={updateProfile}
        >
          Update Profile
        </Button>
      </div>
    </Dialog>
  );
}

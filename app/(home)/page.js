'use client'

import { useState, useEffect } from 'react'
import { Button } from "@material-tailwind/react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi"
import { useEthersSigner } from "@/wagmi/EthersSigner"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setProfile } from "@/redux/slice/pushSlice"
import { useRouter } from "next/navigation"
import usePush from "@/hooks/usePush"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const signer = useEthersSigner()
  const dispatch = useDispatch()
  const router = useRouter()
  const { streamChat } = usePush()
  const stream = useSelector((state) => state.push.stream)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleConnect = () => {
    connect({
      connector: connectors[0],
    })
  }

  const handleStart = async () => {
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.PROD,
    })
    if (user && !user.readMode) {
      dispatch(setUser(user));

      const profile = await user.profile.info()
      if(profile) {
        dispatch(setProfile({
          name: profile.name || "",
          image: profile.picture || ""
        }));
      }
      streamChat(user);
      router.push("/dashboard");
    }
  }

  const handleDisconnect = () => {
    if (stream) stream.disconnect()
    disconnect()
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="w-[400px] border-[1px] border-white/30 rounded-3xl flex flex-col items-center p-5 pb-7">
        <h1 className="font-bold text-5xl">3Chat</h1>
        <h3>Messenger</h3>

        {!isConnected && (
          <Button
            className="w-full mt-10 rounded-2xl"
            size="lg"
            onClick={handleConnect}
          >
            {isClient ? "Metamask" : "Connect"}
          </Button>
        )}

        {isConnected && (
          <>
            <Button
              className="w-full mt-10 rounded-2xl flex items-center justify-center"
              size="lg"
              onClick={handleStart}
            >
              {isClient ? "Start" : "Initialize"}
            </Button>
            <Button
              className="w-full mt-5 rounded-2xl flex items-center justify-center"
              size="lg"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
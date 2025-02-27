export default function ChatBubble({ message, isMe, timestamp }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return isMe ? (
    <div className="flex flex-row-reverse w-full ">
      <div className="bg-blue-400 rounded-2xl p-3 px-5">
        <p>{message}</p>
        <p className="text-xs text-white/70 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  ) : (
    <div className="flex  w-full ">
      <div className="bg-gray-900 rounded-2xl p-3 px-5">
        <p>{message}</p>
        <p className="text-xs text-white/70 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
}

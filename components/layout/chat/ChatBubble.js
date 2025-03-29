import Avatar from "boring-avatars";
import Image from "next/image";

export default function ChatBubble({ message, isMe, senderName, timestamp, profilePicture }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const renderContent = () => {
    try {
      const truncatedAddress = truncateAddress(message.fromDID?.split(':')[1]);
      
      if (message.messageType === 'Image') {
        return (
          <div className="flex flex-col gap-1">
            {!isMe && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-400">{truncatedAddress}</span>
              </div>
            )}
            <img 
              src={message.messageContent} 
              alt="chat image" 
              className="max-w-[300px] rounded-lg"
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col gap-1">
            {!isMe && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-400">{truncatedAddress}</span>
              </div>
            )}
            <p className="text-white break-words">{message.messageContent}</p>
          </div>
        );
      }
    } catch (error) {
      console.error('Error rendering message:', error);
      return <p className="text-white">Error displaying message</p>;
    }
  };

  return (
    <div className={`flex w-full items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isMe ? 'ml-2' : 'mr-2'}`}>
        {profilePicture ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profilePicture}
              alt={senderName}
              width={32}
              height={32}
              className="object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.fallback-avatar').style.display = 'block';
              }}
            />
            <div className="fallback-avatar" style={{ display: 'none' }}>
              <Avatar
                size={32}
                name={senderName}
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </div>
          </div>
        ) : (
          <Avatar
            size={32}
            name={senderName}
            variant="marble"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        )}
      </div>

      {/* Message Bubble */}
      <div 
        className={`max-w-[70%] rounded-2xl p-3 px-4 ${
          isMe 
            ? 'bg-blue-500 rounded-tr-none' 
            : 'bg-gray-800 rounded-tl-none'
        }`}
      >
        {renderContent()}
        <p className="text-xs text-white/70 mt-1 text-right">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
}

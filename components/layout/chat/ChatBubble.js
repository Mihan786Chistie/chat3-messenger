export default function ChatBubble({ message, isMe, timestamp }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    try {
      if (message.messageType === 'Image') {
        // For image messages, the content is already a base64 string
        return (
          <img 
            src={message.messageContent} 
            alt="chat image" 
            className="max-w-[300px] rounded-lg"
          />
        );
      } else {
        // For text messages
        return <p className="text-white">{message.messageContent}</p>;
      }
    } catch (error) {
      console.error('Error rendering message:', error);
      return <p className="text-white">Error displaying message</p>;
    }
  };

  return isMe ? (
    <div className="flex flex-row-reverse w-full">
      <div className="bg-blue-400 rounded-2xl p-3 px-5">
        {renderContent()}
        <p className="text-xs text-white/70 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  ) : (
    <div className="flex w-full">
      <div className="bg-gray-900 rounded-2xl p-3 px-5">
        {renderContent()}
        <p className="text-xs text-white/70 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
}

import React from 'react';
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Plus } from 'lucide-react';
import { WalkieChannel } from '../hooks/useWalkieTalkie';

interface ChannelListProps {
  channels: WalkieChannel[];
  onJoinChannel: (channelId: string) => void;
  onCreateChannel: () => void;
  className?: string;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  onJoinChannel,
  onCreateChannel,
  className
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Available Channels</h4>
        <Button variant="ghost" size="sm" onClick={onCreateChannel}>
          <Plus className="h-4 w-4 mr-1" /> New
        </Button>
      </div>
      
      {channels.length > 0 ? (
        <ScrollArea className="h-[200px]">
          {channels.map((channel) => (
            <div
              key={channel.channelId}
              className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onJoinChannel(channel.channelId)}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{channel.name}</span>
              </div>
              <Badge variant="outline">{channel.userCount} users</Badge>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No channels available. Create one!
        </div>
      )}
    </div>
  );
};

export default ChannelList;
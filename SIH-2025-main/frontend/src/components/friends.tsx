import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Users, MessageCircle, MapPin } from 'lucide-react';

interface FriendsProps {
  onBack: () => void;
  language: string;
  onStartChat: () => void;
}

export function Friends({ onBack, onStartChat }: FriendsProps) {
  const friends = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      status: 'online' as const,
      lastSeen: 'Now'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">SafarSuraksha Friends</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Connected Friends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {friend.location}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={onStartChat}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

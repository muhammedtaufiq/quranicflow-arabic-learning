import { useState } from "react";
import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Plus, 
  Crown, 
  Flame, 
  Trophy, 
  Clock,
  Target,
  Gift,
  Settings,
  UserPlus,
  Copy,
  CheckCircle
} from "lucide-react";

export default function Family() {
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [nickname, setNickname] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userId = 1; // Demo user ID

  const { data: familyData, isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/family`],
  });

  const family = familyData?.family;

  const createFamilyMutation = useMutation({
    mutationFn: async (data: { name: string; createdBy: number }) => {
      const response = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/family`] });
      setShowCreateFamily(false);
      setFamilyName("");
      toast({
        title: "Family Created!",
        description: "Your family has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const joinFamilyMutation = useMutation({
    mutationFn: async (data: { inviteCode: string; userId: number; nickname?: string }) => {
      const response = await fetch("/api/families/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/family`] });
      setShowJoinFamily(false);
      setInviteCode("");
      setNickname("");
      toast({
        title: "Joined Family!",
        description: "You've successfully joined the family.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;
    
    createFamilyMutation.mutate({
      name: familyName,
      createdBy: userId,
    });
  };

  const handleJoinFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    joinFamilyMutation.mutate({
      inviteCode: inviteCode.toUpperCase(),
      userId,
      nickname: nickname.trim() || undefined,
    });
  };

  const copyInviteCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading family...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!family ? (
          // No family - show create/join options
          <div className="text-center mb-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Family Learning
            </h1>
            <p className="text-gray-600 mb-8">
              Learn Arabic together with your family! Track progress, compete in challenges, and motivate each other.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Create Family */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Family</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showCreateFamily ? (
                    <form onSubmit={handleCreateFamily} className="space-y-4">
                      <div>
                        <Label htmlFor="familyName">Family Name</Label>
                        <Input
                          id="familyName"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          placeholder="e.g., The Ahmed Family"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          disabled={createFamilyMutation.isPending}
                          className="flex-1"
                        >
                          {createFamilyMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowCreateFamily(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Start a new family group and invite your family members to learn together.
                      </p>
                      <Button 
                        onClick={() => setShowCreateFamily(true)}
                        className="w-full"
                      >
                        Create Family
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Join Family */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Join Family</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showJoinFamily ? (
                    <form onSubmit={handleJoinFamily} className="space-y-4">
                      <div>
                        <Label htmlFor="inviteCode">Invite Code</Label>
                        <Input
                          id="inviteCode"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          placeholder="Enter 6-letter code"
                          maxLength={6}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nickname">Nickname (Optional)</Label>
                        <Input
                          id="nickname"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="How family sees you"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          disabled={joinFamilyMutation.isPending}
                          className="flex-1"
                        >
                          {joinFamilyMutation.isPending ? "Joining..." : "Join"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowJoinFamily(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Have an invite code? Join your family's learning group.
                      </p>
                      <Button 
                        onClick={() => setShowJoinFamily(true)}
                        variant="outline"
                        className="w-full"
                      >
                        Join Family
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Has family - show family dashboard
          <div>
            {/* Family Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {family.name}
              </h1>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Invite Code:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {family.inviteCode}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={copyInviteCode}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Family Members */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Family Members</span>
                  </span>
                  <Badge variant="secondary">
                    {family.members?.length || 0} members
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {family.members?.map((member: any) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {member.user?.displayName?.charAt(0) || member.nickname?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.nickname || member.user?.displayName}
                            {member.role === 'admin' && (
                              <Crown className="w-4 h-4 text-yellow-500 inline ml-1" />
                            )}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Level {member.user?.level || 1}</span>
                            <span>{member.user?.xp || 0} XP</span>
                            {member.user?.streakDays > 0 && (
                              <div className="flex items-center space-x-1">
                                <Flame className="w-3 h-3 text-orange-500" />
                                <span>{member.user.streakDays} days</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          #{family.members.findIndex((m: any) => m.id === member.id) + 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Family Challenges */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Family Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No active family challenges</p>
                  <p className="text-sm text-gray-500">
                    Family challenges will appear here when created by an admin.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Daily Reminders</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set up learning reminders for your family
                  </p>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Gift className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Family Rewards</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Unlock rewards by learning together
                  </p>
                  <Button size="sm" variant="outline">
                    View Rewards
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Settings className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Family Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your family group settings
                  </p>
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}
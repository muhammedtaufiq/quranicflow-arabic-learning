import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { User, Crown, Shield, Trash2, Users, Star, Calendar, Award } from "lucide-react";

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Admin users list (only for admins)
  const { data: adminData } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === 'admin',
  });

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    try {
      await apiRequest("DELETE", `/api/user/${user.id}`);
      logoutMutation.mutate();
    } catch (error) {
      console.error('Delete account failed:', error);
    }
    setDeleteLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator': return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': 
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Moderator</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <NavigationHeader />
      
      <main className="px-4 pt-20 pb-20 space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Profile Settings</h1>
          <p className="text-emerald-700">Manage your account and preferences</p>
        </div>

        {/* User Information */}
        <Card className="card-tranquil">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getRoleIcon(user.role)}
              <span>Account Information</span>
              {getRoleBadge(user.role)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Display Name</label>
                <p className="text-slate-900 font-medium">{user.displayName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Username</label>
                <p className="text-slate-900 font-medium">@{user.username}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600">Member Since</label>
                <p className="text-slate-900 font-medium">
                  {new Date(user.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Learning Stats */}
            <div className="border-t border-slate-200 pt-4 mt-6">
              <h3 className="font-semibold text-slate-800 mb-3">Learning Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-2">
                    <Crown className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">Level {user.level}</div>
                  <div className="text-xs text-slate-600">Current Level</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">{user.xp}</div>
                  <div className="text-xs text-slate-600">Total XP</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">{user.streakDays}</div>
                  <div className="text-xs text-slate-600">Day Streak</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">{user.comprehensionPercentage}%</div>
                  <div className="text-xs text-slate-600">Comprehension</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Panel */}
        {user.role === 'admin' && adminData && (
          <Card className="card-tranquil">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>User Management</span>
                <Badge className="bg-blue-100 text-blue-800">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  Total Users: {(adminData as any)?.users?.length || 0}
                </p>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(adminData as any)?.users?.map((adminUser: any) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(adminUser.role)}
                        <div>
                          <p className="font-medium text-slate-900">{adminUser.displayName}</p>
                          <p className="text-sm text-slate-600">@{adminUser.username} • Level {adminUser.level}</p>
                        </div>
                      </div>
                      {getRoleBadge(adminUser.role)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="card-tranquil">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Trash2 className="h-4 w-4" />
              <AlertDescription>
                Deleting your account is permanent and cannot be undone. All your progress, achievements, and data will be lost.
              </AlertDescription>
            </Alert>

            {!showDeleteConfirm ? (
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-800">
                  Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 md:flex-none"
                  >
                    {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 md:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, BookOpen, Flame, Star, User, Info, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";



export function NavigationHeader() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-secondary text-2xl" />
              <span className="text-xl font-bold text-gray-900">QuranicFlow</span>
            </div>
          </div>
          
          {/* Stats - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <Flame className="text-orange-500 w-4 h-4 streak-fire" />
              <span className="text-sm font-medium">{user?.streakDays || 0}</span>
            </div>
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <Star className="text-accent w-4 h-4" />
              <span className="text-sm font-medium">{user?.xp || 0}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Info Icon - Navigate to About Page */}
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                <Info className="w-5 h-5" />
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white p-0"
                >
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2">
                  <User className="w-4 h-4" />
                  <span>{user?.displayName || user?.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sources Dialog - Keep for reference but secondary */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-600 hover:bg-slate-50">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-slate-800">
                    Authentic Islamic Sources & Scholarship
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  {/* Credibility Statement */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border border-emerald-200">
                    <h3 className="font-semibold text-emerald-900 mb-3">Academic Verification & Trust</h3>
                    <p className="text-emerald-800 text-sm leading-relaxed">
                      Every Arabic word, translation, and definition in QuranicFlow has been verified against authoritative Islamic scholarship. 
                      We maintain complete transparency about our sources to ensure absolute credibility and trust in your learning journey.
                    </p>
                  </div>

                  {/* Arabic Sources */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Classical Arabic Lexicons</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-2">Lane's Arabic-English Lexicon</h4>
                        <p className="text-sm text-slate-600">The most comprehensive classical Arabic dictionary, compiled by Edward William Lane (1801-1876)</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-2">Lisan al-Arab</h4>
                        <p className="text-sm text-slate-600">The premier medieval Arabic dictionary by Ibn Manzur (1233-1311)</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-2">Al-Mufradat fi Gharib al-Quran</h4>
                        <p className="text-sm text-slate-600">Specialized Quranic vocabulary by Ar-Raghib al-Isfahani (d. 1108)</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium text-slate-800 mb-2">Hans Wehr Dictionary</h4>
                        <p className="text-sm text-slate-600">Modern standard reference for Arabic-English translation</p>
                      </div>
                    </div>
                  </div>

                  {/* English Translation Sources */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">English Translation References</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Sahih International</h4>
                        <p className="text-sm text-blue-600">Contemporary scholarly translation</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Pickthall Translation</h4>
                        <p className="text-sm text-blue-600">By Muhammad Marmaduke Pickthall</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Yusuf Ali Translation</h4>
                        <p className="text-sm text-blue-600">Classical English reference</p>
                      </div>
                    </div>
                  </div>

                  {/* Urdu Sources */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Urdu Translation Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Classical Sources</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Tafsir Ibn Kathir (Urdu)</li>
                          <li>• Tafsir Al-Jalalayn</li>
                          <li>• Kanz-ul-Iman by Ahmad Raza Khan</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Contemporary Sources</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Tafheem-ul-Quran by Maududi</li>
                          <li>• Tafsir Usmani</li>
                          <li>• Ma'ariful Quran by Mufti Shafi</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Methodology */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-3">Our Verification Methodology</h3>
                    <div className="text-sm text-purple-800 space-y-2">
                      <p>• Cross-referenced across multiple authoritative sources</p>
                      <p>• Verified by classical and contemporary Islamic scholarship</p>
                      <p>• Frequency analysis based on authentic Quranic corpus</p>
                      <p>• Regular updates based on scholarly consensus</p>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-slate-100 p-6 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">Content Coverage</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-teal-600">632+</div>
                        <div className="text-sm text-slate-600">Verified Words</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">65%</div>
                        <div className="text-sm text-slate-600">Quran Coverage</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">100%</div>
                        <div className="text-sm text-slate-600">Source Verified</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">50+</div>
                        <div className="text-sm text-slate-600">Categories</div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

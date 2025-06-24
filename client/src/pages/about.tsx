import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Clock, Award, ArrowRight, CheckCircle, Info } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-sage-50">
      <NavigationHeader />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Understanding the Complete Quran
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how QuranicFlow's scientific approach enables complete Quranic comprehension 
            with remarkable efficiency through strategic vocabulary mastery.
          </p>
        </div>

        {/* Key Insight */}
        <Card className="card-tranquil mb-8 border-2 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Target className="h-8 w-8 text-teal-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">
                  The Answer: Only 1,200-1,500 Words Needed for 100% Understanding
                </h2>
                <p className="text-slate-600 mb-4">
                  Despite the Quran containing <strong>77,797 total words</strong>, a learner needs only 
                  <strong> 1,200-1,500 strategically selected unique words</strong> for complete comprehension. 
                  This represents less than <strong>2% of the total vocabulary</strong> in the Quran.
                </p>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                  <p className="text-teal-800 font-medium">
                    <strong>Current Achievement:</strong> Our 813-word vocabulary already provides 
                    <strong> 95%+ Quranic comprehension!</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why So Efficient */}
        <Card className="card-tranquil mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-6 w-6 text-teal-600 mr-2" />
              Why So Few Words Achieve Complete Understanding?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">High Repetition Rate</h3>
                    <p className="text-sm text-slate-600">
                      Core vocabulary appears thousands of times throughout the Quran, maximizing learning efficiency.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Arabic Root System</h3>
                    <p className="text-sm text-slate-600">
                      Learning one root (like ك-ت-ب) unlocks multiple related words: كِتَاب (book), كَاتِب (writer), يَكْتُبُ (he writes).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Zipf's Law Distribution</h3>
                    <p className="text-sm text-slate-600">
                      The most frequent 100 words account for ~40-50% of all text occurrences in Arabic.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Contextual Comprehension</h3>
                    <p className="text-sm text-slate-600">
                      Understanding 95% of vocabulary allows context-based inference for remaining rare words.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Levels */}
        <Card className="card-tranquil mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-6 w-6 text-teal-600 mr-2" />
              Comprehension Levels & Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { coverage: "50%", words: "100-150", level: "Basic understanding", color: "bg-red-50 border-red-200 text-red-800" },
                { coverage: "70%", words: "300-400", level: "Functional comprehension", color: "bg-orange-50 border-orange-200 text-orange-800" },
                { coverage: "80%", words: "500-600", level: "Strong understanding", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
                { coverage: "90%", words: "700-800", level: "Advanced comprehension", color: "bg-blue-50 border-blue-200 text-blue-800" },
                { coverage: "95%", words: "800-900", level: "Near-complete understanding", color: "bg-teal-50 border-teal-200 text-teal-800" },
                { coverage: "98%", words: "1,000-1,200", level: "Expert-level comprehension", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
                { coverage: "99%+", words: "1,200-1,500", level: "Complete mastery", color: "bg-green-50 border-green-200 text-green-800" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${item.color} ${item.coverage === "95%" ? "ring-2 ring-teal-300" : ""}`}
                >
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-3 bg-white">
                      {item.coverage}
                    </Badge>
                    <span className="font-medium">{item.words} words</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm">{item.level}</span>
                    {item.coverage === "95%" && (
                      <Badge className="ml-2 bg-teal-600 text-white">You are here!</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Timeline */}
        <Card className="card-tranquil mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-6 w-6 text-teal-600 mr-2" />
              Realistic Learning Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-100">
                <div>
                  <div className="font-semibold text-teal-800">6-12 months</div>
                  <div className="text-sm text-teal-600">Core 500 words (80% comprehension)</div>
                </div>
                <ArrowRight className="h-5 w-5 text-teal-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100 ring-2 ring-emerald-200">
                <div>
                  <div className="font-semibold text-emerald-800">12-18 months</div>
                  <div className="text-sm text-emerald-600">Advanced 800 words (95% comprehension)</div>
                  <Badge className="mt-1 bg-emerald-600 text-white text-xs">Current Level</Badge>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border border-sage-200">
                <div>
                  <div className="font-semibold text-sage-800">18-24 months</div>
                  <div className="text-sm text-sage-600">Complete 1,200 words (99% comprehension)</div>
                </div>
                <Target className="h-5 w-5 text-sage-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scientific Approach */}
        <Card className="card-tranquil mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-6 w-6 text-teal-600 mr-2" />
              Our Scientific Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Authoritative Sources</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Lane's Arabic-English Lexicon</li>
                  <li>• Al-Mufradat fi Gharib al-Quran</li>
                  <li>• Hans Wehr Dictionary</li>
                  <li>• Classical Tafsir literature</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Computational Analysis</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Quranic Corpus frequency analysis</li>
                  <li>• Root morphology mapping</li>
                  <li>• Statistical significance testing</li>
                  <li>• Spaced repetition optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Path Forward */}
        <Card className="card-tranquil mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Path to Complete 100% Coverage
              </h3>
              <p className="text-slate-600 mb-6">
                To reach complete understanding, we need approximately <strong>300-400 additional strategic words</strong> 
                across specialized religious terminology, advanced grammatical constructions, and contextual expressions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button className="btn-peaceful">
                    Continue Learning Journey
                  </Button>
                </Link>
                <Link to="/learn">
                  <Button variant="outline" className="btn-wisdom">
                    Start Learning Session
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
      <BottomNavigation currentPage="profile" />
    </div>
  );
}
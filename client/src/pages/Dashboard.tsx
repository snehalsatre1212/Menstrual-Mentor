import { useCycleLogs } from "@/hooks/use-cycle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, Activity, Zap, Smile } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: logs, isLoading } = useCycleLogs();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        <div className="h-40 bg-muted rounded-xl col-span-full"></div>
        <div className="h-60 bg-muted rounded-xl"></div>
        <div className="h-60 bg-muted rounded-xl"></div>
        <div className="h-60 bg-muted rounded-xl"></div>
      </div>
    );
  }

  const moodData = logs?.slice(-7).map(log => ({
    date: format(new Date(log.startDate), 'MMM dd'),
    // Mapping simple mood strings to numbers for demo chart
    value: log.mood.length // Simplified for visualization
  })) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome Back, Mentor</h1>
          <p className="text-white/90 max-w-lg mb-6">
            Your cycle health is looking stable. Your next predicted phase begins in 3 days.
          </p>
          <div className="flex gap-4">
            <Link href="/log">
              <Button size="lg" variant="secondary" className="font-bold shadow-lg hover:scale-105 transition-transform">
                Log Today's Cycle <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/analyze/voice">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Activity className="mr-2 w-4 h-4" /> Quick Check-in
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes background */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-20 h-32 w-32 translate-y-1/2 rounded-full bg-indigo-500/20 blur-2xl"></div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover border-l-4 border-l-pink-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Next Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-pink-600">Oct 24</div>
            <p className="text-xs text-muted-foreground mt-1">Approx. 4 days remaining</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-l-4 border-l-purple-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cycle Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-purple-600">28 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Consistent over last 3 months</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Wellness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-blue-600">8.5/10</div>
            <p className="text-xs text-muted-foreground mt-1">Based on recent logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-primary" /> Mood Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#888888" />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorMood)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Energy Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#888888" />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#fbbf24" 
                  strokeWidth={3}
                  dot={{r: 4, fill: "#fbbf24"}}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Logs</CardTitle>
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs && logs.length > 0 ? (
              logs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {format(new Date(log.startDate), 'dd')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{log.symptoms}</p>
                      <p className="text-sm text-muted-foreground">{log.mood} • {log.energyLevel}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {format(new Date(log.startDate), 'MMM yyyy')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No logs yet. Start tracking today!</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

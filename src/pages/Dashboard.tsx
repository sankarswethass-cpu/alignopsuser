import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ProgressPieChart from "@/components/ProgressPieChart";
import { teams, quarters, getTeamOKRs, calculateTeamProgress } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(() => localStorage.getItem("alignops_team") || "");
  const [selectedQuarter, setSelectedQuarter] = useState(() => localStorage.getItem("alignops_quarter") || "q1-2026");

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("alignops_user") || "{}"); } catch { return {}; }
  })();

  useEffect(() => {
    if (selectedTeam) localStorage.setItem("alignops_team", selectedTeam);
    if (selectedQuarter) localStorage.setItem("alignops_quarter", selectedQuarter);
  }, [selectedTeam, selectedQuarter]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const teamOKRs = selectedTeam ? getTeamOKRs(selectedTeam, selectedQuarter) : undefined;
  const progress = teamOKRs ? calculateTeamProgress(teamOKRs.objectives) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          {greeting}, {user.name || "User"}
        </h1>

        {/* Selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Select Your Team</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Choose a team..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Select Quarter</label>
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {quarters.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name} ({q.label}){q.isCurrent ? " — Current" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pie Chart */}
        {selectedTeam ? (
          <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center animate-fade-in">
            <ProgressPieChart progress={progress} />
            <p className="mt-4 text-sm text-muted-foreground">
              {teamOKRs
                ? `Based on ${teamOKRs.objectives.length} objective${teamOKRs.objectives.length !== 1 ? "s" : ""} and ${teamOKRs.objectives.reduce((s, o) => s + o.keyResults.length, 0)} key results`
                : "No OKR data for this team and quarter"}
            </p>
            <Button
              onClick={() => navigate("/okrs")}
              className="mt-6 gradient-primary text-primary-foreground gap-2"
            >
              View Detailed OKRs <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center animate-fade-in">
            <p className="text-muted-foreground text-lg">Welcome! Select your team to view OKRs.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

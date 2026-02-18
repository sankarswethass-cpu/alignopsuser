import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  teams,
  quarters,
  calculateObjectiveProgress,
  getProgressColor,
  getConfidenceColor,
  getTrendIcon,
  type Objective,
  type KeyResult,
  type TeamOKRData
} from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchTeamOKRs, saveTeamOKRs } from "@/api/okrApi";

const OKRs = () => {
  const [selectedTeam, setSelectedTeam] = useState(() => localStorage.getItem("alignops_team") || "product");
  const [selectedQuarter, setSelectedQuarter] = useState(() => localStorage.getItem("alignops_quarter") || "q1-2026");
  const [expandedObjectives, setExpandedObjectives] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [addObjOpen, setAddObjOpen] = useState(false);
  const [addKrOpen, setAddKrOpen] = useState(false);
  const [editKrOpen, setEditKrOpen] = useState(false);
  const [activeObjectiveId, setActiveObjectiveId] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "obj" | "kr"; id: string } | null>(null);

  // Form states
  const [objTitle, setObjTitle] = useState("");
  const [objWeight, setObjWeight] = useState("");
  const [krDesc, setKrDesc] = useState("");
  const [krOwner, setKrOwner] = useState("");
  const [krWeight, setKrWeight] = useState("");
  const [krConfidence, setKrConfidence] = useState<"1" | "3" | "5">("3");
  const [krProgress, setKrProgress] = useState("0");
  const [krComments, setKrComments] = useState("");
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null);

  // Local OKR data (mutable copy)
  const [localData, setLocalData] = useState<TeamOKRData | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("alignops_user") || "{}");
    } catch {
      return {};
    }
  })();

  const refreshData = async (team: string, quarter: string) => {
    if (!user.id || !team || !quarter) {
      setLocalData(null);
      return;
    }
    setLoading(true);
    const data = await fetchTeamOKRs(user.id, team, quarter);
    setLocalData(
      data
        ? {
            ...data,
            objectives: data.objectives.map((o) => ({ ...o, keyResults: [...o.keyResults] }))
          }
        : null
    );
    setLoading(false);
  };

  useEffect(() => {
    void refreshData(selectedTeam, selectedQuarter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTeamChange = (t: string) => {
    setSelectedTeam(t);
    localStorage.setItem("alignops_team", t);
    void refreshData(t, selectedQuarter);
  };

  const handleQuarterChange = (q: string) => {
    setSelectedQuarter(q);
    localStorage.setItem("alignops_quarter", q);
    void refreshData(selectedTeam, q);
  };

  const toggleExpand = (id: string) => {
    setExpandedObjectives(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (localData) setExpandedObjectives(new Set(localData.objectives.map(o => o.id)));
  };

  // Filter
  const filteredObjectives = localData?.objectives.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.keyResults.some(kr =>
      kr.description.toLowerCase().includes(q) || kr.owner.toLowerCase().includes(q) || kr.comments.toLowerCase().includes(q)
    );
  }) || [];

  // Add Objective
  const handleAddObjective = () => {
    if (!objTitle.trim()) return;

    const baseData: TeamOKRData =
      localData ?? {
        ownerUserId: user.id,
        teamId: selectedTeam,
        quarterId: selectedQuarter,
        vision: "",
        strategy: "",
        objectives: []
      };

    const newObj: Objective = {
      id: `obj-new-${Date.now()}`,
      number: baseData.objectives.length + 1,
      title: objTitle,
      weightage: objWeight ? parseInt(objWeight) : undefined,
      keyResults: []
    };

    const next: TeamOKRData = { ...baseData, objectives: [...baseData.objectives, newObj] };

    setLocalData(next);
    void saveTeamOKRs(user.id, next);
    setExpandedObjectives((prev) => new Set([...prev, newObj.id]));
    setObjTitle("");
    setObjWeight("");
    setAddObjOpen(false);
    toast({ title: "Objective created" });
  };

  // Add KR
  const handleAddKr = () => {
    if (!krDesc.trim() || !krOwner.trim() || !localData) return;
    const newKr: KeyResult = {
      id: `kr-new-${Date.now()}`,
      description: krDesc,
      owner: krOwner,
      weightage: krWeight ? parseInt(krWeight) : 0,
      confidence: parseInt(krConfidence) as 1 | 3 | 5,
      trend: "same",
      progress: parseInt(krProgress) || 0,
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "2-digit" }),
      comments: krComments,
    };
    const next: TeamOKRData = {
      ...localData,
      objectives: localData.objectives.map((o) =>
        o.id === activeObjectiveId ? { ...o, keyResults: [...o.keyResults, newKr] } : o
      )
    };
    setLocalData(next);
    void saveTeamOKRs(user.id, next);
    resetKrForm();
    setAddKrOpen(false);
    toast({ title: "Key Result added" });
  };

  // Edit KR
  const openEditKr = (kr: KeyResult) => {
    setEditingKr(kr);
    setKrDesc(kr.description);
    setKrOwner(kr.owner);
    setKrWeight(kr.weightage.toString());
    setKrConfidence(kr.confidence.toString() as "1" | "3" | "5");
    setKrProgress(kr.progress.toString());
    setKrComments(kr.comments);
    setEditKrOpen(true);
  };

  const handleEditKr = () => {
    if (!editingKr || !localData) return;
    const next: TeamOKRData = {
      ...localData,
      objectives: localData.objectives.map((o) => ({
        ...o,
        keyResults: o.keyResults.map((kr) =>
          kr.id === editingKr.id
            ? {
                ...kr,
                description: krDesc,
                owner: krOwner,
                weightage: parseInt(krWeight) || 0,
                confidence: parseInt(krConfidence) as 1 | 3 | 5,
                progress: parseInt(krProgress) || 0,
                comments: krComments,
                lastUpdated: new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit"
                })
              }
            : kr
        )
      }))
    };
    setLocalData(next);
    void saveTeamOKRs(user.id, next);
    resetKrForm();
    setEditKrOpen(false);
    toast({ title: "Key Result updated" });
  };

  // Delete
  const confirmDelete = () => {
    if (!deleteTarget || !localData) return;
    if (deleteTarget.type === "obj") {
      const next: TeamOKRData = {
        ...localData,
        objectives: localData.objectives.filter((o) => o.id !== deleteTarget.id)
      };
      setLocalData(next);
      void saveTeamOKRs(user.id, next);
      toast({ title: "Objective deleted" });
    } else {
      const next: TeamOKRData = {
        ...localData,
        objectives: localData.objectives.map((o) => ({
          ...o,
          keyResults: o.keyResults.filter((kr) => kr.id !== deleteTarget.id)
        }))
      };
      setLocalData(next);
      void saveTeamOKRs(user.id, next);
      toast({ title: "Key Result deleted" });
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const resetKrForm = () => {
    setKrDesc("");
    setKrOwner("");
    setKrWeight("");
    setKrConfidence("3");
    setKrProgress("0");
    setKrComments("");
    setEditingKr(null);
  };

  const progressBarColor = (p: number) => {
    const c = getProgressColor(p);
    if (c === "progress-red") return "bg-progress-red";
    if (c === "progress-yellow") return "bg-progress-yellow";
    return "bg-progress-green";
  };

  const confDot = (c: 1 | 3 | 5) => {
    const color = getConfidenceColor(c);
    if (color === "progress-red") return "bg-progress-red";
    if (color === "progress-yellow") return "bg-progress-yellow";
    return "bg-progress-green";
  };

  const teamName = teams.find(t => t.id === selectedTeam)?.name || selectedTeam;
  const quarterName = quarters.find(q => q.id === selectedQuarter)?.name || selectedQuarter;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">OKRs — {teamName} — {quarterName}</h1>
            {localData && (
              <p className="text-sm text-muted-foreground mt-1">
                Vision: {localData.vision} · Strategy: {localData.strategy}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTeam} onValueChange={handleTeamChange}>
              <SelectTrigger className="w-40 bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedQuarter} onValueChange={handleQuarterChange}>
              <SelectTrigger className="w-44 bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>{quarters.map(q => <SelectItem key={q.id} value={q.id}>{q.name} ({q.label})</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card rounded-lg border border-border p-4 mb-4 flex flex-wrap gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Confidence:</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-red" /> 1=Low</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-yellow" /> 3=Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-green" /> 5=High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Trend:</span> ⬆️ Better · ➡️ Same · ⬇️ Worse
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Progress:</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-red" /> 0-39%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-yellow" /> 40-69%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-progress-green" /> 70-100%</span>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search OKRs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-card" />
          </div>
          <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1" onClick={() => setAddObjOpen(true)}>
            <Plus className="w-4 h-4" /> Add Objective
          </Button>
        </div>

        {/* Table */}
        {!localData || filteredObjectives.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              {!localData ? "No OKR data for this team and quarter." : "No results match your search."}
            </p>
            {!localData && (
              <Button className="gradient-primary text-primary-foreground gap-1" onClick={() => setAddObjOpen(true)}>
                <Plus className="w-4 h-4" /> Create First Objective
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_100px_80px_80px_60px_120px_90px_1fr_80px] gap-0 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground bg-muted/50">
              <span>Objective / Key Result</span>
              <span>Owner</span>
              <span>Weight</span>
              <span>Confidence</span>
              <span>Trend</span>
              <span>Progress</span>
              <span>Updated</span>
              <span>Comments</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {filteredObjectives.map(obj => {
              const isExpanded = expandedObjectives.has(obj.id);
              const objProgress = calculateObjectiveProgress(obj);
              return (
                <div key={obj.id}>
                  {/* Objective Row */}
                  <div
                    className="grid grid-cols-[1fr_100px_80px_80px_60px_120px_90px_1fr_80px] gap-0 px-4 py-3 border-b border-border bg-muted/30 hover:bg-muted/50 cursor-pointer items-center"
                    onClick={() => toggleExpand(obj.id)}
                  >
                    <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      Obj {obj.number}: {obj.title}
                    </div>
                    <span className="text-sm text-muted-foreground">—</span>
                    <span className="text-sm text-muted-foreground">{obj.weightage ? `${obj.weightage}%` : "—"}</span>
                    <span className="text-sm text-muted-foreground">—</span>
                    <span className="text-sm text-muted-foreground">—</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progressBarColor(objProgress)}`} style={{ width: `${objProgress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground w-9 text-right">{objProgress}%</span>
                    </div>
                    <span className="text-sm text-muted-foreground">—</span>
                    <span className="text-sm text-muted-foreground">—</span>
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        className="p-1.5 rounded hover:bg-accent text-primary"
                        title="Add Key Result"
                        onClick={() => { setActiveObjectiveId(obj.id); setAddKrOpen(true); }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                        title="Delete Objective"
                        onClick={() => { setDeleteTarget({ type: "obj", id: obj.id }); setDeleteConfirmOpen(true); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Key Result Rows */}
                  {isExpanded && obj.keyResults.map(kr => (
                    <div
                      key={kr.id}
                      className="grid grid-cols-[1fr_100px_80px_80px_60px_120px_90px_1fr_80px] gap-0 px-4 py-2.5 border-b border-border hover:bg-accent/30 items-center"
                    >
                      <span className="pl-8 text-sm text-foreground">{kr.description}</span>
                      <span className="text-sm text-foreground">{kr.owner}</span>
                      <span className="text-sm text-muted-foreground">{kr.weightage}%</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${confDot(kr.confidence)}`} />
                        <span className="text-sm text-foreground">{kr.confidence}</span>
                      </div>
                      <span className="text-sm">{getTrendIcon(kr.trend)}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${progressBarColor(kr.progress)}`} style={{ width: `${kr.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground w-9 text-right">{kr.progress}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{kr.lastUpdated}</span>
                      <span className="text-xs text-muted-foreground truncate" title={kr.comments}>{kr.comments}</span>
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-accent text-primary" title="Edit" onClick={() => openEditKr(kr)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Delete" onClick={() => { setDeleteTarget({ type: "kr", id: kr.id }); setDeleteConfirmOpen(true); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Objective Dialog */}
      <Dialog open={addObjOpen} onOpenChange={setAddObjOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Objective</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Objective Title</Label><Input value={objTitle} onChange={e => setObjTitle(e.target.value)} placeholder="Enter objective title" className="mt-1.5" /></div>
            <div><Label>Weightage % (optional)</Label><Input type="number" min={0} max={100} value={objWeight} onChange={e => setObjWeight(e.target.value)} placeholder="0-100" className="mt-1.5" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddObjOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleAddObjective}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add KR Dialog */}
      <Dialog open={addKrOpen} onOpenChange={v => { setAddKrOpen(v); if (!v) resetKrForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Key Result</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Description</Label><Input value={krDesc} onChange={e => setKrDesc(e.target.value)} placeholder="Key result description" className="mt-1.5" /></div>
            <div><Label>Owner</Label><Input value={krOwner} onChange={e => setKrOwner(e.target.value)} placeholder="Person responsible" className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Weightage %</Label><Input type="number" min={0} max={100} value={krWeight} onChange={e => setKrWeight(e.target.value)} className="mt-1.5" /></div>
              <div>
                <Label>Confidence</Label>
                <Select value={krConfidence} onValueChange={v => setKrConfidence(v as "1" | "3" | "5")}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 — Not confident</SelectItem>
                    <SelectItem value="3">3 — On track</SelectItem>
                    <SelectItem value="5">5 — Very confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Initial Progress (%)</Label><Input type="number" min={0} max={100} value={krProgress} onChange={e => setKrProgress(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Comments</Label><Textarea value={krComments} onChange={e => setKrComments(e.target.value)} placeholder="Notes, barriers, next steps..." className="mt-1.5" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddKrOpen(false); resetKrForm(); }}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleAddKr}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit KR Dialog */}
      <Dialog open={editKrOpen} onOpenChange={v => { setEditKrOpen(v); if (!v) resetKrForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Key Result</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Description</Label><Input value={krDesc} onChange={e => setKrDesc(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Owner</Label><Input value={krOwner} onChange={e => setKrOwner(e.target.value)} className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Weightage %</Label><Input type="number" min={0} max={100} value={krWeight} onChange={e => setKrWeight(e.target.value)} className="mt-1.5" /></div>
              <div>
                <Label>Confidence</Label>
                <Select value={krConfidence} onValueChange={v => setKrConfidence(v as "1" | "3" | "5")}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 — Not confident</SelectItem>
                    <SelectItem value="3">3 — On track</SelectItem>
                    <SelectItem value="5">5 — Very confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={krProgress} onChange={e => setKrProgress(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Comments</Label><Textarea value={krComments} onChange={e => setKrComments(e.target.value)} className="mt-1.5" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditKrOpen(false); resetKrForm(); }}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleEditKr}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.type === "obj" ? "Delete Objective and all Key Results?" : "Delete this Key Result?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OKRs;

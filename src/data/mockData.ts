export const teams = [
  { id: "product", name: "Product" },
  { id: "execution", name: "Execution" },
  { id: "tech", name: "Tech" },
  { id: "hr-finance", name: "HR & Finance" },
  { id: "sales-marketing", name: "Sales & Marketing" },
];

export const quarters = [
  { id: "q1-2026", name: "Q1 2026", label: "Jan - Mar 2026", isCurrent: true },
  { id: "q2-2026", name: "Q2 2026", label: "Apr - Jun 2026", isCurrent: false },
  { id: "q3-2026", name: "Q3 2026", label: "Jul - Sep 2026", isCurrent: false },
  { id: "q4-2026", name: "Q4 2026", label: "Oct - Dec 2026", isCurrent: false },
];

export type KeyResult = {
  id: string;
  description: string;
  owner: string;
  weightage: number;
  confidence: 1 | 3 | 5;
  trend: "up" | "same" | "down";
  progress: number;
  lastUpdated: string;
  comments: string;
};

export type Objective = {
  id: string;
  number: number;
  title: string;
  description?: string;
  weightage?: number;
  keyResults: KeyResult[];
};

export type TeamOKRData = {
  teamId: string;
  quarterId: string;
  vision: string;
  strategy: string;
  objectives: Objective[];
};

export const mockOKRData: TeamOKRData[] = [
  {
    teamId: "product",
    quarterId: "q1-2026",
    vision: "Deliver innovative solutions that solve customer problems",
    strategy: "2026 Product Strategy",
    objectives: [
      {
        id: "obj-1",
        number: 1,
        title: "Deliver high-impact modules that expand product coverage",
        weightage: 50,
        keyResults: [
          {
            id: "kr-1a",
            description: "Launch 5 new modules (EUDR, PPWR, EUBR, PCF, IMDS Connect)",
            owner: "Swetha",
            weightage: 30,
            confidence: 5,
            trend: "up",
            progress: 50,
            lastUpdated: "13/2/26",
            comments: "EUDR - Design 3%, PPWR - Design 3%, IMDS - 6%",
          },
          {
            id: "kr-1b",
            description: "Achieve 95% user satisfaction for new modules",
            owner: "Raj",
            weightage: 25,
            confidence: 3,
            trend: "same",
            progress: 65,
            lastUpdated: "12/2/26",
            comments: "Beta feedback positive so far",
          },
          {
            id: "kr-1c",
            description: "Complete 100% of regulatory compliance requirements",
            owner: "Priya",
            weightage: 25,
            confidence: 5,
            trend: "up",
            progress: 80,
            lastUpdated: "14/2/26",
            comments: "All audits passed",
          },
          {
            id: "kr-1d",
            description: "Reduce module load time by 40%",
            owner: "Arjun",
            weightage: 20,
            confidence: 1,
            trend: "down",
            progress: 15,
            lastUpdated: "10/2/26",
            comments: "Performance issues need architect review",
          },
        ],
      },
      {
        id: "obj-2",
        number: 2,
        title: "Improve product adoption and engagement",
        weightage: 50,
        keyResults: [
          {
            id: "kr-2a",
            description: "Increase DAU from 500 to 800",
            owner: "Neha",
            weightage: 35,
            confidence: 3,
            trend: "up",
            progress: 60,
            lastUpdated: "13/2/26",
            comments: "New onboarding flow helping",
          },
          {
            id: "kr-2b",
            description: "Reduce churn rate from 15% to 8%",
            owner: "Vikram",
            weightage: 35,
            confidence: 5,
            trend: "up",
            progress: 75,
            lastUpdated: "14/2/26",
            comments: "Customer success outreach working",
          },
          {
            id: "kr-2c",
            description: "Launch 3 engagement features",
            owner: "Kavya",
            weightage: 30,
            confidence: 3,
            trend: "same",
            progress: 50,
            lastUpdated: "11/2/26",
            comments: "2/3 features deployed",
          },
        ],
      },
    ],
  },
  {
    teamId: "tech",
    quarterId: "q1-2026",
    vision: "Build scalable and reliable technology infrastructure",
    strategy: "2026 Tech Strategy",
    objectives: [
      {
        id: "obj-t1",
        number: 1,
        title: "Achieve 99.9% platform uptime",
        weightage: 60,
        keyResults: [
          {
            id: "kr-t1a",
            description: "Implement automated failover for all critical services",
            owner: "Anil",
            weightage: 40,
            confidence: 5,
            trend: "up",
            progress: 85,
            lastUpdated: "14/2/26",
            comments: "All primary services covered",
          },
          {
            id: "kr-t1b",
            description: "Reduce mean time to recovery (MTTR) to under 15 minutes",
            owner: "Deepa",
            weightage: 30,
            confidence: 3,
            trend: "same",
            progress: 55,
            lastUpdated: "13/2/26",
            comments: "Monitoring improvements in progress",
          },
          {
            id: "kr-t1c",
            description: "Complete security audit and remediation",
            owner: "Rahul",
            weightage: 30,
            confidence: 5,
            trend: "up",
            progress: 90,
            lastUpdated: "14/2/26",
            comments: "Final remediation items being closed",
          },
        ],
      },
    ],
  },
  {
    teamId: "execution",
    quarterId: "q1-2026",
    vision: "Deliver projects on time with exceptional quality",
    strategy: "2026 Execution Strategy",
    objectives: [
      {
        id: "obj-e1",
        number: 1,
        title: "Improve delivery predictability to 90%",
        weightage: 100,
        keyResults: [
          {
            id: "kr-e1a",
            description: "Achieve 90% sprint commitment accuracy",
            owner: "Meera",
            weightage: 50,
            confidence: 3,
            trend: "up",
            progress: 70,
            lastUpdated: "13/2/26",
            comments: "Improving sprint planning process",
          },
          {
            id: "kr-e1b",
            description: "Reduce scope creep incidents by 50%",
            owner: "Suresh",
            weightage: 50,
            confidence: 3,
            trend: "same",
            progress: 45,
            lastUpdated: "12/2/26",
            comments: "Better requirements gathering process introduced",
          },
        ],
      },
    ],
  },
];

export function getTeamOKRs(teamId: string, quarterId: string): TeamOKRData | undefined {
  return mockOKRData.find((d) => d.teamId === teamId && d.quarterId === quarterId);
}

export function calculateObjectiveProgress(obj: Objective): number {
  if (obj.keyResults.length === 0) return 0;
  const totalWeight = obj.keyResults.reduce((sum, kr) => sum + kr.weightage, 0);
  if (totalWeight === 0) return Math.round(obj.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / obj.keyResults.length);
  return Math.round(obj.keyResults.reduce((sum, kr) => sum + (kr.progress * kr.weightage) / totalWeight, 0));
}

export function calculateTeamProgress(objectives: Objective[]): number {
  if (objectives.length === 0) return 0;
  const totalWeight = objectives.reduce((sum, o) => sum + (o.weightage || 0), 0);
  if (totalWeight === 0) {
    return Math.round(objectives.reduce((sum, o) => sum + calculateObjectiveProgress(o), 0) / objectives.length);
  }
  return Math.round(
    objectives.reduce((sum, o) => sum + (calculateObjectiveProgress(o) * (o.weightage || 0)) / totalWeight, 0)
  );
}

export function getProgressColor(progress: number): string {
  if (progress < 40) return "progress-red";
  if (progress < 70) return "progress-yellow";
  return "progress-green";
}

export function getProgressColorHsl(progress: number): string {
  if (progress < 40) return "hsl(var(--progress-red))";
  if (progress < 70) return "hsl(var(--progress-yellow))";
  return "hsl(var(--progress-green))";
}

export function getConfidenceColor(confidence: 1 | 3 | 5): string {
  if (confidence === 1) return "progress-red";
  if (confidence === 3) return "progress-yellow";
  return "progress-green";
}

export function getTrendIcon(trend: "up" | "same" | "down"): string {
  if (trend === "up") return "⬆️";
  if (trend === "same") return "➡️";
  return "⬇️";
}

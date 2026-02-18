import { Router } from "express";

// Static metadata for teams and quarters.
// You can later move these to MongoDB collections if needed.
const teams = [
  { id: "product", name: "Product" },
  { id: "execution", name: "Execution" },
  { id: "tech", name: "Tech" },
  { id: "hr-finance", name: "HR & Finance" },
  { id: "sales-marketing", name: "Sales & Marketing" }
];

const quarters = [
  { id: "q1-2026", name: "Q1 2026", label: "Jan - Mar 2026", isCurrent: true },
  { id: "q2-2026", name: "Q2 2026", label: "Apr - Jun 2026", isCurrent: false },
  { id: "q3-2026", name: "Q3 2026", label: "Jul - Sep 2026", isCurrent: false },
  { id: "q4-2026", name: "Q4 2026", label: "Oct - Dec 2026", isCurrent: false }
];

const router = Router();

router.get("/teams", (_req, res) => {
  res.json(teams);
});

router.get("/quarters", (_req, res) => {
  res.json(quarters);
});

export default router;


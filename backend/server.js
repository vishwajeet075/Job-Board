const express = require("express");
const cors = require("cors");
const jobs = require("./data/jobs.json");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// GET all jobs (with optional query filters)
app.get("/api/jobs", (req, res) => {
  let result = [...jobs];

  const { search, location, type, experienceMin, experienceMax, department, locationType, salary } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (j) =>
        j.role.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q)) ||
        j.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (location) {
    result = result.filter((j) =>
      j.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (type) {
    result = result.filter((j) => j.type === type);
  }

  if (locationType) {
    result = result.filter((j) => j.locationType === locationType);
  }

  if (department) {
    result = result.filter((j) => j.department === department);
  }

  if (experienceMin !== undefined) {
    result = result.filter((j) => j.experienceMax >= parseInt(experienceMin));
  }

  if (experienceMax !== undefined) {
    result = result.filter((j) => j.experienceMin <= parseInt(experienceMax));
  }

  res.json({ total: result.length, jobs: result });
});

// GET single job by ID
app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

// GET featured jobs
app.get("/api/jobs/featured/list", (req, res) => {
  const featured = jobs.filter((j) => j.featured);
  res.json({ total: featured.length, jobs: featured });
});

// GET filter metadata (for populating filter dropdowns)
app.get("/api/meta/filters", (req, res) => {
  const departments = [...new Set(jobs.map((j) => j.department))];
  const locationTypes = [...new Set(jobs.map((j) => j.locationType))];
  const jobTypes = [...new Set(jobs.map((j) => j.type))];
  const allSkills = [...new Set(jobs.flatMap((j) => j.skills))].sort();
  res.json({ departments, locationTypes, jobTypes, allSkills });
});

app.listen(PORT, () => {
  console.log(`Job Board API running at http://localhost:${PORT}`);
});
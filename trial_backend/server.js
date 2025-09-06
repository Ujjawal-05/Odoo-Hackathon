/* SynergySphere trial backend (Express + in-memory DB)
   npm i express cors uuid
   node server.js
   Base URL: http://localhost:3000/api/v1
*/
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------------------ In-Memory DB ------------------------------ */
const roles = { USER: "user", MANAGER: "manager", ADMIN: "admin" };

const users = [
  { id: "u1", name: "Demo User", email: "demo@synergy.com", password: "password123", role: roles.ADMIN },
  { id: "u2", name: "Alice", email: "alice@example.com", password: "alice", role: roles.MANAGER },
  { id: "u3", name: "Bob",   email: "bob@example.com",   password: "bob",   role: roles.USER },
];

// project membership stored separately (role per project)
const projects = [
  { id: "p1", name: "Hackathon MVP", description: "Trial backend project", ownerId: "u2" },
];
const projectMembers = [
  { projectId: "p1", userId: "u2", role: "manager" },
  { projectId: "p1", userId: "u3", role: "member" },
];

const tasks = [
  { id: "t1", projectId: "p1", title: "Design login UI", description: "", status: "todo",  dueDate: null, assigneeId: "u3" },
  { id: "t2", projectId: "p1", title: "Wire API client",  description: "", status: "in_progress", dueDate: null, assigneeId: "u2" },
];

const messages = [
  { id: "m1", projectId: "p1", authorId: "u2", authorName: "Alice", text: "Welcome to Synergy!", parentId: null, createdAt: new Date().toISOString() },
];

const notifications = [
  { id: "n1", userId: "u3", type: "info", title: "Assigned task", body: "You were assigned t1", read: false, createdAt: new Date().toISOString() },
];

/* ------------------------------ Auth Helpers ----------------------------- */
// Super-simple token: "token-<userId>"
const makeToken = (userId) => `token-${userId}`;
const parseToken = (hdr) => {
  if (!hdr) return null;
  const m = hdr.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1];
  const userId = token.replace(/^token-/, "");
  return users.find((u) => u.id === userId) ? { token, userId } : null;
};

const authRequired = (req, res, next) => {
  const parsed = parseToken(req.header("Authorization") || "");
  if (!parsed) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Login required" } });
  req.userId = parsed.userId;
  req.user = users.find((u) => u.id === parsed.userId);
  next();
};

const isAdmin = (req) => req.user?.role === roles.ADMIN;
const isProjectMember = (projectId, userId) => projectMembers.some((m) => m.projectId === projectId && m.userId === userId);
const projectRole = (projectId, userId) => projectMembers.find((m) => m.projectId === projectId && m.userId === userId)?.role;
const isProjectManager = (projectId, userId) => projectRole(projectId, userId) === "manager";

/* ------------------------------ ROUTES: AUTH ----------------------------- */
const v1 = express.Router();
app.use("/api/v1", v1);

v1.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: { code: "INVALID", message: "name, email, password required" } });
  if (users.some((u) => u.email === email)) return res.status(409).json({ error: { code: "CONFLICT", message: "Email exists" } });
  const u = { id: uuid(), name, email, password, role: roles.USER };
  users.push(u);
  res.status(201).json({ id: u.id, name: u.name, email: u.email });
});

v1.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const u = users.find((x) => x.email === email && x.password === password);
  if (!u) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
  res.json({ token: makeToken(u.id), user: { id: u.id, name: u.name, email: u.email, role: u.role } });
});

v1.post("/auth/logout", authRequired, (_req, res) => res.status(204).end());
v1.post("/auth/refresh", (_req, res) => res.json({ token: makeToken("u1") })); // demo

/* ------------------------------- ROUTES: USERS --------------------------- */
v1.get("/users/me", authRequired, (req, res) => {
  const u = users.find((x) => x.id === req.userId);
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
});

v1.get("/users/:userId", authRequired, (req, res) => {
  const u = users.find((x) => x.id === req.params.userId);
  if (!u) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
  res.json({ id: u.id, name: u.name });
});

v1.get("/users/search", authRequired, (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  if (!(isAdmin(req) || req.user.role === roles.MANAGER)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin/Manager only" } });
  const results = users
    .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    .map((u) => ({ id: u.id, name: u.name, email: u.email }));
  res.json(results);
});

/* ----------------------------- ROUTES: PROJECTS ------------------------- */
v1.get("/projects", authRequired, (req, res) => {
  const mine = isAdmin(req) ? projects : projects.filter((p) => isProjectMember(p.id, req.userId));
  const withRole = mine.map((p) => ({ ...p, role: isProjectManager(p.id, req.userId) ? "manager" : "member" }));
  res.json(withRole);
});

v1.post("/projects", authRequired, (req, res) => {
  if (!(isAdmin(req) || req.user.role === roles.MANAGER)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: { code: "INVALID", message: "name required" } });
  const p = { id: uuid(), name, description: description || "", ownerId: req.userId };
  projects.push(p);
  projectMembers.push({ projectId: p.id, userId: req.userId, role: "manager" });
  res.status(201).json(p);
});

v1.get("/projects/:projectId", authRequired, (req, res) => {
  const p = projects.find((x) => x.id === req.params.projectId);
  if (!p) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
  if (!(isAdmin(req) || isProjectMember(p.id, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const membersCount = projectMembers.filter((m) => m.projectId === p.id).length;
  const tasksCount = tasks.filter((t) => t.projectId === p.id).length;
  res.json({ ...p, membersCount, tasksCount });
});

v1.put("/projects/:projectId", authRequired, (req, res) => {
  const p = projects.find((x) => x.id === req.params.projectId);
  if (!p) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
  if (!(isAdmin(req) || isProjectManager(p.id, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const { name, description } = req.body || {};
  if (name !== undefined) p.name = name;
  if (description !== undefined) p.description = description;
  res.json(p);
});

v1.delete("/projects/:projectId", authRequired, (req, res) => {
  const p = projects.find((x) => x.id === req.params.projectId);
  if (!p) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
  if (!(isAdmin(req) || isProjectManager(p.id, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  // remove project, members, tasks, messages
  const idx = projects.findIndex((x) => x.id === p.id);
  projects.splice(idx, 1);
  for (let i = projectMembers.length - 1; i >= 0; i--) if (projectMembers[i].projectId === p.id) projectMembers.splice(i, 1);
  for (let i = tasks.length - 1; i >= 0; i--) if (tasks[i].projectId === p.id) tasks.splice(i, 1);
  for (let i = messages.length - 1; i >= 0; i--) if (messages[i].projectId === p.id) messages.splice(i, 1);
  res.status(204).end();
});

/* Project Members */
v1.get("/projects/:projectId/members", authRequired, (req, res) => {
  const pid = req.params.projectId;
  if (!(isAdmin(req) || isProjectMember(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const mem = projectMembers.filter((m) => m.projectId === pid).map((m) => ({ ...m, name: users.find((u) => u.id === m.userId)?.name || "User" }));
  res.json(mem);
});

v1.post("/projects/:projectId/members", authRequired, (req, res) => {
  const pid = req.params.projectId;
  if (!(isAdmin(req) || isProjectManager(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const { userId, role } = req.body || {};
  if (!userId || !role) return res.status(400).json({ error: { code: "INVALID", message: "userId and role required" } });
  if (!users.find((u) => u.id === userId)) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
  if (projectMembers.some((m) => m.projectId === pid && m.userId === userId)) return res.status(409).json({ error: { code: "CONFLICT", message: "Already a member" } });
  projectMembers.push({ projectId: pid, userId, role });
  res.status(201).json({ userId, role });
});

v1.delete("/projects/:projectId/members/:userId", authRequired, (req, res) => {
  const pid = req.params.projectId, uid = req.params.userId;
  if (!(isAdmin(req) || isProjectManager(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const idx = projectMembers.findIndex((m) => m.projectId === pid && m.userId === uid);
  if (idx === -1) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Membership not found" } });
  projectMembers.splice(idx, 1);
  res.status(204).end();
});

/* ------------------------------- ROUTES: TASKS -------------------------- */
// Project-scoped
v1.get("/projects/:projectId/tasks", authRequired, (req, res) => {
  const pid = req.params.projectId;
  if (!(isAdmin(req) || isProjectMember(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const { status, assigneeId } = req.query;
  let list = tasks.filter((t) => t.projectId === pid);
  if (status) list = list.filter((t) => t.status === status);
  if (assigneeId) list = list.filter((t) => t.assigneeId === assigneeId);
  res.json(list);
});

v1.post("/projects/:projectId/tasks", authRequired, (req, res) => {
  const pid = req.params.projectId;
  const isMgr = isProjectManager(pid, req.userId);
  if (!(isAdmin(req) || isMgr)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const { title, description, status, dueDate, assigneeId } = req.body || {};
  if (!title) return res.status(400).json({ error: { code: "INVALID", message: "title required" } });
  const t = { id: uuid(), projectId: pid, title, description: description || "", status: status || "todo", dueDate: dueDate || null, assigneeId: assigneeId || null };
  tasks.push(t);
  res.status(201).json(t);
});

v1.get("/projects/:projectId/tasks/:taskId", authRequired, (req, res) => {
  const { projectId, taskId } = req.params;
  if (!(isAdmin(req) || isProjectMember(projectId, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const t = tasks.find((x) => x.id === taskId && x.projectId === projectId);
  if (!t) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found" } });
  res.json(t);
});

v1.put("/projects/:projectId/tasks/:taskId", authRequired, (req, res) => {
  const { projectId, taskId } = req.params;
  const t = tasks.find((x) => x.id === taskId && x.projectId === projectId);
  if (!t) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found" } });
  const assigneeEditingOwnStatus = t.assigneeId === req.userId && Object.keys(req.body || {}).every((k) => ["status"].includes(k));
  if (!(isAdmin(req) || isProjectManager(projectId, req.userId) || assigneeEditingOwnStatus))
    return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
  const { title, description, status, dueDate, assigneeId } = req.body || {};
  if (title !== undefined) t.title = title;
  if (description !== undefined) t.description = description;
  if (status !== undefined) t.status = status;
  if (dueDate !== undefined) t.dueDate = dueDate;
  if (assigneeId !== undefined) t.assigneeId = assigneeId;
  res.json(t);
});

v1.delete("/projects/:projectId/tasks/:taskId", authRequired, (req, res) => {
  const { projectId, taskId } = req.params;
  if (!(isAdmin(req) || isProjectManager(projectId, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Manager/Admin only" } });
  const idx = tasks.findIndex((x) => x.id === taskId && x.projectId === projectId);
  if (idx === -1) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found" } });
  tasks.splice(idx, 1);
  res.status(204).end();
});

// Global tasks
v1.get("/tasks", authRequired, (req, res) => {
  let { assigneeId, projectId, status } = req.query;
  if (!assigneeId || assigneeId === "me") assigneeId = req.userId;
  let list = tasks.filter((t) => t.assigneeId === assigneeId);
  if (projectId) list = list.filter((t) => t.projectId === projectId);
  if (status) list = list.filter((t) => t.status === status);
  // Security: show only tasks in projects caller can access unless admin
  if (!isAdmin(req)) list = list.filter((t) => isProjectMember(t.projectId, req.userId));
  res.json(list);
});

v1.get("/tasks/:taskId", authRequired, (req, res) => {
  const t = tasks.find((x) => x.id === req.params.taskId);
  if (!t) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found" } });
  if (!(isAdmin(req) || isProjectMember(t.projectId, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
  res.json(t);
});

/* ------------------------------ ROUTES: MESSAGES ------------------------ */
v1.get("/projects/:projectId/messages", authRequired, (req, res) => {
  const pid = req.params.projectId;
  if (!(isAdmin(req) || isProjectMember(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const { parentId } = req.query;
  let list = messages.filter((m) => m.projectId === pid);
  if (parentId !== undefined) list = list.filter((m) => (parentId === "" ? m.parentId == null : m.parentId === parentId));
  res.json(list);
});

v1.post("/projects/:projectId/messages", authRequired, (req, res) => {
  const pid = req.params.projectId;
  if (!(isAdmin(req) || isProjectMember(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const { text, parentId } = req.body || {};
  if (!text) return res.status(400).json({ error: { code: "INVALID", message: "text required" } });
  const u = users.find((x) => x.id === req.userId);
  const m = { id: uuid(), projectId: pid, authorId: u.id, authorName: u.name, text, parentId: parentId || null, createdAt: new Date().toISOString() };
  messages.push(m);
  res.status(201).json(m);
});

v1.get("/projects/:projectId/messages/:messageId", authRequired, (req, res) => {
  const pid = req.params.projectId, mid = req.params.messageId;
  if (!(isAdmin(req) || isProjectMember(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not a member" } });
  const m = messages.find((x) => x.id === mid && x.projectId === pid);
  if (!m) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Message not found" } });
  res.json(m);
});

v1.put("/projects/:projectId/messages/:messageId", authRequired, (req, res) => {
  const pid = req.params.projectId, mid = req.params.messageId;
  const m = messages.find((x) => x.id === mid && x.projectId === pid);
  if (!m) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Message not found" } });
  const author = m.authorId === req.userId;
  if (!(author || isAdmin(req) || isProjectManager(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: { code: "INVALID", message: "text required" } });
  m.text = text;
  res.json(m);
});

v1.delete("/projects/:projectId/messages/:messageId", authRequired, (req, res) => {
  const pid = req.params.projectId, mid = req.params.messageId;
  const idx = messages.findIndex((x) => x.id === mid && x.projectId === pid);
  if (idx === -1) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Message not found" } });
  const m = messages[idx];
  const author = m.authorId === req.userId;
  if (!(author || isAdmin(req) || isProjectManager(pid, req.userId))) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Not allowed" } });
  messages.splice(idx, 1);
  res.status(204).end();
});

/* --------------------------- ROUTES: NOTIFICATIONS ---------------------- */
v1.get("/notifications", authRequired, (req, res) => {
  res.json(notifications.filter((n) => n.userId === req.userId));
});

v1.post("/notifications/:id/read", authRequired, (req, res) => {
  const n = notifications.find((x) => x.id === req.params.id && x.userId === req.userId);
  if (!n) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Notification not found" } });
  n.read = true;
  res.status(204).end();
});

v1.get("/users", authRequired, (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin only" } });
  }
  const safe = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
  res.json(safe);
});

/* ----------------------------------------------------------------------- */
const port = 3000;
app.listen(port, () => console.log(`Synergy backend running on http://localhost:${port}/api/v1`));



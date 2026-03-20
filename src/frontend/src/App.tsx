import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  CheckCircle2,
  Filter,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Search,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { AddTaskModal } from "./components/AddTaskModal";
import { TaskCard } from "./components/TaskCard";
import { Department, TaskMode, useGetTasks } from "./hooks/useQueries";

type DeptFilter = "all" | Department;
type ModeFilter = "all" | TaskMode;

const DEPT_TABS: { label: string; value: DeptFilter }[] = [
  { label: "All", value: "all" },
  { label: "Store", value: Department.store },
  { label: "Purchase", value: Department.purchase },
  { label: "Marketing", value: Department.marketing },
];

const MODE_TABS: { label: string; value: ModeFilter }[] = [
  { label: "All", value: "all" },
  { label: "On Site", value: TaskMode.onSite },
  { label: "Online", value: TaskMode.online },
];

const QUICK_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ShoppingCart, label: "Purchase" },
  { icon: Megaphone, label: "Marketing" },
  { icon: Store, label: "Store" },
  { icon: FolderKanban, label: "Projects" },
];

const ACTIVE_PROJECTS = [
  { color: "bg-blue-500", label: "AS9100D Audit 2026" },
  { color: "bg-purple-500", label: "Customer Sat Q1" },
  { color: "bg-teal-500", label: "Stock Overhaul" },
];

export default function App() {
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [search, setSearch] = useState("");

  const { data: tasks = [], isLoading } = useGetTasks(
    deptFilter === "all" ? null : deptFilter,
    modeFilter === "all" ? null : modeFilter,
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [tasks, search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster richColors position="top-right" />

      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-card border-b border-border h-16 flex items-center px-6 gap-6 shadow-sm">
        <div className="flex items-center gap-2 mr-4">
          <CheckCircle2 className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">
            TaskFlow
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {["Overview", "Tasks", "Reports", "Settings"].map((item) => (
            <button
              key={item}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                item === "Tasks"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              data-ocid="nav.link"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 h-9 w-56 bg-background rounded-full text-sm"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="header.search_input"
          />
        </div>
        <button
          type="button"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-foreground"
          aria-label="Profile"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-card border-r border-border py-6 gap-6 flex-shrink-0">
          <div className="px-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Quick Links
            </p>
            <ul className="space-y-0.5">
              {QUICK_LINKS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    data-ocid="sidebar.link"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Active Projects
            </p>
            <ul className="space-y-2">
              {ACTIVE_PROJECTS.map(({ color, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color}`}
                  />
                  <span className="text-xs text-foreground leading-tight">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </div>

            {/* Department filter */}
            <div className="flex items-center gap-1 bg-card rounded-full border border-border p-1 shadow-sm">
              {DEPT_TABS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeptFilter(value)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    deptFilter === value
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid="dept.tab"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mode filter */}
            <div className="flex items-center gap-1 bg-card rounded-full border border-border p-1 shadow-sm">
              {MODE_TABS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setModeFilter(value)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    modeFilter === value
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid="mode.tab"
                >
                  {label}
                </button>
              ))}
            </div>

            <span className="text-xs text-muted-foreground bg-accent px-2.5 py-1 rounded-full font-medium">
              {filtered.length} task{filtered.length !== 1 ? "s" : ""}
            </span>

            <div className="flex-1" />
            <AddTaskModal />
          </div>

          {/* Task Grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              data-ocid="task.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="task.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FolderKanban className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">
                No tasks found
              </p>
              <p className="text-sm text-muted-foreground">
                Adjust your filters or add a new task
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
                hidden: {},
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((task, i) => (
                  <motion.div
                    key={task.id.toString()}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.15 },
                    }}
                    layout
                  >
                    <TaskCard task={task} index={i + 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground bg-card">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

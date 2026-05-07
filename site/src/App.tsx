import * as Accordion from "@radix-ui/react-accordion";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ArrowDownToLine,
  ChevronDown,
  FolderOpen,
  Languages,
  ListChecks,
  Monitor,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import { useEffect, useState } from "react";

type Locale = "zh" | "en";

type Feature = {
  label: string;
  title: string;
  body: string;
};

type Faq = {
  question: string;
  answer: string;
};

const downloadURL = "https://github.com/walnut-a/FileBox-Public/releases/latest";
const cliDocsURL = "https://github.com/walnut-a/FileBox-Public/blob/main/docs/agent-cli-and-skill.md";
const releaseURL = "https://github.com/walnut-a/FileBox-Public/releases";

const copy: Record<
  Locale,
  {
    nav: string[];
    langLabel: string;
    eyebrow: string;
    heroTitle: string;
    heroLead: string;
    primaryCta: string;
    secondaryCta: string;
    latest: string;
    system: string;
    screenshotAlt: string;
    windowNote: string;
    valueTitle: string;
    valueLead: string;
    features: Feature[];
    workflowTitle: string;
    workflowLead: string;
    workflow: Feature[];
    localTitle: string;
    localLead: string;
    localPoints: string[];
    cliTitle: string;
    cliLead: string;
    cliCommand: string;
    cliNote: string;
    faqTitle: string;
    faqs: Faq[];
    downloadTitle: string;
    downloadLead: string;
    downloadButton: string;
    releaseLink: string;
    footer: string;
  }
> = {
  zh: {
    nav: ["功能", "工作流", "CLI", "下载"],
    langLabel: "语言",
    eyebrow: "FileBox for macOS",
    heroTitle: "文件更近。",
    heroLead:
      "把桌面、下载、项目文件夹和文件动态收在一起。FileBox 不替代 Finder，只把你每天都会打开的那几个位置变得更近。",
    primaryCta: "下载 FileBox",
    secondaryCta: "查看 CLI 文档",
    latest: "最新版本 1.4.2",
    system: "macOS 13.0+",
    screenshotAlt: "FileBox 主窗口截图",
    windowNote: "主窗口、快捷窗口和文件动态使用同一份本地目录上下文。",
    valueTitle: "为高频文件夹做得更快一点。",
    valueLead:
      "FileBox 的重点不是管理一切，而是让桌面、下载、项目、素材这些常用位置更容易抵达。",
    features: [
      {
        label: "01",
        title: "常用目录",
        body: "把最常打开的文件夹固定在一个轻量侧栏里，减少在 Finder 里反复寻找。"
      },
      {
        label: "02",
        title: "快捷窗口",
        body: "用全局快捷键呼出小窗口，按 Tab 切换目录，快速处理下载和临时文件。"
      },
      {
        label: "03",
        title: "文件动态",
        body: "关注目录里的最新文件变化，并按目录分组展示，避免被大量无关文件淹没。"
      }
    ],
    workflowTitle: "界面给人用，CLI 给 Agent 用。",
    workflowLead:
      "图形界面负责日常浏览，CLI 负责把路径和文件动态交给终端、脚本或 Agent。FileBox 只读输出，不替你操作文件。",
    workflow: [
      {
        label: "Browse",
        title: "在界面里整理日常文件",
        body: "打开常用目录、预览文件、查看文件动态，仍然保留 Mac 原生文件使用习惯。"
      },
      {
        label: "Focus",
        title: "用关注后缀减少噪音",
        body: "优先看 md、app、dmg、pdf 这类重要格式，全部动态也可以随时切回。"
      },
      {
        label: "Ask",
        title: "把路径交给 Agent",
        body: "CLI 输出 JSON 或路径列表，Agent 可以基于这些路径继续阅读、总结或处理。"
      }
    ],
    localTitle: "本地优先，动作边界清楚。",
    localLead:
      "FileBox 读取你的本地目录和缓存。CLI 只返回路径和元数据，不移动、不删除、不重命名文件。",
    localPoints: ["不需要账户", "不上传文件内容", "CLI 默认只读", "文件操作由用户决定"],
    cliTitle: "给 Agent 的只读入口",
    cliLead:
      "安装 App 后，可以在设置里安装 filebox 命令。Agent Skill 会告诉模型如何安全调用它。",
    cliCommand: "npx filebox-agent-skill install",
    cliNote: "如果你只是自己查看文件动态，安装 App 内置 CLI 就够了。",
    faqTitle: "常见问题",
    faqs: [
      {
        question: "FileBox 会替代 Finder 吗？",
        answer:
          "不会。FileBox 更像一个快捷入口，适合高频目录、临时文件和最近变化。真正的系统文件管理仍然交给 Finder。"
      },
      {
        question: "文件动态会扫描所有目录吗？",
        answer:
          "不会。它只关注你配置的常用目录或手动添加的监控目录，并且会用缓存和上限控制开销。"
      },
      {
        question: "CLI 可以操作文件吗？",
        answer:
          "不可以。CLI 只返回路径和元数据。如果用户或 Agent 要继续处理文件，下一步动作需要由用户明确决定。"
      }
    ],
    downloadTitle: "把 FileBox 放到你的 Mac 上。",
    downloadLead: "下载最新版，放进 Applications 文件夹，然后配置你的常用目录。",
    downloadButton: "下载 FileBox",
    releaseLink: "查看历史版本",
    footer: "FileBox 是一个本地优先的 macOS 文件快捷访问工具。"
  },
  en: {
    nav: ["Features", "Workflow", "CLI", "Download"],
    langLabel: "Language",
    eyebrow: "FileBox for macOS",
    heroTitle: "Mac files, closer.",
    heroLead:
      "Keep Desktop, Downloads, project folders, and file activity close at hand. FileBox does not replace Finder; it shortens the paths you touch every day.",
    primaryCta: "Download FileBox",
    secondaryCta: "Read CLI docs",
    latest: "Latest version 1.4.2",
    system: "macOS 13.0+",
    screenshotAlt: "FileBox main window screenshot",
    windowNote: "Main window, quick panel, and file activity share one local folder context.",
    valueTitle: "A faster lane for the folders you use most.",
    valueLead:
      "FileBox is not trying to manage everything. It keeps the folders that matter most easier to reach.",
    features: [
      {
        label: "01",
        title: "Favorite folders",
        body: "Pin the folders you open constantly in a lightweight sidebar instead of hunting through Finder again."
      },
      {
        label: "02",
        title: "Quick panel",
        body: "Call up a compact window with a global shortcut, switch folders with Tab, and handle temporary files faster."
      },
      {
        label: "03",
        title: "File activity",
        body: "See recent changes grouped by folder, with focused file extensions to keep noisy directories readable."
      }
    ],
    workflowTitle: "A visual app for people. A read-only CLI for Agents.",
    workflowLead:
      "The app handles everyday browsing. The CLI gives terminals, scripts, and Agents read-only access to folders and file activity.",
    workflow: [
      {
        label: "Browse",
        title: "Work with files in a familiar Mac flow",
        body: "Open folders, preview files, and review activity without abandoning native file habits."
      },
      {
        label: "Focus",
        title: "Reduce noise with focused extensions",
        body: "Prioritize md, app, dmg, pdf, or your own important formats while keeping the all-activity view nearby."
      },
      {
        label: "Ask",
        title: "Hand paths to an Agent",
        body: "The CLI returns JSON or plain paths, so Agents can read, summarize, or continue from your current file context."
      }
    ],
    localTitle: "Local-first, with clear action boundaries.",
    localLead:
      "FileBox reads local folders and local cache. The CLI returns paths and metadata only; it does not move, delete, rename, or modify files.",
    localPoints: ["No account required", "No file contents uploaded", "Read-only CLI by default", "File actions stay user-directed"],
    cliTitle: "A read-only entry point for Agents",
    cliLead:
      "After installing the app, enable the filebox command in Settings. The Agent Skill teaches compatible Agents how to call it safely.",
    cliCommand: "npx filebox-agent-skill install",
    cliNote: "If you only need terminal access, the built-in CLI is enough.",
    faqTitle: "Questions",
    faqs: [
      {
        question: "Does FileBox replace Finder?",
        answer:
          "No. FileBox is a faster entry point for favorite folders, temporary files, and recent changes. Finder remains the system file manager."
      },
      {
        question: "Does file activity scan everything?",
        answer:
          "No. It watches configured favorite folders or manually added monitored folders, with cache and display limits to keep the experience lightweight."
      },
      {
        question: "Can the CLI operate on files?",
        answer:
          "No. The CLI only returns paths and metadata. Any follow-up file operation should be explicitly decided by the user."
      }
    ],
    downloadTitle: "Put FileBox on your Mac.",
    downloadLead: "Download the latest release, drag it into Applications, and set up the folders you touch every day.",
    downloadButton: "Download FileBox",
    releaseLink: "View release history",
    footer: "FileBox is a local-first macOS file access utility."
  }
};

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "zh";
  }
  const saved = window.localStorage.getItem("filebox-site-locale");
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "zh" || requested === "en") {
    return requested;
  }
  if (saved === "zh" || saved === "en") {
    return saved;
  }
  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = locale === "zh" ? "FileBox - 更安静的 Mac 文件工作区" : "FileBox - A quieter file workspace for Mac";
    window.localStorage.setItem("filebox-site-locale", locale);
  }, [locale]);

  return (
    <div className="site-shell">
      <header className="topbar" aria-label="FileBox">
        <a className="brand" href="#top" aria-label="FileBox home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>FileBox</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#features">{text.nav[0]}</a>
          <a href="#workflow">{text.nav[1]}</a>
          <a href="#cli">{text.nav[2]}</a>
          <a href="#download">{text.nav[3]}</a>
        </nav>
        <div className="mobile-language-control" aria-label={text.langLabel}>
          <ToggleGroup.Root
            type="single"
            value={locale}
            onValueChange={(value) => {
              if (value === "zh" || value === "en") {
                setLocale(value);
              }
            }}
            aria-label={text.langLabel}
          >
            <ToggleGroup.Item value="zh" aria-label="中文">
              中
            </ToggleGroup.Item>
            <ToggleGroup.Item value="en" aria-label="English">
              EN
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="language-control" aria-label={text.langLabel}>
          <Languages aria-hidden="true" size={16} />
          <ToggleGroup.Root
            type="single"
            value={locale}
            onValueChange={(value) => {
              if (value === "zh" || value === "en") {
                setLocale(value);
              }
            }}
            aria-label={text.langLabel}
          >
            <ToggleGroup.Item value="zh" aria-label="中文">
              中
            </ToggleGroup.Item>
            <ToggleGroup.Item value="en" aria-label="English">
              EN
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>{text.heroTitle}</h1>
            <p className="hero-lead">{text.heroLead}</p>
            <div className="hero-actions">
              <a className="button primary" href={downloadURL}>
                <ArrowDownToLine aria-hidden="true" size={18} />
                {text.primaryCta}
              </a>
              <a className="button secondary" href={cliDocsURL}>
                <TerminalSquare aria-hidden="true" size={18} />
                {text.secondaryCta}
              </a>
            </div>
            <div className="release-strip" aria-label="Release information">
              <span>{text.latest}</span>
              <span>{text.system}</span>
            </div>
          </div>

          <div className="hero-art" aria-label={text.screenshotAlt}>
            <div className="desk-label">{text.windowNote}</div>
            <div className="window-card">
              <img src="/images/filebox-main-window-20260428.png" alt={text.screenshotAlt} fetchPriority="high" />
            </div>
            <div className="floating-note">
              <FolderOpen aria-hidden="true" size={18} />
              <span>Downloads / GitHub / Desktop</span>
            </div>
          </div>
        </section>

        <section id="features" className="section split-section">
          <div className="section-copy">
            <p className="eyebrow">Core</p>
            <h2>{text.valueTitle}</h2>
            <p>{text.valueLead}</p>
          </div>
          <div className="feature-stack">
            {text.features.map((feature) => (
              <article className="feature-row" key={feature.title}>
                <span className="feature-index">{feature.label}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="section workflow-section">
          <div className="section-heading">
            <p className="eyebrow">Flow</p>
            <h2>{text.workflowTitle}</h2>
            <p>{text.workflowLead}</p>
          </div>
          <div className="workflow-grid">
            <div className="quick-shot">
              <img src="/images/filebox-quick-window-20260428.png" alt="FileBox quick panel" loading="lazy" />
            </div>
            <div className="workflow-list">
              {text.workflow.map((item) => (
                <article key={item.title}>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section local-section">
          <div className="local-card">
            <ShieldCheck aria-hidden="true" size={32} />
            <div>
              <h2>{text.localTitle}</h2>
              <p>{text.localLead}</p>
            </div>
            <ul>
              {text.localPoints.map((point) => (
                <li key={point}>
                  <ListChecks aria-hidden="true" size={16} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="cli" className="section cli-section">
          <div className="cli-copy">
            <p className="eyebrow">CLI / Agent Skill</p>
            <h2>{text.cliTitle}</h2>
            <p>{text.cliLead}</p>
            <p className="soft-note">{text.cliNote}</p>
          </div>
          <div className="terminal-card" aria-label="Agent Skill install command">
            <div className="terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <code>{text.cliCommand}</code>
          </div>
        </section>

        <section className="section faq-section">
          <div className="section-heading compact">
            <p className="eyebrow">Notes</p>
            <h2>{text.faqTitle}</h2>
          </div>
          <Accordion.Root type="single" collapsible className="faq-list">
            {text.faqs.map((item, index) => (
              <Accordion.Item className="faq-item" value={`item-${index}`} key={item.question}>
                <Accordion.Header>
                  <Accordion.Trigger>
                    {item.question}
                    <ChevronDown aria-hidden="true" size={18} />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content">
                  <p>{item.answer}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </section>

        <section id="download" className="download-section">
          <Monitor aria-hidden="true" size={30} />
          <h2>{text.downloadTitle}</h2>
          <p>{text.downloadLead}</p>
          <div className="hero-actions centered">
            <a className="button primary" href={downloadURL}>
              <ArrowDownToLine aria-hidden="true" size={18} />
              {text.downloadButton}
            </a>
            <a className="button secondary" href={releaseURL}>
              {text.releaseLink}
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>{text.footer}</span>
        <a href={cliDocsURL}>CLI / Agent Skill</a>
        <a href={releaseURL}>Releases</a>
      </footer>
    </div>
  );
}

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ArrowDownToLine,
  Monitor,
  TerminalSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import stableRelease from "./data/stable-release.json";

type Locale = "zh" | "en";

type Feature = {
  label: string;
  title: string;
  body: string;
};

const currentVersion = stableRelease.version;
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
    valueTitle: string;
    valueLead: string;
    features: Feature[];
    workflowTitle: string;
    workflowLead: string;
    workflow: Feature[];
    cliTitle: string;
    cliLead: string;
    cliCommand: string;
    cliNote: string;
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
    heroTitle: "少翻几层目录，快一点进入工作",
    heroLead: "FileBox 把常用目录、快捷窗口和文件动态放在同一个地方。",
    primaryCta: "立即下载",
    secondaryCta: "查看 CLI 文档",
    latest: `最新版本 ${currentVersion}`,
    system: "macOS 14.0+",
    screenshotAlt: "FileBox 主窗口截图",
    valueTitle: "为高频文件夹做得更快一点。",
    valueLead: "FileBox 不替代 Finder，只把每天都会打开的位置变得更近。",
    features: [
      {
        label: "01",
        title: "常用目录",
        body: "把最常打开的文件夹固定在一个轻量侧栏里。"
      },
      {
        label: "02",
        title: "快捷窗口",
        body: "用快捷键呼出小窗口，按 Tab 切换目录。"
      },
      {
        label: "03",
        title: "文件动态",
        body: "按目录查看最新变化，减少无关文件干扰。"
      }
    ],
    workflowTitle: "界面处理文件，CLI 交给 Agent。",
    workflowLead: "FileBox 保持本地优先。CLI 只读输出路径和文件动态，不替你操作文件。",
    workflow: [
      {
        label: "Browse",
        title: "在界面里整理日常文件",
        body: "打开常用目录、预览文件、查看文件动态。"
      },
      {
        label: "Focus",
        title: "用关注后缀减少噪音",
        body: "优先看 md、app、dmg、pdf 这类重要格式。"
      },
      {
        label: "Ask",
        title: "把路径交给 Agent",
        body: "输出 JSON 或路径列表，让 Agent 继续阅读。"
      }
    ],
    cliTitle: "给 Agent 的只读入口",
    cliLead: "安装 App 后，可以在设置里安装 FileBox CLI。Agent Skill 会说明调用方式。",
    cliCommand: "npx filebox-agent-skill install",
    cliNote: "如果你只是自己查看文件动态，安装 App 内置 CLI 就够了。",
    downloadTitle: "开启更快的文件访问",
    downloadLead: "下载最新版，拖进 Applications 文件夹，然后配置常用目录。",
    downloadButton: "立即下载",
    releaseLink: "查看历史版本",
    footer: "FileBox 是一个本地优先的 macOS 文件快捷访问工具。"
  },
  en: {
    nav: ["Features", "Workflow", "CLI", "Download"],
    langLabel: "Language",
    eyebrow: "FileBox for macOS",
    heroTitle: "Less folder hunting, faster work",
    heroLead: "FileBox brings favorite folders, the quick panel, and file activity into one place.",
    primaryCta: "Download",
    secondaryCta: "Read CLI docs",
    latest: `Latest version ${currentVersion}`,
    system: "macOS 14.0+",
    screenshotAlt: "FileBox main window screenshot",
    valueTitle: "A faster lane for the folders you use most.",
    valueLead: "FileBox does not replace Finder. It simply shortens the paths you touch every day.",
    features: [
      {
        label: "01",
        title: "Favorite folders",
        body: "Pin the folders you open constantly in a lightweight sidebar."
      },
      {
        label: "02",
        title: "Quick panel",
        body: "Call up a compact window and switch folders with Tab."
      },
      {
        label: "03",
        title: "File activity",
        body: "Review recent changes grouped by folder."
      }
    ],
    workflowTitle: "A visual app for people. A CLI for Agents.",
    workflowLead: "The app handles daily browsing. The CLI returns paths and file activity without modifying files.",
    workflow: [
      {
        label: "Browse",
        title: "Work with files in a familiar Mac flow",
        body: "Open folders, preview files, and review activity."
      },
      {
        label: "Focus",
        title: "Reduce noise with focused extensions",
        body: "Prioritize md, app, dmg, pdf, or your own formats."
      },
      {
        label: "Ask",
        title: "Hand paths to an Agent",
        body: "Return JSON or plain paths for an Agent to continue."
      }
    ],
    cliTitle: "A read-only entry point for Agents",
    cliLead: "After installing the app, enable the FileBox CLI in Settings. The Agent Skill explains how to call it.",
    cliCommand: "npx filebox-agent-skill install",
    cliNote: "If you only need terminal access, the built-in CLI is enough.",
    downloadTitle: "Get faster file access",
    downloadLead: "Download the latest release, drag it into Applications, and set up your folders.",
    downloadButton: "Download",
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
          <img
            className="brand-mark"
            src="/images/filebox-box-transparent-20260425.png"
            alt=""
            width="36"
            height="36"
            aria-hidden="true"
          />
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
              <span className="language-label language-label-zh">中</span>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="en" aria-label="English">
              <span className="language-label">EN</span>
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="language-control" aria-label={text.langLabel}>
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
              <span className="language-label language-label-zh">中</span>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="en" aria-label="English">
              <span className="language-label">EN</span>
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>
              {locale === "zh" ? (
                <>
                  少翻几层目录，<span className="hero-title-nowrap">快一点进入工作</span>
                </>
              ) : (
                text.heroTitle
              )}
            </h1>
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
            <div className="window-card">
              <img src="/images/filebox-main-window-hero-20260509.png" alt={text.screenshotAlt} fetchPriority="high" />
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

        <section id="download" className="download-section">
          <Monitor aria-hidden="true" size={30} />
          <h2>{text.downloadTitle}</h2>
          <p>{text.downloadLead}</p>
          <div className="hero-actions centered">
            <a className="button primary" href={downloadURL}>
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

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ArrowDownToLine,
  Check,
  Copy,
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
const directDownloadURL = stableRelease.asset?.url ?? "https://github.com/walnut-a/FileBox-Public/releases/latest";
const assetSizeMB = stableRelease.asset?.size
  ? `${(stableRelease.asset.size / (1024 * 1024)).toFixed(1)} MB`
  : null;
const cliDocsURL = "https://github.com/walnut-a/FileBox-Public/blob/main/docs/agent-cli-and-skill.md";
const releaseURL = "https://github.com/walnut-a/FileBox-Public/releases";
const releaseNotesURL = stableRelease.releaseNotesURL ?? releaseURL;

const cliCommand = "filebox activity --focused --path-only --limit 2";
const cliSampleOutput = `/Users/alex/Downloads/DESIGN.md
/Users/alex/Downloads/bracket-v2.step`;

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
    quickPanelAlt: string;
    quickPanelCaption: string;
    valueEyebrow: string;
    valueTitle: string;
    valueLead: string;
    features: Feature[];
    workflowEyebrow: string;
    workflowTitle: string;
    workflowLead: string;
    workflow: Feature[];
    cliEyebrow: string;
    cliTitle: string;
    cliLead: string;
    copyCommand: string;
    copied: string;
    downloadTitle: string;
    downloadLead: string;
    downloadButton: string;
    releaseHighlightsTitle: string;
    releaseLink: string;
    footer: string;
  }
> = {
  zh: {
    nav: ["功能", "工作流", "CLI", "下载"],
    langLabel: "语言",
    eyebrow: "macOS 本地文件工作区",
    heroTitle: "少翻几层目录，快一点进入工作",
    heroLead: "FileBox 把常用目录、全键盘快捷窗口与实时文件动态收拢在一处，让日常找文件和 Agent 产出定位都更顺手。",
    primaryCta: "下载 macOS 版",
    secondaryCta: "查看 CLI 文档",
    latest: `v${currentVersion}`,
    system: `macOS ${stableRelease.minimumSystemVersion}+`,
    screenshotAlt: "FileBox 新版纸面主窗口截图",
    quickPanelAlt: "FileBox 快捷窗口截图",
    quickPanelCaption: "快捷窗口 · Tab 切目录 · Space 空格预览",
    valueEyebrow: "核心能力",
    valueTitle: "为高频文件夹做得更快一点。",
    valueLead: "FileBox 不替代 Finder，只把每天都会打开的目录、刚生成的文件和临时中转变得触手可及。",
    features: [
      {
        label: "01",
        title: "常用目录与中转箱",
        body: "把高频文件夹固定在轻量纸面侧栏，支持拖拽到菜单栏直接入中转，减少桌面杂乱。"
      },
      {
        label: "02",
        title: "全键盘快捷窗口",
        body: "全局快捷键呼出小窗口，Tab 切目录、Space 空格预览、回车直开，有新动态时一键直达。"
      },
      {
        label: "03",
        title: "实时文件动态",
        body: "按项目目录或文件格式聚合最新变更，Agent 刚生成的文件打开就能找到。"
      }
    ],
    workflowEyebrow: "工作流",
    workflowTitle: "界面处理文件，CLI 交给 Agent。",
    workflowLead: "一切保持本地优先。CLI 只读输出路径和文件动态，不替你修改任何文件。",
    workflow: [
      {
        label: "浏览",
        title: "在纸面工作区处理日常文件",
        body: "打开常用目录、快速预览、拖拽中转，并在终端里一键定位目录。"
      },
      {
        label: "聚焦",
        title: "按格式和目录过滤噪音",
        body: "跨目录筛选 md、pdf、step、dmg 等关注格式，跳过构建产物和无关缓存。"
      },
      {
        label: "协作",
        title: "把准确路径交给 Agent",
        body: "输出结构化 JSON 或纯路径列表，让编程 Agent 直接读取最新文件继续工作。"
      }
    ],
    cliEyebrow: "FileBox CLI",
    cliTitle: "给 Agent 的只读入口",
    cliLead: "在 FileBox 设置中安装命令行工具，终端和 AI 助手就可以查询最近的文件。",
    copyCommand: "复制命令",
    copied: "已复制",
    downloadTitle: "开启更安静的文件工作区",
    downloadLead: "下载安装包，拖进 Applications 文件夹即可开始使用。",
    downloadButton: assetSizeMB ? `立即下载 (${assetSizeMB})` : "立即下载",
    releaseHighlightsTitle: `v${currentVersion} 更新亮点`,
    releaseLink: "更新日志与历史版本",
    footer: "FileBox 是一个本地优先的 macOS 文件快捷访问工具。"
  },
  en: {
    nav: ["Features", "Workflow", "CLI", "Download"],
    langLabel: "Language",
    eyebrow: "Local-first macOS Workspace",
    heroTitle: "Less folder hunting, faster work",
    heroLead: "FileBox brings favorite folders, a keyboard-first quick panel, and live file activity into one quiet Mac workspace.",
    primaryCta: "Download for macOS",
    secondaryCta: "Read CLI docs",
    latest: `v${currentVersion}`,
    system: `macOS ${stableRelease.minimumSystemVersion}+`,
    screenshotAlt: "FileBox main window screenshot",
    quickPanelAlt: "FileBox quick panel screenshot",
    quickPanelCaption: "Quick Panel · Tab to switch · Space to preview",
    valueEyebrow: "Core",
    valueTitle: "A faster lane for the folders you use most.",
    valueLead: "FileBox does not replace Finder. It simply keeps daily folders, fresh outputs, and staging files within immediate reach.",
    features: [
      {
        label: "01",
        title: "Favorite folders & Transit",
        body: "Pin daily folders in a calm sidebar and drop files onto the menu bar icon to stage them cleanly."
      },
      {
        label: "02",
        title: "Keyboard-first Quick Panel",
        body: "Summon a compact panel anywhere—switch folders with Tab, preview with Space, and jump straight to fresh activity."
      },
      {
        label: "03",
        title: "Live file activity",
        body: "Track newly created files by project or format so Agent outputs are ready the moment they land."
      }
    ],
    workflowEyebrow: "Workflow",
    workflowTitle: "A visual app for people. A CLI for Agents.",
    workflowLead: "Everything stays local-first. The CLI returns paths and activity read-only without touching your files.",
    workflow: [
      {
        label: "Browse",
        title: "Work with files in a calm Mac flow",
        body: "Open pinned folders, Quick Look preview, drag into Transit, or open straight in your terminal."
      },
      {
        label: "Focus",
        title: "Filter noise by format and folder",
        body: "Browse across folders by md, pdf, step, dmg, or your own extensions while ignoring build artifacts."
      },
      {
        label: "Ask",
        title: "Hand exact paths to an Agent",
        body: "Return structured JSON or plain paths so coding Agents pick up the right files immediately."
      }
    ],
    cliEyebrow: "FileBox CLI",
    cliTitle: "A read-only entry point for Agents",
    cliLead: "Install the CLI in FileBox Settings to query recent files from your terminal or AI assistant.",
    copyCommand: "Copy",
    copied: "Copied",
    downloadTitle: "Start with a quieter file workspace",
    downloadLead: "Download the latest DMG, drag FileBox into Applications, and pin your everyday folders.",
    downloadButton: assetSizeMB ? `Download DMG (${assetSizeMB})` : "Download DMG",
    releaseHighlightsTitle: `What's new in v${currentVersion}`,
    releaseLink: "Release notes & history",
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
  const [copied, setCopied] = useState(false);
  const text = copy[locale];
  const releaseSummary = locale === "zh"
    ? stableRelease.summary["zh-Hans"]
    : stableRelease.summary.en;

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = locale === "zh"
      ? "FileBox - 更安静的 Mac 文件工作区"
      : "FileBox - A quieter file workspace for Mac";
    window.localStorage.setItem("filebox-site-locale", locale);
  }, [locale]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = cliCommand;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

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
              <a className="button primary" href={directDownloadURL}>
                <ArrowDownToLine aria-hidden="true" size={17} />
                {text.primaryCta}
              </a>
              <a className="button secondary" href={cliDocsURL}>
                <TerminalSquare aria-hidden="true" size={17} />
                {text.secondaryCta}
              </a>
            </div>
            <div className="release-strip" aria-label="Release information">
              <span className="release-version">
                <i className="accent-dot" aria-hidden="true" />
                {text.latest}
              </span>
              <span>{text.system}</span>
              {assetSizeMB && <span>{assetSizeMB}</span>}
            </div>
          </div>

          <div className="hero-art" aria-label={text.screenshotAlt}>
            <div className="window-card">
              <img
                src="/images/filebox-main-window-hero-20261122.png"
                alt={text.screenshotAlt}
                width="1024"
                height="790"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        <section id="features" className="section split-section">
          <div className="section-copy">
            <p className="eyebrow">{text.valueEyebrow}</p>
            <h2>{text.valueTitle}</h2>
            <p>{text.valueLead}</p>
            <figure className="quick-panel-showcase">
              <div className="window-card quick-panel-card">
                <img
                  src="/images/filebox-quick-window-20261122.png"
                  alt={text.quickPanelAlt}
                  width="750"
                  height="896"
                  loading="lazy"
                />
              </div>
              <figcaption>{text.quickPanelCaption}</figcaption>
            </figure>
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
            <p className="eyebrow">{text.workflowEyebrow}</p>
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
            <p className="eyebrow">{text.cliEyebrow}</p>
            <h2>{text.cliTitle}</h2>
            <p>{text.cliLead}</p>
          </div>
          <div className="cli-showcase">
            <div className="terminal-card" aria-label="FileBox CLI">
              <div className="terminal-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <code>{cliCommand}</code>
              <button
                type="button"
                className={`copy-button${copied ? " is-copied" : ""}`}
                onClick={handleCopyCommand}
                aria-label={copied ? text.copied : text.copyCommand}
              >
                {copied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
                <span>{copied ? text.copied : text.copyCommand}</span>
              </button>
            </div>
            <pre className="cli-output" aria-label="Example CLI output">
              <code>{cliSampleOutput}</code>
            </pre>
          </div>
        </section>

        <section id="download" className="download-section">
          <img
            className="download-box-mark"
            src="/images/filebox-box-transparent-20260425.png"
            alt=""
            width="48"
            height="48"
            aria-hidden="true"
          />
          <h2>{text.downloadTitle}</h2>
          <p>{text.downloadLead}</p>
          <div className="hero-actions centered">
            <a className="button primary" href={directDownloadURL}>
              <ArrowDownToLine aria-hidden="true" size={17} />
              {text.downloadButton}
            </a>
            <a className="button secondary" href={releaseNotesURL}>
              {text.releaseLink}
            </a>
          </div>
          {releaseSummary && releaseSummary.length > 0 && (
            <div className="release-highlights">
              <p className="release-highlights-title">{text.releaseHighlightsTitle}</p>
              <ul>
                {releaseSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>{text.footer}</span>
        <div className="footer-links">
          <a href={cliDocsURL}>FileBox CLI</a>
          <a href={releaseURL}>Releases</a>
        </div>
      </footer>
    </div>
  );
}

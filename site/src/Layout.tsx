import { useState } from "react";
import { Link, NavLink, Outlet, useOutletContext } from "react-router-dom";
import { Glass, Toaster } from "glaceui";
import { BookOpen, Github, Mark, Npm } from "./Icons";
import type { ToasterConfig } from "./Playground";

export interface DocsContext {
  config: ToasterConfig;
  setConfig: (c: ToasterConfig) => void;
}

export const useDocs = () => useOutletContext<DocsContext>();

const GROUPS: { title: string; links: { to: string; label: string; end?: boolean }[] }[] = [
  { title: "Get started", links: [{ to: "/", label: "Overview", end: true }] },
  {
    title: "Components",
    links: [
      { to: "/toasts", label: "Toasts" },
      { to: "/buttons", label: "Buttons" },
      { to: "/panels", label: "Panels" },
      { to: "/primitives", label: "Primitives" },
    ],
  },
];

export function Layout() {
  const [config, setConfig] = useState<ToasterConfig>({
    position: "bottom-right",
    theme: "dark",
    richColors: false,
    closeButton: false,
    expand: true,
    haptics: false,
  });

  return (
    <div className="page">
      <div className="bg" aria-hidden />

      <Glass as="nav" tone="dark" radius={14} className="nav">
        <Link className="brand" to="/">
          <Mark className="brand-mark" />
          <span>Glacé</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/toasts"><BookOpen className="nav-icon" /><span>Docs</span></NavLink>
          <a href="https://github.com/seangeng/glace" target="_blank" rel="noreferrer"><Github className="nav-icon" /><span>GitHub</span></a>
          <a href="https://www.npmjs.com/package/glaceui" target="_blank" rel="noreferrer"><Npm className="nav-icon" /><span>npm</span></a>
        </div>
      </Glass>

      <div className="layout">
        <aside className="sidebar">
          <nav className="side-nav">
            {GROUPS.map((g) => (
              <div className="side-group" key={g.title}>
                <div className="side-group-title">{g.title}</div>
                {g.links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) => "side-link" + (isActive ? " active" : "")}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="content">
          <Outlet context={{ config, setConfig } satisfies DocsContext} />

          <footer className="site-footer">
            <p>
              Built by{" "}
              <a href="https://seangeng.com" target="_blank" rel="noreferrer">Sean Geng</a>. MIT licensed.
            </p>
            <p className="site-footer-links">
              <a href="https://seangeng.com/writing/building-a-liquid-glass-ui-kit" target="_blank" rel="noreferrer">The writeup</a>
              <span aria-hidden>·</span>
              <a href="https://github.com/seangeng/glace" target="_blank" rel="noreferrer">GitHub</a>
              <span aria-hidden>·</span>
              <a href="https://www.npmjs.com/package/glaceui" target="_blank" rel="noreferrer">npm</a>
            </p>
            <p className="site-footer-credits">
              On the shoulders of sonner, Aave's glass recipe, Sileo, and web-haptics.
            </p>
          </footer>
        </main>
      </div>

      <Toaster
        position={config.position}
        theme={config.theme}
        richColors={config.richColors}
        closeButton={config.closeButton}
        expand={config.expand}
        haptics={config.haptics}
      />
    </div>
  );
}

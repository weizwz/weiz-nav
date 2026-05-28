import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultLinks, searchLinks } from '@weiz-nav/core';
import { getFaviconUrl } from '@weiz-nav/services/api/favicon';
import type { Link } from '@weiz-nav/core/link';
import './styles.css';

function openLink(link: Link) {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url: link.url });
    return;
  }

  window.open(link.url, '_blank', 'noopener,noreferrer');
}

function App() {
  const [query, setQuery] = useState('');
  const links = useMemo(() => searchLinks(defaultLinks, query).slice(0, 12), [query]);

  return (
    <main className="popup-shell">
      <header className="popup-header">
        <img src="/icons/logo.png" alt="" className="logo" />
        <div>
          <h1>唯知导航</h1>
          <p>{defaultLinks.length} 个前端资源</p>
        </div>
      </header>

      <label className="search-box">
        <span>搜索</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="输入名称、描述、URL 或标签"
          autoFocus
        />
      </label>

      <section className="link-list" aria-label="导航链接">
        {links.map((link) => {
          const favicon = getFaviconUrl(link.url);

          return (
            <button key={link.id} className="link-item" type="button" onClick={() => openLink(link)}>
              {favicon ? <img src={favicon} alt="" /> : <span className="fallback-icon" />}
              <span className="link-copy">
                <strong>{link.name}</strong>
                <small>{link.description || link.url}</small>
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

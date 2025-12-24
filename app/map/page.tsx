"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard/home.module.css";

export default function MapPage() {
  const [activeNav, setActiveNav] = useState("Map");
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      router.push("/login");
    }
  };

  return (
    <main className={styles.page}>
      <nav className={styles.dock} aria-label="Primary">
        <div className={styles.dockStack}>
          <div className={styles.dockItemWrapper} data-tooltip="Dashboard">
            <button
              className={`${styles.dockItem} ${activeNav === "Dashboard" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => router.push("/dashboard")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.5L12 4l8 6.5v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
          </div>
          <div className={styles.dockItemWrapper} data-tooltip="Map">
            <button
              className={`${styles.dockItem} ${activeNav === "Map" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => router.push("/map")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 18l-4 2V6l4-2 6 3 6-3v14l-6 3-6-3z" />
                <path d="M9 4v14" />
                <path d="M15 7v14" />
              </svg>
            </button>
          </div>
          <div className={styles.dockItemWrapper} data-tooltip="Missions">
            <button
              className={`${styles.dockItem} ${activeNav === "Missions" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => setActiveNav("Missions")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="18" r="2" />
                <path d="M8 6h5a4 4 0 0 1 0 8h-2a4 4 0 0 0 0 8h5" />
              </svg>
            </button>
          </div>
          <div className={styles.dockItemWrapper} data-tooltip="Fleet">
            <button
              className={`${styles.dockItem} ${activeNav === "Fleet" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => setActiveNav("Fleet")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4l7 16-7-4-7 4 7-16z" />
              </svg>
            </button>
          </div>
          <div className={styles.dockItemWrapper} data-tooltip="Live">
            <button
              className={`${styles.dockItem} ${activeNav === "Live" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => setActiveNav("Live")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="7" width="14" height="10" rx="2" />
                <path d="M17 10l4-2v8l-4-2" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.dockBottom}>
          <div className={styles.dockItemWrapper} data-tooltip="Settings">
            <button
              className={`${styles.dockItem} ${activeNav === "Settings" ? styles.dockItemActive : ""}`}
              type="button"
              onClick={() => setActiveNav("Settings")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.66 0 1.26-.38 1.51-1 .27-.68.13-1.36-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.14.6 1.82.33h.02c.62-.25 1-.85 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.38 1.26 1 1.51h.02c.68.27 1.36.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.6 1.14-.33 1.82v.02c.25.62.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.38-1.51 1z" />
              </svg>
            </button>
          </div>
          <div className={styles.dockItemWrapper} data-tooltip="Log out">
            <button
              className={`${styles.dockItem} ${styles.dockLogout}`}
              type="button"
              onClick={handleLogout}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8l-4 4 4 4" />
                <path d="M8 12h13" />
                <path d="M6 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.brand}>
            <div className={styles.brandTitle}>LYNKHUB</div>
            <div className={styles.brandSubtitle}>Ops Command Suite</div>
          </div>
          <div className={styles.topActions}>
            <button className={styles.projectButton} type="button">
              Atlas Operations
              <span className={styles.chevron}>▾</span>
            </button>
            <div className={styles.statusPill}>
              Global Status
              <span className={styles.statusDot} />
            </div>
            <button className={styles.userButton} type="button">
              Kairos
            </button>
          </div>
        </header>
      </div>
    </main>
  );
}

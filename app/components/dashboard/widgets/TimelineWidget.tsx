"use client";

import styles from "../../../dashboard/home.module.css";

type TimelineRow = {
  name: string;
  status: string;
  uptime: string;
  trend: string;
};

type TimelineWidgetProps = {
  rows: TimelineRow[];
  onRemove: () => void;
  showRemove: boolean;
};

export default function TimelineWidget({ rows, onRemove, showRemove }: TimelineWidgetProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Mission Timeline</div>
          <div className={styles.cardSubtitle}>Next sequence blocks</div>
        </div>
        <div className={styles.widgetHeaderActions}>
          <button className={styles.cardAction} type="button">
            View Plan
          </button>
          {showRemove ? (
            <button className={styles.widgetRemove} type="button" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <div className={styles.fleetList}>
        {rows.map((row) => (
          <button key={row.name} className={styles.fleetRow} type="button">
            <div>
              <div className={styles.fleetName}>{row.name}</div>
              <div className={styles.fleetMeta}>{row.status}</div>
            </div>
            <div className={styles.fleetStats}>
              <span>{row.uptime}</span>
              <span className={styles.fleetTrend}>{row.trend}</span>
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}

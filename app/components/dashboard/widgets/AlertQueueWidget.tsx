"use client";

import styles from "../../../dashboard/home.module.css";

type AlertRow = {
  name: string;
  status: string;
  uptime: string;
  trend: string;
};

type AlertQueueWidgetProps = {
  rows: AlertRow[];
  onRemove: () => void;
  showRemove: boolean;
};

export default function AlertQueueWidget({ rows, onRemove, showRemove }: AlertQueueWidgetProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Alert Queue</div>
          <div className={styles.cardSubtitle}>Priority events in the last hour</div>
        </div>
        <div className={styles.widgetHeaderActions}>
          <button className={styles.cardAction} type="button">
            Review
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

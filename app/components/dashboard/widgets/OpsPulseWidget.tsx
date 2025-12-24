"use client";

import styles from "../../../dashboard/home.module.css";

type OpsPulseWidgetProps = {
  onOpenMap: () => void;
  onRemove: () => void;
  showRemove: boolean;
};

export default function OpsPulseWidget({ onOpenMap, onRemove, showRemove }: OpsPulseWidgetProps) {
  return (
    <article className={`${styles.card} ${styles.mapCard}`}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Operations Pulse</div>
          <div className={styles.cardSubtitle}>Airspace tempo and sector sweep</div>
        </div>
        <div className={styles.widgetHeaderActions}>
          <button className={styles.cardAction} type="button" onClick={onOpenMap}>
            Open Map
          </button>
          {showRemove ? (
            <button className={styles.widgetRemove} type="button" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <div className={styles.mapCanvas}>
        <div className={styles.mapGrid} />
        <div className={styles.mapPulse} />
        <div className={styles.mapMarkers}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.mapFallback}>Live sectors updating</div>
      </div>
    </article>
  );
}

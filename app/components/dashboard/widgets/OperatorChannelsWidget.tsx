"use client";

import styles from "../../../dashboard/home.module.css";

type LiveChannel = {
  name: string;
  location: string;
  signal: string;
};

type OperatorChannelsWidgetProps = {
  channels: LiveChannel[];
  onRemove: () => void;
  showRemove: boolean;
};

export default function OperatorChannelsWidget({
  channels,
  onRemove,
  showRemove,
}: OperatorChannelsWidgetProps) {
  return (
    <article className={`${styles.card} ${styles.liveCard}`}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Operator Channels</div>
          <div className={styles.cardSubtitle}>Active feeds and analytics</div>
        </div>
        <div className={styles.widgetHeaderActions}>
          <button className={styles.cardAction} type="button">
            Manage
          </button>
          {showRemove ? (
            <button className={styles.widgetRemove} type="button" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <div className={styles.liveGrid}>
        {channels.map((channel) => (
          <button key={channel.name} className={styles.liveTile} type="button">
            <div className={styles.liveThumb}>
              <span className={styles.liveSignal}>{channel.signal}</span>
            </div>
            <div className={styles.liveMeta}>
              <div className={styles.liveName}>{channel.name}</div>
              <div className={styles.liveLocation}>{channel.location}</div>
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}

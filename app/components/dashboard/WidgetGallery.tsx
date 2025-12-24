"use client";

import styles from "../../dashboard/home.module.css";

type WidgetDefinition = {
  id: string;
  title: string;
  subtitle: string;
};

type WidgetGalleryProps = {
  widgets: WidgetDefinition[];
  selectedWidgetId: string | null;
  layoutCount: number;
  maxSlots: number;
  onSelect: (id: string) => void;
  onAdd: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (next: boolean) => void;
  showTrigger?: boolean;
  triggerLabel?: string;
};

export default function WidgetGallery({
  widgets,
  selectedWidgetId,
  layoutCount,
  maxSlots,
  onSelect,
  onAdd,
  isOpen,
  onOpenChange,
  showTrigger = true,
  triggerLabel = "Add Widget",
}: WidgetGalleryProps) {
  return (
    <section className={styles.widgetGallery} aria-label="Widget gallery">
      <div className={styles.widgetGalleryHeader}>
        <div />
        <div className={styles.widgetGalleryMeta}>
          Slots: {layoutCount} / {maxSlots}
        </div>
      </div>
      <div className={styles.widgetGalleryActions}>
        {showTrigger ? (
          <button className={styles.widgetActionButton} type="button" onClick={() => onOpenChange(true)}>
            {triggerLabel}
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <button
          className={styles.widgetDrawerBackdrop}
          type="button"
          aria-label="Close widget gallery"
          onClick={() => onOpenChange(false)}
        />
      ) : null}
      <div
        className={`${styles.widgetDrawer} ${isOpen ? styles.widgetDrawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className={styles.widgetDrawerHeader}>
          <div>
            <div className={styles.widgetDrawerTitle}>Widget Gallery</div>
            <div className={styles.widgetDrawerSubtitle}>
              Pick a widget to place into your dashboard.
            </div>
          </div>
          <button className={styles.widgetModalClose} type="button" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
        <div className={styles.widgetList}>
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`${styles.widgetPicker} ${
                selectedWidgetId === widget.id ? styles.widgetPickerActive : ""
              }`}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", widget.id);
                event.dataTransfer.effectAllowed = "copy";
                onSelect(widget.id);
              }}
            >
              <div className={styles.widgetPickerInfo}>
                <div className={styles.widgetPickerTitle}>{widget.title}</div>
                <div className={styles.widgetPickerSubtitle}>{widget.subtitle}</div>
              </div>
              <div className={styles.widgetPickerActions}>
                <button
                  className={styles.widgetActionButton}
                  type="button"
                  onClick={() => onSelect(widget.id)}
                >
                  Select
                </button>
                <button
                  className={styles.widgetActionButton}
                  type="button"
                  onClick={() => onAdd(widget.id)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

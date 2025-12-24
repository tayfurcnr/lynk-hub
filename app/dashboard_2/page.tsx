"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard/home.module.css";
import WidgetGallery from "../components/dashboard/WidgetGallery";
import AlertQueueWidget from "../components/dashboard/widgets/AlertQueueWidget";
import OperatorChannelsWidget from "../components/dashboard/widgets/OperatorChannelsWidget";
import OpsPulseWidget from "../components/dashboard/widgets/OpsPulseWidget";
import TimelineWidget from "../components/dashboard/widgets/TimelineWidget";

type WidgetSlot = string | null;
type WidgetSize = {
  colSpan: number;
  rowSpan: number;
};
type ResizeDirection = "left" | "right" | "top" | "bottom";

const storageKey = "lynkhub_dashboard_2_layout";
const columns = 3;
const rows = 4;
const maxSlots = columns * rows;
const maxColSpan = 3;
const maxRowSpan = 2;

const createDefaultSizes = () =>
  Array.from({ length: maxSlots }, () => ({ colSpan: 1, rowSpan: 1 }));

const clampSpan = (value: number, max: number) => Math.max(1, Math.min(max, value));

const toRowCol = (index: number) => ({
  row: Math.floor(index / columns),
  col: index % columns,
});

const toIndex = (row: number, col: number) => row * columns + col;

export default function DashboardAltPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [layout, setLayout] = useState<WidgetSlot[]>([
    "opsPulse",
    "timeline",
    "alerts",
    "channels",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [sizes, setSizes] = useState<WidgetSize[]>(createDefaultSizes);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [pendingSlotIndex, setPendingSlotIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverWidgetIndex, setDragOverWidgetIndex] = useState<number | null>(null);
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startCol: number;
    startRow: number;
    direction: ResizeDirection;
  } | null>(null);
  const resizeIndexRef = useRef<number | null>(null);

  const getDefaultSize = () => ({ colSpan: 1, rowSpan: 1 });

  const clampSizeToGrid = (size: WidgetSize, index: number) => {
    const { row, col } = toRowCol(index);
    const colSpan = clampSpan(Math.min(size.colSpan, columns - col), maxColSpan);
    const rowSpan = clampSpan(Math.min(size.rowSpan, rows - row), maxRowSpan);
    return { colSpan, rowSpan };
  };

  const buildOccupancy = (slots: WidgetSlot[], slotSizes: WidgetSize[], ignoreIndex?: number) => {
    const occupancy = Array.from({ length: maxSlots }, () => null as number | null);
    slots.forEach((slot, index) => {
      if (slot === null || index === ignoreIndex) {
        return;
      }
      const size = clampSizeToGrid(slotSizes[index] ?? getDefaultSize(), index);
      const { row, col } = toRowCol(index);
      for (let r = 0; r < size.rowSpan; r += 1) {
        for (let c = 0; c < size.colSpan; c += 1) {
          const cellIndex = toIndex(row + r, col + c);
          if (cellIndex < maxSlots && occupancy[cellIndex] === null) {
            occupancy[cellIndex] = index;
          }
        }
      }
    });
    return occupancy;
  };

  const canPlaceAt = (
    index: number,
    size: WidgetSize,
    occupancy: Array<number | null>
  ) => {
    const { row, col } = toRowCol(index);
    if (col + size.colSpan > columns || row + size.rowSpan > rows) {
      return false;
    }
    for (let r = 0; r < size.rowSpan; r += 1) {
      for (let c = 0; c < size.colSpan; c += 1) {
        const cellIndex = toIndex(row + r, col + c);
        if (occupancy[cellIndex] !== null) {
          return false;
        }
      }
    }
    return true;
  };

  const getCellsForSize = (index: number, size: WidgetSize) => {
    const { row, col } = toRowCol(index);
    const cells: number[] = [];
    for (let r = 0; r < size.rowSpan; r += 1) {
      for (let c = 0; c < size.colSpan; c += 1) {
        const cellIndex = toIndex(row + r, col + c);
        if (cellIndex < maxSlots) {
          cells.push(cellIndex);
        }
      }
    }
    return cells;
  };

  const autoScrollOnDrag = (event: DragEvent<HTMLElement>) => {
    if (!isDraggingWidget) {
      return;
    }
    const threshold = 80;
    const scrollStep = 20;
    if (event.clientY < threshold) {
      window.scrollBy({ top: -scrollStep });
    } else if (event.clientY > window.innerHeight - threshold) {
      window.scrollBy({ top: scrollStep });
    }
  };

  const normalizeLayout = (slots: WidgetSlot[], slotSizes: WidgetSize[]) => {
    const nextLayout = [...slots];
    const nextSizes = Array.from({ length: maxSlots }, (_, index) =>
      clampSizeToGrid(slotSizes[index] ?? getDefaultSize(), index)
    );
    const occupancy = Array.from({ length: maxSlots }, () => null as number | null);

    nextLayout.forEach((slot, index) => {
      if (slot === null) {
        nextSizes[index] = getDefaultSize();
        return;
      }
      const size = nextSizes[index];
      if (!canPlaceAt(index, size, occupancy)) {
        nextLayout[index] = null;
        nextSizes[index] = getDefaultSize();
        return;
      }
      const { row, col } = toRowCol(index);
      for (let r = 0; r < size.rowSpan; r += 1) {
        for (let c = 0; c < size.colSpan; c += 1) {
          const cellIndex = toIndex(row + r, col + c);
          if (cellIndex < maxSlots) {
            occupancy[cellIndex] = index;
          }
        }
      }
    });

    return { layout: nextLayout, sizes: nextSizes };
  };

  const isLayoutValid = (slots: WidgetSlot[], slotSizes: WidgetSize[]) => {
    const occupancy = Array.from({ length: maxSlots }, () => null as number | null);
    for (let index = 0; index < slots.length; index += 1) {
      const slot = slots[index];
      if (!slot) {
        continue;
      }
      const size = clampSizeToGrid(slotSizes[index] ?? getDefaultSize(), index);
      if (!canPlaceAt(index, size, occupancy)) {
        return false;
      }
      const { row, col } = toRowCol(index);
      for (let r = 0; r < size.rowSpan; r += 1) {
        for (let c = 0; c < size.colSpan; c += 1) {
          const cellIndex = toIndex(row + r, col + c);
          if (cellIndex < maxSlots) {
            occupancy[cellIndex] = index;
          }
        }
      }
    }
    return true;
  };

  const updateLayoutState = (nextLayout: WidgetSlot[], nextSizes: WidgetSize[]) => {
    const normalizedSizes = nextLayout.map((slot, index) =>
      slot ? clampSizeToGrid(nextSizes[index] ?? getDefaultSize(), index) : getDefaultSize()
    );
    if (!isLayoutValid(nextLayout, normalizedSizes)) {
      return false;
    }
    setLayout(nextLayout);
    setSizes(normalizedSizes);
    return true;
  };

  const metrics = [
    { label: "Fleet Ready", value: "46 / 52" },
    { label: "Open Incidents", value: "2" },
    { label: "Coverage Radius", value: "18 km" },
    { label: "Avg Battery", value: "84%" },
    { label: "Wind Window", value: "12 min" },
    { label: "ETA Sync", value: "97%" },
  ];

  const timelineRows = [
    { name: "Launch Window", status: "T-00:18", uptime: "On Track", trend: "Phase 2" },
    { name: "Sector 9 Sweep", status: "T-00:42", uptime: "Scheduled", trend: "North Grid" },
    { name: "Pipeline Patrol", status: "T-01:05", uptime: "Queued", trend: "Line 7" },
  ];

  const alertRows = [
    { name: "LYNX-021", status: "Comms Drop", uptime: "2 min ago", trend: "Recovering" },
    { name: "LYNX-009", status: "Thermal Spike", uptime: "6 min ago", trend: "Watch" },
    { name: "LYNX-016", status: "Route Drift", uptime: "9 min ago", trend: "Stable" },
    { name: "LYNX-004", status: "Geo Fence", uptime: "11 min ago", trend: "Cleared" },
  ];

  const liveChannels = [
    { name: "Ops Watch", location: "Command Deck", signal: "LIVE" },
    { name: "Weather Cell", location: "Gulf Line", signal: "TRACK" },
    { name: "Traffic AI", location: "Lane 4", signal: "ANALYTICS" },
    { name: "Comms Relay", location: "East Ridge", signal: "SYNC" },
  ];

  const widgetCatalog = useMemo(
    () => [
      {
        id: "opsPulse",
        title: "Operations Pulse",
        subtitle: "Airspace tempo and sector sweep",
      },
      {
        id: "timeline",
        title: "Mission Timeline",
        subtitle: "Next sequence blocks",
      },
      {
        id: "alerts",
        title: "Alert Queue",
        subtitle: "Priority events in the last hour",
      },
      {
        id: "channels",
        title: "Operator Channels",
        subtitle: "Active feeds and analytics",
      },
    ],
    []
  );

  const widgetIds = useMemo(() => new Set(widgetCatalog.map((widget) => widget.id)), [widgetCatalog]);
  const occupancy = useMemo(() => buildOccupancy(layout, sizes), [layout, sizes]);
  const emptySlots = useMemo(
    () => occupancy.filter((cell) => cell === null).length,
    [occupancy]
  );
  const filledSlots = maxSlots - emptySlots;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const rawSlots = Array.isArray(parsed) ? parsed : parsed?.slots;
        const rawSizes = !Array.isArray(parsed) ? parsed?.sizes : null;
        if (Array.isArray(rawSlots)) {
          const nextLayout = rawSlots
            .slice(0, maxSlots)
            .map((slot) => (typeof slot === "string" && widgetIds.has(slot) ? slot : null));
          while (nextLayout.length < maxSlots) {
            nextLayout.push(null);
          }
          const nextSizes = Array.isArray(rawSizes)
            ? rawSizes.slice(0, maxSlots).map((size) => ({
                colSpan: typeof size?.colSpan === "number" ? size.colSpan : 1,
                rowSpan: typeof size?.rowSpan === "number" ? size.rowSpan : 1,
              }))
            : createDefaultSizes();
          while (nextSizes.length < maxSlots) {
            nextSizes.push(getDefaultSize());
          }
          const normalized = normalizeLayout(nextLayout, nextSizes);
          setLayout(normalized.layout);
          setSizes(normalized.sizes);
        }
      } catch {
        // Ignore invalid storage payload.
      }
    }
    setIsHydrated(true);
  }, [widgetIds]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify({ slots: layout, sizes }));
  }, [isHydrated, layout, sizes]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      router.push("/login");
    }
  };

  const placeWidgetAt = (index: number, id: string) => {
    const size = clampSizeToGrid(sizes[index] ?? getDefaultSize(), index);
    const occupancy = buildOccupancy(layout, sizes, index);
    if (!canPlaceAt(index, size, occupancy)) {
      return false;
    }
    const nextLayout = layout.map((slot, slotIndex) =>
      slotIndex === index ? id : slot
    );
    return updateLayoutState(nextLayout, sizes);
  };

  const handleEmptySlotClick = (index: number) => {
    if (!isEditMode) {
      return;
    }
    setPendingSlotIndex(index);
    setIsGalleryOpen(true);
  };

  const handleDropOnSlot = (index: number, event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOverIndex(null);
    setDragOverWidgetIndex(null);
    setIsDraggingWidget(false);
    const dragPayload = event.dataTransfer.getData("application/x-lynk-widget");
    if (dragPayload) {
      try {
        const parsed = JSON.parse(dragPayload) as { index?: number; id?: string };
        if (typeof parsed.index === "number" && parsed.id) {
          const sourceIndex = parsed.index;
          if (sourceIndex === index) {
            return;
          }
          const moved = moveWidgetToIndex(sourceIndex, index);
          if (!moved) {
            return;
          }
          return;
        }
      } catch {
        // Ignore invalid drag payload.
      }
    }

    const id = event.dataTransfer.getData("text/plain");
    if (!widgetIds.has(id)) {
      setDragOverIndex(null);
      return;
    }
    const size = clampSizeToGrid(sizes[index] ?? getDefaultSize(), index);
    const occupancy = buildOccupancy(layout, sizes, index);
    if (!canPlaceAt(index, size, occupancy)) {
      setDragOverIndex(null);
      return;
    }
    const nextLayout = layout.map((slot, slotIndex) =>
      slotIndex === index ? id : slot
    );
    updateLayoutState(nextLayout, sizes);
    setSelectedWidgetId(id);
  };

  const handleAddToFirstEmpty = (id: string) => {
    const occupancy = buildOccupancy(layout, sizes);
    const emptyIndex = layout.findIndex((slot, index) => slot === null && occupancy[index] === null);
    if (emptyIndex === -1) {
      return;
    }
    const size = clampSizeToGrid(sizes[emptyIndex] ?? getDefaultSize(), emptyIndex);
    if (!canPlaceAt(emptyIndex, size, occupancy)) {
      return;
    }
    const nextLayout = layout.map((slot, slotIndex) =>
      slotIndex === emptyIndex ? id : slot
    );
    updateLayoutState(nextLayout, sizes);
  };

  const handleGallerySelect = (id: string) => {
    if (pendingSlotIndex !== null) {
      const placed = placeWidgetAt(pendingSlotIndex, id);
      if (placed) {
        setIsGalleryOpen(false);
        setPendingSlotIndex(null);
      }
      return;
    }
    setSelectedWidgetId(id);
  };

  const handleGalleryAdd = (id: string) => {
    if (pendingSlotIndex !== null) {
      const placed = placeWidgetAt(pendingSlotIndex, id);
      if (placed) {
        setIsGalleryOpen(false);
        setPendingSlotIndex(null);
      }
      return;
    }
    handleAddToFirstEmpty(id);
  };

  const handleWidgetSwap = (targetIndex: number, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverWidgetIndex(null);
    setIsDraggingWidget(false);
    const dragPayload = event.dataTransfer.getData("application/x-lynk-widget");
    if (!dragPayload) {
      return;
    }
    try {
      const parsed = JSON.parse(dragPayload) as { index?: number; id?: string };
      if (typeof parsed.index !== "number" || !parsed.id) {
        return;
      }
      const sourceIndex = parsed.index;
      if (sourceIndex === targetIndex) {
        return;
      }
      moveWidgetToIndex(sourceIndex, targetIndex);
    } catch {
      // Ignore invalid drag payload.
    }
  };

  const moveWidgetToIndex = (sourceIndex: number, targetIndex: number) => {
    const widgetId = layout[sourceIndex];
    if (!widgetId) {
      return false;
    }
    if (sourceIndex === targetIndex) {
      return true;
    }
    const sourceSize = clampSizeToGrid(sizes[sourceIndex] ?? getDefaultSize(), sourceIndex);
    const occupancy = buildOccupancy(layout, sizes, sourceIndex);
    const targetSize = clampSizeToGrid(sourceSize, targetIndex);

    if (canPlaceAt(targetIndex, targetSize, occupancy)) {
      const nextLayout = layout.map((slot, slotIndex) => {
        if (slotIndex === sourceIndex) {
          return null;
        }
        if (slotIndex === targetIndex) {
          return widgetId;
        }
        return slot;
      });
      const nextSizes = sizes.map((size, slotIndex) => {
        if (slotIndex === sourceIndex) {
          return getDefaultSize();
        }
        if (slotIndex === targetIndex) {
          return targetSize;
        }
        return size;
      });
      return updateLayoutState(nextLayout, nextSizes);
    }

    const cells = getCellsForSize(targetIndex, targetSize);
    const overlappingAnchors = new Set<number>();
    cells.forEach((cell) => {
      const anchor = occupancy[cell];
      if (anchor !== null) {
        overlappingAnchors.add(anchor);
      }
    });
    overlappingAnchors.delete(sourceIndex);
    if (overlappingAnchors.size === 0) {
      return false;
    }

    const displaced = Array.from(overlappingAnchors).sort((a, b) => a - b);
    const displacedWidgets = displaced.map((index) => ({
      index,
      id: layout[index] as string,
      size: clampSizeToGrid(sizes[index] ?? getDefaultSize(), index),
    }));

    const nextLayout = layout.map((slot, slotIndex) =>
      slotIndex === sourceIndex || overlappingAnchors.has(slotIndex) ? null : slot
    );
    const nextSizes = sizes.map((size, slotIndex) =>
      slotIndex === sourceIndex || overlappingAnchors.has(slotIndex) ? getDefaultSize() : size
    );

    const nextOccupancy = buildOccupancy(nextLayout, nextSizes);
    if (!canPlaceAt(targetIndex, targetSize, nextOccupancy)) {
      return false;
    }
    nextLayout[targetIndex] = widgetId;
    nextSizes[targetIndex] = targetSize;

    for (const displacedWidget of displacedWidgets) {
      const placementStart = sourceIndex;
      let placed = false;
      for (let offset = 0; offset < maxSlots; offset += 1) {
        const candidateIndex = (placementStart + offset) % maxSlots;
        if (nextLayout[candidateIndex] !== null) {
          continue;
        }
        const sizeCandidate = clampSizeToGrid(displacedWidget.size, candidateIndex);
        const occupancyCheck = buildOccupancy(nextLayout, nextSizes);
        if (!canPlaceAt(candidateIndex, sizeCandidate, occupancyCheck)) {
          continue;
        }
        nextLayout[candidateIndex] = displacedWidget.id;
        nextSizes[candidateIndex] = sizeCandidate;
        placed = true;
        break;
      }
      if (!placed) {
        return false;
      }
    }

    return updateLayoutState(nextLayout, nextSizes);
  };

  const handleRemoveWidget = (index: number) => {
    const nextLayout = layout.map((slot, slotIndex) => (slotIndex === index ? null : slot));
    const nextSizes = sizes.map((size, sizeIndex) =>
      sizeIndex === index ? getDefaultSize() : size
    );
    updateLayoutState(nextLayout, nextSizes);
  };

  const handleResizeStart = (
    index: number,
    direction: ResizeDirection,
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const size = sizes[index] ?? { colSpan: 1, rowSpan: 1 };
    resizeStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startCol: size.colSpan,
      startRow: size.rowSpan,
      direction,
    };
    setResizingIndex(index);
    resizeIndexRef.current = index;
  };

  useEffect(() => {
    if (resizingIndex === null) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const start = resizeStartRef.current;
      if (!start) {
        return;
      }
      const activeIndex = resizeIndexRef.current;
      if (activeIndex === null) {
        return;
      }
      const isHorizontal = start.direction === "left" || start.direction === "right";
      const delta = isHorizontal
        ? event.clientX - start.startX
        : event.clientY - start.startY;
      if (Math.abs(delta) < 120) {
        return;
      }
      const step = delta > 0 ? 1 : -1;
      const effectiveStep =
        start.direction === "left" || start.direction === "top" ? -step : step;
      const size = sizes[activeIndex] ?? getDefaultSize();
      const occupancy = buildOccupancy(layout, sizes, activeIndex);

      if (start.direction === "left") {
        const { row, col } = toRowCol(activeIndex);
        const rightEdge = col + size.colSpan - 1;
        const nextColSpan = clampSpan(size.colSpan + effectiveStep, maxColSpan);
        const nextLeftCol = rightEdge - (nextColSpan - 1);
        if (nextLeftCol < 0) {
          return;
        }
        const nextIndex = toIndex(row, nextLeftCol);
        const sizeCandidate = clampSizeToGrid(
          { colSpan: nextColSpan, rowSpan: size.rowSpan },
          nextIndex
        );
        if (!canPlaceAt(nextIndex, sizeCandidate, occupancy)) {
          return;
        }
        const widgetId = layout[activeIndex];
        if (!widgetId) {
          return;
        }
        const nextLayout = layout.map((slot, slotIndex) => {
          if (slotIndex === activeIndex) {
            return null;
          }
          if (slotIndex === nextIndex) {
            return widgetId;
          }
          return slot;
        });
        const nextSizes = sizes.map((slotSize, slotIndex) => {
          if (slotIndex === activeIndex) {
            return getDefaultSize();
          }
          if (slotIndex === nextIndex) {
            return sizeCandidate;
          }
          return slotSize;
        });
        updateLayoutState(nextLayout, nextSizes);
        resizeIndexRef.current = nextIndex;
        setResizingIndex(nextIndex);
        resizeStartRef.current = {
          ...start,
          startX: event.clientX,
        };
        return;
      }

      if (start.direction === "top") {
        const { row, col } = toRowCol(activeIndex);
        const bottomEdge = row + size.rowSpan - 1;
        const nextRowSpan = clampSpan(size.rowSpan + effectiveStep, maxRowSpan);
        const nextTopRow = bottomEdge - (nextRowSpan - 1);
        if (nextTopRow < 0) {
          return;
        }
        const nextIndex = toIndex(nextTopRow, col);
        const sizeCandidate = clampSizeToGrid(
          { colSpan: size.colSpan, rowSpan: nextRowSpan },
          nextIndex
        );
        if (!canPlaceAt(nextIndex, sizeCandidate, occupancy)) {
          return;
        }
        const widgetId = layout[activeIndex];
        if (!widgetId) {
          return;
        }
        const nextLayout = layout.map((slot, slotIndex) => {
          if (slotIndex === activeIndex) {
            return null;
          }
          if (slotIndex === nextIndex) {
            return widgetId;
          }
          return slot;
        });
        const nextSizes = sizes.map((slotSize, slotIndex) => {
          if (slotIndex === activeIndex) {
            return getDefaultSize();
          }
          if (slotIndex === nextIndex) {
            return sizeCandidate;
          }
          return slotSize;
        });
        updateLayoutState(nextLayout, nextSizes);
        resizeIndexRef.current = nextIndex;
        setResizingIndex(nextIndex);
        resizeStartRef.current = {
          ...start,
          startY: event.clientY,
        };
        return;
      }

      const nextColSpan = clampSpan(size.colSpan + (isHorizontal ? effectiveStep : 0), maxColSpan);
      const nextRowSpan = clampSpan(size.rowSpan + (isHorizontal ? 0 : effectiveStep), maxRowSpan);
      const sizeCandidate = clampSizeToGrid(
        { colSpan: nextColSpan, rowSpan: nextRowSpan },
        activeIndex
      );
      if (!canPlaceAt(activeIndex, sizeCandidate, occupancy)) {
        return;
      }
      const nextSizes = sizes.map((slotSize, slotIndex) =>
        slotIndex === activeIndex ? sizeCandidate : slotSize
      );
      updateLayoutState(layout, nextSizes);
      resizeStartRef.current = {
        ...start,
        startX: isHorizontal ? event.clientX : start.startX,
        startY: isHorizontal ? start.startY : event.clientY,
      };
    };

    const handleMouseUp = () => {
      setResizingIndex(null);
      resizeStartRef.current = null;
      resizeIndexRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingIndex]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setIsEditMode(false);
      setIsGalleryOpen(false);
      setPendingSlotIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditMode]);

  const renderWidget = (id: string, index: number) => {
    switch (id) {
      case "opsPulse":
        return (
          <OpsPulseWidget
            onOpenMap={() => router.push("/map")}
            onRemove={() => handleRemoveWidget(index)}
            showRemove={isEditMode}
          />
        );
      case "timeline":
        return (
          <TimelineWidget
            rows={timelineRows}
            onRemove={() => handleRemoveWidget(index)}
            showRemove={isEditMode}
          />
        );
      case "alerts":
        return (
          <AlertQueueWidget
            rows={alertRows}
            onRemove={() => handleRemoveWidget(index)}
            showRemove={isEditMode}
          />
        );
      case "channels":
        return (
          <OperatorChannelsWidget
            channels={liveChannels}
            onRemove={() => handleRemoveWidget(index)}
            showRemove={isEditMode}
          />
        );
      default:
        return null;
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

        <section className={styles.metricsBar}>
          {metrics.map((metric) => (
            <button key={metric.label} className={styles.metricCard} type="button">
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
            </button>
          ))}
        </section>

        <div className={styles.dashboardEditBar}>
          <div className={styles.dashboardEditActions}>
            {isEditMode ? (
              <button
                className={styles.dashboardEditButton}
                type="button"
                onClick={() => setIsGalleryOpen(true)}
              >
                Add Widget
              </button>
            ) : null}
            <button
              className={styles.dashboardEditButton}
              type="button"
              onClick={() => {
                setIsEditMode((prev) => {
                  const next = !prev;
                  if (!next) {
                    setIsGalleryOpen(false);
                  }
                  return next;
                });
              }}
            >
              {isEditMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className={styles.dashboardEditControls}>
          {isEditMode ? (
            <WidgetGallery
              widgets={widgetCatalog}
              selectedWidgetId={selectedWidgetId}
              layoutCount={filledSlots}
              maxSlots={maxSlots}
              onSelect={handleGallerySelect}
              onAdd={handleGalleryAdd}
              isOpen={isGalleryOpen}
              onOpenChange={(next) => {
                setIsGalleryOpen(next);
                if (!next) {
                  setPendingSlotIndex(null);
                }
              }}
              showTrigger={false}
            />
          ) : null}
        </div>

        <section className={styles.widgetGrid} aria-label="Dashboard layout">
          {Array.from({ length: maxSlots }, (_, index) => {
            const anchorIndex = occupancy[index];
            if (anchorIndex !== null && anchorIndex !== index) {
              return null;
            }
            const slot = layout[index];
            const size = sizes[index] ?? getDefaultSize();
            if (slot) {
              return (
                <div
                  key={`${slot}-${index}`}
                  className={`${styles.widgetFrame} ${
                    dragOverWidgetIndex === index ? styles.widgetFrameHighlight : ""
                  }`}
                  style={{
                    gridColumn: `span ${size.colSpan}`,
                    gridRow: `span ${size.rowSpan}`,
                  }}
                  draggable={isEditMode}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "application/x-lynk-widget",
                      JSON.stringify({ index, id: slot })
                    );
                    event.dataTransfer.effectAllowed = "move";
                    setIsDraggingWidget(true);
                  }}
                  onDragEnd={() => {
                    setIsDraggingWidget(false);
                    setDragOverWidgetIndex(null);
                  }}
                  onDragOver={(event) => {
                    if (!isEditMode) {
                      return;
                    }
                    event.preventDefault();
                    autoScrollOnDrag(event);
                    setDragOverWidgetIndex(index);
                  }}
                  onDragLeave={() => setDragOverWidgetIndex(null)}
                  onDrop={(event) => handleWidgetSwap(index, event)}
                >
                  {renderWidget(slot, index)}
                  {isEditMode ? (
                    <>
                      <button
                        className={styles.widgetResizeHandleLeft}
                        type="button"
                        aria-label="Resize widget from left"
                        onMouseDown={(event) => handleResizeStart(index, "left", event)}
                      />
                      <button
                        className={styles.widgetResizeHandleRight}
                        type="button"
                        aria-label="Resize widget from right"
                        onMouseDown={(event) => handleResizeStart(index, "right", event)}
                      />
                      <button
                        className={styles.widgetResizeHandleTop}
                        type="button"
                        aria-label="Resize widget from top"
                        onMouseDown={(event) => handleResizeStart(index, "top", event)}
                      />
                      <button
                        className={styles.widgetResizeHandleBottom}
                        type="button"
                        aria-label="Resize widget from bottom"
                        onMouseDown={(event) => handleResizeStart(index, "bottom", event)}
                      />
                    </>
                  ) : null}
                </div>
              );
            }

            if (!isEditMode) {
              return null;
            }

            if (occupancy[index] !== null) {
              return null;
            }

            return (
              <button
                key={`empty-${index}`}
                className={`${styles.widgetSlotEmpty} ${
                  dragOverIndex === index ? styles.widgetSlotEmptyActive : ""
                }`}
                type="button"
                onClick={() => handleEmptySlotClick(index)}
                onDragOver={(event) => {
                  event.preventDefault();
                  autoScrollOnDrag(event);
                  setDragOverIndex(index);
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(event) => handleDropOnSlot(index, event)}
                onDragEnd={() => {
                  setDragOverIndex(null);
                  setIsDraggingWidget(false);
                }}
              >
                <div className={styles.widgetSlotTitle}>Empty Slot</div>
                <div className={styles.widgetSlotSubtitle}>
                  {selectedWidgetId
                    ? `Place "${widgetCatalog.find((w) => w.id === selectedWidgetId)?.title}"`
                    : "Select a widget to place"}
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}

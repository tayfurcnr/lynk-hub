module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/CanvasScene.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CanvasScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const createStars = (count)=>Array.from({
        length: count
    }, ()=>({
            x: Math.random(),
            y: Math.random(),
            r: 0.6 + Math.random() * 1.4,
            a: 0.25 + Math.random() * 0.55,
            dir: Math.random() > 0.5 ? 1 : -1,
            tw: 0.003 + Math.random() * 0.006
        }));
const createDrones = ()=>[
        {
            baseX: 0.72,
            baseY: 0.22,
            ampX: 0.06,
            ampY: 0.03,
            size: 0.12,
            phase: 0.4
        },
        {
            baseX: 0.28,
            baseY: 0.62,
            ampX: 0.05,
            ampY: 0.04,
            size: 0.1,
            phase: 2.1
        }
    ];
const drawRoundedRect = (ctx, x, y, w, h, r)=>{
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};
function CanvasScene({ className }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const stars = createStars(120);
        const drones = createDrones();
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let rafId = 0;
        let width = 0;
        let height = 0;
        let lastTime = 0;
        const resize = ()=>{
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, rect.width);
            height = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const drawStars = ()=>{
            for (const star of stars){
                ctx.fillStyle = `rgba(125, 211, 252, ${star.a})`;
                ctx.beginPath();
                ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        const drawRadar = (time)=>{
            const radarX = width * 0.16;
            const radarY = height * 0.78;
            const radius = Math.min(width, height) * 0.26;
            ctx.save();
            ctx.translate(radarX, radarY);
            ctx.strokeStyle = "rgba(59, 130, 246, 0.18)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.66, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-radius, 0);
            ctx.lineTo(radius, 0);
            ctx.moveTo(0, -radius);
            ctx.lineTo(0, radius);
            ctx.stroke();
            const sweepAngle = time * 0.0004;
            ctx.rotate(sweepAngle);
            const sweep = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            sweep.addColorStop(0, "rgba(56, 189, 248, 0.22)");
            sweep.addColorStop(0.7, "rgba(56, 189, 248, 0.08)");
            sweep.addColorStop(1, "rgba(56, 189, 248, 0)");
            ctx.fillStyle = sweep;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, -0.35, 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
        const drawDrone = (drone, time)=>{
            const driftX = Math.sin(time * 0.00022 + drone.phase) * drone.ampX;
            const driftY = Math.cos(time * 0.00018 + drone.phase) * drone.ampY;
            const centerX = (drone.baseX + driftX) * width;
            const centerY = (drone.baseY + driftY) * height;
            const bodyWidth = width * drone.size;
            const bodyHeight = bodyWidth * 0.42;
            const x = centerX - bodyWidth / 2;
            const y = centerY - bodyHeight / 2;
            ctx.save();
            ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
            ctx.shadowBlur = 18;
            ctx.fillStyle = "rgba(14, 20, 36, 0.85)";
            ctx.strokeStyle = "rgba(125, 177, 255, 0.35)";
            ctx.lineWidth = 1;
            drawRoundedRect(ctx, x, y, bodyWidth, bodyHeight, bodyHeight / 2);
            ctx.fill();
            ctx.stroke();
            const rotorRadius = bodyHeight * 0.28;
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "rgba(125, 177, 255, 0.45)";
            ctx.beginPath();
            ctx.arc(x - rotorRadius * 0.2, centerY, rotorRadius, 0, Math.PI * 2);
            ctx.arc(x + bodyWidth + rotorRadius * 0.2, centerY, rotorRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(125, 211, 252, 0.9)";
            ctx.shadowColor = "rgba(125, 211, 252, 0.8)";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(centerX, centerY, bodyHeight * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };
        const render = (time)=>{
            if (prefersReduced.matches && time !== 0) return;
            if (!lastTime) lastTime = time;
            const delta = time - lastTime;
            lastTime = time;
            ctx.clearRect(0, 0, width, height);
            drawStars();
            drawRadar(time);
            drones.forEach((drone)=>drawDrone(drone, time));
            if (!prefersReduced.matches) {
                for (const star of stars){
                    star.a += star.dir * star.tw * delta * 0.06;
                    if (star.a > 0.85 || star.a < 0.2) {
                        star.dir *= -1;
                    }
                }
                rafId = window.requestAnimationFrame(render);
            }
        };
        resize();
        render(0);
        if (!prefersReduced.matches) {
            rafId = window.requestAnimationFrame(render);
        }
        window.addEventListener("resize", resize);
        return ()=>{
            window.removeEventListener("resize", resize);
            window.cancelAnimationFrame(rafId);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: className,
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/app/components/CanvasScene.tsx",
        lineNumber: 211,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c850f3c3._.js.map
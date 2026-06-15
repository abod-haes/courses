export function LoadingMotionStyles() {
  return (
    <style>{`
      @keyframes medicalBlob {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(18px, -16px, 0) scale(1.08); }
      }

      @keyframes medicalBlobReverse {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1.04); }
        50% { transform: translate3d(-18px, 18px, 0) scale(0.96); }
      }

      @keyframes medicalFloat {
        0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        50% { transform: translate3d(0, -16px, 0) rotate(2deg); }
      }

      @keyframes loaderEnter {
        from { opacity: 0; transform: translateY(16px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes loaderHeartbeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.12); }
        30% { transform: scale(0.96); }
        45% { transform: scale(1.08); }
        60% { transform: scale(1); }
      }

      @keyframes loaderMessage {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes loaderDot {
        0%, 80%, 100% { opacity: 0.35; transform: translateY(0) scale(0.88); }
        40% { opacity: 1; transform: translateY(-4px) scale(1); }
      }

      @keyframes medicalEcgDash {
        from { stroke-dashoffset: 420; }
        to { stroke-dashoffset: -420; }
      }

      @keyframes loadingShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      @keyframes skeletonCard {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes routeProgressFill {
        0% { transform: translateX(-70%) scaleX(0.32); }
        48% { transform: translateX(-18%) scaleX(0.72); }
        100% { transform: translateX(105%) scaleX(0.34); }
      }

      .animate-medical-blob { animation: medicalBlob 8s ease-in-out infinite; }
      .animate-medical-blob-reverse { animation: medicalBlobReverse 9s ease-in-out infinite; }
      .animate-medical-float { animation: medicalFloat 4.8s ease-in-out infinite; }
      .animate-loader-enter { animation: loaderEnter 520ms ease-out both; }
      .animate-loader-heartbeat { animation: loaderHeartbeat 1.6s ease-in-out infinite; }
      .animate-loader-message { animation: loaderMessage 360ms ease-out both; }
      .animate-loader-dot { animation: loaderDot 1.1s ease-in-out infinite; }
      .medical-ecg-path { stroke-dasharray: 160 260; animation: medicalEcgDash 1.8s linear infinite; }
      .animate-skeleton-card { animation: skeletonCard 420ms ease-out both; }
      .route-progress-fill { width: 70%; transform-origin: left center; animation: routeProgressFill 1.1s ease-in-out infinite; }
      .loading-shimmer {
        background-image: linear-gradient(110deg, rgba(148, 163, 184, 0.12) 0%, rgba(29, 23, 213, 0.14) 18%, rgba(148, 163, 184, 0.12) 36%);
        background-size: 220% 100%;
        animation: loadingShimmer 1.5s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-medical-blob,
        .animate-medical-blob-reverse,
        .animate-medical-float,
        .animate-loader-enter,
        .animate-loader-heartbeat,
        .animate-loader-message,
        .animate-loader-dot,
        .medical-ecg-path,
        .animate-skeleton-card,
        .route-progress-fill,
        .loading-shimmer {
          animation: none !important;
        }
      }
    `}</style>
  );
}

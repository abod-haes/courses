import { CatalogPageSkeleton } from "@/shared/components/loading/catalog-page-skeleton.component";
import { LoadingMotionStyles } from "@/shared/components/loading/loading-motion-styles.component";

export default function Loading() {
  return (
    <>
      <LoadingMotionStyles />
      <CatalogPageSkeleton />
    </>
  );
}

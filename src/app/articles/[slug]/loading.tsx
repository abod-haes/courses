import { DetailsPageSkeleton } from "@/shared/components/loading/details-page-skeleton.component";
import { LoadingMotionStyles } from "@/shared/components/loading/loading-motion-styles.component";

export default function Loading() {
  return (
    <>
      <LoadingMotionStyles />
      <DetailsPageSkeleton />
    </>
  );
}

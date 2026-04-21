interface LoadingSkeletonProps {
 count?: number;
}
export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
    return (
        <div className="loading-skeleton">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-item">
                <div className="skeleton-line" />
                </div>
            ))}
        </div>
    );
}
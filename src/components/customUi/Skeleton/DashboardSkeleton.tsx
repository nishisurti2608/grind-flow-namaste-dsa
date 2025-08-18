import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Skeleton */}
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto md:px-6 md:py-8 p-4">
                {/* Stats Row Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-40">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                            <Skeleton className="h-10 w-3/4 mb-2" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ))}
                </div>

                <div className="lg:grid grid-cols-4 gap-8">
                    {/* Sidebar Skeleton */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <Skeleton className="h-8 w-full mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">
                            {/* View Mode Toggle Skeleton */}
                            <div className="flex justify-between items-center mb-6">
                                <Skeleton className="h-8 w-48" />
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-9 w-20 rounded-md" />
                                    ))}
                                </div>
                            </div>

                            {/* Calendar/Chart Area Skeleton */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>

                                {/* Heatmap Skeleton */}
                                <div className="grid grid-cols-7 gap-1 mt-6">
                                    {Array.from({ length: 7 * 5 }).map((_, i) => (
                                        <Skeleton key={i} className="aspect-square rounded-sm" />
                                    ))}
                                </div>

                                {/* Legend Skeleton */}
                                <div className="flex justify-end items-center space-x-2 mt-4">
                                    <Skeleton className="h-4 w-16" />
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="border-t border-gray-200 bg-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-4 w-48 mx-auto" />
                </div>
            </div>
        </div>
    );
};

export default DashboardLoadingSkeleton;
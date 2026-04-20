//✅ Server Component — solo renderiza HTML
export default function TasksLoading() {
 return (
    <div>
        <div className="h-8 w-48 rounded bg-gray-200 animatepulse mb-6" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-lg border bordergray-200 p-4">
                    <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse mb-3" />
                </div>
            ))}
        </div>
    </div>
 );
}

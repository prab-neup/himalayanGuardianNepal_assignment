/**
 * Loading spinner — shown while React Query is fetching data.
 * The 500ms delay from MockAdapter means users will actually see this.
 */
export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

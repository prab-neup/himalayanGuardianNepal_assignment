/**
 * EmptyState — shown when a list/table has no data.
 * Example: "No tickets found" when an org has zero tickets.
 */
interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-1">{title}</h3>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
}

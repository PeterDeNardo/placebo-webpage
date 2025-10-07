interface EmptyStateProps {
  message?: string;
  description?: string;
  type?: 'empty' | 'error';
  onRetry?: () => void;
}

export default function EmptyState({ 
  message = "No products found", 
  description = "We couldn't find any products to display at the moment.",
  type = 'empty',
  onRetry
}: EmptyStateProps) {
  const isError = type === 'error';
  
  return (
    <div className="w-full px-4 md:px-8 py-16">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center ${
          isError ? 'bg-red-100' : 'bg-muted'
        }`}>
          {isError ? (
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          ) : (
            <svg 
              className="w-10 h-10 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}


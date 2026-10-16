import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * @returns Error boundary wrapper for the app.
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: 'Something went wrong. Please refresh the page.',
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
      message: 'Something went wrong. Please refresh the page.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env && import.meta.env.DEV) {
      console.error('UI error:', error, info);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-hacker-dark text-electric-lime flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-electric-lime/30 bg-black/60 p-6 font-mono">
            <h1 className="text-lg mb-2">System Error</h1>
            <p className="text-sm text-lime-300 mb-4">{this.state.message}</p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-electric-lime/20 border border-lime-700 text-lime-300 hover:bg-electric-lime/40 hover:text-white transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

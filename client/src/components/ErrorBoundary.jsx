import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error boundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 surface-base">
          <div className="surface-card border border-theme rounded-xl p-6 max-w-md w-full text-center">
            <h1 className="text-lg font-semibold text-heading mb-2">Something went wrong</h1>
            <p className="text-sm text-hint mb-4">Please refresh the page and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

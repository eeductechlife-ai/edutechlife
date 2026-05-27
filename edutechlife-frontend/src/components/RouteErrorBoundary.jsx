import React, { Component } from 'react';

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[RouteErrorBoundary:${this.props.route || 'unknown'}]`, error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {this.props.title || 'Algo salió mal'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {this.props.message || 'Ocurrió un error al cargar esta página. Puedes intentar de nuevo.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-petroleum to-corporate text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Recargar página
              </button>
            </div>
            {this.state.error && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left">
                <details className="text-xs">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2 font-medium">
                    Detalles del error
                  </summary>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-xs overflow-auto max-h-40 border border-slate-200 dark:border-slate-700">
                    <div className="text-red-600 font-semibold mb-1">
                      {this.state.error.toString()}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                      {this.state.errorInfo?.componentStack}
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;

import React, { Component } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(`[ErrorBoundary:${this.props.name || 'unknown'}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback;

      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="fa-circle-exclamation" className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {this.props.title || 'Sección no disponible'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5 max-w-sm">
            {this.props.message || 'Ocurrió un error al cargar esta sección. Puedes intentar de nuevo.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-petroleum to-corporate rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              Reintentar
            </button>
            {this.props.showReload !== false && (
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Recargar página
              </button>
            )}
          </div>
          {this.props.showDetails && this.state.error && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left w-full max-w-md">
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
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;

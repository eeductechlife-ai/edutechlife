import { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../utils/iconMapping.jsx';
import { withTranslation } from '../../i18n/withTranslation';

class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      remountKey: 0
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
    const t = this.props.t || ((s) => s);
    this.setState((prev) => ({
      hasError: false, error: null, errorInfo: null, remountKey: prev.remountKey + 1
    }));
    if (this.props.onRetry) this.props.onRetry();
  };

  t(key, fallback) {
    return this.props.t ? this.props.t(key) : fallback;
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback;

      return (
        <div role="alert" aria-live="assertive" className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
            <Icon name="fa-circle-exclamation" className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1" id="error-boundary-title">
            {this.props.title || this.t('ialab.error_boundary.title', 'Sección no disponible')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5 max-w-sm" id="error-boundary-message" aria-describedby="error-boundary-title">
            {this.props.message || this.t('ialab.error_boundary.message', 'Ocurrió un error al cargar esta sección. Puedes intentar de nuevo.')}
          </p>
          {this.state.error && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mb-4 max-w-sm font-mono truncate w-full select-all" title="Error details for support">
              {this.state.error.toString().split('\n')[0]}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-petroleum to-corporate rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              {this.t('ialab.error_boundary.retry', 'Reintentar')}
            </button>
            {this.props.showReload !== false && (
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {this.t('ialab.error_boundary.reload', 'Recargar página')}
              </button>
            )}
          </div>
          {this.props.showDetails && this.state.error && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left w-full max-w-md">
              <div className="text-xs">
                <div className="font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2">
                  {this.t('ialab.error_boundary.details', 'Detalles del error')}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg font-mono text-xs overflow-auto max-h-40 border border-slate-200 dark:border-slate-700">
                  <div className="text-red-600 font-semibold mb-1">
                    {this.state.error.toString()}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={this.state.remountKey}>
        {this.props.children}
      </div>
    );
  }
}

SectionErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
  showReload: PropTypes.bool,
  onRetry: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(SectionErrorBoundary);

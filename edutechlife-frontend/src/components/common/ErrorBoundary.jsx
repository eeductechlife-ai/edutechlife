import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      remountKey: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error(
      `[ErrorBoundary${this.props.name ? ":" + this.props.name : ""}]`,
      error,
      errorInfo,
    );
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      remountKey: prev.remountKey + 1,
    }));
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback({
              retry: this.handleRetry,
              error: this.state.error,
            })
          : this.props.fallback;
      }

      const inline = this.props.variant !== "fullscreen";

      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`flex flex-col items-center justify-center ${inline ? "min-h-[200px] p-6" : "min-h-screen p-8 bg-white"}`}
        >
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <h3
            className={`font-bold mb-1 ${inline ? "text-base" : "text-2xl"} text-slate-800 dark:text-slate-100`}
          >
            {this.props.title || "Algo salió mal"}
          </h3>
          <p
            className={`text-slate-500 dark:text-slate-400 text-center mb-5 max-w-sm ${inline ? "text-sm" : ""}`}
          >
            {this.props.message ||
              "Ocurrió un error inesperado. Puedes intentar de nuevo."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#004B63] to-[#0096C7] rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              {this.props.retryText || "Reintentar"}
            </button>
            {this.props.showReload !== false && (
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {this.props.reloadText || "Recargar página"}
              </button>
            )}
          </div>
          {(this.props.showDetails || process.env.NODE_ENV === "development") &&
            this.state.error && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left w-full max-w-md">
                <details className="text-xs">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2 font-semibold">
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

    return <div key={this.state.remountKey}>{this.props.children}</div>;
  }
}

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center min-h-[200px] rounded-2xl bg-slate-50 mx-4 my-8 border border-slate-200">
          <div className="text-center p-8 max-w-lg">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <p className="text-petroleum font-semibold mb-1">Sección temporalmente no disponible</p>
            <p className="text-sm text-slate-500 mb-3">Estamos trabajando en mejorar tu experiencia</p>
            <details className="text-left text-xs text-gray-400 border-t border-gray-200 pt-3">
              <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-red-400">
                {this.state.error?.message}
                {'\n'}
                {this.state.error?.stack?.split('\n').slice(0, 4).join('\n')}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

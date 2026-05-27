import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleRetry() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <span className="inline-flex p-4 bg-red-100 dark:bg-red-950/40 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Algo salió mal</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            Ocurrió un error inesperado en el módulo de evaluación. Tus respuestas anteriores están guardadas.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

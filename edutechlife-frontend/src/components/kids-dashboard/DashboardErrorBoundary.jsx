import { Component } from 'react';
import { motion } from 'framer-motion';

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center p-8 min-h-[300px]"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-[#FF6B9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😅</span>
            </div>
            <h3 className="text-lg font-bold text-[#004B63] mb-2">
              ¡Ups! Algo no salió bien
            </h3>
            <p className="text-sm text-[#64748B] mb-6">
              {this.props.message || 'Tuvimos un problema al cargar esta sección. Puedes intentar de nuevo.'}
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={this.handleRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-semibold text-sm shadow-md"
              >
                Reintentar
              </motion.button>
              <motion.button
                onClick={() => this.props.onTabChange?.('inicio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-[#F8FAFC] text-[#64748B] rounded-xl font-semibold text-sm border border-[#E2E8F0]"
              >
                Ir al inicio
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }
    return this.props.children;
  }
}

export default DashboardErrorBoundary;

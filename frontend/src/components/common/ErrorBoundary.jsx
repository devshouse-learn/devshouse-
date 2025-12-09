import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log al servidor en producción
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring/error-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1> Algo salió mal</h1>
            <p className="error-message">{this.state.error?.toString()}</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Detalles técnicos</summary>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}

            <button 
              onClick={this.handleReset}
              className="error-boundary-button"
            >
               Intentar de nuevo
            </button>

            <button 
              onClick={() => window.location.href = '/'}
              className="error-boundary-button secondary"
            >
               Ir a inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

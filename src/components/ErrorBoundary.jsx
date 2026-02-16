import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-5 font-mono text-sm bg-red-50 min-h-screen text-red-900 overflow-auto">
                    <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
                    <div className="mb-4">
                        <p className="font-bold">Error:</p>
                        <pre className="whitespace-pre-wrap">{this.state.error && this.state.error.toString()}</pre>
                    </div>
                    <div>
                        <p className="font-bold">Stack Component:</p>
                        <pre className="whitespace-pre-wrap text-xs">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg active:bg-red-700"
                    >
                        Reload App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

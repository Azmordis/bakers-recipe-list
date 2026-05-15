import { Component } from 'react';

// Class component required — no functional API for error boundaries yet.
// Catches render errors anywhere in the subtree and shows a plain fallback
// instead of a blank page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 600,
          margin: '80px auto',
          padding: '32px 24px',
          textAlign: 'center',
          fontFamily: 'inherit',
          color: '#2C2C2A',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🍳</div>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#888780', fontSize: 14, marginBottom: 24 }}>
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{
              background: '#0C447C',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service
    console.log("ErrorBoundary caught an error", error, info);
  }

  handleRetry = () => {
    // Reset the error state to attempt a re-render of the component tree
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
          <Button title="Try Again" onPress={this.handleRetry} />
        </View>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  errorMessage: {
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default ErrorBoundary;

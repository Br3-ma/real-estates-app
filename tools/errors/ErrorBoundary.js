import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorInfo: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    console.log("ErrorBoundary caught an error", error, info);
    this.setState({ errorInfo: info.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '', errorInfo: '' });
  };
\
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
          <ScrollView style={styles.errorDetails}>
            <Text style={styles.errorInfo}>
              {this.state.errorInfo.trim() ? this.state.errorInfo : 'No additional information available'}
            </Text>
          </ScrollView>
          
          <Button title="Try Again" onPress={this.handleRetry} />
        </View>
      );
    }
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
  errorDetails: {
    marginVertical: 10,
    maxHeight: 150,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  errorInfo: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default ErrorBoundary;

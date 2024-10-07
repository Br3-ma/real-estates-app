import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider, Button, Input } from '@reactsax/reactsax';

const Theme = ({ children }) => {
  const theme = {
    colors: {
      primary: '#007bff',  
      background: '#ffffff',  
      text: '#333333',  
    },
    fonts: {
      regular: 'Roboto-Regular',
      bold: 'Roboto-Bold', 
    },
    components: { 
      Button,  
      Input,   
    },
    styles: StyleSheet.create({ 
      container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
      },
      input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
      },
      button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    }),
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;

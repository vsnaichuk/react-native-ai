import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.container}>
          <Text>Hello world</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;

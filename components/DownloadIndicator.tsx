import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface DownloadIndicatorProps {
  progress: number;
  visible: boolean;
}

const DownloadIndicator: React.FC<DownloadIndicatorProps> = ({
  progress,
  visible,
}) => {
  if (!visible) return null;

  const formattedProgress = `${Math.round(progress * 100)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={styles.progressText}>Downloading model...</Text>
        <Text style={styles.progressPercent}>{formattedProgress}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
  },
  progressText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  progressPercent: {
    color: '#0070f3',
    marginTop: 6,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DownloadIndicator;

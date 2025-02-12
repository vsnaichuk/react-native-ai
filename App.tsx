import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {GiftedChat, IMessage, User} from 'react-native-gifted-chat';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {generateUniqueId} from './utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

const USER = {_id: 'usr1'};
const AI = {_id: 'ai'};

function App(): React.JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const addMessage = (user: User, text: string) => {
    setMessages(prev => {
      const message: IMessage = {
        _id: generateUniqueId(),
        createdAt: new Date(),
        user,
        text,
      };
      return [message, ...prev];
    });
  };

  const handleSendMessagePress = ([msg]: IMessage[]) => {
    addMessage(USER, msg.text);
  };

  useEffect(() => {
    addMessage(AI, 'Hello developer');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.container}>
          <GiftedChat
            messages={messages}
            onSend={handleSendMessagePress}
            renderAvatar={() => null}
            user={USER}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;

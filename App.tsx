import React, {useEffect, useState} from 'react';
import {Image, StatusBar, StyleSheet} from 'react-native';
import {
  GiftedChat,
  IMessage,
  User,
  Bubble,
  InputToolbar,
  Send,
  Composer,
  BubbleProps,
  InputToolbarProps,
  SendProps,
  ComposerProps,
} from 'react-native-gifted-chat';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {generateUniqueId} from './utils';
import LlamaService from './services/LlamaService';
import {TokenData} from 'llama.rn';

const Colors = {
  black: '#000',
  white: '#fff',
  userBubble: '#0070f3',
  aiBubble: '#333',
  composerBackground: '#333',
  composerBorder: '#444',
  sendIcon: '#999',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  bubble: {
    borderRadius: 15,
    padding: 10,
  },
  userBubble: {
    backgroundColor: Colors.userBubble,
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: Colors.aiBubble,
    borderBottomLeftRadius: 0,
  },
  text: {
    color: Colors.white,
  },
  inputToolbar: {
    backgroundColor: Colors.black,
    borderTopWidth: 0,
    padding: 8,
    alignItems: 'center',
  },
  composer: {
    color: Colors.white,
    backgroundColor: Colors.composerBackground,
    borderColor: Colors.composerBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginVertical: 2,
    minHeight: 42,
    borderRadius: 32,
  },
  sendContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  sendImage: {
    width: 30,
    height: 30,
    tintColor: Colors.sendIcon,
  },
  messagesContainer: {
    backgroundColor: Colors.black,
  },
});

const USER = {_id: 'usr1', avatar: require('./assets/img/user-avatar.png')};
const AI = {_id: 'ai', avatar: require('./assets/img/ai-avatar.png')};

const MESSAGES = {
  INTRO: {
    role: 'system',
    content: 'Introduce yourself as helpful assistant!',
  },
};

function App(): React.JSX.Element {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onPartialCompletion = ({token}: TokenData) => {
    setMessages(prev =>
      prev.map((msg, index) => {
        if (index === 0) {
          return {...msg, text: msg.text + token};
        }
        return msg;
      }),
    );
  };

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
    addMessage(AI, '');
    LlamaService.completion(
      [
        {
          role: 'user',
          content: msg.text,
        },
      ],
      onPartialCompletion,
    );
  };

  useEffect(() => {
    LlamaService.initialize().then(() => {
      addMessage(AI, '');
      LlamaService.completion([MESSAGES.INTRO], onPartialCompletion);
    });

    return () => {
      LlamaService.cleanup();
    };
  }, []);

  const renderBubble = (props: BubbleProps<IMessage>) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: [styles.bubble, styles.aiBubble],
        right: [styles.bubble, styles.userBubble],
      }}
      textStyle={{left: styles.text, right: styles.text}}
    />
  );

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} />
  );

  const renderComposer = (props: ComposerProps) => (
    <Composer {...props} textInputStyle={styles.composer} />
  );

  const renderSend = (props: SendProps<IMessage>) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={styles.sendContainer}>
      <Image
        style={styles.sendImage}
        source={require('./assets/img/send.png')}
      />
    </Send>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.black} />
        <GiftedChat
          messagesContainerStyle={styles.messagesContainer}
          messages={messages}
          onSend={handleSendMessagePress}
          user={USER}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          showUserAvatar
          alwaysShowSend
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bubble, BubbleProps, IMessage } from 'react-native-gifted-chat';
import { Colors } from '../constants/colors';

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.aiBubble,
    borderBottomLeftRadius: 0,
  },
  text: {
    color: Colors.white,
    fontSize: 14,
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
  thinkingPlaceholder: {
    color: Colors.thinkingText,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  thinkingBlock: {
    backgroundColor: Colors.thinkingBackground,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  thinkingContentText: {
    color: Colors.thinkingText,
  },
});

const THINK_START_TAG = '<think>';
const THINK_END_TAG = '</think>';

interface ChatBubbleProps extends BubbleProps<IMessage> {}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  const [isThinkingVisible, setIsThinkingVisible] = useState(false);

  const messageText = props.currentMessage?.text || '';
  const isAiMessage = props.position === 'left';

  if (isAiMessage) {
    const thinkStartIndex = messageText.indexOf(THINK_START_TAG);
    const thinkEndIndex = messageText.indexOf(THINK_END_TAG);

    // <think> tag exists
    if (thinkStartIndex !== -1) {
      let thinkingContent = '';
      let responseContent = '';

      if (thinkEndIndex !== -1 && thinkEndIndex > thinkStartIndex) {
        // Both start and end tags exist
        thinkingContent = messageText.substring(thinkStartIndex + THINK_START_TAG.length, thinkEndIndex).trim();
        responseContent = messageText.substring(thinkEndIndex + THINK_END_TAG.length).trim();
      } else {
        thinkingContent = messageText.substring(thinkStartIndex + THINK_START_TAG.length).trim();
      }

      const handlePress = () => {
        setIsThinkingVisible(prev => !prev);
      };

      return (
        <View style={styles.bubbleWrapper}>
          {!isThinkingVisible ? (
            <TouchableOpacity onPress={handlePress}>
              <Text style={styles.thinkingPlaceholder}>thinking...</Text>
            </TouchableOpacity>
          ) : (
            thinkingContent ? (
              <TouchableOpacity onPress={handlePress}>
              <View style={styles.thinkingBlock}>
                <Text style={styles.thinkingContentText}>
                  {thinkingContent}
                  {thinkEndIndex === -1 ? '...' : ''}
                </Text>
              </View>
              </TouchableOpacity>
            ) : null
          )}
          {thinkEndIndex !== -1 && responseContent ? (
            <Text style={styles.text}>{responseContent}</Text>
          ) : null}
        </View>
      );
    }
  }

  // Default rendering for user messages
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: [styles.bubble, styles.aiBubble],
        right: [styles.bubble, styles.userBubble],
      }}
      textStyle={{left: styles.text, right: styles.text}}
    />
  );
};

export default ChatBubble;

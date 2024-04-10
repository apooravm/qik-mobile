import React from 'react';
import {View, Text, Image, ScrollView, TextInput} from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const App = () => {
  return (
    <StyledScrollView className='p-8'>
      <StyledText className='text-red-800'>Some text heyyy</StyledText>
      <StyledView>
        <StyledText>Some more text</StyledText>
        <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{width: 200, height: 200}}
        />
      </StyledView>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="You can type in me"
      />
    </StyledScrollView>
  );
};

export default App;
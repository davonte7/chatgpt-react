import logo from './logo.svg';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Configuration, OpenAIApi } from 'openai';
import { default as UUID } from 'node-uuid';
import React from 'react';

function App() {

  async function handleSubmit(event, transcript) {
    event.preventDefault();
    console.log(transcript)
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: transcript,
      temperature: 0.9,
      max_tokens: 200,
    })
    console.log(response)
    setAnswer(response.data.choices[0].text)
  }

  async function saveText(event, transcript) {

    event.preventDefault()
    const blobItem = "Prompt:\n" + transcript + "\n\nText:" + answer
    const blob = new Blob([blobItem], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = "chatGPT" + UUID.v4() + ".txt"
    link.href = url
    link.click()
  }

  const Dictaphone = () => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
      <div style={{ width: '100%', textAlign:'center' }}>
        <p>Microphone: {listening ? 'on' : 'off'}</p>

        <button style={{ margin: '3%', fontSize: 'x-large', padding: '1%' }}
          onClick={SpeechRecognition.startListening}>Start</button>

        <button style={{ margin: '3%', fontSize: 'x-large', padding: '1%' }}
          onClick={SpeechRecognition.stopListening}>Stop</button>

        <button style={{ margin: '3%', fontSize: 'x-large', padding: '1%' }}
          onClick={resetTranscript}>Reset</button>

        <p style={{ width: '80%', textAlign: 'center' }}>{transcript}</p>

        <button style={{ margin: '1%', fontSize: 'x-large', padding: '1%' }}
          onClick={(event) => { handleSubmit(event, transcript) }}>Submit</button>

        <p style={{ width: '80%', margin: 'auto' }}>{answer}</p>

        <button style={{ margin: '3%', fontSize: 'x-large', padding: '1%' }}
          onClick={(event) => { saveText(event, transcript) }}>Save this text</button>
      </div>
    );
  };

  const config = new Configuration({ apiKey: 'your-key' })
  const openai = new OpenAIApi(config)

  const [answer, setAnswer] = React.useState('')

  return (
    <div className="App">
      <header className="App-header">
        {Dictaphone()}
      </header>
    </div>
  );
}

export default App;

"use client"
import { Pause, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ur');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
translateText(speechResult, selectedLanguage);
      };

      recognitionInstance.onend = () => setIsListening(false);
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    const audio = new Audio();
    audio.onloadstart = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      console.error('Audio playback error');
    };
    setAudioElement(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [selectedLanguage]);

 const translateText = async (text, language) => {
  if (!text.trim()) return;

  setIsTranslating(true);
  setAudioUrl('');

  try {
    const response = await fetch('http://localhost:3001/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang: language }),
    });

    console.log(language, "function lang"); // ✅ correct value print karega
    const data = await response.json();
    setTranslatedText(data.translatedText);
    if (data.audioUrl) setAudioUrl(data.audioUrl);
  } catch (error) {
    console.error('Translation error:', error);
    setTranslatedText('Translation failed. Please try again.');
  } finally {
    setIsTranslating(false);
  }
};


  const startListening = () => {
    if (recognition && isSupported) {
      setIsListening(true);
      setTranscript('');
      setTranslatedText('');
      setAudioUrl('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const playUrduAudio = () => {
    if (!audioUrl || !audioElement) return;
    try {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = audioUrl;
      audioElement.play().then(() => setIsPlaying(true)).catch(err => {
        console.error('Audio play error:', err);
        setIsPlaying(false);
      });
    } catch (err) {
      console.error('Audio setup error:', err);
    }
  };

  const clearAll = () => {
    setTranscript('');
    setTranslatedText('');
    setAudioUrl('');
    setIsListening(false);
    setIsPlaying(false);
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    if (recognition) recognition.stop();
  };

  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Browser Not Supported</h1>
          <p className="text-white opacity-90">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-18 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            English to {selectedLanguage.toUpperCase()} Translator
          </h1>
          <p className="text-black opacity-80 text-lg">
            Speak in English and get translation with audio
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 animate-pulse text-black rounded-full mr-2"></span>
              English Input
            </h2>
            <div className="mb-6">
              <div className="min-h-32 bg-black bg-opacity-20 rounded-2xl p-4 mb-4">
                <p className="text-white text-lg leading-relaxed">
                  {transcript || (isListening ? 'Listening...' : 'Click the microphone to start speaking')}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isTranslating}
                  className={`w-20 h-20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-green-500 hover:bg-green-600'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-6">
            <div className='flex gap-16' >
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 animate-pulse rounded-full mr-2"></span>
              Translation Output
            </h2>
            <div className="flex justify-center mb-6">
              <select
                value={selectedLanguage}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg shadow bg-white text-black font-medium"
              >
                <option value="ur">Urdu</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
                <option value="fr">French</option>
              </select>
            </div>
            </div>
            <div className="mb-6">
              <div className="min-h-32 bg-black bg-opacity-20 rounded-2xl p-4 mb-4">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-2 text-white">Translating...</span>
                  </div>
                ) : (
                  <p className="text-white text-lg leading-relaxed font-medium font-urdu" style={{ direction: 'rtl' }}>
                    {translatedText || 'Translation will appear here'}
                  </p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={playUrduAudio}
                  disabled={!audioUrl || isTranslating || isPlaying}
                  className={`w-20 h-20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                    !audioUrl || isTranslating || isPlaying ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-600'
                  } ${isPlaying ? 'animate-pulse' : ''}`}
                >
                  <Play Icon className="w-6 h-6 text-white" />
                </button>
              </div>
              {audioUrl && (
                <div className="mt-2 text-center">
                  <p className="text-black text-sm opacity-70">
                    Audio ready - Click speaker to play
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors duration-200 transform hover:scale-105"
          >
            Clear All
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors duration-200 transform hover:scale-105"
          >
            Refresh
          </button>
        </div>

        <div className="text-center mt-8 text-black opacity-70">
          <p>Make sure your microphone is enabled and speak clearly</p>
          <p className="text-sm mt-2">
            High-quality audio generated using Google TTS
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;



// {
//   "id": "user_abc123",
//   "emailAddresses": [
//     {
//       "emailAddress": "example@gmail.com",
//       "id": "idn_abc123"
//     }
//   ],
//   "firstName": "John",
//   "lastName": "Doe",
//   "fullName": "John Doe",
//   "username": null,
//   "primaryEmailAddressId": "idn_abc123",
//   "imageUrl": "https://images.clerk.dev/oauth_profile.jpg",
//   "createdAt": 1673627176896,
//   "updatedAt": 1673627176896,
//   "externalAccounts": [
//     {
//       "provider": "oauth_google",
//       "providerUserId": "1234567890",
//       "approvedScopes": "profile email",
//       "emailAddress": "example@gmail.com"
//     }
//   ]
// }

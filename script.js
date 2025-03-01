document.addEventListener('DOMContentLoaded', function() {
    // Initialize global variables
    const synth = window.speechSynthesis;
    let voices = [];
    let currentUtterance = null;
    let recognition = null;
    let isRecognizing = false;
    let ttsHistory = JSON.parse(localStorage.getItem('ttsHistory')) || [];
    let sstHistory = JSON.parse(localStorage.getItem('sstHistory')) || [];
    
    // DOM Elements
    const ttsText = document.getElementById('tts-text');
    const speakBtn = document.getElementById('speak-btn');
    const stopBtn = document.getElementById('stop-btn');
    const voiceSelectEl = document.getElementById('voiceSelect');
    const rate = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const pitch = document.getElementById('pitch');
    const pitchValue = document.getElementById('pitch-value');
    const volume = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    const copyBtn = document.getElementById('copy-btn');
    const pasteBtn = document.getElementById('paste-btn');
    
    // Translation elements
    const ttsSourceLang = document.getElementById('tts-source-lang');
    const ttsTargetLang = document.getElementById('tts-target-lang');
    const translateTtsBtn = document.getElementById('translate-tts-btn');
    const ttsTranslatedText = document.getElementById('tts-translated-text');
    const speakTranslatedBtn = document.getElementById('speak-translated-btn');
    
    // SST elements
    const sstText = document.getElementById('sst-text');
    const startBtn = document.getElementById('start-btn');
    const stopRecBtn = document.getElementById('stop-rec-btn');
    const saveSstBtn = document.getElementById('save-sst-btn');
    const clearBtn = document.getElementById('clear-btn');
    const recognitionLangSelect = document.getElementById('recognition-lang');
    
    // SST translation
    const sstSourceLang = document.getElementById('sst-source-lang');
    const sstTargetLang = document.getElementById('sst-target-lang');
    const translateSstBtn = document.getElementById('translate-sst-btn');
    const sstTranslatedText = document.getElementById('sst-translated-text');
    const speakSstTranslatedBtn = document.getElementById('speak-sst-translated-btn');
    
    // History elements
    const ttsHistoryList = document.getElementById('tts-history-list');
    const sstHistoryList = document.getElementById('sst-history-list');
    const historySearch = document.getElementById('history-search');
    const downloadHistoryBtn = document.getElementById('download-history');
    const clearAllHistoryBtn = document.getElementById('clear-all-history');
    const clearTtsHistoryBtn = document.getElementById('clear-tts-history');
    const clearSstHistoryBtn = document.getElementById('clear-sst-history');
    
    // Tab navigation elements
    const tabTTS = document.getElementById('tab-tts');
    const tabSST = document.getElementById('tab-sst');
    const tabHistory = document.getElementById('tab-history');
    const tabAbout = document.getElementById('tab-about');
    const ttsSection = document.getElementById('tts-section');
    const sstSection = document.getElementById('sst-section');
    const historySection = document.getElementById('history-section');
    const aboutSection = document.getElementById('about-section');
    
    // Settings elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStatus = document.getElementById('dark-mode-status');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const fontSizeInput = document.getElementById('font-size-input');
    const fontSizeDisplay = document.getElementById('font-size-display');
    const fontFamilySelect = document.getElementById('font-family-select');
    
    // Language data
    const fullLanguages = [
      { code: 'af', name: 'Afrikaans' },
      { code: 'sq', name: 'Albanian' },
      { code: 'am', name: 'Amharic' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hy', name: 'Armenian' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'eu', name: 'Basque' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bn', name: 'Bengali' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'ca', name: 'Catalan' },
      { code: 'ceb', name: 'Cebuano' },
      { code: 'zh', name: 'Chinese' },
      { code: 'co', name: 'Corsican' },
      { code: 'hr', name: 'Croatian' },
      { code: 'cs', name: 'Czech' },
      { code: 'da', name: 'Danish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'en', name: 'English' },
      { code: 'eo', name: 'Esperanto' },
      { code: 'et', name: 'Estonian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fr', name: 'French' },
      { code: 'fy', name: 'Frisian' },
      { code: 'gl', name: 'Galician' },
      { code: 'ka', name: 'Georgian' },
      { code: 'de', name: 'German' },
      { code: 'el', name: 'Greek' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'ht', name: 'Haitian Creole' },
      { code: 'ha', name: 'Hausa' },
      { code: 'haw', name: 'Hawaiian' },
      { code: 'he', name: 'Hebrew' },
      { code: 'hi', name: 'Hindi' },
      { code: 'hmn', name: 'Hmong' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'is', name: 'Icelandic' },
      { code: 'ig', name: 'Igbo' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ga', name: 'Irish' },
      { code: 'it', name: 'Italian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'jw', name: 'Javanese' },
      { code: 'kn', name: 'Kannada' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'km', name: 'Khmer' },
      { code: 'ko', name: 'Korean' },
      { code: 'ku', name: 'Kurdish' },
      { code: 'ky', name: 'Kyrgyz' },
      { code: 'lo', name: 'Lao' },
      { code: 'la', name: 'Latin' },
      { code: 'lv', name: 'Latvian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'mg', name: 'Malagasy' },
      { code: 'ms', name: 'Malay' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'mt', name: 'Maltese' },
      { code: 'mi', name: 'Maori' },
      { code: 'mr', name: 'Marathi' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'my', name: 'Myanmar (Burmese)' },
      { code: 'ne', name: 'Nepali' },
      { code: 'no', name: 'Norwegian' },
      { code: 'ny', name: 'Nyanja (Chichewa)' },
      { code: 'or', name: 'Odia (Oriya)' },
      { code: 'ps', name: 'Pashto' },
      { code: 'fa', name: 'Persian' },
      { code: 'pl', name: 'Polish' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'sm', name: 'Samoan' },
      { code: 'gd', name: 'Scots Gaelic' },
      { code: 'sr', name: 'Serbian' },
      { code: 'st', name: 'Sesotho' },
      { code: 'sn', name: 'Shona' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'si', name: 'Sinhala' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'so', name: 'Somali' },
      { code: 'es', name: 'Spanish' },
      { code: 'su', name: 'Sundanese' },
      { code: 'sw', name: 'Swahili' },
      { code: 'sv', name: 'Swedish' },
      { code: 'tl', name: 'Tagalog' },
      { code: 'tg', name: 'Tajik' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'th', name: 'Thai' },
      { code: 'tr', name: 'Turkish' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'ur', name: 'Urdu' },
      { code: 'uz', name: 'Uzbek' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'cy', name: 'Welsh' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'yi', name: 'Yiddish' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'zu', name: 'Zulu' }
    ];
  
    // Initialize Language Dropdowns
    function populateLanguageDropdowns() {
      const dropdowns = [ttsSourceLang, ttsTargetLang, sstSourceLang, sstTargetLang];
      
      fullLanguages.forEach(lang => {
        dropdowns.forEach(dropdown => {
          const option = document.createElement('option');
          option.value = lang.code;
          option.textContent = lang.name;
          dropdown.appendChild(option);
        });
      });
      
      // Default languages
      ttsSourceLang.value = 'en';
      ttsTargetLang.value = 'es';
      sstSourceLang.value = 'en';
      sstTargetLang.value = 'es';
      
      // Recognition language options (more specific for speech recognition)
      if (recognitionLangSelect) {
        recognitionLangSelect.innerHTML = '';
        const recogLanguages = [
          { code: 'en-US', name: 'English (US)' },
          { code: 'en-GB', name: 'English (UK)' },
          { code: 'es-ES', name: 'Spanish' },
          { code: 'fr-FR', name: 'French' },
          { code: 'de-DE', name: 'German' },
          { code: 'it-IT', name: 'Italian' },
          { code: 'pt-BR', name: 'Portuguese' },
          { code: 'ru-RU', name: 'Russian' },
          { code: 'ja-JP', name: 'Japanese' },
          { code: 'ko-KR', name: 'Korean' },
          { code: 'zh-CN', name: 'Chinese (Simplified)' },
          { code: 'hi-IN', name: 'Hindi' },
          { code: 'ar-SA', name: 'Arabic' },
          { code: 'ta-IN', name: 'Tamil' },
          { code: 'te-IN', name: 'Telugu' },
          { code: 'kn-IN', name: 'Kannada' },
          { code: 'ml-IN', name: 'Malayalam' }
        ];
        
        recogLanguages.forEach(lang => {
          const option = document.createElement('option');
          option.value = lang.code;
          option.textContent = lang.name;
          recognitionLangSelect.appendChild(option);
        });
        
        // Set browser language or English as default
        const browserLang = navigator.language;
        const langExists = recogLanguages.find(l => l.code.startsWith(browserLang));
        recognitionLangSelect.value = langExists ? langExists.code : 'en-US';
      }
    }
    
    // Initialize voice selection
    function populateVoices() {
      voices = synth.getVoices();
      voiceSelectEl.innerHTML = '';
      
      const sortedVoices = [...voices].sort((a, b) => {
        if (a.lang !== b.lang) {
          return a.lang.localeCompare(b.lang);
        }
        return a.name.localeCompare(b.name);
      });
      
      // Group voices by language
      const groupedVoices = {};
      sortedVoices.forEach(voice => {
        const langCode = voice.lang.slice(0, 2);
        if (!groupedVoices[langCode]) {
          groupedVoices[langCode] = [];
        }
        groupedVoices[langCode].push(voice);
      });
      
      // Create option groups for each language
      Object.keys(groupedVoices).forEach(langCode => {
        const langName = fullLanguages.find(l => l.code === langCode)?.name || langCode.toUpperCase();
        const group = document.createElement('optgroup');
        group.label = langName;
        
        groupedVoices[langCode].forEach(voice => {
          const option = document.createElement('option');
          option.textContent = `${voice.name} (${voice.lang})`;
          option.setAttribute('data-lang', voice.lang);
          option.setAttribute('data-name', voice.name);
          option.value = voice.name;
          group.appendChild(option);
        });
        
        voiceSelectEl.appendChild(group);
      });
      
      // Select the browser's default voice
      if (voices.length > 0) {
        const defaultVoice = voices.find(voice => voice.default);
        if (defaultVoice) {
          voiceSelectEl.value = defaultVoice.name;
        }
      }
    }
    
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
    
    // Initialize on page load
    populateLanguageDropdowns();
    setTimeout(populateVoices, 100);  // Fallback if onvoiceschanged doesn't trigger
    
    // Event listeners for range inputs
    rate.addEventListener('input', () => {
      rateValue.textContent = rate.value;
    });
    
    pitch.addEventListener('input', () => {
      pitchValue.textContent = pitch.value;
    });
    
    volume.addEventListener('input', () => {
      volumeValue.textContent = volume.value;
    });
    
    // Improved speak function with better language support
    function speak(text, mode = 'local') {
      if (!text) return;
      
      // Cancel any ongoing speech
      stopSpeaking();
      
      // Save to history if not playing from history already
      if (!window.isPlayingFromHistory && text.trim().length > 0 && text !== ttsTranslatedText.value) {
        saveTtsHistory(text);
      }
      
      // Get language from the text or use default language
      let detectedLang = 'en';
      
      // For translated text, get the language from the appropriate target language select
      if (text === ttsTranslatedText.value) {
        detectedLang = ttsTargetLang.value;
      } else if (text === sstTranslatedText.value) {
        detectedLang = sstTargetLang.value;
      }
      
      // Check if browser TTS supports this language
      let foundVoice = null;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // For translated text, explicitly try to find a voice for the target language
      if (voices.length > 0) {
        const targetLangCode = detectedLang;
        
        // First try: find exact match for language code
        foundVoice = voices.find(voice => 
          voice.lang.toLowerCase().startsWith(targetLangCode.toLowerCase())
        );
        
        // Second try: match just the main language part (e.g., 'en' from 'en-US')
        if (!foundVoice && targetLangCode.includes('-')) {
          const mainLangPart = targetLangCode.split('-')[0];
          foundVoice = voices.find(voice => 
            voice.lang.toLowerCase().startsWith(mainLangPart.toLowerCase())
          );
        }
        
        // If no matching voice was found, notify the user instead of using a mismatched voice
        if (!foundVoice) {
          // Try to get the language name for better user message
          const langName = fullLanguages.find(l => l.code === detectedLang)?.name || detectedLang;
          
          // Alert the user and use external TTS
          alert(`No voice available for ${langName}. Attempting to use external text-to-speech service.`);
          useExternalTTS(text, detectedLang);
          return; // External TTS is handling this, so we return
        }
        
        utterance.voice = foundVoice;
        console.log(`Using voice: ${foundVoice.name} (${foundVoice.lang}) for language ${detectedLang}`);
      }
      
      // Set speech parameters
      utterance.rate = parseFloat(rate.value);
      utterance.pitch = parseFloat(pitch.value);
      utterance.volume = parseFloat(volume.value);
      
      // Add event listeners for the utterance
      utterance.onstart = () => {
        speakBtn.disabled = true;
        stopBtn.disabled = false;
        if (speakTranslatedBtn) speakTranslatedBtn.disabled = true;
        if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = true;
      };
      
      utterance.onend = () => {
        speakBtn.disabled = false;
        stopBtn.disabled = true;
        if (speakTranslatedBtn) speakTranslatedBtn.disabled = false;
        if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = false;
        currentUtterance = null;
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        alert(`Error speaking text: ${event.error}`);
        speakBtn.disabled = false;
        stopBtn.disabled = true;
        if (speakTranslatedBtn) speakTranslatedBtn.disabled = false;
        if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = false;
        currentUtterance = null;
        
        // Try external TTS as fallback
        useExternalTTS(text, detectedLang);
      };
      
      // Store current utterance and speak
      currentUtterance = utterance;
      synth.speak(utterance);
    }
    
    // External TTS function using Google's TTS service
    function useExternalTTS(text, lang) {
      try {
        // Create audio element
        const audio = new Audio();
        
        // Google TTS URL (this is using their public API)
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
        
        // Set up audio
        audio.src = googleTTSUrl;
        audio.onloadedmetadata = () => {
          console.log("External TTS audio loaded");
        };
        
        // Event handlers for buttons
        audio.onplay = () => {
          speakBtn.disabled = true;
          stopBtn.disabled = false;
          if (speakTranslatedBtn) speakTranslatedBtn.disabled = true;
          if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = true;
        };
        
        audio.onended = () => {
          speakBtn.disabled = false;
          stopBtn.disabled = true;
          if (speakTranslatedBtn) speakTranslatedBtn.disabled = false;
          if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = false;
        };
        
        audio.onerror = (e) => {
          console.error("Error playing audio from Google TTS", e);
          alert("Unable to play speech. Please try another voice or text.");
          speakBtn.disabled = false;
          stopBtn.disabled = true;
          if (speakTranslatedBtn) speakTranslatedBtn.disabled = false;
          if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = false;
        };
        
        // Play the audio
        audio.play().catch(error => {
          console.error("Error playing external TTS audio:", error);
          
          // Try alternative method as last resort
          if (error.name === 'NotAllowedError') {
            alert("Browser blocked automatic audio playback. Trying with a click approach...");
            
            // Create a button for user to click
            const playButton = document.createElement('button');
            playButton.textContent = "Click to play speech";
            playButton.className = "btn btn-primary temp-play-btn";
            playButton.onclick = () => {
              audio.play();
              document.body.removeChild(playButton);
            };
            
            document.body.appendChild(playButton);
          } else {
            alert("Unable to play speech. Please try another voice or text.");
          }
        });
      } catch (error) {
        console.error("External TTS error:", error);
        alert("Error using external TTS service. Please try again later.");
      }
    }
    
    // Stop speaking
    function stopSpeaking() {
      if (synth.speaking) {
        synth.cancel();
      }
      
      currentUtterance = null;
      speakBtn.disabled = false;
      stopBtn.disabled = true;
      if (speakTranslatedBtn) speakTranslatedBtn.disabled = false;
      if (speakSstTranslatedBtn) speakSstTranslatedBtn.disabled = false;
    }
    
    // Translation function
    async function translateText(text, sourceLang, targetLang, outputElement) {
      if (!text.trim()) {
        alert('Please enter text to translate.');
        return;
      }
      
      outputElement.value = 'Translating...';
      
      try {
        // Primary translation method using MyMemory API
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
          outputElement.value = data.responseData.translatedText;
        } else {
          // Fallback to simple translation (client-side glossary for common phrases)
          outputElement.value = `Translation failed: ${data.responseStatus}`;
          console.error('Translation error:', data);
        }
      } catch (error) {
        console.error('Translation error:', error);
        outputElement.value = 'Error: Could not complete translation.';
        
        // Use offline fallback for common phrases
        const fallbackResult = offlineTranslationFallback(text, sourceLang, targetLang);
        if (fallbackResult) {
          outputElement.value = fallbackResult;
        }
      }
    }
    
    // Simple offline translation fallback for common phrases
    function offlineTranslationFallback(text, sourceLang, targetLang) {
      // This is just a tiny glossary for demo purposes
      // In a real app, you'd have a more extensive dictionary
      const dictionary = {
        'en': {
          'hello': {
            'es': 'hola',
            'fr': 'bonjour',
            'de': 'hallo',
            'hi': 'नमस्ते',
            'ta': 'வணக்கம்',
            'kn': 'ನಮಸ್ಕಾರ'
          },
          'thank you': {
            'es': 'gracias',
            'fr': 'merci',
            'de': 'danke',
            'hi': 'धन्यवाद',
            'ta': 'நன்றி',
            'kn': 'ಧನ್ಯವಾದಗಳು'
          }
        }
      };
      
      // Check if we have this phrase in our dictionary
      const lowercaseText = text.toLowerCase();
      if (dictionary[sourceLang] && 
          dictionary[sourceLang][lowercaseText] && 
          dictionary[sourceLang][lowercaseText][targetLang]) {
        return dictionary[sourceLang][lowercaseText][targetLang];
      }
      
      return null;
    }
    
    // Speech recognition setup
    function setupSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
        startBtn.disabled = true;
        return;
      }
      
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        isRecognizing = true;
        startBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
        startBtn.classList.add('listening');
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        sstText.value = finalTranscript + interimTranscript;
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isRecognizing = false;
        startBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recognition';
        startBtn.classList.remove('listening');
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          alert('No microphone detected. Please ensure your microphone is connected and permissions are granted.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access to use speech recognition.');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        isRecognizing = false;
        startBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recognition';
        startBtn.classList.remove('listening');
        
        // Save the final transcript to history
        if (sstText.value.trim()) {
          saveSstHistory(sstText.value);
        }
      };
    }
    
    // Start speech recognition
    function startRecognition() {
      if (!recognition) {
        setupSpeechRecognition();
      }
      
      if (isRecognizing) {
        recognition.stop();
        return;
      }
      
      try {
        recognition.lang = recognitionLangSelect.value;
        recognition.start();
      } catch (error) {
        console.error('Recognition start error:', error);
        alert('Could not start speech recognition. Please reload the page and try again.');
      }
    }
    
    // History functions
    function saveTtsHistory(text) {
      if (text.trim() === '') return;
      
      const now = new Date();
      ttsHistory.unshift({
        text,
        timestamp: now.toISOString(),
        formattedTime: formatDate(now)
      });
      
      if (ttsHistory.length > 50) {
        ttsHistory.pop();
      }
      
      localStorage.setItem('ttsHistory', JSON.stringify(ttsHistory));
      updateHistory();
    }
    
    function saveSstHistory(text) {
      if (text.trim() === '') return;
      
      const now = new Date();
      sstHistory.unshift({
        text,
        timestamp: now.toISOString(),
        formattedTime: formatDate(now)
      });
      
      if (sstHistory.length > 50) {
        sstHistory.pop();
      }
      
      localStorage.setItem('sstHistory', JSON.stringify(sstHistory));
      updateHistory();
    }
    
    function formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    
    function updateHistory(searchTerm = '') {
      if (!ttsHistoryList || !sstHistoryList) return;
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Update TTS history
      ttsHistoryList.innerHTML = '';
      const filteredTtsHistory = searchTerm ? 
        ttsHistory.filter(item => item.text.toLowerCase().includes(lowerSearchTerm)) : 
        ttsHistory;
      
      if (filteredTtsHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.innerHTML = searchTerm ? 
          '<em>No matching TTS history items</em>' : 
          '<em>No TTS history yet</em>';
        ttsHistoryList.appendChild(emptyItem);
      } else {
        filteredTtsHistory.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = 'history-item';
          
          li.innerHTML = `
            <div class="history-text">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</div>
            <div class="history-time">${item.formattedTime}</div>
            <div class="history-actions">
              <button class="history-action-btn" data-action="play" data-type="tts" data-index="${index}">
                <i class="fas fa-play"></i>
              </button>
              <button class="history-action-btn" data-action="copy" data-type="tts" data-index="${index}">
                <i class="fas fa-copy"></i>
              </button>
              <button class="history-action-btn" data-action="delete" data-type="tts" data-index="${index}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
          
          ttsHistoryList.appendChild(li);
        });
      }
      
      // Update SST history
      sstHistoryList.innerHTML = '';
      const filteredSstHistory = searchTerm ? 
        sstHistory.filter(item => item.text.toLowerCase().includes(lowerSearchTerm)) : 
        sstHistory;
      
      if (filteredSstHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.innerHTML = searchTerm ? 
          '<em>No matching SST history items</em>' : 
          '<em>No SST history yet</em>';
        sstHistoryList.appendChild(emptyItem);
      } else {
        filteredSstHistory.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = 'history-item';
          
          li.innerHTML = `
            <div class="history-text">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</div>
            <div class="history-time">${item.formattedTime}</div>
            <div class="history-actions">
              <button class="history-action-btn" data-action="play" data-type="sst" data-index="${index}">
                <i class="fas fa-play"></i>
              </button>
              <button class="history-action-btn" data-action="copy" data-type="sst" data-index="${index}">
                <i class="fas fa-copy"></i>
              </button>
              <button class="history-action-btn" data-action="delete" data-type="sst" data-index="${index}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
          
          sstHistoryList.appendChild(li);
        });
      }
      
      // Add event listeners to history action buttons
      document.querySelectorAll('.history-action-btn').forEach(btn => {
        btn.addEventListener('click', handleHistoryAction);
      });
    }
    
    function handleHistoryAction(e) {
      const action = e.currentTarget.getAttribute('data-action');
      const type = e.currentTarget.getAttribute('data-type');
      const index = e.currentTarget.getAttribute('data-index');
      
      const historyArray = type === 'tts' ? ttsHistory : sstHistory;
      const item = historyArray[index];
      
      if (!item) return;
      
      switch (action) {
        case 'play':
          window.isPlayingFromHistory = true;
          speak(item.text);
          window.isPlayingFromHistory = false;
          break;
        
        case 'copy':
          navigator.clipboard.writeText(item.text)
            .then(() => {
              alert('Text copied to clipboard!');
            })
            .catch(err => {
              console.error('Error copying text: ', err);
              alert('Failed to copy text. Please copy manually.');
            });
          break;
        
        case 'delete':
          if (confirm('Delete this history item?')) {
            historyArray.splice(index, 1);
            localStorage.setItem(
              type === 'tts' ? 'ttsHistory' : 'sstHistory', 
              JSON.stringify(historyArray)
            );
            updateHistory(historySearch.value);
          }
          break;
      }
    }
    
    // Tab navigation
    function setActiveTab(tab) {
      [tabTTS, tabSST, tabHistory, tabAbout].forEach(btn => btn.classList.remove('active'));
      [ttsSection, sstSection, historySection, aboutSection].forEach(sec => sec.classList.remove('active'));
      
      if (tab === 'tts') {
        tabTTS.classList.add('active');
        ttsSection.classList.add('active');
      } else if (tab === 'sst') {
        tabSST.classList.add('active');
        sstSection.classList.add('active');
      } else if (tab === 'history') {
        tabHistory.classList.add('active');
        historySection.classList.add('active');
        updateHistory();
      } else if (tab === 'about') {
        tabAbout.classList.add('active');
        aboutSection.classList.add('active');
      }
    }
    
    // Settings functions
    function loadSettings() {
      const dark = localStorage.getItem('darkMode') === 'true';
      darkModeToggle.checked = dark;
      darkModeStatus.textContent = dark ? 'On' : 'Off';
      updateDarkMode(dark);
      
      const fs = localStorage.getItem('fontSize') || "16";
      fontSizeInput.value = fs;
      fontSizeDisplay.textContent = fs + "px";
      document.body.style.fontSize = fs + "px";
      
      const ff = localStorage.getItem('fontFamily') || "'Poppins', sans-serif";
      fontFamilySelect.value = ff;
      document.body.style.fontFamily = ff;
    }
    
    function updateDarkMode(enabled) {
      if (enabled) document.body.classList.add('dark-mode');
      else document.body.classList.remove('dark-mode');
    }
  
    // Event listeners
    speakBtn.addEventListener('click', () => speak(ttsText.value));
    stopBtn.addEventListener('click', stopSpeaking);
    translateTtsBtn.addEventListener('click', () => translateText(ttsText.value, ttsSourceLang.value, ttsTargetLang.value, ttsTranslatedText));
    if (speakTranslatedBtn) {
      speakTranslatedBtn.addEventListener('click', () => {
        if (ttsTranslatedText.value.trim()) {
          speak(ttsTranslatedText.value);
        } else {
          alert("No translated text to speak. Please translate some text first.");
        }
      });
    }
    
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(ttsText.value)
        .then(() => alert('Text copied to clipboard!'))
        .catch(err => {
          console.error('Error copying text: ', err);
          alert('Failed to copy text. Please copy manually.');
        });
    });
    
    pasteBtn.addEventListener('click', () => {
      navigator.clipboard.readText()
        .then(text => {
          ttsText.value = text;
        })
        .catch(err => {
          console.error('Error pasting text: ', err);
          alert('Failed to paste text. Please paste manually.');
        });
    });
    
    if (startBtn) {
      startBtn.addEventListener('click', startRecognition);
    }
    
    if (stopRecBtn) {
      stopRecBtn.addEventListener('click', () => {
        if (recognition && isRecognizing) {
          recognition.stop();
        }
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sstText.value = '';
      });
    }
    
    if (saveSstBtn) {
      saveSstBtn.addEventListener('click', () => {
        if (sstText.value.trim()) {
          saveSstHistory(sstText.value);
          alert('Speech text saved to history!');
        }
      });
    }
    
    if (translateSstBtn) {
      translateSstBtn.addEventListener('click', () => {
        translateText(sstText.value, sstSourceLang.value, sstTargetLang.value, sstTranslatedText);
      });
    }
    
    if (speakSstTranslatedBtn) {
      speakSstTranslatedBtn.addEventListener('click', () => {
        if (sstTranslatedText.value.trim()) {
          speak(sstTranslatedText.value);
        } else {
          alert("No translated text to speak. Please translate some text first.");
        }
      });
    }
    
    // History event listeners
    if (historySearch) {
      historySearch.addEventListener('input', () => {
        updateHistory(historySearch.value);
      });
    }
    
    if (downloadHistoryBtn) {
      downloadHistoryBtn.addEventListener('click', () => {
        const historyData = {
          tts: ttsHistory,
          sst: sstHistory
        };
        
        const blob = new Blob([JSON.stringify(historyData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speech-app-history.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
    
    if (clearAllHistoryBtn) {
      clearAllHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
          ttsHistory = [];
          sstHistory = [];
          localStorage.setItem('ttsHistory', JSON.stringify(ttsHistory));
          localStorage.setItem('sstHistory', JSON.stringify(sstHistory));
          updateHistory();
          alert('All history cleared!');
        }
      });
    }
    
    if (clearTtsHistoryBtn) {
      clearTtsHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all TTS history?')) {
          ttsHistory = [];
          localStorage.setItem('ttsHistory', JSON.stringify(ttsHistory));
          updateHistory();
          alert('TTS history cleared!');
        }
      });
    }
    
    if (clearSstHistoryBtn) {
      clearSstHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all SST history?')) {
          sstHistory = [];
          localStorage.setItem('sstHistory', JSON.stringify(sstHistory));
          updateHistory();
          alert('SST history cleared!');
        }
      });
    }
    
    // Tab navigation event listeners
    tabTTS.addEventListener('click', () => setActiveTab('tts'));
    tabSST.addEventListener('click', () => setActiveTab('sst'));
    tabHistory.addEventListener('click', () => setActiveTab('history'));
    tabAbout.addEventListener('click', () => setActiveTab('about'));
    
    // Settings event listeners
    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = (settingsModal.style.display === "block" ? "none" : "block");
    });
    
    document.addEventListener('click', (e) => {
      if (settingsModal && !settingsModal.contains(e.target) && e.target !== settingsBtn) {
        settingsModal.style.display = "none";
      }
    });
    
    darkModeToggle.addEventListener('change', () => {
      updateDarkMode(darkModeToggle.checked);
      darkModeStatus.textContent = darkModeToggle.checked ? 'On' : 'Off';
      localStorage.setItem('darkMode', darkModeToggle.checked);
    });
    
    fontSizeInput.addEventListener('input', () => {
      const val = fontSizeInput.value;
      fontSizeDisplay.textContent = val + "px";
      document.body.style.fontSize = val + "px";
      localStorage.setItem('fontSize', val);
    });
    
    fontFamilySelect.addEventListener('change', () => {
      const val = fontFamilySelect.value;
      document.body.style.fontFamily = val;
      localStorage.setItem('fontFamily', val);
    });
    
    resetSettingsBtn.addEventListener('click', () => {
      if (confirm('Reset all settings to default?')) {
        localStorage.removeItem('darkMode');
        localStorage.removeItem('fontSize');
        localStorage.removeItem('fontFamily');
        darkModeToggle.checked = false;
        darkModeStatus.textContent = 'Off';
        updateDarkMode(false);
        fontSizeInput.value = "16";
        fontSizeDisplay.textContent = "16px";
        document.body.style.fontSize = "16px";
        fontFamilySelect.value = "'Poppins', sans-serif";
        document.body.style.fontFamily = "'Poppins', sans-serif";
      }
    });
    
    // Initialize app
    function init() {
      // Load settings
      loadSettings();
      
      // Populate language dropdowns
      populateLanguageDropdowns();
      
      // Get voices and populate voice selector
      if (synth) {
        const getVoices = () => {
          voices = synth.getVoices();
          populateVoices();
        };
        
        if (synth.onvoiceschanged !== undefined) {
          synth.onvoiceschanged = getVoices;
        }
        
        // Try immediately as well for browsers that don't fire the event
        setTimeout(getVoices, 100);
      }
      
      // Check for Web Speech API support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (startBtn) startBtn.disabled = true;
        if (sstSection) {
          const warningDiv = document.createElement('div');
          warningDiv.classList.add('warning-message');
          warningDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.';
          sstSection.insertBefore(warningDiv, sstSection.firstChild);
        }
      }
      
      // Show initial tab
      setActiveTab('tts');
      
      // Update history initially
      updateHistory();
      
      // Add slider event listeners
      rate.addEventListener('input', () => {
        rateValue.textContent = rate.value;
      });
      
      pitch.addEventListener('input', () => {
        pitchValue.textContent = pitch.value;
      });
      
      volume.addEventListener('input', () => {
        volumeValue.textContent = volume.value;
      });
      
      // Add resize listener for mobile adjustments
      window.addEventListener('resize', handleResize);
      handleResize();
      
      // Fade out loader if it exists
      document.body.classList.add('loaded');
      const loader = document.querySelector('.loader');
      if (loader) {
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => loader.style.display = 'none', 500);
        }, 800);
      }
    }
    
    function handleResize() {
      const isMobile = window.innerWidth < 768;
      document.body.classList.toggle('mobile', isMobile);
      
      // Adjust UI elements for mobile if needed
      if (isMobile) {
        // Mobile specific adjustments
      } else {
        // Desktop specific adjustments
      }
    }
    
    // Start the app
    init();
});
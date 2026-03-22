export function speakTextConversational(text, onFinishSpeaking) {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported.');
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[#*`_~🎉🎯💡✨👏👍🎨🎧🎮🎬📚©®™°•↑↓→←↔↕]/g, '').replace(/\n+/g, ' ').trim();

    if (!cleanText) {
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    const selectBestVoice = (voices) => {
        const femaleLatinPriority = [
            v => v.lang === 'es-CO' && v.name.includes('Google'),
            v => v.lang === 'es-MX' && v.name.includes('Google'),
            v => v.lang === 'es-AR' && v.name.includes('Google'),
            v => v.lang === 'es-ES' && v.name.includes('Google') && !v.name.includes('Male'),
            v => v.lang.includes('es') && v.name.includes('female') && v.name.includes('Google'),
            v => v.lang.includes('es') && v.name.includes('Female'),
            v => v.lang.includes('es') && (v.name.includes('Laura') || v.name.includes('Sofia') || v.name.includes('Carmen') || v.name.includes('Lucia')),
            v => v.lang.includes('es') && v.name.includes('Microsoft') && v.name.includes('Sabina'),
            v => v.lang === 'es-CO' && v.name.includes('Google'),
            v => v.lang === 'es-MX' && v.name.includes('Google'),
            v => v.lang === 'es-AR' && v.name.includes('Google'),
            v => v.lang === 'es-ES' && v.name.includes('Google'),
            v => v.lang.includes('es') && v.name.includes('Google'),
        ];
        
        for (const matcher of femaleLatinPriority) {
            const found = voices.find(matcher);
            if (found) return found;
        }
        
        const spanishVoices = voices.filter(v => v.lang.includes('es') && !v.lang.includes('US'));
        if (spanishVoices.length > 0) {
            return spanishVoices[0];
        }
        
        return voices[0] || null;
    };

    const speakText = (textToSpeak, callback) => {
        const msg = new SpeechSynthesisUtterance(textToSpeak);
        
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = selectBestVoice(voices);
        if (selectedVoice) {
            msg.voice = selectedVoice;
        }
        
        msg.lang = 'es';
        msg.rate = 1.0;
        msg.pitch = 1.05;
        msg.volume = 1.0;

        msg.onend = () => {
            if (callback) callback();
        };
        msg.onerror = (e) => {
            console.error('TTS error', e);
            if (callback) callback();
        };

        window.speechSynthesis.speak(msg);
    };

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const filteredSentences = sentences.map(s => s.trim()).filter(s => s.length > 0);

    if (filteredSentences.length === 0) {
        filteredSentences.push(cleanText);
    }

    let currentIndex = 0;
    const speakNext = () => {
        if (currentIndex >= filteredSentences.length) {
            if (onFinishSpeaking) onFinishSpeaking();
            return;
        }
        
        const sentence = filteredSentences[currentIndex];
        speakText(sentence, () => {
            currentIndex++;
            if (currentIndex < filteredSentences.length) {
                setTimeout(speakNext, 80);
            } else {
                if (onFinishSpeaking) onFinishSpeaking();
            }
        });
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
            setTimeout(speakNext, 50);
        }, { once: true });
    } else {
        setTimeout(speakNext, 50);
    }
}

export function iniciarReconocimiento(setQ, onResult, setIsListening) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('SpeechRecognition not supported');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-CO';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let lastResultIndex = 0;

    recognition.onstart = () => {
        finalTranscript = '';
        lastResultIndex = 0;
        if (setIsListening) setIsListening(true);
    };

    recognition.onend = () => {
        if (setIsListening) setIsListening(false);
        if (finalTranscript.trim() && onResult) {
            onResult(finalTranscript.trim());
        }
        finalTranscript = '';
        lastResultIndex = 0;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = lastResultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += ' ' + transcript.trim();
            } else {
                interimTranscript += transcript;
            }
        }
        lastResultIndex = event.results.length;

        if (setQ) {
            setQ(finalTranscript || interimTranscript);
        }
    };

    recognition.onerror = (event) => {
        console.error('SpeechRecognition error:', event.error);
        if (setIsListening) setIsListening(false);
        
        if (event.error === 'no-speech' && finalTranscript.trim()) {
            setTimeout(() => {
                if (onResult) {
                    onResult(finalTranscript.trim());
                }
            }, 300);
        }
    };

    try {
        recognition.start();
    } catch(e) {
        console.error('Recognition start error', e);
        if (setIsListening) setIsListening(false);
    }
}

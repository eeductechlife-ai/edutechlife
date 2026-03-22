export async function speakTextConversational(t, onFinishSpeaking) {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported.');
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    window.speechSynthesis.cancel();
    
    const cleanText = t.replace(/[#*`_~]/g, '').replace(/\n/g, ' ').trim();

    if (!cleanText) {
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    const speakNext = (text, callback) => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'es-ES';
        msg.rate = 0.92;
        msg.pitch = 1.05;
        msg.volume = 1.0;
        
        const processVoices = (voices) => {
            const preferredVoices = [
                v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Natural')) && !v.name.includes('US'),
                v => v.lang === 'es-ES' || v.lang === 'es-MX' || v.lang === 'es-CO',
                v => v.lang.includes('es') && v.name.includes('Spanish'),
                v => v.lang.includes('es'),
                v => v.name.includes('Microsoft') && v.lang.includes('Spanish'),
            ];
            
            for (const matcher of preferredVoices) {
                const found = voices.find(matcher);
                if (found) {
                    msg.voice = found;
                    break;
                }
            }
            
            if (!msg.voice) {
                const latinVoices = voices.filter(v => 
                    v.lang.includes('es') && 
                    (v.lang.includes('ES') || v.lang.includes('MX') || v.lang.includes('CO') || v.lang.includes('AR'))
                );
                if (latinVoices.length > 0) {
                    msg.voice = latinVoices[0];
                }
            }
        };
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            processVoices(voices);
        } else {
            window.speechSynthesis.addEventListener('voiceschanged', () => {
                const updatedVoices = window.speechSynthesis.getVoices();
                processVoices(updatedVoices);
            }, { once: true });
        }
        
        msg.onend = () => {
            if (callback) callback();
        };
        msg.onerror = (e) => {
            console.error('TTS error', e);
            if (callback) callback();
        };

        window.speechSynthesis.speak(msg);
    };

    const segments = cleanText.split(/(?<=[.!?]) +/).filter(s => s.trim());
    
    let currentIndex = 0;
    const speakNextSegment = () => {
        if (currentIndex >= segments.length) {
            if (onFinishSpeaking) onFinishSpeaking();
            return;
        }
        
        let text = segments[currentIndex].trim();
        if (!text) {
            currentIndex++;
            speakNextSegment();
            return;
        }
        
        text = text.replace(/([.!?])$/, '$1');
        
        speakNext(text, () => {
            currentIndex++;
            if (currentIndex < segments.length) {
                setTimeout(speakNextSegment, 150);
            } else {
                if (onFinishSpeaking) onFinishSpeaking();
            }
        });
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => speakNextSegment(), { once: true });
    } else {
        setTimeout(speakNextSegment, 100);
    }
}

export function iniciarReconocimiento(setQ, onResult, setIsListening) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('SpeechRecognition not supported');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    let finalTranscript = '';

    recognition.onstart = () => {
        finalTranscript = '';
        if (setIsListening) setIsListening(true);
    };

    recognition.onend = () => {
        if (setIsListening) setIsListening(false);
        if (finalTranscript && onResult) {
            onResult(finalTranscript);
        }
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (setQ) {
            setQ(finalTranscript || interimTranscript);
        }
    };

    recognition.onerror = (event) => {
        console.error('SpeechRecognition error', event.error);
        if (setIsListening) setIsListening(false);
        
        if (event.error === 'no-speech') {
            setTimeout(() => {
                if (onResult && finalTranscript) {
                    onResult(finalTranscript);
                }
            }, 500);
        }
    };

    try {
        recognition.start();
    } catch(e) {
        console.error("Recognition start error", e);
        if (setIsListening) setIsListening(false);
    }
}

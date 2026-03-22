export async function speakTextConversational(t, onFinishSpeaking) {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported.');
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    window.speechSynthesis.cancel();
    
    const cleanText = t.replace(/[#*`_~🎉🎯💡✨👏👍🎨🎧🎮🎬📚]/g, '').replace(/\n/g, ' ').trim();

    if (!cleanText) {
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    const speakNext = (text, callback) => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'es';
        msg.rate = 0.95;
        msg.pitch = 1.1;
        msg.volume = 1.0;
        
        const processVoices = (voices) => {
            const femaleLatinVoices = [
                v => v.lang.includes('es') && v.name.includes('female') && (v.name.includes('Google') || v.name.includes('Natural')),
                v => v.lang.includes('es') && v.name.toLowerCase().includes('female') && v.name.includes('es'),
                v => v.lang === 'es-ES' && v.name.includes('Google') && !v.name.includes('Male'),
                v => v.lang === 'es-MX' && v.name.includes('Google'),
                v => v.lang === 'es-CO' && v.name.includes('Google'),
                v => v.lang === 'es-AR' && v.name.includes('Google'),
                v => v.lang.includes('es') && v.name.includes('Google') && v.name.includes('Female'),
                v => v.lang.includes('es') && (v.name.includes('Laura') || v.name.includes('Sofia') || v.name.includes('Carmen') || v.name.includes('Lucia')),
                v => v.lang.includes('es') && v.name.includes('Microsoft') && (v.name.includes('Female') || v.name.includes('Sabina')),
            ];
            
            const anyLatinVoices = [
                v => v.lang.includes('es') && v.name.includes('Google'),
                v => v.lang === 'es-ES' || v.lang === 'es-MX' || v.lang === 'es-CO' || v.lang === 'es-AR',
                v => v.lang.includes('es-Latam'),
                v => v.lang.includes('es') && !v.name.includes('US'),
            ];
            
            for (const matcher of femaleLatinVoices) {
                const found = voices.find(matcher);
                if (found) {
                    msg.voice = found;
                    break;
                }
            }
            
            if (!msg.voice) {
                for (const matcher of anyLatinVoices) {
                    const found = voices.find(matcher);
                    if (found) {
                        msg.voice = found;
                        break;
                    }
                }
            }
            
            if (!msg.voice && voices.length > 0) {
                const spanishVoices = voices.filter(v => v.lang.includes('es'));
                if (spanishVoices.length > 0) {
                    msg.voice = spanishVoices[0];
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
        
        speakNext(text, () => {
            currentIndex++;
            if (currentIndex < segments.length) {
                setTimeout(speakNextSegment, 120);
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
    
    recognition.lang = 'es-CO';
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

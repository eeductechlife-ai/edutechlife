export async function speakTextConversational(t, onFinishSpeaking) {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported.');
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    window.speechSynthesis.cancel();
    
    const cleanText = t.replace(/[#*`_]/g, '').trim();

    if (!cleanText) {
        if (onFinishSpeaking) onFinishSpeaking();
        return;
    }

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    
    let i = 0;
    const speakNext = () => {
        if (i >= sentences.length) {
            if (onFinishSpeaking) onFinishSpeaking();
            return;
        }
        const chunk = sentences[i].trim();
        if (!chunk) { i++; return speakNext(); }
        
        const msg = new SpeechSynthesisUtterance(chunk);
        msg.lang = 'es-CO';
        msg.rate = 1.0; 
        msg.pitch = 1.02; 
        
        const voices = window.speechSynthesis.getVoices();
        const coVoice = voices.find(v => v.lang.includes('es-CO') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')));
        const anyCoVoice = voices.find(v => v.lang.includes('es-CO'));
        const fallbackVoice = voices.find(v => v.lang.includes('es'));
        msg.voice = coVoice || anyCoVoice || fallbackVoice;
        
        msg.onend = () => { i++; speakNext(); };
        msg.onerror = (e) => { console.error('TTS config error', e); i++; speakNext(); };

        window.speechSynthesis.speak(msg);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => speakNext(), { once: true });
    } else {
        speakNext();
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
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
        if (setIsListening) setIsListening(true);
    };

    recognition.onend = () => {
        if (setIsListening) setIsListening(false);
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (setQ) setQ(transcript);
        if (onResult) onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error('SpeechRecognition error', event.error);
        if (setIsListening) setIsListening(false);
    };

    try {
        recognition.start();
    } catch(e) {
        console.error("Recognition start error", e);
    }
}

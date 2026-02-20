import { useState, useEffect, useRef } from "react";
import { useVoiceAnalysis } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { AnalysisResultCard } from "@/components/ui/AnalysisResultCard";
import { Mic, MicOff, Loader2, AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";

// Web Speech API Types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

export default function AnalyzeVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { mutate, data, isPending } = useVoiceAnalysis();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleAnalyze = () => {
    if (transcript.trim()) {
      mutate(transcript);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-2 animate-pulse">
          <Mic className="w-10 h-10 text-pink-600" />
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight">Voice Journal</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Speak freely about how you're feeling. We'll transcribe your voice and provide instant health insights.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-8">
        <div className={cn(
          "relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300",
          isListening ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]" : "bg-primary shadow-xl"
        )}>
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping"></div>
          )}
          <Button
            variant="ghost"
            className="w-full h-full rounded-full hover:bg-transparent text-white"
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="w-16 h-16" />
            ) : (
              <Mic className="w-16 h-16" />
            )}
          </Button>
        </div>
        <p className="font-medium text-lg">
          {isListening ? "Listening... Tap to stop" : "Tap microphone to start"}
        </p>
      </div>

      {transcript && (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-semibold text-muted-foreground mb-3 uppercase text-xs tracking-wider">Transcript</h3>
          <p className="text-xl leading-relaxed font-serif italic text-foreground/80">"{transcript}"</p>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={isListening || isPending}
              size="lg"
              className="rounded-xl px-8 font-bold"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                "Analyze Transcript"
              )}
            </Button>
          </div>
        </div>
      )}

      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <AnalysisResultCard 
            title="Voice Insights" 
            data={data} 
            className="border-t-pink-500"
          />
        </div>
      )}
    </div>
  );
}

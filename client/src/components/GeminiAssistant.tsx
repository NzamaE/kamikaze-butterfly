import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a high-end wedding curator for "Kamikaze Butterfly". 
        Help the user with their wedding planning query: "${prompt}". 
        Keep the tone editorial, sophisticated, and helpful.`,
      });
      setResponse(result.text || 'I am sorry, I could not generate a response.');
    } catch (error) {
      console.error("Gemini Error:", error);
      setResponse("I'm having trouble connecting to my creative muse. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-surface-container-lowest rounded-4xl shadow-2xl border border-primary/10 overflow-hidden"
          >
            <div className="p-6 bg-primary text-on-primary flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                <h3 className="font-headline italic text-lg">Ethereal Concierge</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="material-symbols-outlined">close</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
              {response ? (
                <div className="space-y-4">
                  <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{response}</p>
                  <button 
                    onClick={() => { setResponse(''); setPrompt(''); }}
                    className="text-primary font-label text-[10px] uppercase tracking-widest font-bold"
                  >
                    Ask another question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-body text-sm text-on-surface-variant">
                    How can I assist in curating your perfect celebration today?
                  </p>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Suggest a color palette for a Tuscan sunset wedding..."
                    className="w-full h-24 p-4 bg-surface-container rounded-2xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <button
                    onClick={handleAsk}
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold disabled:opacity-50"
                  >
                    {isLoading ? 'Curating...' : 'Consult Gemini'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? 'close' : 'auto_awesome'}
        </span>
      </motion.button>
    </div>
  );
}

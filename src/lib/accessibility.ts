export function speakText(text: string, lang: string = 'hi-IN'): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}

export function adjustFontSize(element: HTMLElement, increase: boolean): void {
  const currentSize = parseFloat(getComputedStyle(element).fontSize);
  const newSize = increase ? currentSize * 1.2 : currentSize / 1.2;
  element.style.fontSize = `${Math.max(12, Math.min(32, newSize))}px`;
}

export function toggleHighContrast(): void {
  document.body.classList.toggle('high-contrast');
}

export function saveToFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function shareText(text: string, title: string = 'Transliterated Text'): void {
  if (navigator.share) {
    navigator.share({ title, text });
  } else {
    navigator.clipboard.writeText(text);
  }
}

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
}

export default function TypewriterText({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pause = 1500,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = texts[currentIndex];

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < fullText.length) {
        timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, speed);
      } else {
        // Finished typing, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length - 1));
        }, deleteSpeed);
      } else {
        // Finished deleting, transition to next item
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, texts, speed, deleteSpeed, pause]);

  return (
    <span id="typewriter-container" className="inline-flex items-center">
      <span
        id="typewriter-content"
        className="font-mono bg-gradient-to-r from-blue-500 to-purple-500 gradient-text font-bold"
      >
        {displayText}
      </span>
      <span
        id="typewriter-cursor"
        className="ml-0.5 text-blue-500 font-bold dark:text-purple-400 animate-pulse duration-500"
      >
        |
      </span>
    </span>
  );
}

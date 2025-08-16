'use client';

import { useState } from 'react';
import { ChatWidget } from './Chat';
import { ChatWidgetButton } from './chatbutton';
import styles from './chat.module.scss';

export default function RenderPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatWidgetContainer}>
      <ChatWidget isOpen={isOpen} onToggle={handleToggle} />
      <ChatWidgetButton isOpen={isOpen} onClick={handleToggle} />
    </div>
  );
}
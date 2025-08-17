import { useState, useRef, useEffect, createElement as h } from 'react';
import io from 'socket.io-client';
import styles from './chat.module.scss';

const socket = io('http://localhost:4500'); 

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'file';
  fileName?: string;
}

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi 👋 Halo! Saya AskNirwana, asisten virtual Anda dari PT Bumi Nirwana Estate. Saya siap membantu Anda menemukan informasi seputar properti dan layanan kami. Silakan ajukan pertanyaan Anda!',
      sender: 'bot',
      timestamp: new Date(Date.now()),
      type: 'text'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('reply', (text: string) => { // Corrected: Listen for 'reply'
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: text, // The backend sends a simple string
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    });

    return () => {
      socket.off('connect');
      socket.off('reply'); // Corrected: Clean up 'reply' listener
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    socket.emit('message', inputValue);
    setInputValue('');
    setIsTyping(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach(file => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      };
      
      setFiles(prev => [...prev, newFile]);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmitFiles = async () => {
    if (files.length === 0) return;

    const uploadPromises = files.map(fileItem => {
      const formData = new FormData();
      formData.append('file', fileItem.file);

      return fetch('http://localhost:4500/chat/upload', {
        method: 'POST',
        body: formData,
      });
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const allOk = responses.every(res => res.ok);

      if (allOk) {
        console.log('All files uploaded successfully');
        setFiles([]);
        setShowFileManager(false);
      } else {
        console.error('Some file uploads failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // SVG Icons
  const BackIcon = () => h('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
    h('path', { d: "M15 18L9 12L15 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
  );

  const StarIcon = () => h('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor" },
    h('path', { d: "M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" })
  );

  const MenuIcon = () => h('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" }, [
    h('circle', { cx: "12", cy: "12", r: "1", fill: "currentColor", key: "1" }),
    h('circle', { cx: "19", cy: "12", r: "1", fill: "currentColor", key: "2" }),
    h('circle', { cx: "5", cy: "12", r: "1", fill: "currentColor", key: "3" })
  ]);

  const MinimizeIcon = () => h('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
    h('path', { d: "M6 9L12 15L18 9", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
  );

  const PlusIcon = () => h('svg', { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none" },
    h('path', { d: "M12 5V19M5 12H19", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
  );

  const FileIcon = () => h('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" }, [
    h('path', { d: "M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z", stroke: "currentColor", strokeWidth: "2", key: "1" }),
    h('path', { d: "M14 2V8H20", stroke: "currentColor", strokeWidth: "2", key: "2" })
  ]);

  const CloseIcon = () => h('svg', { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none" },
    h('path', { d: "M18 6L6 18M6 6L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
  );

  const SendIcon = () => h('svg', { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none" },
    h('path', { d: "M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
  );

  const SmallFileIcon = () => h('svg', { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none" }, [
    h('path', { d: "M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z", stroke: "currentColor", strokeWidth: "2", key: "1" }),
    h('path', { d: "M14 2V8H20", stroke: "currentColor", strokeWidth: "2", key: "2" })
  ]);

  if (!isOpen) return null;

  return h('div', { 
    className: `${styles.chatWidget} ${isOpen ? styles.open : ''}`,
    key: "chatWidget" 
  }, [
    // Header
    h('div', { className: styles.chatHeader, key: "header" }, [
      h('div', { className: styles.headerLeft, key: "headerLeft" }, [
        h('div', { className: styles.headerInfo, key: "headerInfo" }, [
          h('div', { className: styles.teamIcon, key: "teamIcon" }, StarIcon()),
          h('div', { key: "teamText" }, [
            h('h3', { className: styles.teamName, key: "teamName" }, 'AskNirwana'),
            h('p', { className: styles.teamSubtitle, key: "teamSubtitle" }, '')
          ])
        ])
      ]),
      h('div', { className: styles.headerActions, key: "headerActions" }, [
        h('button', {
          className: styles.menuButton,
          onClick: () => setShowFileManager(!showFileManager),
          key: "menuBtn"
        }, MenuIcon()),
        h('button', {
          className: styles.minimizeButton,
          onClick: onToggle,
          key: "minimizeBtn"
        }, MinimizeIcon())
      ])
    ]),

    // File Manager Modal
    showFileManager && h('div', {
      className: styles.fileManagerOverlay,
      onClick: () => setShowFileManager(false),
      key: "fileManagerOverlay"
    }, [
      h('div', {
        className: styles.fileManager,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        key: "fileManager"
      }, [
        h('div', { className: styles.fileManagerHeader, key: "fileManagerHeader" }, [
          h('h3', { key: "fileManagerTitle" }, 'File Manager'),
          h('button', {
            className: styles.closeButton,
            onClick: () => setShowFileManager(false),
            key: "closeBtn"
          }, '×')
        ]),
        
        h('div', { className: styles.fileActions, key: "fileActions" }, [
          h('input', {
            type: "file",
            ref: fileInputRef,
            onChange: handleFileUpload,
            multiple: true,
            className: styles.hiddenFileInput,
            key: "fileInput"
          }),
          h('button', {
            className: styles.addFileButton,
            onClick: () => fileInputRef.current?.click(),
            key: "addFileBtn"
          }, [PlusIcon(), 'Add Files'])
        ]),

        h('div', { className: styles.filesList, key: "filesList" },
          files.length === 0
            ? h('p', { className: styles.noFiles, key: "noFiles" }, 'No files uploaded yet')
            : files.map(file =>
                h('div', { key: file.id, className: styles.fileItem }, [
                  h('div', { className: styles.fileIcon, key: "fileIcon" }, FileIcon()),
                  h('div', { className: styles.fileDetails, key: "fileDetails" }, [
                    h('p', { className: styles.fileName, key: "fileName" }, file.name),
                    h('p', { className: styles.fileInfo, key: "fileInfo" }, `${formatFileSize(file.size)} • ${formatTime(file.uploadDate)}`)
                  ]),
                  h('button', {
                    className: styles.removeFileButton,
                    onClick: () => removeFile(file.id),
                    key: "removeBtn"
                  }, CloseIcon())
                ])
              )
        ),
        h('button', {
            className: styles.submitFilesButton,
            onClick: handleSubmitFiles,
            disabled: files.length === 0,
            key: "submitFilesBtn"
        }, 'Submit Files')
      ])
    ]),

    // Chat Messages
    h('div', { className: styles.chatMessages, key: "chatMessages" }, [
      h('div', { className: styles.welcomeMessage, key: "welcomeMessage" }, [
        h('p', { key: "welcomeText" }, [
          'header',
          h('a', { href: "#", key: "communityLink" }, '')
        ])
      ]),
      
      ...messages.map(message =>
        h('div', {
          key: message.id,
          className: `${styles.message} ${styles[message.sender]}`
        }, [
          message.sender === 'bot' && h('div', { className: styles.avatar, key: "avatar" }, StarIcon()),
          h('div', { className: styles.messageContent, key: "messageContent" }, [
            h('div', { className: styles.messageBubble, key: "messageBubble" },
              message.type === 'file' 
                ? h('div', { className: styles.fileMessage, key: "fileMessage" }, [SmallFileIcon(), message.fileName])
                : message.text
            ),
            h('div', { className: styles.messageTime, key: "messageTime" }, 
              `${message.sender === 'bot' ? 'AskNirwana • ' : ''}${formatTime(message.timestamp)}`
            )
          ])
        ])
      ),
      
      isTyping && h('div', { className: `${styles.message} ${styles.bot}`, key: "typingMessage" }, [
        h('div', { className: styles.avatar, key: "typingAvatar" }, StarIcon()),
        h('div', { className: styles.messageContent, key: "typingContent" }, [
          h('div', { className: styles.messageBubble, key: "typingBubble" }, [
            h('div', { className: styles.typingIndicator, key: "typingIndicator" }, [
              h('span', { key: "dot1" }),
              h('span', { key: "dot2" }),
              h('span', { key: "dot3" })
            ])
          ])
        ])
      ]),
      
      h('div', { ref: messagesEndRef, key: "messagesEnd" })
    ]),

    // Input Area
    h('div', { className: styles.chatInput, key: "chatInput" }, [
      h('div', { className: styles.inputContainer, key: "inputContainer" }, [
        h('textarea', {
          value: inputValue,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value),
          onKeyDown: handleKeyPress,
          placeholder: "I have a question",
          className: styles.messageInput,
          rows: 1,
          key: "messageInput"
        }),
        h('button', {
          className: styles.sendButton,
          onClick: handleSendMessage,
          disabled: !inputValue.trim(),
          key: "sendBtn"
        }, SendIcon())
      ])
    ]),

    // Footer
    h('div', { className: styles.chatFooter, key: "chatFooter" }, [
      h('p', { key: "footerText" }, [
        'footer. ',
        h('a', { href: "#", key: "privacyLink" }, '')
      ])
    ])
  ]);
}
import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { MessageCircle, X, Send, HelpCircle, ShoppingCart, Truck, CreditCard, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.loginUser);
  const [agentMode, setAgentMode] = useState(false);
  const [adminOnline, setAdminOnline] = useState(null);
  const [chatEnded, setChatEnded] = useState(false);
  const pollingInterval = useRef(null);

  // Guest ID logic
  const [guestId, setGuestId] = useState(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('guestId', id);
    }
    return id;
  });

  // Static bot flow
  const conversationFlow = [
    {
      question: "Hello! Welcome to Surgical Instruments. How can I assist you today?",
      quickReplies: []
    },
    {
      question: "Are you looking for help with:",
      quickReplies: [
        { text: "Product Information", icon: <HelpCircle size={16} />, type: "product_info" },
        { text: "Order Status", icon: <ShoppingCart size={16} />, type: "order_status" },
        { text: "Shipping Info", icon: <Truck size={16} />, type: "shipping_info" },
        { text: "Payment Options", icon: <CreditCard size={16} />, type: "payment_options" },
        { text: "Talk to Agent", icon: <MessageCircle size={16} />, type: "talk_to_agent" }
      ]
    },
    {
      question: "Is there anything else I can assist you with?",
      quickReplies: [
        { text: "No, thank you", icon: null, type: "end_convo" },
        { text: "Yes, another question", icon: null, type: "restart" }
      ]
    }
  ];

  const quickReplyResponses = {
    product_info: {
      question: "About Our Products",
      answer: "We offer premium surgical instruments including:\n\n• Forceps (Tissue, Hemostatic, Dressing)\n• Scissors (Mayo, Metzenbaum, Iris)\n• Retractors (Army-Navy, Gelpi, Weitlaner)\n• Needle Holders (Castroviejo, Crile-Wood)\n\nAll instruments are made from German surgical stainless steel (DIN 1.4125) or US stainless steel (Type 410). Most products are autoclavable up to 135°C."
    },
    order_status: {
      question: "Order Status Information",
      answer: "Order processing details:\n\n• Processing time: 1-2 business days\n• Tracking available after shipment\n• International orders may take 3-5 days to process\n\nYou can check your order status in 'My Account' or by contacting support@example.com with your order #."
    },
    shipping_info: {
      question: "Shipping Options",
      answer: "We offer:\n\n• Standard Shipping (3-5 business days) - $8.99\n• Express Shipping (2 business days) - $14.99\n• Overnight Shipping - $24.99\n• International Shipping (5-10 business days) - Calculated at checkout\n\nFREE shipping on orders over $300 USD"
    },
    payment_options: {
      question: "Accepted Payment Methods",
      answer: "We accept:\n\n• Credit/Debit Cards (Visa, MasterCard, AMEX)\n• PayPal\n• Stripe\n• Bank Wire Transfer\n• JazzCash (for Pakistani customers)\n\nAll transactions are PCI-DSS compliant and encrypted for security."
    }
  };

  // FAQ database
  const faqs = [
    {
      triggers: ["return", "refund", "exchange"],
      question: "What is your return policy?",
      answer: "We accept returns within 30 days for unused items in original packaging. Custom/special order items cannot be returned. Please initiate returns through our portal or contact returns@example.com."
    },
    {
      triggers: ["sterile", "sterilization", "autoclave"],
      question: "Are instruments sterile?",
      answer: "Most instruments are non-sterile unless specified. We offer EO gas or gamma sterilization for an additional fee. All instruments are cleaned and passivated before shipping."
    },
    {
      triggers: ["warranty", "guarantee"],
      question: "What's your warranty policy?",
      answer: "All instruments come with a 1-year manufacturer warranty against defects. Normal wear and tear or misuse is not covered. Warranty claims require proof of purchase."
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize with first bot message (only in static mode)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (!agentMode) {
        setTimeout(() => {
          addBotMessage(conversationFlow[0].question);
          setCurrentQuestionIndex(1); // Move to next question with quick replies
        }, 500);
      }
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (isOpen) {
      // If closing the chat, reset agent mode and chat ended for next session
      setAgentMode(false);
      setChatEnded(false);
      setMessages([]);
      setCurrentQuestionIndex(0);
      setShowQuickReplies(false);
      setAdminOnline(null);
    }
    setIsOpen(!isOpen);
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { text, isUser: false, timestamp: new Date() }]);
    setShowQuickReplies(true);
  };

  // Fetch conversation from backend
  const fetchConversation = async () => {
    if (agentMode && chatEnded) return;
    if (agentMode && user && user.id) {
      // Authenticated user
      try {
        const res = await fetch(`${baseUrl}/v1/chat/conversation/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch conversation');
        const data = await res.json();
        if (data && data.messages) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.text,
              isUser: msg.sender === 'user',
              timestamp: new Date(msg.timestamp),
              sender: msg.sender
            }))
          );
          if (data.messages.some((msg) => msg.sender === 'admin' && msg.text === '__end_chat__')) {
            setChatEnded(true);
            if (pollingInterval.current) {
              clearInterval(pollingInterval.current);
              pollingInterval.current = null;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    } else if (agentMode && !user) {
      // Guest user
      try {
        const res = await fetch(`${baseUrl}/v1/chat/conversation/guest/${guestId}`);
        if (!res.ok) throw new Error('Failed to fetch conversation');
        const data = await res.json();
        if (data && data.messages) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.text,
              isUser: msg.sender === 'user',
              timestamp: new Date(msg.timestamp),
              sender: msg.sender
            }))
          );
          if (data.messages.some((msg) => msg.sender === 'admin' && msg.text === '__end_chat__')) {
            setChatEnded(true);
            if (pollingInterval.current) {
              clearInterval(pollingInterval.current);
              pollingInterval.current = null;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching guest conversation:', error);
      }
    }
  };

  // Start polling in agent mode
  useEffect(() => {
    if (agentMode && user && user.id && !chatEnded) {
      // Initial fetch
      fetchConversation();
      
      // Start polling
      pollingInterval.current = setInterval(fetchConversation, 2500);
      
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      };
    }
  }, [agentMode, user, chatEnded]);

  // Add user message (handles both static and agent mode)
  const addUserMessage = async (text) => {
    console.log("addUserMessage called", { agentMode, text, user });
    setInputValue('');
    setShowQuickReplies(false);
    
    if (agentMode && !chatEnded) {
      setMessages(prev => [...prev, { text, isUser: true, timestamp: new Date() }]);
      try {
        let body;
        if (user && user.id) {
          body = { userId: user.id, sender: 'user', text };
        } else {
          body = { guestId, sender: 'user', text };
        }
        const response = await fetch(`${baseUrl}/v1/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Failed to send message');
        setTimeout(() => {
          fetchConversation();
        }, 1000);
      } catch (error) {
        setMessages(prev => [...prev, { text: "Sorry, there was an error sending your message. Please try again.", isUser: false, timestamp: new Date() }]);
      }
      return;
    }

    // Static flow handling (only if NOT in agent mode)
    if (!agentMode) {
      setMessages(prev => [...prev, { text, isUser: true, timestamp: new Date() }]);
      
      // Check if message matches any FAQ
      const matchedFAQ = checkForFAQ(text);
      if (matchedFAQ) return;
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (currentQuestionIndex < conversationFlow.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          addBotMessage(conversationFlow[nextIndex].question);
        } else {
          addBotMessage("Thank you for chatting with us. Our support team is available 24/7 at support@example.com!");
        }
      }, 1500);
    }
  };

  // Handle quick replies (static flow only)
  const handleQuickReply = async (text, type) => {
    if (type === "talk_to_agent") {
      setIsTyping(true);
      setShowQuickReplies(false);
      try {
        // Delete previous chat before starting new session
        if (user && user.id) {
          await fetch(`${baseUrl}/v1/chat/conversation/${user.id}`, { method: 'DELETE' });
        } else if (guestId) {
          await fetch(`${baseUrl}/v1/chat/conversation/guest/${guestId}`, { method: 'DELETE' });
        }
        const response = await fetch(`${baseUrl}/v1/chat/admin-status`);
        const data = await response.json();
        setIsTyping(false);
        setAdminOnline(data.isOnline);
        setMessages([
          { text: "You are now connected to an agent. Please type your message.", isUser: false, timestamp: new Date() }
        ]);
        setCurrentQuestionIndex(0);
        setAgentMode(true);
        setChatEnded(false);
      } catch (error) {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: "Sorry, we couldn't connect you to an agent right now. Please try again later.", isUser: false, timestamp: new Date() }]);
      }
      return;
    }

    // Only allow static flow if NOT in agent mode
    if (!agentMode) {
      // Add user message first
      setMessages(prev => [...prev, { text, isUser: true, timestamp: new Date() }]);
      setShowQuickReplies(false);
      
      if (type && quickReplyResponses[type]) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const response = quickReplyResponses[type];
          setMessages(prev => [
            ...prev,
            { text: response.question, isUser: false, timestamp: new Date() },
            { text: response.answer, isUser: false, timestamp: new Date() }
          ]);
          setCurrentQuestionIndex(2); // Move to "anything else" question
          setShowQuickReplies(true);
        }, 1000);
      } else if (type === "restart") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setCurrentQuestionIndex(1);
          addBotMessage(conversationFlow[1].question);
        }, 800);
      } else if (type === "end_convo") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Thank you for contacting Surgical Instruments. Have a great day!");
          setShowQuickReplies(false);
        }, 800);
      }
    }
  };

  // FAQ check (static flow only)
  const checkForFAQ = (message) => {
    if (agentMode) return false;
    
    const lowerMessage = message.toLowerCase();
    for (const faq of faqs) {
      for (const trigger of faq.triggers) {
        if (lowerMessage.includes(trigger)) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
              ...prev, 
              { text: faq.question, isUser: false, timestamp: new Date() },
              { text: faq.answer, isUser: false, timestamp: new Date() }
            ]);
            setCurrentQuestionIndex(2); // Move to "anything else" question
            setShowQuickReplies(true);
          }, 1000);
          return true;
        }
      }
    }
    return false;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("handleSendMessage", inputValue);
    if (inputValue.trim() && !chatEnded) {
      addUserMessage(inputValue);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <MessageCircle size={24} />
          <span className="pulse-dot"></span>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <div className="avatar">SI</div>
              <div className="header-text">
                <h3>Surgical Instruments Support</h3>
                <p className="status">
                  {isTyping ? 'Typing...' : agentMode ? (adminOnline ? 'Agent Online' : 'Agent Offline') : 'Online'}
                </p>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {/* Only show welcome message if NOT in agent mode */}
            {!agentMode && (
              <div className="welcome-message">
                <p>Hello! I'm your Surgical Instruments assistant. Ask me about products, orders, shipping, or payments.</p>
                {!user && <p className="guest-info">You are chatting as a guest. Chat history will not be saved to your account unless you log in.</p>}
              </div>
            )}
            
            {messages.map((message, index) => {
              // If admin sent __end_chat__, show friendly message instead
              if (message.sender === 'admin' && message.text === '__end_chat__') {
                return (
                  <div key={index} className="message bot">
                    <div className="message-content">
                      <p>Thank you for chatting with us. Goodbye</p>
                      <span className="timestamp">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                );
              }
              // Otherwise, show the real message
              return (
                <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                  <div className="message-content">
                    {message.text.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                    <span className="timestamp">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            
            {/* Only show quick replies if NOT in agent mode */}
            {showQuickReplies && !agentMode && conversationFlow[currentQuestionIndex]?.quickReplies?.length > 0 && (
              <div className="quick-replies">
                {conversationFlow[currentQuestionIndex].quickReplies.map((reply, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuickReply(reply.text, reply.type)}
                    className="quick-reply-btn"
                  >
                    {reply.icon && <span className="quick-reply-icon">{reply.icon}</span>}
                    {reply.text}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={chatEnded ? "Chat has ended." : "Type your message..."}
              autoFocus
              disabled={chatEnded}
            />
            <button type="submit" disabled={!inputValue.trim() || chatEnded}>
              <Send size={18} />
            </button>
          </form>
          
          <div className="chatbot-footer">
            <div className="trust-badges">
              <Shield size={16} />
              <span>Secure & Confidential</span>
            </div>
          </div>
          
          {agentMode && adminOnline === false && (
            <div className="chatbot-offline-banner">
              Agent is currently offline. Your messages will be saved for later.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
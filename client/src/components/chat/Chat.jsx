import "./chat.css";
import model from "../../lib/gemini";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthenticationContext } from '../../context/AuthenticationContext';
import Markdown from "react-markdown";
import { useQuery } from '@tanstack/react-query';

const Chat = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthenticationContext);
  const userId = user._id;
  const token = localStorage.getItem('access_token');
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastSubmittedQuestion, setLastSubmittedQuestion] = useState(null);

  const hasLoadedLastQuestion = useRef(false); // Ref to track loading of last question

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`${apiUrl}/api/chat/userChat/${userId}`, { credentials: 'include' })
        .then((res) => res.json()),
  });

  // Function to add messages
  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  // Function to handle form submission and AI response
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.question.value;
    if (!text) return;

    // Add user message to the interface
    addMessage(text, "user");
    setLastSubmittedQuestion(text);

    try {
      // Call AI model for a response
      const result = await model.generateContent(text);
      const responseAi = await result.response.text();

      // Send message to the backend
      await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, text }),
      });

      // Add AI response
      addMessage(responseAi, "bot");
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
    }

    // Reset the question input
    setQuestion("");
  };

  const endRef = useRef(null);

  // Load the last asked question from history
  useEffect(() => {
    if (!data || !data.length) return;

    if (hasLoadedLastQuestion.current) return; // Avoid loading again

    const lastChat = data[data.length - 1];
    const lastQuestion = lastChat.history[lastChat.history.length - 1]?.parts[0]?.text;

    if (lastQuestion) {
      // Add the last question to the interface
      addMessage(lastQuestion, "user");

      // Generate AI response for the last question
      model.generateContent(lastQuestion)
        .then((result) => result.response.text())
        .then((responseAi) => {
          // Add AI response
          addMessage(responseAi, "bot");
        })
        .catch((err) => {
          console.error("Error generating AI content:", err);
        });

      // Mark that we've loaded the last question
      hasLoadedLastQuestion.current = true;
    }
  }, [data]);

  // Auto-scroll to the bottom when messages are added
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatAi">
      <div className="chatPageAi">
        <div className="wrapperAI">
          <div className="chatContainerAI">
            <div className="chatContainer">
              <div className="chatBox">
                {isPending ? "Loading..." :
                  error ? 'An error has occurred: ' + error.message :
                    messages?.map((message, index) => (
                      <div
                        key={index}
                        className={message.sender === "bot" ? "chatLeft" : "chatRight"}
                      >
                        <div className="chatMessage">
                          <Markdown className="chatText">{message.text}</Markdown>
                        </div>
                      </div>
                    ))}
                <div ref={endRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="inputWithButton">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="inputField"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit" className="sendBtn">
              <img
                src="https://img.icons8.com/ios-filled/50/000000/send-comment.png"
                alt="send"
                className="sendIcon"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

import "./chat.css";
import model from "../../lib/gemini";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthenticationContext } from '../../context/AuthenticationContext';
import Markdown from "react-markdown";
import { useQuery } from '@tanstack/react-query';

const Chat = () => {
  const { user } = useContext(AuthenticationContext);
  const userId = user._id;
  const token = localStorage.getItem('access_token');
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastSubmittedQuestion, setLastSubmittedQuestion] = useState(null); // Stocker la dernière question soumise

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`/api/chat/userChat/${userId}`, { credentials: 'include' })
        .then((res) => res.json()),
  });

  // Fonction qui gère l'ajout de messages
  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  // Fonction qui gère la soumission du formulaire et la réponse IA
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.question.value;
    if (!text) return;

    // Ajoute le message de l'utilisateur à l'interface
    addMessage(text, "user");
    setLastSubmittedQuestion(text); // Stocker la question soumise

    try {
      // Appel au modèle IA pour obtenir une réponse
      const result = await model.generateContent(text);
      const responseAi = await result.response.text();

      // Envoi du message au backend
      await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, text }),
      });

      // Ajouter la réponse de l'IA
      addMessage(responseAi, "bot");
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
    }

    // Réinitialiser la question dans le formulaire
    setQuestion("");
  };

  const endRef = useRef(null);

  // Charger la dernière question posée à partir de l'historique
  useEffect(() => {
    if (!data || !data.length) return;

    // Récupérer la dernière question posée
    const lastChat = data[data.length - 1];
    const lastQuestion = lastChat.history[lastChat.history.length - 1]?.parts[0]?.text;

    // Vérifier si la dernière question n'est pas celle soumise récemment
    if (lastQuestion && lastQuestion !== lastSubmittedQuestion) {
      // Ajouter la dernière question à l'interface si elle n'a pas déjà été ajoutée
      addMessage(lastQuestion, "user");

      // Appeler l'IA pour générer une réponse pour la dernière question
      model.generateContent(lastQuestion)
        .then((result) => result.response.text())
        .then((responseAi) => {
          // Ajouter la réponse de l'IA
          addMessage(responseAi, "bot");
        })
        .catch((err) => {
          console.error("Erreur lors de la génération de contenu de l'IA :", err);
        });

      // Mettre à jour la dernière question soumise pour éviter la boucle
      setLastSubmittedQuestion(lastQuestion);
    }
  }, [data]); // Se déclenche uniquement quand 'data' change

  // Scroll automatique vers le bas lors de l'ajout de messages
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
              value={question} // Lier l'état à la valeur de l'input
              onChange={(e) => setQuestion(e.target.value)} // Met à jour l'état à chaque changement dans l'input
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

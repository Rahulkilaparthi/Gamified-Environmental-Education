import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';
import { useUser } from '../contexts/UserContext';
import { LEARNING_TOPICS } from '../constants';
import { BadgeIcon } from '../components/BadgeIcon';
import { SparkleText } from '../components/SparkleText';
// FIX: Imported Award icon for the quiz summary screen
import { Loader, Check, X, Award } from 'lucide-react';

// FIX: Aligned with coding guidelines by removing `as string`
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple markdown to HTML converter for better lesson display
const markdownToHtml = (text: string): string => {
  const lines = text.split('\n');
  let html = '';
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };

  for (const line of lines) {
    // Process inline formatting first for the whole line
    let processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Block elements
    if (processedLine.startsWith('## ')) {
      closeList();
      html += `<h2>${processedLine.substring(3)}</h2>`;
      continue;
    }
    if (processedLine.startsWith('# ')) {
      closeList();
      html += `<h1>${processedLine.substring(2)}</h1>`;
      continue;
    }
    if (processedLine.startsWith('* ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${processedLine.substring(2)}</li>`;
      continue;
    }

    closeList();

    if (processedLine.trim()) {
      html += `<p>${processedLine}</p>`;
    }
  }

  closeList(); // Ensure any open list is closed at the end
  return html;
};


const Learn: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<{id: string; title: string} | null>(null);
    const [lesson, setLesson] = useState<string>('');
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async (topicTitle: string) => {
        setIsLoading(true);
        setError(null);
        setLesson('');
        setQuiz([]);

        try {
            const prompt = `Generate a short, engaging lesson and a 3-question multiple-choice quiz for a 14-year-old student in India about ${topicTitle}. Make the lesson easy to understand, use simple language, and include one fun fact. Format the lesson using markdown (e.g., ## for headings, * for list items).`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            lesson: {
                                type: Type.STRING,
                                description: "An engaging lesson in Markdown format about the topic."
                            },
                            quiz: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        correctAnswer: { type: Type.STRING },
                                    },
                                    required: ['question', 'options', 'correctAnswer']
                                },
                            },
                        },
                        required: ['lesson', 'quiz']
                    },
                },
            });

            const parsedResponse = JSON.parse(response.text);
            if (parsedResponse.lesson && Array.isArray(parsedResponse.quiz)) {
                setLesson(parsedResponse.lesson);
                setQuiz(parsedResponse.quiz);
            } else {
                throw new Error("Failed to parse content from the API response.");
            }
        } catch (e) {
            console.error(e);
            setError("Oops! Something went wrong while fetching content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTopicSelect = (topic: {id: string, title: string}) => {
        setSelectedTopic(topic);
        fetchContent(topic.title);
    };
    
    const handleQuizFinish = () => {
        setSelectedTopic(null);
        setLesson('');
        setQuiz([]);
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-6">Learn & Grow</h1>
            {!selectedTopic ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LEARNING_TOPICS.map((topic) => (
                        <button key={topic.id} onClick={() => handleTopicSelect(topic)} className="group bg-surface dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 text-center flex flex-col items-center justify-center space-y-3">
                            <BadgeIcon iconName={topic.icon} className="w-16 h-16 text-primary group-hover:animate-wiggle"/>
                            <h2 className="text-xl font-semibold">{topic.title}</h2>
                            <p className="text-text-secondary dark:text-gray-400">{topic.description}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedTopic(null)} className="mb-6 text-primary font-semibold hover:underline">&larr; Back to Topics</button>
                    <h2 className="text-3xl font-bold mb-4">{selectedTopic.title}</h2>
                    {isLoading && <div className="text-center my-12"><SparkleText text="Generating your lesson..." className="text-2xl font-semibold text-text-secondary dark:text-gray-400" /></div>}
                    {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
                    
                    {lesson && (
                        <div className="prose dark:prose-invert max-w-none bg-surface dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8 animate-fade-in-up" dangerouslySetInnerHTML={{ __html: markdownToHtml(lesson) }}></div>
                    )}

                    {quiz.length > 0 && <QuizComponent questions={quiz} onFinish={handleQuizFinish} />}
                </div>
            )}
        </div>
    );
};


const QuizComponent: React.FC<{ questions: QuizQuestion[]; onFinish: () => void; }> = ({ questions, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    // FIX: Added state to track quiz completion for better UX
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const { addPoints } = useUser();

    const currentQuestion = questions[currentQuestionIndex];
    
    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            // FIX: Replaced alert with state update for a summary screen
            const pointsEarned = score * 10;
            addPoints(pointsEarned);
            setIsQuizFinished(true);
        }
    };

    // FIX: Render a summary screen when the quiz is finished
    if (isQuizFinished) {
        const pointsEarned = score * 10;
        return (
            <div className="bg-surface dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center animate-fade-in-up">
                <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
                <Award className="w-16 h-16 mx-auto text-primary" />
                <p className="text-lg mt-4">
                    You scored {score}/{questions.length}!
                </p>
                <p className="text-xl font-semibold text-primary mt-2">
                    You've earned {pointsEarned} Eco-Points!
                </p>
                <button onClick={onFinish} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition">
                    Explore More Topics
                </button>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="bg-surface dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-4">Quick Quiz!</h3>
            <p className="text-lg font-semibold mb-4">{currentQuestion.question}</p>
            <div className="space-y-3">
                {currentQuestion.options.map(option => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    let buttonClass = 'w-full text-left p-3 rounded-lg border-2 transition-colors ';
                    if (isAnswered) {
                        if (isCorrect) buttonClass += 'bg-green-100 border-green-500 text-green-800';
                        else if (isSelected) buttonClass += 'bg-red-100 border-red-500 text-red-800';
                        else buttonClass += 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
                    } else {
                        buttonClass += 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-primary';
                    }
                    
                    return (
                        <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswered} className={buttonClass}>
                            <span className="flex items-center">
                                {isAnswered && (isSelected ? (isCorrect ? <Check className="mr-2 text-green-600"/> : <X className="mr-2 text-red-600"/>) : (isCorrect ? <Check className="mr-2 text-green-600"/> : <span className="w-6 mr-2"></span>))}
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>
            {isAnswered && (
                <button onClick={handleNext} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
            )}
        </div>
    );
};

export default Learn;
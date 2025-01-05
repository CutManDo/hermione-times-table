"use strict";
// Game States
const GAME_STATES = {
  INTRO: 'intro',
  FAT_LADY: 'fatLady',
  POTIONS_INTRO: 'potionsIntro',
  POTIONS_CLASS: 'potionsClass',
  ROOM_OF_REQUIREMENT_INTRO: 'roomOfRequirementIntro',
  ROOM_OF_REQUIREMENT: 'roomOfRequirement',
  BELLATRIX_INTRO: 'bellatrixIntro',
  BELLATRIX_FIGHT: 'bellatrixFight',
  VICTORY: 'victory',
  GAME_OVER: 'gameOver'
};

// Characters
const CHARACTERS = {
  fatLady: {
    name: 'הגברת השמנה',
    color: 'bg-pink-100',
    message: 'עלייך לענות נכון כדי להיכנס למועדון גריפינדור!'
  },
  draco: {
    name: 'דראקו מאלפוי',
    color: 'bg-green-100',
    message: 'חה! נראה אם את באמת כזאת חכמה, גריינג\'ר!'
  },
  filch: {
    name: 'ארגוס פילץ\'',
    color: 'bg-gray-100',
    message: 'מה את עושה במסדרונות בשעה כזו?'
  },
  pansy: {
    name: 'פנסי פרקינסון',
    color: 'bg-purple-100',
    message: 'בואי נראה כמה את שווה, יא בוצדמית!'
  },
  bellatrix: {
    name: 'בלטריקס לסטריינג\'',
    color: 'bg-red-100',
    message: 'אההה... מי הגיעה לבקר?'
  }
};

function HermioneMathGame() {
  const [gameState, setGameState] = React.useState(GAME_STATES.INTRO);
  const [lives, setLives] = React.useState(3);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [currentCharacter, setCurrentCharacter] = React.useState(null);
  const [problem, setProblem] = React.useState(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [score, setScore] = React.useState(0);
  // Generate math problem
  const generateProblem = React.useCallback(() => {
    const isEasyQuestion = currentQuestion % 5 === 4;
    let num1, num2;

    if (isEasyQuestion) {
      num1 = Math.floor(Math.random() * 5) + 2;
      num2 = Math.floor(Math.random() * 5) + 2;
    } else {
      num1 = Math.floor(Math.random() * 6) + 5;
      num2 = Math.floor(Math.random() * 6) + 5;
    }

    if (gameState === GAME_STATES.FAT_LADY) {
      const correctAnswer = num1 * num2;
      const options = [
        correctAnswer,
        correctAnswer + Math.floor(Math.random() * 10) + 1,
        correctAnswer - Math.floor(Math.random() * 10) - 1,
        correctAnswer + Math.floor(Math.random() * 20) - 10
      ].sort(() => Math.random() - 0.5);
      
      setProblem({ num1, num2, options, correctAnswer });
    } else {
    let hiddenPosition = Math.random() < 0.5 ? 'num1' : 'num2';
const correctAnswer = hiddenPosition === 'num1' ? num1 : num2;
setProblem({ 
  num1: hiddenPosition === 'num1' ? '?' : num1, 
  num2: hiddenPosition === 'num2' ? '?' : num2, 
  correctAnswer, 
  hiddenPosition 
});
    }
  }, [gameState, currentQuestion]);

  // Initialize stage
  React.useEffect(() => {
    switch (gameState) {
      case GAME_STATES.FAT_LADY:
        setLives(3);
        setTimeLeft(0);
        setCurrentQuestion(0);
        setCurrentCharacter(CHARACTERS.fatLady);
        generateProblem();
        break;
      case GAME_STATES.POTIONS_CLASS:
        setTimeLeft(300);
        setCurrentQuestion(0);
        setCurrentCharacter(CHARACTERS.draco);
        generateProblem();
        break;
      case GAME_STATES.ROOM_OF_REQUIREMENT:
        setLives(3);
        setTimeLeft(300);
        setCurrentQuestion(0);
        generateProblem();
        break;
      case GAME_STATES.BELLATRIX_FIGHT:
        setTimeLeft(120);
        setCurrentQuestion(0);
        setCurrentCharacter(CHARACTERS.bellatrix);
        generateProblem();
        break;
    }
  }, [gameState, generateProblem]);
  // Timer effect
  React.useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GAME_STATES.GAME_OVER);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

const checkFatLadyAnswer = (selectedAnswer) => {
    if (selectedAnswer === problem.correctAnswer) {
        const newScore = score + 1;  // שומרים את הציון החדש במשתנה
        setScore(newScore);  // מעדכנים את הציון
        
        if (newScore >= 15) {  // בודקים לפי הציון החדש במקום הישן
            setMessage('מצוין! הגברת השמנה מאפשרת לך להיכנס!');
            setTimeout(() => {
                setGameState(GAME_STATES.POTIONS_INTRO);
                setScore(0);  // מאפסים את הציון לשלב הבא
            }, 1500);
        } else {
            setMessage('נכון מאוד!');
            generateProblem();  // שאלה חדשה
        }
    } else {
        setMessage('לא נכון, נסי שוב!');
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                setGameState(GAME_STATES.GAME_OVER);
            }
            return newLives;
        });
    }
};
  // Regular answer check
 const checkAnswer = () => {
    if (!userAnswer) return;
    
    const answer = parseInt(userAnswer);
    const isCorrect = gameState === GAME_STATES.ROOM_OF_REQUIREMENT 
    ? (problem.hiddenPosition === 'num1' 
        ? answer * problem.num2 === problem.num2 * problem.correctAnswer
        : problem.num1 * answer === problem.num1 * problem.correctAnswer)
    : answer === problem.correctAnswer;
if (isCorrect) {
        const newQuestion = currentQuestion + 1;
        setCurrentQuestion(newQuestion);
        setMessage('מצוין! הצלחת להדוף את הלחש!');
        
        if (newQuestion >= 5 && gameState === GAME_STATES.POTIONS_CLASS) {
            if (currentCharacter === CHARACTERS.draco) {
    setMessage('דראקו נסוג! אבל מי זה מגיע...');
    setTimeout(() => {
        setCurrentCharacter(CHARACTERS.filch);
        generateProblem();
    }, 1500);
} else if (currentCharacter === CHARACTERS.filch) {
    setMessage('פילץ\' בורח! אבל פנסי מתקרבת...');
    setTimeout(() => {
        setCurrentCharacter(CHARACTERS.pansy);
        generateProblem();
    }, 1500);
}
            } else {
                setMessage('הצלחת לעבור את כולם!');
                setTimeout(() => {
                    setGameState(GAME_STATES.ROOM_OF_REQUIREMENT_INTRO);
                }, 1500);
            }
        } else {
            generateProblem();
        }
    } else {
        setMessage('לא נכון, נסי שוב!');
        if (lives > 0) {
            setLives(prev => prev - 1);
        }
    }
    setUserAnswer('');
};

  const nextState = () => {
    switch (gameState) {
      case GAME_STATES.ROOM_OF_REQUIREMENT:
        return GAME_STATES.BELLATRIX_INTRO;
      case GAME_STATES.BELLATRIX_FIGHT:
        return GAME_STATES.VICTORY;
      default:
        return GAME_STATES.GAME_OVER;
    }
  };
  // Render intro screen
  if (gameState === GAME_STATES.INTRO) {
    return (
      <div className="game-container">
        <div className="game-card">
          <h1 className="text-3xl font-bold mb-6 text-purple-800">הרפתקת החשבון של הרמיוני</h1>
          <div className="text-center">
            <p className="text-lg mb-4">ברוכה הבאה להוגוורטס, הרמיוני!</p>
            <p className="text-md mb-4">האם תצליחי להתמודד עם כל האתגרים שמחכים לך?</p>
            <button 
              className="game-button"
              onClick={() => setGameState(GAME_STATES.FAT_LADY)}
            >
              התחילי במסע!
            </button>
          </div>
        </div>
      </div>
    );
  }

// Render Fat Lady screen
if (gameState === GAME_STATES.FAT_LADY) {
  return (
    <div className="game-container">
      <div className="game-card">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-purple-800">הגברת השמנה</h1>
          <p className="text-lg mb-4">
            עלייך לענות נכון על 15 שאלות כדי להיכנס. ענית נכון על {score} שאלות!
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(lives)].map((_, i) => (
              <span key={i} className="text-red-500 text-2xl">❤️</span>
            ))}
          </div>
          {problem && (
            <div>
              <p className="text-xl font-bold mb-4">{problem.num1} × {problem.num2} = ?</p>
              <div className="grid grid-cols-2 gap-4">
                {problem.options.map((option, index) => (
                  <button
                    key={index}
                    className="game-button"
                    onClick={() => checkFatLadyAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          {message && (
            <p className="mt-4 text-lg font-bold">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
// Render Potions Class screen
if (gameState === GAME_STATES.POTIONS_CLASS) {
    return (
      <div className="game-container">
        <div className="game-card">
          <div className="flex justify-between items-center mb-6">
            {/* הסרנו את תצוגת מספר השאלה */}
            <div className="text-xl font-bold bg-purple-100 px-4 py-2 rounded-lg">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">{currentCharacter.name}</h2>
            <p className="text-lg mb-4">{currentCharacter.message}</p>
            
            {problem && (
              <div className="space-y-4">
                <p className="text-2xl font-bold">{problem.num1} × {problem.num2} = ?</p>
                <div className="flex justify-center gap-4">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-24 text-center text-xl border rounded p-2"
                    placeholder="?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        checkAnswer();
                      }
                    }}
                  />
                  <button 
                    className="game-button"
                    onClick={checkAnswer}
                  >
                    הטל לחש!
                  </button>
                </div>
              </div>
            )}
            
            {message && (
              <p className="mt-4 text-lg font-bold">{message}</p>
            )}
          </div>
        </div>
      </div>
    );
}

  // Render Room of Requirement screen
  if (gameState === GAME_STATES.ROOM_OF_REQUIREMENT) {
    return (
      <div className="game-container">
        <div className="game-card">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">שאלה {currentQuestion + 1}/15</div>
            <div className="text-xl font-bold bg-purple-100 px-4 py-2 rounded-lg">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">חדר הנחיצות</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(lives)].map((_, i) => (
                <span key={i} className="text-red-500 text-2xl">❤️</span>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-bold">
  {problem.num1} × {problem.num2} = 
  {problem.hiddenPosition === 'num1' ? '?' : problem.num1} × 
  {problem.hiddenPosition === 'num2' ? '?' : problem.num2}
</p>
              <div className="flex justify-center gap-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-24 text-center text-xl border rounded p-2"
                  placeholder="?"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkAnswer();
                    }
                  }}
                />
                <button 
                  className="game-button"
                  onClick={checkAnswer}
                >
                  הטל לחש!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
// Render Bellatrix Fight screen
  if (gameState === GAME_STATES.BELLATRIX_FIGHT) {
    return (
      <div className="game-container">
        <div className="game-card">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">שאלה {currentQuestion + 1}/15</div>
            <div className="text-xl font-bold bg-red-100 px-4 py-2 rounded-lg">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{CHARACTERS.bellatrix.name}</h2>
            <p className="text-lg mb-4">{CHARACTERS.bellatrix.message}</p>
            
            {problem && (
              <div className="space-y-4">
                <p className="text-2xl font-bold">{problem.num1} × {problem.num2} = ?</p>
                <div className="flex justify-center gap-4">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-24 text-center text-xl border rounded p-2"
                    placeholder="?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        checkAnswer();
                      }
                    }}
                  />
                  <button 
                    className="game-button"
                    onClick={checkAnswer}
                  >
                    הטל לחש!
                  </button>
                </div>
              </div>
            )}
            
            {message && (
              <p className="mt-4 text-lg font-bold">{message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Victory screen
  if (gameState === GAME_STATES.VICTORY) {
    return (
      <div className="game-container">
        <div className="game-card text-center">
          <h1 className="text-3xl font-bold mb-6 text-purple-800">כל הכבוד!</h1>
          <p className="text-xl mb-4">הצלחת להביס את בלטריקס!</p>
          <button 
            className="game-button"
            onClick={() => setGameState(GAME_STATES.INTRO)}
          >
            שחקי שוב!
          </button>
        </div>
      </div>
    );
  }

  // Render Game Over screen
  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div className="game-container">
        <div className="game-card text-center">
          <h1 className="text-3xl font-bold mb-6 text-red-800">המשחק נגמר!</h1>
          <button 
            className="game-button"
            onClick={() => setGameState(GAME_STATES.INTRO)}
          >
            נסי שוב!
          </button>
        </div>
      </div>
    );
  }

  // Default render for stage intros
  return (
    <div className="game-container">
      <div className="game-card text-center">
        <h1 className="text-3xl font-bold mb-6 text-purple-800">
          {gameState === GAME_STATES.POTIONS_INTRO && 'בדרך לשיעור שיקויים'}
          {gameState === GAME_STATES.ROOM_OF_REQUIREMENT_INTRO && 'חדר הנחיצות'}
          {gameState === GAME_STATES.BELLATRIX_INTRO && 'בלטריקס!'}
        </h1>
        <button 
          className="game-button"
          onClick={() => {
            switch (gameState) {
              case GAME_STATES.POTIONS_INTRO:
                setGameState(GAME_STATES.POTIONS_CLASS);
                break;
              case GAME_STATES.ROOM_OF_REQUIREMENT_INTRO:
                setGameState(GAME_STATES.ROOM_OF_REQUIREMENT);
                break;
              case GAME_STATES.BELLATRIX_INTRO:
                setGameState(GAME_STATES.BELLATRIX_FIGHT);
                break;
            }
          }}
        >
          המשיכי!
        </button>
      </div>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(HermioneMathGame)
  )
);

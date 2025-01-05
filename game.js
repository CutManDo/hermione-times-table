'use strict';

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
  fatLady: { name: 'הגברת השמנה', color: 'bg-pink-100', message: 'עני נכון כדי להיכנס למועדון גריפינדור!' },
  draco: { name: 'דראקו מאלפוי', color: 'bg-green-100', message: 'חה! נראה אם את באמת חכמה, גריינג'ר!' },
  filch: { name: 'ארגוס פילץ'', color: 'bg-gray-100', message: 'מה את עושה כאן?' },
  pansy: { name: 'פנסי פרקינסון', color: 'bg-purple-100', message: 'בואי נראה מה את שווה!' },
  bellatrix: { name: 'בלטריקס לסטריינג'', color: 'bg-red-100', message: 'מי העזה להיכנס?!' }
};

function HermioneMathGame() {
  const [gameState, setGameState] = React.useState(GAME_STATES.INTRO);
  const [lives, setLives] = React.useState(3);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [currentCharacter, setCurrentCharacter] = React.useState(null);
  const [problem, setProblem] = React.useState(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [message, setMessage] = React.useState('');

  const generateProblem = React.useCallback(() => {
    let num1 = Math.floor(Math.random() * 9) + 2;
    let num2 = Math.floor(Math.random() * 9) + 2;
    const correctAnswer = num1 * num2;
    const options = [
      correctAnswer,
      correctAnswer + Math.floor(Math.random() * 10) + 1,
      correctAnswer - Math.floor(Math.random() * 10) - 1,
      correctAnswer + Math.floor(Math.random() * 20) - 10
    ].sort(() => Math.random() - 0.5);
    setProblem({ num1, num2, options, correctAnswer });
  }, [gameState, currentQuestion]);

  const generateRequirementProblem = React.useCallback(() => {
    let num1 = Math.floor(Math.random() * 9) + 2;
    let num2 = Math.floor(Math.random() * 9) + 2;
    const correctAnswer = num1 * num2;
    const missingIndex = Math.floor(Math.random() * 3);
    setProblem({ num1, num2, correctAnswer, missingIndex });
  }, [gameState, currentQuestion]);

  React.useEffect(() => {
    switch (gameState) {
      case GAME_STATES.FAT_LADY:
        setLives(3);
        setScore(0);
        setCurrentCharacter(CHARACTERS.fatLady);
        generateProblem();
        break;
      case GAME_STATES.POTIONS_CLASS:
        setTimeLeft(300);
        setScore(0);
        setCurrentCharacter(CHARACTERS.draco);
        generateProblem();
        break;
      case GAME_STATES.ROOM_OF_REQUIREMENT:
        setLives(3);
        setScore(0);
        generateRequirementProblem();
        break;
      case GAME_STATES.BELLATRIX_FIGHT:
        setTimeLeft(120);
        setScore(0);
        setCurrentCharacter(CHARACTERS.bellatrix);
        generateProblem();
        break;
    }
  }, [gameState, generateProblem, generateRequirementProblem]);

  const checkAnswer = (selectedAnswer) => {
    if (selectedAnswer === problem.correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage('נכון מאוד!');
      if (newScore >= 5) {
        if (currentCharacter === CHARACTERS.draco) {
          setCurrentCharacter(CHARACTERS.filch);
          setScore(0);
          generateProblem();
        } else if (currentCharacter === CHARACTERS.filch) {
          setCurrentCharacter(CHARACTERS.pansy);
          setScore(0);
          generateProblem();
        } else {
          setGameState(GAME_STATES.ROOM_OF_REQUIREMENT_INTRO);
        }
      } else {
        generateProblem();
      }
    } else {
      setLives(lives - 1);
    }
  };

  const checkRoomRequirementAnswer = () => {
    if (!userAnswer) return;
    const answer = parseInt(userAnswer);
    let isCorrect = false;
    switch (problem.missingIndex) {
      case 0: isCorrect = answer * problem.num2 === problem.correctAnswer; break;
      case 1: isCorrect = problem.num1 * answer === problem.correctAnswer; break;
      case 2: isCorrect = problem.num1 * problem.num2 === answer; break;
    }
    if (isCorrect) {
      setScore(score + 1);
      if (score >= 14) {
        setGameState(GAME_STATES.BELLATRIX_INTRO);
      } else {
        generateRequirementProblem();
      }
    } else {
      setLives(lives - 1);
    }
  };

  if (gameState === GAME_STATES.INTRO) return (<div>Intro Screen</div>);
  if (gameState === GAME_STATES.GAME_OVER) return (<div>Game Over</div>);
  return (<div>Game Screen</div>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(HermioneMathGame)));

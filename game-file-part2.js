if (gameState === GAME_STATES.POTIONS_CLASS) {
    return (
      <div className="game-container">
        <div className="game-card">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">שאלה {currentQuestion + 1}/5</div>
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
            <div className="space-y-4">
              <p className="text-2xl font-bold">
                {problem.num1} × {problem.num2} = {problem.correctAnswer}
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
            
            {message && (
              <p className="mt-4 text-lg font-bold">{message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

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

// Render the game
ReactDOM.render(
  <HermioneMathGame />,
  document.getElementById('root')
);

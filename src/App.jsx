import { useState } from "react";
import { clsx } from "clsx";
import Confetti from "react-confetti";

import { languages } from "/languages.js";
import { getFarewellText, getRandomWord } from "./utils.js";

export default function App() {
  // State values
  const [currentWord, setCurrentWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  console.log("guessedLetters", guessedLetters);
  console.log("currentWord", currentWord);

  // derived values
  const wrongGuessCount = guessedLetters.filter((c) => {
    return !currentWord.toUpperCase().includes(c);
  }).length;
  console.log("wrongGuessCount", wrongGuessCount);

  const isGameWon = currentWord.split("").every((c) => {
    return guessedLetters.includes(c.toUpperCase());
  });
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  console.log("isGameWon", isGameWon);
  console.log("isGameLost", isGameLost);
  console.log("isGameOver", isGameOver);

  const lastLang = languages[wrongGuessCount - 1];
  const lastGuessed = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedWrong = !currentWord.toUpperCase().includes(lastGuessed);

  console.log("lastlang", lastLang);
  console.log("lastGuessed", lastGuessed);
  console.log("isLastGuessedWrong", isLastGuessedWrong);

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevArr) =>
      prevArr.includes(letter) ? prevArr : [...prevArr, letter]
    );
  }

  const langArray = languages.map((element, index) => {
    const styles = {
      backgroundColor: element.backgroundColor,
      color: element.color,
    };

    const isLost = index < wrongGuessCount;
    return (
      <div
        className={clsx({ chip: true, lost: isLost })}
        style={styles}
        key={element.name}>
        {element.name}
      </div>
    );
  });

  const currentWordArr = currentWord.toUpperCase().split("");
  const currentWordElements = currentWordArr.map((c, index) => {
    if (!isGameOver) {
      return (
        <span key={index} className="letter">
          {guessedLetters.includes(c) ? c : ""}
        </span>
      );
    } else {
      const className = clsx(
        "letter",
        !guessedLetters.includes(c) ? "wrong-guess" : null
      );
      return (
        <span key={index} className={className}>
          {c}
        </span>
      );
    }
  });

  const keyboardElements = alphabet
    .toUpperCase()
    .split("")
    .map((c) => {
      let isGuessed = guessedLetters.includes(c);
      let isCorrect = isGuessed && currentWord.toUpperCase().includes(c);
      let isWrong = isGuessed && !currentWord.toUpperCase().includes(c);

      const className = clsx({
        correct: isCorrect,
        wrong: isWrong,
      });

      return (
        <button
          key={c}
          className={className}
          disabled={isGameOver}
          aria-disabled={isGuessed}
          aria-label={`Letter ${c}`}
          onClick={() => addGuessedLetter(c)}>
          {c}
        </button>
      );
    });

  function getGameStatus() {
    if (isGameWon) {
      return (
        <section className="game-status game-won">
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </section>
      );
    } else if (isGameLost) {
      return (
        <section className="game-status game-lost">
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </section>
      );
    } else if (!isGameOver && isLastGuessedWrong && lastLang) {
      return (
        <section className="game-status farewell">
          <p>"{getFarewellText(lastLang.name)}"</p>
        </section>
      );
    } else {
      return (
        <section className="game-status">
          <h2> </h2>
          <p> </p>
        </section>
      );
    }
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }
  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <div aria-live="polite" role="status">
        {getGameStatus()}
      </div>

      <section className="chips-container">{langArray}</section>

      <section className="letters-container">{currentWordElements}</section>

      <section className="sr-only" aria-live="polite" role="status">
        <p>
          Current Word:{" "}
          {currentWord
            .toUpperCase()
            .split("")
            .map((c) => {
              return guessedLetters.includes(c) ? `${c}.` : "blank.";
            })
            .join(" ")}
        </p>
      </section>

      <section className="keyboard-container">{keyboardElements}</section>

      {isGameOver && (
        <button className="new-game-btn" onClick={startNewGame}>
          New Game
        </button>
      )}

      {isGameWon && <Confetti />}
    </main>
  );
}

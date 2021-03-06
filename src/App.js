import React, { useState } from 'react';
import './App.css';

function randomDate() {
  const start = new Date(1950, 0, 1)
  const end = new Date(2050, 11, 31)
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getMonthName(date) {
  return ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ][date.getMonth()];
}

function getDayOfWeek(dayOfWeek) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];
}

function App() {
  const [date, setDate] = useState(randomDate())
  const [shouldRevealAnswer, setShouldRevealAnswer] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const dateString = `${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`

  return (
    <div className="App">
      <div className="App-dateLine">
        <div className={"App-date"}>{dateString}</div> fell on a
      </div>
      {
        new Array(7).fill(0)
          .map(
            (_, i) =>
              <DayOfWeek
                key={i}
                dayOfWeek={i}
                onClick={ () => !shouldRevealAnswer ? setSelectedDay(i) : null }
                isSelected={ !shouldRevealAnswer && selectedDay === i }
                isCorrect={
                  shouldRevealAnswer
                    && date.getDay() === i
                }

                isIncorrect={
                  shouldRevealAnswer
                    && selectedDay === i
                    && date.getDay() !== i

                }
              />
          )
      }

      {
        shouldRevealAnswer
          ? <Result
            isCorrect={date.getDay() === selectedDay}
            correctAnswers={correctAnswers}
            totalAttempts={totalAttempts}
            year={date.getFullYear()}
          />
          : null
      }

      {
        selectedDay === null
          ? null
          :<NextStep
            shouldRevealAnswer={shouldRevealAnswer}
            onClick={() => {
              if (!shouldRevealAnswer) {
                setTotalAttempts(totalAttempts + 1);
                if (date.getDay() === selectedDay) {
                  setCorrectAnswers(correctAnswers + 1);
                }
                setShouldRevealAnswer(true)
              } else {
                setShouldRevealAnswer(false);
                setDate(randomDate());
                setSelectedDay(null);
              }
            }}
          />
      }
    </div>
  );
}

function calculateDoomsday(year) {
  const centuryCodeCycle = [5, 3, 2, 0]
  let centuryIndex = Math.floor(year / 100) - 18
  while (centuryIndex < 0) {
    centuryIndex += 4;
  }
  const centuryCode = centuryCodeCycle[centuryIndex % centuryCodeCycle.length];

  const yearsIntoCentury = year % 100;
  const numLeapYears = Math.floor(yearsIntoCentury / 4);

  return (centuryCode + yearsIntoCentury + numLeapYears) % 7;
}

function Result(props) {
  const correctPhrases = ["Correct!", "Exactly!", "Right on!", "You got it!", "That's right!"]
  const correctPhrase = correctPhrases[Math.floor(Math.random()*correctPhrases.length)];

  const classNames = ["Result"]
  if (props.isCorrect) {
    classNames.push("Result--correct")
  } else {
    classNames.push("Result--incorrect")
  }

  return <div className={classNames.join(" ")}>
    <div className="Result-result">
      { props.isCorrect ? correctPhrase : "incorrect - try again!" }
    </div>
    <div className="Result-record">
      ({props.correctAnswers}/{props.totalAttempts}) - pi day fell on a {getDayOfWeek(calculateDoomsday(props.year))}
    </div>
  </div>
}

function DayOfWeek(props) {
  const classNames = ["DayOfWeek"]

  if (props.isSelected) {
    classNames.push("DayOfWeek--selected");
  }

  if (props.isCorrect) {
    classNames.push("DayOfWeek--correct")
  }

  if (props.isIncorrect) {
    classNames.push("DayOfWeek--incorrect")
  }

  return (
    <div className={classNames.join(" ")} onClick={props.onClick} >
      <span className="DayOfWeek-text">{ getDayOfWeek(props.dayOfWeek) }</span>
    </div>
  )
}

function NextStep(props) {
  return (
    <div className="NextStep" onClick={props.onClick}>
      { props.shouldRevealAnswer ? "Try another" : "Check answer" }
    </div>
  )
}

export default App;

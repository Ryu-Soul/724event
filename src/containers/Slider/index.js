import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false)
  
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1 
  )|| [];

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      setIsPaused(!isPaused);
      }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
  }, [isPaused]);

  useEffect(() => {
    let timer;
    if (!isPaused) {
      const nextCard = () => {
        setIndex((prevIndex) =>
          prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
        );
      };
      timer = setTimeout(nextCard, 5000);
    }

    return () => clearTimeout(timer);
  }, [index, byDateDesc.length, isPaused]);

  return (
    <div className="SlideCardList" data-testid="slider" data-paused={isPaused}>
      {byDateDesc?.map((focus, idx) => (
          <div
            key={focus.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={focus.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{focus.title}</h3>
                <p>{focus.description}</p>
                <div>{getMonth(new Date(focus.date))}</div>
              </div>
            </div>
          </div>
      ))}
      <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc?.map((focus, idx) => (
                <input
                  key={`${focus.title}`}
                  type="radio"
                  name="radio-button"
                  checked={index === idx}
                  onChange={() => setIndex(idx)}
                />
              ))}
            </div>
      </div>
    </div>
  );
};

export default Slider;

import { useEffect, useRef, useState } from "react";
import "./Autocomplete.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Autocomplete({ multiple = false }) {
  const apiUrl = "http://localhost:3000";

  const [inputValue, setInputValue] = useState("");
  const [listValues, setListValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const fetchData = async (terms, page) => {
    try {
      const response = await axios.post(
        `${apiUrl}/user/${page}`,
        {
          terms: [terms],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setListValues(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
    }
  };

  useEffect(() => {
    fetchData("", 1);
  }, []);

  useEffect(() => {
    if (inputValue) {
      fetchData(inputValue, 1);
    }
  }, [inputValue]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (e) => {
    setTimeout(() => {
      if (!containerRef.current.contains(e.relatedTarget)) {
        setIsOpen(false);
      }
    }, 200);
  };

  const handleSelectValue = (value) => {
    if (multiple) {
      if (!selectedValue.some((v) => v.id === value.id)) {
        setSelectedValue([...selectedValue, value]);
      }
    } else {
      setSelectedValue([value]);
    }
  };

  const isSelected = (item) => {
    return selectedValue.some((value) => value.id == item.id);
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="selected-users">
        {selectedValue.map((value, index) => (
          <div key={index} className="chip">
            {value.firstName} {value.lastName}
          </div>
        ))}
      </div>
      <div className="inputWrapper">
        <input
          type="text"
          placeholder="Saisissez un texte"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="autocomplete-input"
          ref={inputRef}
        />
        <FontAwesomeIcon icon={faSearch} className="icon" />
      </div>
      {isOpen && listValues.length > 0 && (
        <ul className="autocomplete-list" ref={listRef}>
          {listValues.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectValue(user)}
              className={`autocomplete-list-item ${
                isSelected(user) ? "selected" : ""
              }`}
            >
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Finalement mon problème de onBlur ne venait pas de Safari : quand je fais setIsOpen(false), il le ferme trop vite et le onClick n'a pas le temps de s'éxecuter.
// J'ai reussi à résoudre le soucis en mettant un timeout mais du coup la liste se ferme tout le temps dès qu'on clique dedans

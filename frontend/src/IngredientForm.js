import React, { useState } from "react";
import axios from "axios";

function IngredientForm() {
  const [ingredients, setIngredients] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const requiredFields = 3;

  const handleChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    const filledIngredients = ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );
    if (filledIngredients.length < requiredFields) {
      setIsLoading(false);
      alert("Please add three or more ingredients to proceed.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/submit", {
        ingredients: filledIngredients,
      });
      console.log(response);
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Ingredient Form</h2>
        <form onSubmit={handleSubmit}>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Ingredient ${
                index + 1
              } with quantity (e.g. 2 Eggs)`}
            />
          ))}
          <button type="submit" disabled={isLoading}>
            Submit
          </button>
        </form>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-circle"></div>
            <div>Loading...</div>
          </div>
        ) : (
          <div className="result-container">
            <h5>{response}</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientForm;

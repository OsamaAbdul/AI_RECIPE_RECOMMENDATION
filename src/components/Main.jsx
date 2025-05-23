import React, { useState, useEffect } from 'react';
import Section from './Section';
import OsamaRecipe from './OsamaRecipe';
import { getRecipeFromMistral } from '../Ai.js';

export default function Main() {
  const [ingredient, setIngredient] = useState('');
  const [recipeShown, setRecipeShown] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  async function getRecipe() {
    if (ingredients.length === 0) return;
    setLoading(true);
    setRecipe('');
    try {
      await getRecipeFromMistral(ingredients, (chunk) => {
        setRecipe(chunk);
      });
      setRecipeShown(true);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOnChange(e) {
    setIngredient(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!ingredient.trim()) return;
    setIngredients(prev => [...prev, ingredient.trim()]);
    setIngredient('');
  }

  // Loader Component
  function Loader() {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
      "Chef Osama is chopping ingredients...",
      "Mixing flavors for a tasty dish...",
      "Heating up the culinary magic...",
      "Almost ready, hold your appetite!"
    ];

    useEffect(() => {
      if (!loading) return;
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % messages.length);
      }, 2000); // Change message every 2 seconds
      return () => clearInterval(interval);
    }, [loading]);

    return (
      <div className="loader-pro">
        <div className="spinner"></div>
        <p className="loader-text">{messages[messageIndex]}</p>
      </div>
    );
  }

  return (
    <main className="main-pro">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          .main-pro {
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            font-family: 'Poppins', sans-serif;
            color: #e0e0e0;
          }

          .content-wrapper {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            padding: 30px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .form-pro {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
          }

          .form-pro input {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .form-pro input::placeholder {
            color: #b0b0b0;
          }

          .form-pro input:focus {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 10px rgba(242, 101, 94, 0.5);
          }

          .form-pro button {
            padding: 14px 25px;
            background: linear-gradient(90deg, #f2655e, #ff8c82);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .form-pro button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(242, 101, 94, 0.4);
          }

          .form-pro button:disabled {
            background: #4a4e69;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .ingredients-pro {
            padding: 20px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
          }

          .ingredients-pro h2 {
            color: #f2655e;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .ingredients-pro ul {
            list-style: none;
            padding: 0;
          }

          .ingredients-pro li {
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            margin: 8px 0;
            border-radius: 8px;
            font-size: 16px;
            color: #e0e0e0;
            transition: all 0.3s ease;
          }

          .ingredients-pro li:hover {
            background: rgba(242, 101, 94, 0.2);
            transform: translateX(5px);
          }

          /* Loader Styles */
          .loader-pro {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #ff8c82;
            border-top: 5px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
          }

          .loader-text {
            color: #ff8c82;
            font-size: 16px;
            margin-top: 15px;
            font-style: italic;
            animation: fade 0.5s ease-in-out;
            text-align: center;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes fade {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <div className="content-wrapper">
        <form className="form-pro" onSubmit={handleSubmit}>
          <input 
            type="text"
            aria-label="Add Ingredients"
            placeholder="E.g., Egusi, Okro..."
            name="ingredient" 
            value={ingredient}
            onChange={handleOnChange}
          />
          <button type="submit" disabled={loading}>Add</button> 
        </form> 
        
        {ingredients.length > 0 && (
          <section className="ingredients-pro">
            <h2>Ingredients</h2>
            <ul>
              {ingredients.map((ingr, index) => (
                <li key={index}>{ingr}</li>
              ))}
            </ul>
            <Section 
              getRecipe={getRecipe} 
              flipRecipe={() => setRecipeShown(prev => !prev)} 
              loading={loading}
            />
            {loading && <Loader />}
          </section>
        )}
      </div>

      {ingredients.length >= 3 && (
        <OsamaRecipe recipeShown={recipeShown} recipe={recipe} setRecipeShown={setRecipeShown} />
      )}
    </main>
  );
}
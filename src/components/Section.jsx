import React from 'react';

export default function Section({ getRecipe, flipRecipe, loading, recipeShown }) {
  return (
    <div className="section-pro">
      <style>
        {`
          .section-pro {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 25px;
          }

          .btn-pro {
            padding: 12px 25px;
            background: linear-gradient(90deg, #f2655e, #ff8c82);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .btn-pro:hover {
            background: linear-gradient(90deg, #ff8c82, #f2655e);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(242, 101, 94, 0.4);
          }

          .btn-pro:disabled {
            background: #4a4e69;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `}
      </style>

      <button 
        className="btn-pro" 
        onClick={getRecipe} 
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
      <button 
        className="btn-pro" 
        onClick={flipRecipe} 
        disabled={loading}
      >
        {recipeShown ? "Hide Recipe" : "Show Recipe"}
      </button>
    </div>
  );
}
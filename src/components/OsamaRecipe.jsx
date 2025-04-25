import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './OsamaRecipe.css'; // Import external CSS

export default function OsamaRecipe({ recipeShown, recipe, setRecipeShown }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Handle navigation to home
  const handleHome = () => {
    setRecipeShown(false); // Hide modal before navigating
    navigate('/');
  };

  // Handle closing the modal
  const handleClose = () => {
    setRecipeShown(false); // Hide modal without navigating
  };

  // Focus trap for accessibility
  useEffect(() => {
    if (recipeShown && modalRef.current) {
      modalRef.current.focus(); // Focus the modal when it opens
    }
  }, [recipeShown]);

  // Handle clicks outside the modal to close it
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle keyboard escape to close modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!recipeShown || !recipe) return null;

  return (
    <div
      className="recipe-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="recipe-title"
      tabIndex={-1}
      ref={modalRef}
    >
      <section className="recipe-pro">
        <h2 id="recipe-title">Your Recipe</h2>
        <pre>{typeof recipe === 'string' ? recipe : JSON.stringify(recipe, null, 2)}</pre>
        <button
          onClick={handleHome}
          aria-label="Go back to home page"
        >
          Go Back
        </button>
        <button
          onClick={handleClose}
          aria-label="Close recipe modal"
        >
          Close
        </button>
      </section>
    </div>
  );
}

OsamaRecipe.propTypes = {
  recipeShown: PropTypes.bool.isRequired,
  recipe: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  setRecipeShown: PropTypes.func.isRequired,
};
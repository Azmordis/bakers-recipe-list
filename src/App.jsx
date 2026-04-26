import { useCallback, useState } from 'react';
import TopBar from './components/TopBar/TopBar.jsx';
import TOCNav from './components/TOCNav/TOCNav.jsx';
import RecipeList from './components/RecipeList/RecipeList.jsx';
import RecipeModal from './components/RecipeModal/RecipeModal.jsx';

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleViewRecipe = useCallback((recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  return (
    <>
      <TopBar />
      <TOCNav />
      <RecipeList onViewRecipe={handleViewRecipe} />
      <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
    </>
  );
}

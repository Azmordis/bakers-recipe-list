import { useCallback, useState } from 'react';
import TopBar from './components/TopBar/TopBar.jsx';
import UsdaKeyNotice from './components/UsdaKeyNotice/UsdaKeyNotice.jsx';
import TOCNav from './components/TOCNav/TOCNav.jsx';
import RecipeList from './components/RecipeList/RecipeList.jsx';
import RecipeModal from './components/RecipeModal/RecipeModal.jsx';

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleViewRecipe = useCallback((recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((v) => !v);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <TopBar onMenuToggle={handleMenuToggle} />
      <UsdaKeyNotice />
      <TOCNav open={menuOpen} onClose={handleMenuClose} />
      <RecipeList onViewRecipe={handleViewRecipe} />
      <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
    </>
  );
}

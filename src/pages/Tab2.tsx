import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonCard,
  IonIcon,
  IonSkeletonText,
  IonList
} from '@ionic/react';
import { timeOutline, restaurantOutline } from 'ionicons/icons';
import { searchRecipes } from '../services/recipeService';
import { Recipe } from '../interfaces/recipe';
import './Tab2.css';

const Tab2: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for active filter (e.g., 'All', 'Vegan', 'Quick')
  const [activeFilter, setActiveFilter] = useState('All');

  // List of filters to display
  const filters = ['All', 'Breakfast', 'Vegan', 'Quick (< 30m)', 'Low Calorie'];

  // Effect: Trigger search when searchText changes or filter changes
  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      try {
        const filterToSend = activeFilter === 'All' ? undefined : activeFilter;
        
        // If the search field is empty, the search is done using a filter only (e.g. all Vegan)
        const queryToSend = searchText === '' && filterToSend ? '' : searchText;

        const results = await searchRecipes(queryToSend, filterToSend);
        setRecipes(results);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce: Wait 500ms after user stops typing to avoid too many API calls
    const timeoutId = setTimeout(() => {
      doSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, activeFilter]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="search-header">
          <h1 className="page-title">Find Recipes</h1>
          
          {/* 1. Search Bar */}
          <IonSearchbar 
            value={searchText} 
            onIonInput={e => setSearchText(e.detail.value!)}
            placeholder="Search for pasta, salad..."
            className="custom-searchbar"
          />
        </div>

        {/* 2. Filter Chips (Horizontal Scroll) */}
        <div className="filter-container">
          {filters.map((filter) => (
            <IonChip 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            >
              <IonLabel>{filter}</IonLabel>
            </IonChip>
          ))}
        </div>
      </IonHeader>

      <IonContent fullscreen className="ion-padding-top">
        
        {/* 3. Loading State (Skeleton) */}
        {loading && (
          <div className="ion-padding">
             {/* Show 3 fake cards while loading */}
             {[1, 2, 3].map(i => (
               <IonCard key={i} className="recipe-card">
                 <IonSkeletonText animated style={{ width: '100%', height: '180px' }} />
                 <div className="card-content">
                   <IonSkeletonText animated style={{ width: '60%', height: '24px', marginBottom: '10px' }} />
                   <IonSkeletonText animated style={{ width: '40%', height: '16px' }} />
                 </div>
               </IonCard>
             ))}
          </div>
        )}

        {/* 4. Results List */}
        {!loading && recipes.length > 0 && (
          <IonList lines="none">
            {recipes.map((recipe) => (
              <IonCard key={recipe.id} className="recipe-card" routerLink={`/recipe/${recipe.id}`}>
                {/* Image */}
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                
                {/* Content */}
                <div className="card-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  
                  <div className="recipe-meta">
                    {/* Time */}
                    <div className="meta-item">
                      <IonIcon icon={timeOutline} />
                      <span>{recipe.readyInMinutes} min</span>
                    </div>
                    {/* Servings */}
                    <div className="meta-item">
                      <IonIcon icon={restaurantOutline} />
                      <span>{recipe.servings} servings</span>
                    </div>
                     {/* Removed hardcoded Mock Calories. 
                         The current search API response doesn't include calories. */}
                  </div>
                </div>
              </IonCard>
            ))}
          </IonList>
        )}

        {/* 5. Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="empty-state">
            <p>No recipes found. Try searching for "Pasta" or select a filter.</p>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonSpinner, IonIcon, IonButton, IonCheckbox, IonItem, IonLabel, 
  IonList, useIonToast, useIonRouter, IonModal, IonSelect, IonSelectOption 
} from '@ionic/react';
import { useParams } from 'react-router-dom';
// LISÄTTY: mapOutline importteihin
import { timeOutline, restaurantOutline, heartOutline, heart, calendarOutline, flameOutline, closeOutline, mapOutline } from 'ionicons/icons';
import { getRecipeById } from '../../services/recipeService';
import { addMealToPlan } from '../../services/plannerService';
import { Recipe } from '../../interfaces/recipe';
import { isFavorite as checkIsFavorite, removeFavorite, addFavorite } from '../../services/favoritesService';
import './RecipeDetails.css';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [presentToast] = useIonToast();

  // --- MODAALIN TILAT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Tänään
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

  // Generoi päivät valintalistaan (Tänään, Huomenna...)
  const dayOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' });
    return { value: i, label: label };
  });

  useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            const data = await getRecipeById(id);
            if (data) {
                setRecipe(data);
                // SYNCHRONOUS CHECK: Check status immediately after fetching recipe data
                setIsFavorite(checkIsFavorite(id)); 
            }
            setLoading(false);
        };
        fetchRecipe();
    }, [id]);

  const handleConfirmAdd = () => {
    if (!recipe) return;

    addMealToPlan({
      id: Date.now().toString(),
      recipeId: recipe.id,
      title: recipe.title,
      calories: 450, 
      dayIndex: selectedDay, 
      slot: selectedSlot     
    });

    setIsModalOpen(false); 

    presentToast({
      message: 'Added to Planner!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    
    setTimeout(() => {
        router.push('/tabs/tab3');
    }, 1000);
  };

  // Uusi funktio -> ensimmäisellä klikkauksella lisää suosikkeihin ja toisella poistaa
 const toggleFavorites = () => {
    if (!recipe) return;

    if (isFavorite) {
      // It IS a favorite, so remove it
      removeFavorite(recipe.id);
      setIsFavorite(false);
      presentToast({ 
        message: 'Removed from Favorites.', 
        duration: 2000, 
        icon: heartOutline, 
        color: 'medium', 
        position: 'top' 
      });
    } else {
      // It is NOT a favorite, so add it
      addFavorite(recipe);
      setIsFavorite(true);
      
      presentToast({ 
        message: 'Added to Favorites!', 
        duration: 2000, 
        icon: heart, 
        color: 'primary', 
        position: 'top' 
      });
    }
  };

  // UUSI FUNKTIO: Avaa kartan hakusanalla "grocery store"
  const openMap = () => {
    // Tämä URL avaa Google Mapsin (tai selaimen) ja etsii lähimmät ruokakaupat
    window.open('https://www.google.com/maps/search/grocery+store/', '_blank');
  };

  if (loading) return <IonPage><IonContent className="ion-text-center"><div style={{marginTop: '50%'}}><IonSpinner /></div></IonContent></IonPage>;
  if (!recipe) return <IonPage><IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton defaultHref="/tabs/tab2"/></IonButtons></IonToolbar></IonHeader><IonContent className="ion-padding">Recipe not found.</IonContent></IonPage>;

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/tab2" text="" color="dark" /></IonButtons>
          <IonTitle>{recipe.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <img src={recipe.image} alt={recipe.title} className="hero-image" />
        <div className="recipe-content">
          <h1 className="detail-title">{recipe.title}</h1>
          <div className="quick-stats">
            <div className="stat-item"><IonIcon icon={timeOutline} /> {recipe.readyInMinutes} min</div>
            <div className="stat-item"><IonIcon icon={restaurantOutline} /> {recipe.servings} servings</div>
            <div className="stat-item"><IonIcon icon={flameOutline} /> ~450 kcal</div>
          </div>

          <div className="action-buttons">
           {/* Favorite Button */}
             <IonButton 
                className="action-btn" 
                // 1. DYNAMIC COLOR: Changes to 'primary' if favorited
                color={isFavorite ? 'primary' : 'medium'} 
                // 2. DYNAMIC FILL: Changes to 'solid' fill if favorited
                fill={isFavorite ? 'solid' : 'outline'}
                onClick={toggleFavorites}>
                {/* 4. DYNAMIC ICON: Changes to filled heart if favorited */}
                <IonIcon icon={isFavorite ? heart : heartOutline} />
             </IonButton>
             
             {/* UUSI NAPPI: Find Stores */}
             <IonButton className="action-btn" color="secondary" fill="outline" onClick={openMap}>
                <IonIcon icon={mapOutline} />
             </IonButton>

             {/* Add to Plan Button (leveämpi) */}
             <IonButton className="action-btn" color="primary" onClick={() => setIsModalOpen(true)} style={{flex: 2}}>
                <IonIcon icon={calendarOutline} slot="start" /> Add to Plan
             </IonButton>
          </div>

          <h2 className="section-header">Ingredients</h2>
          <IonList lines="none">
            {recipe.extendedIngredients?.map((ing, index) => (
              <IonItem key={index} className="ingredient-item">
                <IonCheckbox slot="start" /> <IonLabel className="ion-text-wrap">{ing.original}</IonLabel>
              </IonItem>
            ))}
          </IonList>
          
          <h2 className="section-header">Instructions</h2>
          <div className="instructions-text" dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions provided.' }} />
          <div style={{ height: '50px' }}></div>
        </div>

        {/* --- MODAL FOR SELECTING DAY & MEAL --- */}
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} initialBreakpoint={0.5} breakpoints={[0, 0.5]}>
          <IonContent className="ion-padding">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Add to Meal Plan</h2>
              <IonIcon icon={closeOutline} size="large" onClick={() => setIsModalOpen(false)} />
            </div>

            <IonList>
              <IonItem>
                <IonLabel position="stacked">Select Day</IonLabel>
                <IonSelect value={selectedDay} onIonChange={e => setSelectedDay(e.detail.value)}>
                  {dayOptions.map(opt => (
                    <IonSelectOption key={opt.value} value={opt.value}>{opt.label}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Select Meal</IonLabel>
                <IonSelect value={selectedSlot} onIonChange={e => setSelectedSlot(e.detail.value)}>
                  <IonSelectOption value="breakfast">Breakfast</IonSelectOption>
                  <IonSelectOption value="lunch">Lunch</IonSelectOption>
                  <IonSelectOption value="dinner">Dinner</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>

            <IonButton expand="block" className="ion-margin-top" onClick={handleConfirmAdd}>
              Confirm & Add
            </IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default RecipeDetail;
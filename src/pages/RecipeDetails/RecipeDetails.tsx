import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonSpinner, IonIcon, IonButton, IonCheckbox, IonItem, IonLabel, 
  IonList, useIonToast, useIonRouter, IonModal, IonSelect, IonSelectOption 
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { timeOutline, restaurantOutline, heartOutline, calendarOutline, flameOutline, closeOutline } from 'ionicons/icons';
import { getRecipeById } from '../../services/recipeService';
import { addMealToPlan } from '../../services/plannerService';
import { Recipe } from '../../interfaces/recipe';
import './RecipeDetails.css';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [presentToast] = useIonToast();

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Tänään
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');

  // Generate day options for the dropdown (Today, Tomorrow, etc.)
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
      if (data) setRecipe(data);
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
      calories: 450, // Spoonacular free API doesn't provide specific calories here, using an estimate
      dayIndex: selectedDay, // DAY SELECTED BY USER
      slot: selectedSlot     // MEAL SLOT SELECTED BY USER
    });

    setIsModalOpen(false); // Close the modal

    presentToast({
      message: 'Added to Planner!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    
    // Redirect to Planner tab to show the added meal
    setTimeout(() => {
        router.push('/tabs/tab3');
    }, 1000);
  };

  const addToFavorites = () => {
    presentToast({ message: 'Added to Favorites!', duration: 2000, icon: heartOutline, color: 'danger', position: 'top' });
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
             <IonButton className="action-btn" color="medium" fill="outline" onClick={addToFavorites}>
                <IonIcon icon={heartOutline} slot="start" /> Favorite
             </IonButton>
             {/* OPEN MODAL ON CLICK */}
             <IonButton className="action-btn" color="primary" onClick={() => setIsModalOpen(true)}>
                <IonIcon icon={calendarOutline} slot="start" /> Add to Plan
             </IonButton>
          </div>

          {/* ... Ingredients and Instructions ... */}
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
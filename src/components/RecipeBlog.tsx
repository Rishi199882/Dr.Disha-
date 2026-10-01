import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Users, 
  Flame, 
  Sparkles, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  PlusCircle, 
  X, 
  BookOpen, 
  SlidersHorizontal,
  ChevronRight,
  Heart,
  Plus,
  Edit,
  Trash2,
  Lock,
  UtensilsCrossed
} from 'lucide-react';
import { Recipe, RecipeIngredient, FoodDiaryItem, MealType } from '../types/nutrition';
import { StorageService } from '../services/storage';

interface RecipeBlogProps {
  onLogToDiary?: (item: FoodDiaryItem) => void;
  isAdmin?: boolean;
}

export const RecipeBlog: React.FC<RecipeBlogProps> = ({ onLogToDiary, isAdmin: propIsAdmin }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => StorageService.getRecipes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedMealType, setSelectedMealType] = useState<string>('All');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Admin state
  const activeRole = StorageService.getActiveRole();
  const isAdmin = propIsAdmin || activeRole === 'admin';

  // Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Form State for Adding / Editing Recipe
  const [recipeForm, setRecipeForm] = useState<Partial<Recipe>>({
    title: '',
    subtitle: '',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    mealType: 'Dinner',
    difficulty: 'Easy',
    tags: ['Anti-Inflammatory', 'Gluten-Free'],
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 18,
    fiber: 8,
    sodium: 350,
    potassium: 650,
    iron: 3.5,
    magnesium: 95,
    glycemicLoad: 'Low',
    clinicalBenefits: 'Formulated by Dr. Disha to modulate cellular inflammation and maintain sustained euglycemia.',
    iconType: 'quinoa',
    ingredients: [
      { name: 'Organic Quinoa', amount: 1, unit: 'cup', notes: 'Rinsed' },
      { name: 'Extra Virgin Olive Oil', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Simmer quinoa in vegetable broth for 15 minutes.',
      'Drizzle with cold-pressed olive oil and season with Celtic sea salt.'
    ]
  });

  // Portion Multiplier & Cooking Mode State
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [cookingModeActive, setCookingModeActive] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  
  // Kitchen Timer State (in seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      alert('Kitchen timer complete! Check your clinical recipe.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleOpenRecipe = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setServingMultiplier(1);
    setCookingModeActive(false);
    setCompletedSteps({});
    setTimerSeconds((recipe.cookTime || 15) * 60);
    setTimerRunning(false);
  };

  const handleCloseRecipe = () => {
    setActiveRecipe(null);
    setTimerRunning(false);
  };

  const handleToggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Add Recipe directly to Patient Food Diary
  const handleAddToDiary = (recipe: Recipe) => {
    const activePatient = StorageService.getActivePatient();
    const todayStr = new Date().toISOString().split('T')[0];

    const foodItem: FoodDiaryItem = {
      id: `food-${Date.now()}`,
      patientId: activePatient.id,
      date: todayStr,
      mealType: (recipe.mealType?.toLowerCase() || 'lunch') as any,
      title: recipe.title,
      portion: `${servingMultiplier} serving(s)`,
      calories: Math.round(recipe.calories * servingMultiplier),
      protein: Math.round(recipe.protein * servingMultiplier),
      carbs: Math.round(recipe.carbs * servingMultiplier),
      fat: Math.round(recipe.fat * servingMultiplier),
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    StorageService.addFoodLog(foodItem);
    if (onLogToDiary) onLogToDiary(foodItem);

    setLoggedNotice(`Logged ${recipe.title} (${Math.round(recipe.calories * servingMultiplier)} kcal) to ${activePatient.fullName}'s Food Diary!`);
    setTimeout(() => setLoggedNotice(null), 4000);
  };

  // Admin CRUD Actions
  const handleOpenAddRecipe = () => {
    setEditingRecipeId(null);
    setRecipeForm({
      title: '',
      subtitle: '',
      prepTime: 15,
      cookTime: 20,
      servings: 2,
      mealType: 'Dinner',
      difficulty: 'Easy',
      tags: ['Anti-Inflammatory', 'Gluten-Free'],
      calories: 450,
      protein: 35,
      carbs: 30,
      fat: 18,
      fiber: 8,
      sodium: 350,
      potassium: 650,
      iron: 3.5,
      magnesium: 95,
      glycemicLoad: 'Low',
      clinicalBenefits: 'Formulated by Dr. Disha to modulate cellular inflammation and maintain sustained euglycemia.',
      iconType: 'quinoa',
      ingredients: [
        { name: 'Organic Quinoa', amount: 1, unit: 'cup', notes: 'Rinsed' },
        { name: 'Extra Virgin Olive Oil', amount: 1, unit: 'tbsp' }
      ],
      instructions: [
        'Simmer quinoa in vegetable broth for 15 minutes.',
        'Drizzle with cold-pressed olive oil and season with Celtic sea salt.'
      ]
    });
    setShowAdminModal(true);
  };

  const handleOpenEditRecipe = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRecipeId(recipe.id);
    setRecipeForm({ ...recipe });
    setShowAdminModal(true);
  };

  const handleDeleteRecipe = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this recipe from Dr. Disha clinical catalog?')) {
      StorageService.deleteRecipe(id);
      setRecipes(StorageService.getRecipes());
      if (activeRecipe?.id === id) {
        setActiveRecipe(null);
      }
    }
  };

  const handleSaveRecipeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.title) return;

    if (editingRecipeId) {
      // Update
      const updated: Recipe = {
        ...(recipeForm as Recipe),
        id: editingRecipeId
      };
      StorageService.updateRecipe(updated);
      setRecipes(StorageService.getRecipes());
      if (activeRecipe?.id === editingRecipeId) {
        setActiveRecipe(updated);
      }
    } else {
      // Create
      const newRec: Recipe = {
        ...(recipeForm as Recipe),
        id: `rec-${Date.now()}`
      };
      StorageService.addRecipe(newRec);
      setRecipes(StorageService.getRecipes());
    }

    setShowAdminModal(false);
  };

  // Helper for dynamic ingredient rows in admin form
  const handleAddIngredientRow = () => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: '', amount: 1, unit: 'cup' }]
    }));
  };

  const handleRemoveIngredientRow = (idx: number) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== idx)
    }));
  };

  const handleIngredientChange = (idx: number, field: keyof RecipeIngredient, val: any) => {
    setRecipeForm(prev => {
      const ings = [...(prev.ingredients || [])];
      ings[idx] = { ...ings[idx], [field]: val };
      return { ...prev, ingredients: ings };
    });
  };

  // Helper for dynamic instruction steps in admin form
  const handleAddInstructionRow = () => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), '']
    }));
  };

  const handleRemoveInstructionRow = (idx: number) => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: prev.instructions?.filter((_, i) => i !== idx)
    }));
  };

  const handleInstructionChange = (idx: number, val: string) => {
    setRecipeForm(prev => {
      const steps = [...(prev.instructions || [])];
      steps[idx] = val;
      return { ...prev, instructions: steps };
    });
  };

  const tagsList = [
    'All',
    'Anti-Inflammatory',
    'Gluten-Free',
    'High-Protein',
    'Low-FODMAP',
    'Keto',
    'Vegan',
    'Diabetic-Friendly',
    'Renal-Friendly'
  ];

  const mealTypesList = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Beverage'
  ];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.clinicalBenefits.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'All' || r.tags.includes(selectedTag as any);
    const matchesMeal = selectedMealType === 'All' || r.mealType === selectedMealType;
    return matchesSearch && matchesTag && matchesMeal;
  });

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Admin Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Culinary Medicine & Nutritional Biochemistry
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Dr. Disha Clinical Recipe Compendium
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Chef-crafted recipes calibrated for glycemic stability, gut barrier repair, and cellular longevity. Each dish includes full macro/micronutrient quantification, adjustable portion multipliers, and interactive cooking checklists.
          </p>
        </div>

        {/* Admin Action Button */}
        {isAdmin && (
          <button
            onClick={handleOpenAddRecipe}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Clinical Recipe</span>
          </button>
        )}
      </div>

      {/* Search Bar, Meal Type Filter, and Dietary Restriction Filters */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients (e.g. salmon, quinoa, ginger)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 bg-white"
          />
        </div>

        {/* Meal Type Filter Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Meal:</span>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {mealTypesList.map(meal => (
              <button
                key={meal}
                onClick={() => setSelectedMealType(meal)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedMealType === meal
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restriction Tags */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Diet:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {tagsList.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {loggedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{loggedNotice}</span>
        </div>
      )}

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => handleOpenRecipe(recipe)}
            className="group cursor-pointer bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Visual SVG Card Backdrop */}
            <div className="h-44 bg-gradient-to-br from-stone-100 to-emerald-50/50 p-6 flex flex-col justify-between border-b border-stone-100 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-500 z-10">
                <span className="font-mono-numbers">{recipe.prepTime + recipe.cookTime} Mins · {recipe.mealType}</span>
                <span className="font-medium text-emerald-800">{recipe.difficulty}</span>
              </div>

              {/* Decorative Culinary Motif */}
              <div className="z-10">
                <div className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
                  {recipe.glycemicLoad} Glycemic Load
                </div>
                <h3 className="font-serif-display text-lg font-bold text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
              </div>

              {/* Background ambient circular graphic */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-emerald-100/40 blur-xl pointer-events-none" />
            </div>

            {/* Content & Macro Summary */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {recipe.subtitle}
                </p>

                {/* Dietary Tags as clean unboxed text */}
                <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-3 flex-wrap">
                  {recipe.tags.slice(0, 3).map((t, idx) => (
                    <React.Fragment key={t}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span>{t}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Macros Box */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-4 gap-1 text-center font-mono-numbers">
                <div className="p-1.5 rounded-lg bg-stone-50">
                  <div className="text-[10px] text-stone-400">Calories</div>
                  <div className="text-xs font-semibold text-stone-800">{recipe.calories}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-50">
                  <div className="text-[10px] text-stone-400">Protein</div>
                  <div className="text-xs font-semibold text-emerald-800">{recipe.protein}g</div>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-50">
                  <div className="text-[10px] text-stone-400">Carbs</div>
                  <div className="text-xs font-semibold text-stone-800">{recipe.carbs}g</div>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-50">
                  <div className="text-[10px] text-stone-400">Fat</div>
                  <div className="text-xs font-semibold text-stone-800">{recipe.fat}g</div>
                </div>
              </div>
            </div>

            {/* Bottom Card Action & Admin Edit/Delete */}
            <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-800 group-hover:text-emerald-950 flex items-center gap-1">
                <span>View Full Recipe</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>

              {isAdmin && (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleOpenEditRecipe(recipe, e)}
                    className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-stone-200/60 rounded"
                    title="Edit Recipe"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                    className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded"
                    title="Delete Recipe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 text-stone-500">
          <p className="text-sm">No clinical recipes match your filter criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag('All'); setSelectedMealType('All'); }}
            className="mt-2 text-xs font-semibold text-emerald-800 hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-20">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Dr. Disha Clinical Formulation · {activeRecipe.mealType}
                </div>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  {activeRecipe.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => handleOpenEditRecipe(activeRecipe)}
                    className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Recipe</span>
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  title="Print Recipe"
                  className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseRecipe}
                  className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Recipe Meta Banner */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-stone-400">Prep / Cook Time</div>
                  <div className="font-semibold text-stone-800 font-mono-numbers mt-0.5">
                    {activeRecipe.prepTime}m prep · {activeRecipe.cookTime}m cook
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Difficulty</div>
                  <div className="font-semibold text-stone-800 mt-0.5">{activeRecipe.difficulty}</div>
                </div>
                <div>
                  <div className="text-stone-400">Glycemic Impact</div>
                  <div className="font-semibold text-emerald-800 mt-0.5">{activeRecipe.glycemicLoad} Glycemic Load</div>
                </div>
                <div>
                  <div className="text-stone-400">Dietary Categories</div>
                  <div className="font-medium text-stone-700 mt-0.5">{activeRecipe.tags.join(', ')}</div>
                </div>
              </div>

              {/* Dynamic Portion Multiplier Control & Quick Diary Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-800">
                    Portion Multiplier:
                  </span>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-stone-200">
                    {[1, 2, 4].map(mult => (
                      <button
                        key={mult}
                        onClick={() => setServingMultiplier(mult)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors font-mono-numbers ${
                          servingMultiplier === mult
                            ? 'bg-emerald-800 text-white'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {mult}x ({activeRecipe.servings * mult} serv)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCookingModeActive(!cookingModeActive)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      cookingModeActive
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-800 text-white hover:bg-stone-900'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{cookingModeActive ? 'Exit Cooking Mode' : 'Start Cooking Mode'}</span>
                  </button>

                  <button
                    onClick={() => handleAddToDiary(activeRecipe)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log to Patient Diary</span>
                  </button>
                </div>
              </div>

              {/* Interactive Kitchen Timer */}
              {cookingModeActive && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-800" />
                    <div>
                      <div className="text-xs font-semibold text-amber-900">Interactive Kitchen Countdown Timer</div>
                      <div className="text-lg font-bold font-mono-numbers text-amber-950">{formatTimer(timerSeconds)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-800 text-white rounded-lg hover:bg-amber-900 flex items-center gap-1"
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{timerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={() => { setTimerRunning(false); setTimerSeconds((activeRecipe.cookTime || 15) * 60); }}
                      className="p-1.5 text-amber-800 hover:bg-amber-100 rounded-lg"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Macro & Micronutrient Profile */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
                  Adjusted Nutritional Profile ({servingMultiplier}x portion)
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs font-mono-numbers">
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Calories</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.calories * servingMultiplier)}</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-[10px] text-emerald-700">Protein</div>
                    <div className="font-bold text-emerald-900">{Math.round(activeRecipe.protein * servingMultiplier)}g</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Net Carbs</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.carbs * servingMultiplier)}g</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Fat</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.fat * servingMultiplier)}g</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Fiber</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.fiber * servingMultiplier)}g</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Sodium</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.sodium * servingMultiplier)}mg</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Potassium</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.potassium * servingMultiplier)}mg</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-[10px] text-stone-400">Magnesium</div>
                    <div className="font-bold text-stone-900">{Math.round(activeRecipe.magnesium * servingMultiplier)}mg</div>
                  </div>
                </div>
              </div>

              {/* Clinical Biochemistry Rationale */}
              <div className="p-4 bg-stone-50 rounded-xl border-l-4 border-emerald-800 text-xs text-stone-700 space-y-1">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Clinical Biochemistry Rationale (Dr. Disha)</span>
                </div>
                <p className="leading-relaxed">{activeRecipe.clinicalBenefits}</p>
              </div>

              {/* Ingredients & Step-by-Step Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-stone-200">
                
                {/* Ingredients Column */}
                <div className="md:col-span-5 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Ingredients ({activeRecipe.servings * servingMultiplier} Servings)
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {activeRecipe.ingredients.map((ing, idx) => {
                      const calculatedAmount = (ing.amount * servingMultiplier);
                      return (
                        <li key={idx} className="flex items-start justify-between py-1.5 border-b border-stone-100">
                          <div>
                            <span className="font-medium text-stone-900">{ing.name}</span>
                            {ing.notes && <span className="text-stone-400 block text-[11px]">{ing.notes}</span>}
                          </div>
                          <span className="font-mono-numbers font-semibold text-emerald-900 text-right shrink-0 ml-2">
                            {calculatedAmount % 1 === 0 ? calculatedAmount : calculatedAmount.toFixed(1)} {ing.unit}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Instructions Column */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Preparation Protocol
                  </h4>
                  <ol className="space-y-3 text-xs">
                    {activeRecipe.instructions.map((step, idx) => {
                      const isDone = completedSteps[idx];
                      return (
                        <li
                          key={idx}
                          onClick={() => cookingModeActive && handleToggleStep(idx)}
                          className={`p-3 rounded-xl border transition-all ${
                            cookingModeActive ? 'cursor-pointer hover:bg-stone-50' : ''
                          } ${
                            isDone 
                              ? 'bg-emerald-50/60 border-emerald-200 text-stone-400 line-through' 
                              : 'bg-white border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 ${
                              isDone ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADMIN RECIPE CRUD MODAL (Add / Edit) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveRecipeForm} className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Admin Recipe Studio (Dr. Disha)
                </span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  {editingRecipeId ? 'Edit Clinical Recipe' : 'Add New Therapeutic Recipe'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">Recipe Title</label>
                  <input
                    type="text"
                    required
                    value={recipeForm.title}
                    onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })}
                    placeholder="e.g. Turmeric Lentil Stew"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">Meal Category</label>
                  <select
                    value={recipeForm.mealType}
                    onChange={(e) => setRecipeForm({ ...recipeForm, mealType: e.target.value as MealType })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Subtitle / Clinical Mechanism</label>
                <input
                  type="text"
                  value={recipeForm.subtitle}
                  onChange={(e) => setRecipeForm({ ...recipeForm, subtitle: e.target.value })}
                  placeholder="e.g. Rich in EPA/DHA Omega-3s and polyphenolic turmeric tahini"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-stone-700 mb-1">Prep (min)</label>
                  <input
                    type="number"
                    value={recipeForm.prepTime}
                    onChange={(e) => setRecipeForm({ ...recipeForm, prepTime: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Cook (min)</label>
                  <input
                    type="number"
                    value={recipeForm.cookTime}
                    onChange={(e) => setRecipeForm({ ...recipeForm, cookTime: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Servings</label>
                  <input
                    type="number"
                    value={recipeForm.servings}
                    onChange={(e) => setRecipeForm({ ...recipeForm, servings: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Glycemic Load</label>
                  <select
                    value={recipeForm.glycemicLoad}
                    onChange={(e) => setRecipeForm({ ...recipeForm, glycemicLoad: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Nutritional Macros Breakdown */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                  Nutritional Macros (Per Serving)
                </span>
                <div className="grid grid-cols-4 gap-2 font-mono-numbers">
                  <div>
                    <label className="block text-stone-500 text-[10px]">Calories</label>
                    <input
                      type="number"
                      value={recipeForm.calories}
                      onChange={(e) => setRecipeForm({ ...recipeForm, calories: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[10px]">Protein (g)</label>
                    <input
                      type="number"
                      value={recipeForm.protein}
                      onChange={(e) => setRecipeForm({ ...recipeForm, protein: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[10px]">Carbs (g)</label>
                    <input
                      type="number"
                      value={recipeForm.carbs}
                      onChange={(e) => setRecipeForm({ ...recipeForm, carbs: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[10px]">Fat (g)</label>
                    <input
                      type="number"
                      value={recipeForm.fat}
                      onChange={(e) => setRecipeForm({ ...recipeForm, fat: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Ingredients Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                    Ingredients List ({recipeForm.ingredients?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddIngredientRow}
                    className="text-emerald-800 text-xs font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {recipeForm.ingredients?.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 rounded border border-stone-300"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={ing.amount}
                        onChange={(e) => handleIngredientChange(idx, 'amount', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded border border-stone-300 font-mono-numbers"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                        className="w-16 px-2 py-1 rounded border border-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredientRow(idx)}
                        className="text-stone-400 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Preparation Steps Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                    Preparation Steps ({recipeForm.instructions?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddInstructionRow}
                    className="text-emerald-800 text-xs font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {recipeForm.instructions?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-stone-400 mt-1">{idx + 1}.</span>
                      <textarea
                        rows={1}
                        value={step}
                        onChange={(e) => handleInstructionChange(idx, e.target.value)}
                        placeholder="Describe clinical cooking step..."
                        className="flex-1 px-2 py-1 rounded border border-stone-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstructionRow(idx)}
                        className="text-stone-400 hover:text-rose-700 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Clinical Rationale (Dr. Disha)</label>
                <textarea
                  rows={2}
                  value={recipeForm.clinicalBenefits}
                  onChange={(e) => setRecipeForm({ ...recipeForm, clinicalBenefits: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                {editingRecipeId ? 'Save Changes' : 'Publish Recipe to Catalog'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

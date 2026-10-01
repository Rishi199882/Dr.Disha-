import {
  ConsultationType,
  Recipe,
  PatientProfile,
  BiometricLog,
  FoodDiaryItem,
  HydrationLog,
  SupplementProtocol,
  SymptomLog,
  SoapNote,
  LabReport,
  EmailReminder,
  InvoiceSuperbill,
  AuditLogEntry,
  BroadcastCampaign,
  EmiContract,
  DrugNutrientDepletionItem
} from '../types/nutrition';

export const CLINICAL_PROVIDER = {
  name: "Dr. Disha, MS, RDN, CDN, IFMCP",
  title: "Lead Clinical Nutritionist & Functional Medicine Dietitian",
  npi: "1841392810",
  taxId: "47-9281042",
  licenseNumber: "NY-CDN-009482",
  clinicName: "Dr. Disha Clinical Nutrition & Functional Medicine",
  clinicAddress: "450 Lexington Ave, Suite 1400, New York, NY 10017",
  clinicEmail: "care@drdisha-nutrition.com",
  clinicPhone: "(212) 555-0194",
  bio: "Master of Science in Clinical Nutrition from Columbia University Medical Center. Over 14 years specializing in metabolic dysfunction, gut-microbiome therapeutics, precision endocrinology, and bio-individual dietetics. Certified by the Institute for Functional Medicine (IFMCP)."
};

export const CONSULTATION_TYPES: ConsultationType[] = [
  {
    id: 'initial-assessment',
    title: 'Comprehensive Initial Clinical Assessment',
    duration: 75,
    price: 245,
    description: 'Deep dive into 10-year metabolic history, genetic/lab biomarkers, current medications, gastrointestinal symptom mapping, and customized precision nutrition protocol formulation.',
    recommendedFor: 'New clients, chronic metabolic issues, autoimmune conditions',
    cptCode: '97802 (Medical Nutrition Therapy, Initial)'
  },
  {
    id: 'gut-microbiome',
    title: 'Gut Microbiome & Dysbiosis Protocol',
    duration: 60,
    price: 195,
    description: 'Targeted evaluation for IBS, SIBO, leaky gut, histamine intolerance, and food sensitivities with 4-R intestinal repair framework.',
    recommendedFor: 'Bloating, irregular digestion, food intolerances, skin flare-ups',
    cptCode: '97802 (Clinical MNT)'
  },
  {
    id: 'metabolic-health',
    title: 'Metabolic & Glycemic Optimization',
    duration: 60,
    price: 195,
    description: 'Continuous glucose monitor (CGM) data interpretation, fasting insulin assessment, HOMA-IR scoring, and bio-individual insulin sensitivity diet blueprint.',
    recommendedFor: 'Pre-diabetes, insulin resistance, PCOS, stubborn weight plateau',
    cptCode: '97802 (MNT Initial)'
  },
  {
    id: 'sports-nutrition',
    title: 'Sports Performance & Recovery Tuning',
    duration: 50,
    price: 175,
    description: 'Intra-workout glycogen timing, electrolyte replacement ratios, lean mass optimization, and anti-inflammatory recovery protocols for endurance and strength athletes.',
    recommendedFor: 'Marathon runners, triathletes, hybrid athletes, competitive lifters',
    cptCode: '97802 (Sports Dietetics)'
  },
  {
    id: 'follow-up',
    title: 'Clinical Follow-Up & Biometric Reassessment',
    duration: 45,
    price: 135,
    description: 'Progress evaluation, macro target calibration, symptom improvement review, adherence troubleshooting, and ongoing lab trend review.',
    recommendedFor: 'Existing clients on active care protocols',
    cptCode: '97803 (Medical Nutrition Therapy, Re-assessment)'
  },
  {
    id: 'pediatric-nutrition',
    title: 'Pediatric & Family Nutritional Health',
    duration: 60,
    price: 185,
    description: 'Growth curve analysis, food aversion management, neurodevelopmental support, and family meal architecture for optimal childhood vitality.',
    recommendedFor: 'Children, adolescents, selective eaters, growth challenges',
    cptCode: '97802 (Pediatric MNT)'
  }
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'salmon-quinoa-bowl',
    title: 'Anti-Inflammatory Wild Salmon Quinoa Bowl',
    subtitle: 'Rich in marine Omega-3 fatty acids EPA/DHA and polyphenolic turmeric tahini',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    mealType: 'Dinner',
    difficulty: 'Easy',
    tags: ['Anti-Inflammatory', 'Gluten-Free', 'High-Protein', 'Diabetic-Friendly'],
    calories: 540,
    protein: 42,
    carbs: 38,
    fat: 24,
    fiber: 9,
    sodium: 360,
    potassium: 820,
    iron: 4.2,
    magnesium: 115,
    glycemicLoad: 'Low',
    clinicalBenefits: 'EPA/DHA reduces serum hs-CRP and supports cellular membrane fluidity. Quinoa provides complete essential amino acids with slow-digesting resistant starch.',
    iconType: 'salmon',
    ingredients: [
      { name: 'Wild Alaskan Sockeye Salmon fillet', amount: 10, unit: 'oz', notes: 'Skin-on, patted dry' },
      { name: 'Tri-color Organic Quinoa', amount: 1, unit: 'cup', notes: 'Rinsed and cooked in vegetable broth' },
      { name: 'Baby Arugula & Spinach mix', amount: 3, unit: 'cups' },
      { name: 'Hass Avocado', amount: 1, unit: 'medium', notes: 'Diced' },
      { name: 'Raw Pumpkin Seeds (Pepitas)', amount: 2, unit: 'tbsp' },
      { name: 'Fresh Lemon Juice', amount: 2, unit: 'tbsp' },
      { name: 'Cold-Pressed Extra Virgin Olive Oil', amount: 1.5, unit: 'tbsp' },
      { name: 'Ground Turmeric & Black Pepper', amount: 1, unit: 'tsp', notes: 'Piperine enhances curcumin absorption' }
    ],
    instructions: [
      'Preheat oven to 400°F (204°C). Season salmon with sea salt, ground turmeric, and black pepper.',
      'Roast salmon on parchment paper for 12-14 minutes until tender and flaky.',
      'Fluff cooked warm quinoa with a fork, folding in 1 tbsp olive oil and fresh lemon juice.',
      'Divide arugula/spinach greens into two wide bowls; top with warm quinoa, roasted salmon fillet, and sliced avocado.',
      'Garnish with toasted pumpkin seeds and drizzle with extra virgin olive oil.'
    ]
  },
  {
    id: 'low-fodmap-chicken-stirfry',
    title: 'Low-FODMAP Ginger Sesame Chicken Bowl',
    subtitle: 'Gentle on sensitive GI tracts; free from fructans, oligosaccharides, and polyols',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    mealType: 'Lunch',
    difficulty: 'Easy',
    tags: ['Low-FODMAP', 'Gluten-Free', 'High-Protein'],
    calories: 460,
    protein: 44,
    carbs: 32,
    fat: 16,
    fiber: 6,
    sodium: 480,
    potassium: 690,
    iron: 3.1,
    magnesium: 85,
    glycemicLoad: 'Low',
    clinicalBenefits: 'Formulated specifically for IBS and SIBO remission. Uses green scallion tops and ginger for prebiotic digestive enzyme stimulation without fermentable distress.',
    iconType: 'quinoa',
    ingredients: [
      { name: 'Pasture-raised Chicken Breast', amount: 12, unit: 'oz', notes: 'Cut into bite-sized strips' },
      { name: 'Japanese Kabocha Squash or Zucchini', amount: 1.5, unit: 'cups', notes: 'Thinly sliced' },
      { name: 'Baby Bok Choy', amount: 2, unit: 'heads', notes: 'Quartered' },
      { name: 'Green Scallion Tops (dark green only)', amount: 0.5, unit: 'cup', notes: 'FODMAP friendly' },
      { name: 'Fresh Grated Ginger Root', amount: 1.5, unit: 'tbsp' },
      { name: 'Tamari (Gluten-Free Soy Sauce)', amount: 2, unit: 'tbsp' },
      { name: 'Toasted Sesame Oil', amount: 1, unit: 'tbsp' },
      { name: 'Jasmine Brown Rice', amount: 1, unit: 'cup', notes: 'Cooked' }
    ],
    instructions: [
      'Heat toasted sesame oil in a wok or large ceramic skillet over medium-high heat.',
      'Add chicken strips and grated ginger, searing for 5-6 minutes until golden and thoroughly cooked.',
      'Add kabocha/zucchini slices and bok choy; stir-fry for 4 minutes until crisp-tender.',
      'Splash with tamari and fold in green scallion tops during the last 30 seconds of cooking.',
      'Serve hot over steamed jasmine brown rice.'
    ]
  },
  {
    id: 'keto-avocado-goddess-salad',
    title: 'Ketogenic Avocado & Hemp Green Goddess Salad',
    subtitle: 'Healthy monounsaturated fats and phytonutrient sulforaphane dense greens',
    prepTime: 12,
    cookTime: 0,
    servings: 2,
    mealType: 'Lunch',
    difficulty: 'Easy',
    tags: ['Keto', 'Vegan', 'Anti-Inflammatory', 'Gluten-Free'],
    calories: 480,
    protein: 16,
    carbs: 14,
    fat: 42,
    fiber: 10,
    sodium: 290,
    potassium: 910,
    iron: 3.8,
    magnesium: 140,
    glycemicLoad: 'Low',
    clinicalBenefits: 'Generates therapeutic ketones, delivers 10g prebiotic fiber with under 4g net carbohydrates. Hemp seeds deliver ideal 3:1 Omega-6 to Omega-3 ratio.',
    iconType: 'salad',
    ingredients: [
      { name: 'Ripe Hass Avocado', amount: 2, unit: 'medium' },
      { name: 'Shelled Hemp Hearts', amount: 4, unit: 'tbsp' },
      { name: 'Lacinato Kale & Romaine Hearts', amount: 4, unit: 'cups', notes: 'Shredded' },
      { name: 'Fresh Cilantro & Parsley', amount: 0.5, unit: 'cup', notes: 'Finely minced' },
      { name: 'Extra Virgin Olive Oil', amount: 3, unit: 'tbsp' },
      { name: 'Apple Cider Vinegar (Raw, with mother)', amount: 1.5, unit: 'tbsp' },
      { name: 'Sunflower Seeds', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'In a small blender or bowl, whisk 1/2 avocado, olive oil, apple cider vinegar, herbs, and pinch of sea salt into creamy dressing.',
      'In a large wooden bowl, massage the shredded kale with a pinch of salt to soften cellular fiber.',
      'Dice the remaining 1.5 avocados and fold into greens along with raw sunflower seeds.',
      'Toss with creamy herb dressing and top lavishly with raw hemp hearts.'
    ]
  },
  {
    id: 'hormone-seed-cycling-porridge',
    title: 'Hormone-Balancing Seed Cycling Chia Porridge',
    subtitle: 'Lignan-rich flax and zinc-dense pumpkin seeds tailored for endocrine rhythm',
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    mealType: 'Breakfast',
    difficulty: 'Easy',
    tags: ['Vegan', 'Anti-Inflammatory', 'Gluten-Free'],
    calories: 390,
    protein: 18,
    carbs: 32,
    fat: 22,
    fiber: 14,
    sodium: 110,
    potassium: 520,
    iron: 5.1,
    magnesium: 165,
    glycemicLoad: 'Low',
    clinicalBenefits: 'Ground flax lignans modulate estrogen receptors, while high magnesium supports adrenal clearance and restorative evening sleep quality.',
    iconType: 'granola',
    ingredients: [
      { name: 'Black Chia Seeds', amount: 3, unit: 'tbsp' },
      { name: 'Freshly Ground Golden Flaxseed', amount: 1.5, unit: 'tbsp' },
      { name: 'Sprouted Pumpkin Seeds', amount: 1.5, unit: 'tbsp' },
      { name: 'Unsweetened Almond or Coconut Milk', amount: 1, unit: 'cup' },
      { name: 'Ceylon Cinnamon', amount: 1, unit: 'tsp', notes: 'Improves glucose transporter sensitivity' },
      { name: 'Fresh Organic Blueberries', amount: 0.5, unit: 'cup' },
      { name: 'Pure Vanilla Bean extract', amount: 0.5, unit: 'tsp' }
    ],
    instructions: [
      'Combine chia seeds, ground flaxseed, ceylon cinnamon, and plant milk in a wide glass jar.',
      'Whisk thoroughly for 2 minutes to prevent chia clumping, let sit for 10 minutes (or refrigerate overnight).',
      'Warm gently on low heat or serve chilled.',
      'Top with fresh blueberries and sprouted pumpkin seeds.'
    ]
  },
  {
    id: 'golden-turmeric-lentil-stew',
    title: 'High-Protein Golden Turmeric & Red Lentil Stew',
    subtitle: 'Ayurvedic tridoshic clinical recipe with gut-healing warming aromatics',
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    mealType: 'Dinner',
    difficulty: 'Moderate',
    tags: ['Vegan', 'High-Protein', 'Anti-Inflammatory', 'Renal-Friendly'],
    calories: 420,
    protein: 24,
    carbs: 56,
    fat: 11,
    fiber: 16,
    sodium: 380,
    potassium: 780,
    iron: 6.4,
    magnesium: 105,
    glycemicLoad: 'Medium',
    clinicalBenefits: 'Rich in soluble fiber beta-glucans that bind cholesterol and fuel butyrate production in the colon. Curcumin and black pepper synergy reduces chronic systemic inflammation.',
    iconType: 'stew',
    ingredients: [
      { name: 'Split Red Lentils', amount: 1.5, unit: 'cups', notes: 'Rinsed until water runs clear' },
      { name: 'Unsweetened Light Coconut Milk', amount: 1, unit: 'cup' },
      { name: 'Filtered Water or Bone/Veg Broth', amount: 3, unit: 'cups' },
      { name: 'Fresh Turmeric Root (or powder)', amount: 1.5, unit: 'tbsp' },
      { name: 'Fresh Ginger', amount: 1, unit: 'tbsp', notes: 'Minced' },
      { name: 'Ground Cumin & Coriander', amount: 1, unit: 'tsp each' },
      { name: 'Baby Spinach', amount: 3, unit: 'cups', notes: 'Stirred in at end' }
    ],
    instructions: [
      'In a heavy-bottomed pot, gently toast ground cumin, coriander, turmeric, and ginger in 1 tbsp coconut oil.',
      'Add red lentils and broth; bring to a lively boil, then lower heat to gentle simmer for 18 minutes.',
      'Pour in coconut milk, stir until creamy and velvety.',
      'Fold in fresh spinach until wilted, season with sea salt and squeeze of lime.'
    ]
  },
  {
    id: 'glycemic-control-smoothie',
    title: 'Clinical Glycemic-Stabilizing Berry Smoothie',
    subtitle: 'Zero sugar spikes; packed with anthocyanin antioxidants and clean pea protein',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    mealType: 'Beverage',
    difficulty: 'Easy',
    tags: ['Diabetic-Friendly', 'Vegan', 'High-Protein', 'Gluten-Free'],
    calories: 310,
    protein: 28,
    carbs: 22,
    fat: 12,
    fiber: 9,
    sodium: 190,
    potassium: 490,
    iron: 4.0,
    magnesium: 95,
    glycemicLoad: 'Low',
    clinicalBenefits: 'Anthocyanins improve endothelial nitric oxide release. Low glycemic index blunts postprandial glucose excursions.',
    iconType: 'smoothie',
    ingredients: [
      { name: 'Organic Wild Blueberries (frozen)', amount: 0.75, unit: 'cup' },
      { name: 'Organic Plant Protein Powder (Unsweetened)', amount: 1, unit: 'scoop', notes: '25g protein' },
      { name: 'Raw Almond Butter', amount: 1, unit: 'tbsp' },
      { name: 'Chia Seeds', amount: 1, unit: 'tbsp' },
      { name: 'Unsweetened Vanilla Almond Milk', amount: 1.25, unit: 'cups' },
      { name: 'Ceylon Cinnamon', amount: 0.5, unit: 'tsp' }
    ],
    instructions: [
      'Place frozen wild blueberries, almond milk, and protein powder into high-speed blender.',
      'Add raw almond butter, chia seeds, and ceylon cinnamon.',
      'Blend on high for 45-60 seconds until silken and homogenous. Drink immediately.'
    ]
  }
];

export const MOCK_PATIENTS: PatientProfile[] = [
  {
    id: 'patient-01',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '(555) 234-8910',
    dob: '1984-06-14',
    gender: 'Female',
    clinicalFocus: 'Pre-diabetes, Insulin Resistance, Chronic Fatigue',
    mrn: 'MRN-83921-MET',
    targetCalories: 1750,
    targetProteinG: 110,
    targetCarbsG: 120,
    targetFatG: 75,
    targetWaterMl: 2500,
    hipaaConsentSigned: true,
    hipaaConsentDate: '2026-08-12',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M10 25 Q 30 10, 60 25 T 110 20" stroke="%231e293b" stroke-width="2" fill="none"/></svg>'
  },
  {
    id: 'patient-02',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '(555) 891-4421',
    dob: '1991-11-28',
    gender: 'Male',
    clinicalFocus: 'Gut Dysbiosis (SIBO-C), Endurance Marathon Fueling',
    mrn: 'MRN-44910-GUT',
    targetCalories: 2600,
    targetProteinG: 155,
    targetCarbsG: 280,
    targetFatG: 85,
    targetWaterMl: 3400,
    hipaaConsentSigned: true,
    hipaaConsentDate: '2026-07-04',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M10 20 Q 40 30, 70 15 T 110 25" stroke="%231e293b" stroke-width="2" fill="none"/></svg>'
  }
];

export const MOCK_BIOMETRIC_LOGS: BiometricLog[] = [
  {
    id: 'bio-101',
    patientId: 'patient-01',
    date: '2026-08-15',
    weightLbs: 178.4,
    bodyFatPct: 33.2,
    fastingGlucoseMgDl: 114,
    systolicBp: 132,
    diastolicBp: 86,
    waistInches: 35.5,
    hba1c: 5.9,
    notes: 'Initial clinical baseline with Dr. Disha. Fasting glucose elevated in pre-diabetic range.'
  },
  {
    id: 'bio-102',
    patientId: 'patient-01',
    date: '2026-08-25',
    weightLbs: 176.1,
    bodyFatPct: 32.7,
    fastingGlucoseMgDl: 108,
    systolicBp: 128,
    diastolicBp: 84,
    waistInches: 35.0,
    notes: 'Week 2. Morning energy stabilizing. Commenced Dr. Disha anti-inflammatory breakfast plan.'
  },
  {
    id: 'bio-103',
    patientId: 'patient-01',
    date: '2026-09-05',
    weightLbs: 173.8,
    bodyFatPct: 31.9,
    fastingGlucoseMgDl: 102,
    systolicBp: 124,
    diastolicBp: 80,
    waistInches: 34.2,
    notes: 'Week 4. Significant reduction in afternoon brain fog. Glucose dropping steadily.'
  },
  {
    id: 'bio-104',
    patientId: 'patient-01',
    date: '2026-09-18',
    weightLbs: 171.2,
    bodyFatPct: 31.0,
    fastingGlucoseMgDl: 96,
    systolicBp: 120,
    diastolicBp: 78,
    waistInches: 33.5,
    notes: 'Week 6. Fasting blood sugar entered optimal euglycemic zone (<100 mg/dL)!'
  },
  {
    id: 'bio-105',
    patientId: 'patient-01',
    date: '2026-09-29',
    weightLbs: 169.5,
    bodyFatPct: 30.2,
    fastingGlucoseMgDl: 92,
    systolicBp: 118,
    diastolicBp: 76,
    waistInches: 32.8,
    hba1c: 5.4,
    notes: 'Recheck lab milestone: HbA1c reduced to 5.4% (normalized below 5.7%). 8.9 lbs down.'
  },
  {
    id: 'bio-201',
    patientId: 'patient-02',
    date: '2026-08-10',
    weightLbs: 165.0,
    bodyFatPct: 14.8,
    fastingGlucoseMgDl: 89,
    systolicBp: 116,
    diastolicBp: 72,
    waistInches: 31.0,
    notes: 'Baseline intake. Digestive motility slowed, frequent post-workout cramping.'
  },
  {
    id: 'bio-202',
    patientId: 'patient-02',
    date: '2026-09-25',
    weightLbs: 166.5,
    bodyFatPct: 13.9,
    fastingGlucoseMgDl: 86,
    systolicBp: 112,
    diastolicBp: 70,
    waistInches: 30.8,
    notes: 'Lean tissue increase. Gut symptoms 80% reduced with Dr. Disha low-FODMAP cycling.'
  }
];

export const MOCK_FOOD_LOGS: FoodDiaryItem[] = [
  {
    id: 'food-01',
    patientId: 'patient-01',
    date: '2026-09-30',
    mealType: 'breakfast',
    title: 'Hormone-Balancing Seed Cycling Chia Porridge with Wild Blueberries',
    portion: '1 bowl',
    calories: 390,
    protein: 18,
    carbs: 32,
    fat: 22,
    loggedAt: '08:15 AM'
  },
  {
    id: 'food-02',
    patientId: 'patient-01',
    date: '2026-09-30',
    mealType: 'lunch',
    title: 'Anti-Inflammatory Wild Salmon Quinoa Bowl with Extra Avocado',
    portion: '1 full bowl',
    calories: 540,
    protein: 42,
    carbs: 38,
    fat: 24,
    loggedAt: '01:20 PM'
  },
  {
    id: 'food-03',
    patientId: 'patient-01',
    date: '2026-09-30',
    mealType: 'snack',
    title: 'Raw Walnuts and Green Apple with Ceylon Cinnamon',
    portion: '1.5 oz nuts + 1 small apple',
    calories: 220,
    protein: 5,
    carbs: 18,
    fat: 16,
    loggedAt: '04:30 PM'
  },
  {
    id: 'food-04',
    patientId: 'patient-01',
    date: '2026-09-30',
    mealType: 'dinner',
    title: 'Herb-Roasted Pasture Turkey Breast with Steamed Asparagus & Olive Oil',
    portion: '6 oz turkey, 2 cups asparagus',
    calories: 410,
    protein: 46,
    carbs: 10,
    fat: 18,
    loggedAt: '07:15 PM'
  }
];

export const MOCK_HYDRATION: Record<string, HydrationLog> = {
  'patient-01': {
    patientId: 'patient-01',
    date: '2026-09-30',
    currentMl: 2000,
    targetMl: 2500
  },
  'patient-02': {
    patientId: 'patient-02',
    date: '2026-09-30',
    currentMl: 2750,
    targetMl: 3400
  }
};

export const MOCK_SUPPLEMENTS: SupplementProtocol[] = [
  {
    id: 'sup-01',
    patientId: 'patient-01',
    name: 'Berberine HCl (Liposomal)',
    dosage: '500 mg',
    timing: 'with-meals',
    purpose: 'Activates AMPK kinase; promotes insulin receptor sensitivity and hepatic lipid clearance.',
    daysChecked: { '2026-09-30_morning': true, '2026-09-30_evening': false }
  },
  {
    id: 'sup-02',
    patientId: 'patient-01',
    name: 'Omega-3 Fish Oil (Supercritical Triglyceride EPA/DHA)',
    dosage: '2,000 mg (1,200 EPA / 600 DHA)',
    timing: 'morning',
    purpose: 'Systemic inflammation attenuation and endothelial vascular resilience.',
    daysChecked: { '2026-09-30_morning': true }
  },
  {
    id: 'sup-03',
    patientId: 'patient-01',
    name: 'Magnesium Bisglycinate Chelate',
    dosage: '350 mg elemental',
    timing: 'evening',
    purpose: 'Supports deep restorative slow-wave sleep and parasympathetic relaxation.',
    daysChecked: { '2026-09-30_evening': false }
  },
  {
    id: 'sup-04',
    patientId: 'patient-01',
    name: 'Vitamin D3 + K2 (MK-7)',
    dosage: '5,000 IU D3 / 100 mcg K2',
    timing: 'morning',
    purpose: 'Immunomodulation and arterial calcium chaperoning.',
    daysChecked: { '2026-09-30_morning': true }
  }
];

export const MOCK_SYMPTOMS: SymptomLog[] = [
  {
    id: 'sym-01',
    patientId: 'patient-01',
    date: '2026-09-30',
    energyLevel: 8,
    digestiveDistressScore: 1,
    bristolStoolType: 4,
    bloatingLevel: 'None',
    sleepHours: 7.8,
    notes: 'No 3 PM sugar crash today. Felt calm and clear-headed through afternoon presentations.'
  },
  {
    id: 'sym-02',
    patientId: 'patient-01',
    date: '2026-09-29',
    energyLevel: 7,
    digestiveDistressScore: 2,
    bristolStoolType: 4,
    bloatingLevel: 'Mild',
    sleepHours: 7.2,
    notes: 'Mild bloating after eating dining-out salad; possibly hidden onion/garlic dressing.'
  }
];

export const MOCK_SOAP_NOTES: SoapNote[] = [
  {
    id: 'soap-101',
    patientId: 'patient-01',
    encounterDate: '2026-09-29',
    provider: 'Dr. Disha, MS, RDN, CDN, IFMCP',
    consultationType: 'Clinical Follow-Up & Biometric Reassessment (45 Min)',
    subjective: 'Patient Sarah Jenkins reports high compliance (92%) with glycemic stabilizing meal plans over past 4 weeks under Dr. Disha care. States postprandial lethargy has resolved completely. Sleep latency decreased from 45 min to under 15 min.',
    objective: 'Weight: 169.5 lbs (-8.9 lbs from baseline). Fasting BG via Accu-Chek: 92 mg/dL. Clinic BP: 118/76 mmHg. Waist circumference: 32.8 inches. Repeat HbA1c lab result: 5.4% (improved from 5.9%).',
    assessment: '1. Pre-diabetes (ICD-10: R73.03) - Marked clinical remission; current glycemic indices within physiological euglycemic targets.\n2. Excess adiposity with metabolic dysfunction (ICD-10: E66.9) - Steady visceral loss preserved lean mass.',
    plan: '1. Continue berberine 500mg BID prior to largest meals for 30 more days.\n2. Titrate daily dietary carbohydrates from 110g to 130g using low-glycemic tuber starches.\n3. Schedule repeat lipid panel & fasting insulin in 8 weeks.\n4. Follow-up consultation scheduled with Dr. Disha for 2026-10-28.',
    icd10Codes: [
      { code: 'R73.03', description: 'Prediabetes' },
      { code: 'E66.9', description: 'Obesity, unspecified / metabolic dysfunction' }
    ],
    cptCodes: [
      { code: '97803', description: 'Medical nutrition therapy; re-assessment and intervention, each 15 minutes' }
    ],
    signature: 'Digitally Verified & Signed: Dr. Disha, MS, RDN (Lic# NY-CDN-009482)',
    locked: true
  }
];

export const MOCK_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-01',
    patientId: 'patient-01',
    panelName: 'Comprehensive Metabolic & Glycemic Biomarker Panel',
    testDate: '2026-09-24',
    labFacility: 'Quest Diagnostics Specialized Endocrine Lab, NY',
    orderingProvider: 'Dr. Disha, MS, RDN, CDN',
    markers: [
      {
        name: 'Fasting Blood Glucose',
        value: 92,
        unit: 'mg/dL',
        refLow: 70,
        refHigh: 99,
        status: 'normal',
        clinicalInterpretation: 'Optimal fasting euglycemia; reflects hepatic insulin sensitivity.'
      },
      {
        name: 'Hemoglobin A1c (HbA1c)',
        value: 5.4,
        unit: '%',
        refLow: 4.5,
        refHigh: 5.6,
        status: 'normal',
        clinicalInterpretation: 'Normalized from baseline 5.9%. Zero elevated glycation.'
      },
      {
        name: 'Fasting Serum Insulin',
        value: 6.8,
        unit: 'uIU/mL',
        refLow: 2.6,
        refHigh: 12.0,
        status: 'normal',
        clinicalInterpretation: 'Optimal functional medicine reference range (<8.0 uIU/mL).'
      },
      {
        name: 'HOMA-IR (Insulin Resistance Index)',
        value: 1.54,
        unit: 'score',
        refLow: 0.5,
        refHigh: 1.9,
        status: 'normal',
        clinicalInterpretation: 'Indicates robust cellular insulin sensitivity.'
      },
      {
        name: 'hs-CRP (High-Sensitivity C-Reactive Protein)',
        value: 0.8,
        unit: 'mg/L',
        refLow: 0.0,
        refHigh: 1.0,
        status: 'normal',
        clinicalInterpretation: 'Low cardiovascular systemic vascular inflammation.'
      },
      {
        name: 'Vitamin D, 25-Hydroxy',
        value: 58,
        unit: 'ng/mL',
        refLow: 40,
        refHigh: 80,
        status: 'normal',
        clinicalInterpretation: 'Therapeutic functional range achieved with D3/K2 protocol.'
      },
      {
        name: 'Serum Ferritin',
        value: 62,
        unit: 'ng/mL',
        refLow: 30,
        refHigh: 150,
        status: 'normal',
        clinicalInterpretation: 'Adequate iron stores without acute phase elevation.'
      }
    ],
    physicianComments: 'Outstanding biomarker normalization across all glycemic and inflammatory indices. The patient has successfully reversed pre-diabetic biomarker phenotype through clinical nutrition therapy under Dr. Disha.'
  }
];

export const MOCK_EMAIL_REMINDERS: EmailReminder[] = [
  {
    id: 'rem-confirm',
    type: 'booking-confirmation',
    title: 'Instant Booking Confirmation Email',
    subject: 'Consultation Confirmed with Dr. Disha + Pre-Appointment Clinical Intake',
    scheduledTime: 'Triggered immediately upon client reservation',
    channel: 'Both',
    enabled: true,
    lastDispatched: '2026-09-30 11:20 AM',
    previewTemplate: {
      heading: 'Your Consultation is Officially Confirmed!',
      body: 'Dear Sarah, Dr. Disha has reserved your comprehensive Telehealth session. Your calendar invite and intake documentation are attached. Please complete your 3-day baseline dietary log prior to our appointment.',
      actionLabel: 'Open Video Room & Intake Record',
      actionUrl: 'https://telehealth.drdisha-nutrition.com/room/sarah-jenkins'
    }
  },
  {
    id: 'rem-01',
    type: 'consultation-24h',
    title: '24-Hour Consultation Reminder & Intake Link',
    subject: 'Upcoming Clinical Nutrition Consultation Tomorrow with Dr. Disha',
    scheduledTime: '24 hours prior to appointment',
    channel: 'Both',
    enabled: true,
    lastDispatched: '2026-09-29 09:00 AM',
    previewTemplate: {
      heading: 'Your Clinical Appointment is Tomorrow',
      body: 'Hello Sarah, this is a reminder for your Comprehensive Nutrition Reassessment scheduled for tomorrow at 09:30 AM EST with Dr. Disha. Please ensure your recent food logs and fasting glucose logs are submitted.',
      actionLabel: 'Join Video Consultation / Review Prep',
      actionUrl: 'https://telehealth.drdisha-nutrition.com/room/sarah-jenkins'
    }
  },
  {
    id: 'rem-02',
    type: 'fasting-glucose',
    title: 'Morning Fasting Glucose Prompt',
    subject: 'Quick Check-in: Please log your morning fasting blood sugar',
    scheduledTime: 'Daily at 07:30 AM',
    channel: 'SMS',
    enabled: true,
    lastDispatched: '2026-09-30 07:30 AM',
    previewTemplate: {
      heading: 'Morning Biometric Check-in',
      body: 'Good morning! Taking 30 seconds to record your fasting morning glucose helps Dr. Disha fine-tune your evening carbohydrate allotment and metabolic response.',
      actionLabel: 'Log Glucose in Patient Portal',
      actionUrl: 'https://drdisha-nutrition.com/#portal'
    }
  },
  {
    id: 'rem-03',
    type: 'hydration-nudge',
    title: 'Midday Cellular Hydration Nudge',
    subject: 'Hydration Target Check: 1,500 mL reached so far',
    scheduledTime: 'Daily at 02:00 PM',
    channel: 'Email',
    enabled: true,
    lastDispatched: '2026-09-30 02:00 PM',
    previewTemplate: {
      heading: 'Time for Electrolyte Hydration',
      body: 'Keep your mitochondrial energy humming! Sip a tall glass of filtered water with a pinch of Celtic sea salt or electrolyte mineral drops to maintain cellular osmolarity.',
      actionLabel: 'Log Water Intake (+250mL)',
      actionUrl: 'https://drdisha-nutrition.com/#portal'
    }
  },
  {
    id: 'rem-04',
    type: 'weekly-summary',
    title: 'Weekly Clinical Progress & Macro Review',
    subject: 'Your Weekly Nutrition Adherence Report - Dr. Disha',
    scheduledTime: 'Sundays at 06:00 PM',
    channel: 'Email',
    enabled: true,
    lastDispatched: '2026-09-27 06:00 PM',
    previewTemplate: {
      heading: 'Your Weekly Health Momentum',
      body: 'Congratulations on logging 6 of 7 days this week! Your average fasting glucose was 94 mg/dL and your average protein intake hit 108g/day. Keep this rhythm strong.',
      actionLabel: 'View Detailed Weekly Health Chart',
      actionUrl: 'https://drdisha-nutrition.com/#portal'
    }
  }
];

export const MOCK_CAMPAIGNS: BroadcastCampaign[] = [
  {
    id: 'camp-01',
    title: 'Autumn Metabolic Reset & Continuous Glucose Blueprint',
    subject: 'Dr. Disha: How Seasonal Shifts Impact Insulin Sensitivity + New Protocol Drop',
    targetGroup: 'All Patients',
    contentSnippet: 'Learn how cooler temperatures and shorter daylight modulate thyroid T3/T4 conversion and how to adjust your complex root carbohydrates without triggering glucose spikes.',
    status: 'Sent',
    sentAt: '2026-09-28 10:00 AM',
    recipientsCount: 420,
    openRatePct: 78.4,
    category: 'Newsletter'
  },
  {
    id: 'camp-02',
    title: 'New Clinical Recipe: High-Protein Turmeric & Lentil Stew',
    subject: 'New Recipe Drop: 24g Plant Protein & Ayurvedic Gut-Healing Aromatics',
    targetGroup: 'Gut Health & SIBO',
    contentSnippet: 'Discover our newest polyphenol-rich, butyrate-stimulating clinical recipe formulated by Dr. Disha for optimal colonocyte repair and zero postprandial distress.',
    status: 'Sent',
    sentAt: '2026-09-22 02:30 PM',
    recipientsCount: 185,
    openRatePct: 84.1,
    category: 'New Recipe Announcement'
  }
];

export const MOCK_EMI_CONTRACTS: EmiContract[] = [
  {
    id: 'emi-01',
    patientId: 'patient-01',
    patientName: 'Sarah Jenkins',
    serviceTitle: '3-Month Gut & Microbiome Reset Program',
    principalAmount: 540,
    downPayment: 180,
    months: 3,
    monthlyAmount: 120,
    paidMonths: 2,
    nextDueDate: '2026-10-15',
    status: 'active'
  }
];

export const MOCK_INVOICES: InvoiceSuperbill[] = [
  {
    id: 'inv-8901',
    invoiceNumber: 'INV-2026-8901',
    patientId: 'patient-01',
    patientName: 'Sarah Jenkins',
    serviceDescription: 'Comprehensive Initial Clinical Nutrition Consultation (75 Min)',
    cptCode: '97802',
    icd10Code: 'R73.03 (Prediabetes)',
    amount: 245.00,
    tax: 0.00,
    total: 245.00,
    date: '2026-08-15',
    status: 'paid',
    paymentMethod: 'Visa •••• 4242 (HSA/FSA Eligible)',
    providerNpi: CLINICAL_PROVIDER.npi,
    taxId: CLINICAL_PROVIDER.taxId,
    clinicAddress: CLINICAL_PROVIDER.clinicAddress
  },
  {
    id: 'inv-9042',
    invoiceNumber: 'INV-2026-9042',
    patientId: 'patient-01',
    patientName: 'Sarah Jenkins',
    serviceDescription: 'Clinical MNT Follow-Up & Biometric Reassessment (45 Min)',
    cptCode: '97803',
    icd10Code: 'R73.03 (Prediabetes)',
    amount: 135.00,
    tax: 0.00,
    total: 135.00,
    date: '2026-09-29',
    status: 'paid',
    paymentMethod: 'Mastercard •••• 8821',
    providerNpi: CLINICAL_PROVIDER.npi,
    taxId: CLINICAL_PROVIDER.taxId,
    clinicAddress: CLINICAL_PROVIDER.clinicAddress
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-30 08:15:22',
    actor: 'Sarah Jenkins (Patient)',
    action: 'LOGIN_PORTAL',
    resource: '/patient-portal',
    ipAddress: '198.51.100.44',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-30 08:16:04',
    actor: 'Sarah Jenkins (Patient)',
    action: 'UPDATE_BIOMETRICS',
    resource: '/biometrics/glucose',
    ipAddress: '198.51.100.44',
    status: 'SUCCESS'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-29 14:32:10',
    actor: 'Dr. Disha (Provider)',
    action: 'EDIT_SOAP',
    resource: '/ehr/soap-notes/soap-101',
    ipAddress: '12.184.220.15',
    status: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-29 14:45:00',
    actor: 'Dr. Disha (Provider)',
    action: 'ACCESS_LABS',
    resource: '/ehr/labs/lab-01',
    ipAddress: '12.184.220.15',
    status: 'SUCCESS'
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-28 10:11:54',
    actor: 'Sarah Jenkins (Patient)',
    action: 'EXPORT_EHR',
    resource: '/ehr/superbill/inv-9042',
    ipAddress: '198.51.100.44',
    status: 'SUCCESS'
  }
];

export const MOCK_DRUG_NUTRIENTS: DrugNutrientDepletionItem[] = [
  {
    drugClass: 'Biguanides (Metformin)',
    commonMedications: ['Glucophage', 'Fortamet', 'Riomet'],
    depletedNutrients: ['Vitamin B12 (Cobalamin)', 'Folate', 'Coenzyme Q10'],
    physiologicalMechanism: 'Competitively inhibits calcium-dependent ileal uptake of intrinsic factor-B12 complex.',
    clinicalDietaryIntervention: 'Daily methylcobalamin 1,000 mcg sublingual + dietary nutritional yeast & pasture-raised eggs.'
  },
  {
    drugClass: 'Proton Pump Inhibitors (PPIs)',
    commonMedications: ['Omeprazole', 'Pantoprazole', 'Esomeprazole'],
    depletedNutrients: ['Magnesium', 'Vitamin B12', 'Iron', 'Zinc', 'Calcium'],
    physiologicalMechanism: 'Hypochlorhydria impairs ionization and proteolytic cleavage of minerals from dietary food matrices.',
    clinicalDietaryIntervention: 'Magnesium bisglycinate chelate 350mg + organic bone broth & lemon water digestive bitters.'
  },
  {
    drugClass: 'HMG-CoA Reductase Inhibitors (Statins)',
    commonMedications: ['Atorvastatin (Lipitor)', 'Rosuvastatin (Crestor)', 'Simvastatin'],
    depletedNutrients: ['Coenzyme Q10 (Ubiquinol)', 'Vitamin K2 (MK-7)', 'Selenium'],
    physiologicalMechanism: 'Inhibits mevalonate pathway necessary for both endogenous cholesterol and CoQ10 synthesis.',
    clinicalDietaryIntervention: 'Ubiquinol 200mg daily in lipid base + wild Atlantic sardines & grass-fed butter.'
  }
];

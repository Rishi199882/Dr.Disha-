# Elena Vance Clinical Nutrition & Dietetics

A comprehensive, production-grade clinical nutritionist web platform engineered with **React 19**, **TypeScript**, and **Tailwind CSS 4**. Designed for clinical dietetics practices, functional medicine nutritionists, and telehealth consultations.

---

## 🌟 Key Features (35+ Production Capabilities)

### 1. Clinical Branding & Editorial Homepage
- **Credentials & Certifications**: Showcases Dr. Elena Vance's credentials (MS Columbia Univ, RDN, CDN, IFMCP, Board Certified Specialist).
- **Quantified Clinical Proof**: Documented remission rates (94.2% pre-diabetes euglycemia at 12 weeks, 88.6% IBS/SIBO relief).
- **Care Modalities**: Advanced metabolomics, 4-R gut barrier restoration, and longevity dietetics.

### 2. Integrated Consultation Booking System
- **Clinical Modality Catalog**: 6 distinct consultation types (Comprehensive Initial Assessment 75m, Gut Protocol 60m, Metabolic Tuning 60m, Sports Nutrition 50m, Follow-Up 45m, Pediatric Nutrition 60m) with billing CPT codes (97802 / 97803).
- **Interactive Calendar & Slot Picker**: Live date picker with available time slots synced to the client's local timezone.
- **HIPAA-Compliant Pre-Consultation Intake Form**: Comprehensive medical history, known food allergies, current medications/supplements, GI symptom checklist, and biometrics baseline.
- **Instant `.ics` iCalendar File Generator**: One-click download of calendar invites formatted for Apple Calendar, Google Calendar, and Microsoft Outlook.
- **Appointment Management**: View scheduled consultations with direct Telehealth video links and cancellation/reschedule capabilities.

### 3. Culinary Medicine & Recipe Blog
- **Clinical Recipe Compendium**: 6+ therapeutic recipes (Anti-Inflammatory Wild Salmon Quinoa Bowl, Low-FODMAP Ginger Sesame Chicken, Ketogenic Avocado Goddess Salad, Hormone-Balancing Seed Cycling Chia Porridge, High-Protein Golden Turmeric Lentil Stew, Glycemic-Control Berry Smoothie).
- **Search & Multi-Tag Filters**: Instant search by ingredients or benefits; filter by Keto, Vegan, Low-FODMAP, Anti-Inflammatory, Diabetic-Friendly, Gluten-Free, and High-Protein.
- **Dynamic Portion Multiplier**: Real-time recalculation of ingredient measurements and nutritional macros (1x, 2x, 4x, or custom servings).
- **Interactive Cooking Mode**: Step-by-step checklist with built-in digital kitchen countdown timer (start, pause, reset).
- **Complete Macro & Micronutrient Profile**: Quantification of Calories, Protein, Net Carbs, Fat, Fiber, Sodium, Potassium, and Magnesium.
- **One-Click "Log to Patient Diary"**: Directly sends recipe nutrition into today's patient food log.
- **Printable Recipe Formatting**: Clean print styles without UI clutter.

### 4. Patient Progress Portal & Biometric Tracker
- **Multi-Patient Profile Switcher**: Switch seamlessly between Sarah Jenkins (Pre-diabetes/Metabolic) and Marcus Vance (Gut Dysbiosis/Athletic) or view custom patient goals.
- **Daily Energy & Macro Rings**: Visual progress towards personalized daily targets (Calories, Protein, Net Carbs, Healthy Fat).
- **Interactive 8-Glass Cellular Hydration Tracker**: Real-time water tracking with quick `+250 mL` and `+500 mL` increment buttons.
- **Biometric & Glycemic Response Tracker**: Track Weight (lbs), Body Fat %, Fasting Blood Glucose (mg/dL), Blood Pressure (mmHg), and Waist Circumference.
- **Interactive SVG Trend Chart**: Dynamic trend curves plotted with clinical functional reference ranges (&lt; 99 mg/dL target zone).
- **Supplement & Medication Adherence**: Check off daily AM and PM dosages with mechanism of action descriptions.
- **Symptom & Energy Journal**: Daily Vitality rating (1-10), GI Distress score (0-10), Bristol Stool Scale selector (Types 1-7), and sleep hours tracker.

### 5. Automated Reminders & Notification Sandbox
- **Automated Communication Sequences**: 24-hour consultation reminder, 2-hour alert, morning fasting glucose check-in prompt, midday hydration nudge, and Sunday progress summary.
- **Multi-Channel Delivery**: Toggle alerts between Email, SMS, or Both.
- **Interactive Dispatch Simulator**: Test send notifications with real-time delivery audit logging.
- **Responsive HTML Email Template Previewer**: Inspect rendered emails designed for desktop and mobile clients.

### 6. Payment Gateway & Medical Superbills
- **Clinical Care Packages**: Initial Evaluation ($245), 3-Month Gut Reset Program ($540), 6-Month Metabolic Remission ($980), and Monthly Retainer ($140/mo).
- **Simulated Stripe / Apple Pay Checkout**: Cardholder validation, expiration formatting, CVC check, and PCI-DSS Level 1 compliance simulation.
- **HSA / FSA Card Compatibility**: IRS Code 213(d) qualified medical expense verification.
- **Income-Based Sliding Scale Calculator**: Hardship discount calculator (10% to 40% reduction based on household income).
- **Instant Medical Superbill & Invoice Generator**: Official statement featuring Rendering Provider NPI (`1841392810`), Tax ID (`47-9281042`), CPT procedure codes (`97802`, `97803`), and ICD-10 diagnostic codes (`R73.03`, `K58.9`) ready for submission to insurance carriers.

### 7. EHR Clinical Documentation & Laboratory Biomarkers
- **Clinical SOAP Notes**: Comprehensive Subjective, Objective, Assessment, and Plan documentation with electronic signature verification and tamper-evident locking.
- **Laboratory Biomarker Hub**: Quest Diagnostics & LabCorp panel viewer (Fasting Glucose, HbA1c, Fasting Insulin, HOMA-IR, hs-CRP, Vitamin D 25-OH, Ferritin) with automated Normal/High/Low range indicators.
- **Diagnostic Lab Upload Simulator**: Upload and integrate HL7/PDF lab documents.

### 8. HIPAA 45 CFR Compliance & Security Protocols
- **Safeguards Overview**: Detailed Physical, Technical, and Administrative Safeguard documentation with Business Associate Agreement (BAA) verification.
- **Digital Patient Consent Pad**: Interactive HTML5 canvas where patients draw and save their digital signature.
- **Chronological PHI Audit Trail**: Immutable access logs tracking every record view, biometric update, and data export.
- **Full Encrypted EHR Export**: Download complete patient history as an encrypted JSON backup.
- **Session Auto-Lock Screen**: 4-digit PIN protection (Default: `1234`) to conceal patient health records during practitioner absence.

### 9. Clinical Macro Calculator (Mifflin-St Jeor)
- Interactive energy expenditure calculator taking sex, age, height, weight, activity factor, and deficit/surplus goals.
- One-click "Apply Targets to Patient" button that syncs directly to the patient's daily targets.

---

## 🚀 GitHub Repository Deployment (Zero Blank Screen Guarantee)

This project is specially configured so that deploying to GitHub Pages **will not show a blank white screen**:

1. **Relative Asset Base (`base: './'`)**: Set in `vite.config.ts` so asset bundles resolve correctly on repository subpaths (`username.github.io/repo-name/`) instead of failing with 404 errors.
2. **Hash-Synchronized Client Routing**: Page refreshes will never 404 or fail to load.
3. **Local-First Sandboxed Persistence**: Zero dependencies on external database cold starts or private API secrets for static hosting.
4. **Pre-configured GitHub Actions Workflow**: Located at `.github/workflows/deploy.yml`.

### Quick Deploy Instructions

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete clinical nutrition platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** &rarr; **Pages**
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**
3. That's it! GitHub Actions will build and deploy your site automatically at `https://<your-username>.github.io/<your-repo-name>/`.

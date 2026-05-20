# 🇬🇧 English IT Learning App 
<img width="438" height="739" alt="Wordcard component" src="https://github.com/user-attachments/assets/110bdd44-452c-493a-a55d-4e7f0a6b9deb" />
<img width="388" height="719" alt="Settings screen" src="https://github.com/user-attachments/assets/d09c01de-a65e-4f3c-861f-b6bfe1c5aeed" />


A modern, interactive web application designed to help users learn **English vocabulary related to IT and professional work environments**.  
The app combines **daily notifications**, **flashcards**, and **adaptive testing** to make learning efficient and engaging.

---

## 🚀 Features

### 🗂️ Categories
- Users can select **one learning category** at a time (e.g., *IT English*).  
- After completing a category, the next one can be unlocked.  

---

### 🔔 Daily Notifications
- Daily notifications send **a word and its translation** at selected hours.  
- Users can choose how many words to receive each day: **5, 10, or 15**.  
- Add **quiet hours** (e.g., at night) when no notifications are sent.  
- Notifications also appear inside the app as **flashcards** with:
  - the word 🗣️  
  - its translation 🌍  
  - example sentences 💬  

---

### 🧠 Daily Test
- At the end of each day, users receive a **notification** inviting them to take a **daily test**.  
- The test can be **skipped** or **postponed** to the next day.  
- Tests open directly in the app.  
- Two types of tests:
  1. **Multiple choice (A, B, C, D)**  
  2. **Write the translation manually**

#### 🏁 Test Results
- After finishing, users see:
  - Which questions were correct ✅  
  - Correct answers for mistakes ❌  
- Tests can be repeated **unlimited times**.  
- Each new test includes words from **previous days** for better retention.

---

### 📈 Progress Tracking
- The app tracks:
  - **Daily progress:** e.g., `13 / 20 words remembered`  
  - **Category progress:** e.g., `123 / 1000 words (24%)`  
  - **Overall progress:** total words learned  

#### 🏅 Levels
| Level | Words Range | Emoji |
|:------|:-------------|:------|
| 🥉 Beginner | 0–50 | 🥉 |
| 🥈 Intermediate | 51–150 | 🥈 |
| 🥇 Advanced | 151–300 | 🥇 |
| 💎 Expert | 301–500 | 💎 |
| 👑 Master | 501+ | 👑 |

---

### 🔁 Smart Repetition Algorithm
The app automatically reminds users to review words based on their difficulty:

| Difficulty | Accuracy | Next Review |
|:------------|:----------|:-------------|
| 🟢 Easy | 100% | After 30 days |
| 🟡 Medium | 70–99% | After 7 days |
| 🔴 Hard | <70% | After 1 day |

This ensures optimal long-term memory retention.

---

## 🧩 UI Flow (Figma Prototype)

### 1️⃣ Loading Page
- Displays logo or animation while the app initializes.

### 2️⃣ User Setup
- Enter your name → click **Next**.  

### 3️⃣ Welcome Page
- Welcome message 👋  
- Choose a learning category → click **Next**.  

### 4️⃣ Daily Settings
- Choose **number of words per day** (slider interaction).  
- Set **notification hours**.  
- Optionally define **quiet hours**.  

### 5️⃣ Start Day
- Choose when to start learning: **Today** or **Tomorrow**.  

### 6️⃣ Flashcards View
- Card shows **word + translation**, and **example usage**.  
- Swipe left/right between words.  
- Return to previous words at any time.  

### 7️⃣ Test Mode
- Choose test type:
  - **A/B/C/D quiz**
  - **Type the translation**

#### Multiple Choice (A–D)
- One card per word  
- 4 options + "Select" button next to each  
- Button **Next →** to proceed  

#### Type the Translation
- Word displayed on card  
- User types translation into input field  
- Button **Next →** to continue  

---

## 🧭 Tech Stack
*(adjust depending on your actual stack)*  
- **Framework:** React / Next.js  
- **UI:** TailwindCSS, shadcn/ui  
- **State management:** Zustand / Redux  
- **Notifications:** Web Push API / Firebase  
- **Routing:** React Router / Next Navigation  
- **Design:** Figma  

---

## 📊 Future Enhancements
- 📱 Mobile app version (React Native)  
- 🗃️ User dictionary to save favorite words  
- 🔄 Sync progress across devices  
- 🌐 Multi-language support  

---

## 💡 Example Progress Overview


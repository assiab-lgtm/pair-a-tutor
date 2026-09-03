# Study Pair Connect

Create a lightweight, modern P2P tutoring marketplace named "StudyPair" - a simple pure-intermediation platform connecting high school tutors with middle school students (6ème to 3ème).

### 1. Platform Philosophy & Architecture

- Pure Intermediation Model: Focus on fast matching, seamless UX, and community self-regulation via star ratings/reviews.

- Roles: "Student/Parent" (Booker & Payee) and "Tutor" (High Schooler).

- Anonymous Profiles: Display Tutor First Name + Last Name Initial only.

### 2. Streamlined Onboarding

- Simple Tutor Signup: Basic profile creation, subject selection, and document upload for Brevet transcript verification (Mention Très Bien).

- Optional Quick Audio Test: 2-minute voice recording module for tutors to introduce their teaching approach.

### 3. Dynamic Pricing & Booking Matrix

- Automated Grade-Based Pricing:

  * 6ème: $10/h

  * 5ème: $12/h

  * 4ème: $14/h

  * 3ème: $16/h

- Automated Split Payment (Stripe Connect):

  * 80% to Tutor account (payout released automatically upon session completion).

  * 20% platform commission fee.

- Calendar & Instant Booking: Tutors set availability slots; parents book in 3 clicks.

### 4. Classroom & Communication

- Integrated Chat: Built-in anti-circumvention text filter (masks phone numbers and external links).

- Faceless Virtual Classroom: Embedded WebRTC/Jitsi module supporting Audio + Screen Sharing / Digital Whiteboard by default (Camera optional).

- Basic Session Timer: Tracks ongoing session duration.

### 5. Review & Self-Regulation System

- Post-Lesson Rating: Prompt parents/students to leave a 1-5 star rating and short text review at the end of each completed session.

- Automatic Quality Filter: Tutors with average ratings below 3.5 stars are flagged or deprioritized in search results.

- Simple Dispute Button: Allows parents to submit a query to support if a session was incomplete or unattended.

### Tech Stack Specifications:

- Frontend: React, Tailwind CSS, Lucide Icons, Shadcn UI components.

- Backend/Database: Supabase (Auth, RLS, Storage, Realtime DB).

- Payments: Stripe Connect.

- Video/Audio Engine: Jitsi Meet IFrame API.

- UI Style: Clean, ultra-simple, modern light/dark interface with navy blue and emerald accents.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pair-a-tutor.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ffde23a4-626c-4587-89a1-9f035e1a5290).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

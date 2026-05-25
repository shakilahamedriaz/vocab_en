# Software Requirements Specification (SRS)

## IELTS AI Vocabulary Learning Platform

### Version 1.0 | May 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users & Personas](#3-target-users--personas)
4. [System Overview](#4-system-overview)
5. [Functional Requirements - Backend](#5-functional-requirements---backend)
6. [Functional Requirements - Frontend](#6-functional-requirements---frontend)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Data Models](#9-data-models)
10. [API Specifications](#10-api-specifications)
11. [SRS Algorithm Design](#11-srs-algorithm-design)
12. [AI Integration Strategy](#12-ai-integration-strategy)
13. [UI/UX Design Specifications](#13-uiux-design-specifications)
14. [Security Requirements](#14-security-requirements)
15. [Testing Strategy](#15-testing-strategy)
16. [Development Roadmap](#16-development-roadmap)
17. [Risk Analysis & Mitigation](#17-risk-analysis--mitigation)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the IELTS AI Vocabulary Learning Platform. It details the functional and non-functional requirements, system architecture, data models, and implementation strategy for building a production-grade vocabulary learning application.

### 1.2 Scope

The platform transforms static vocabulary PDFs into an interactive, AI-powered learning experience with spaced repetition, gamification, and contextual sentence generation. The system targets IELTS candidates (Band 5-8.5) and university students seeking to master 30,000+ English vocabulary items.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| SRS | Spaced Repetition System |
| IELTS | International English Language Testing System |
| SM-2 | SuperMemo Algorithm 2 |
| FSRS | Free Spaced Repetition Scheduler |
| MCQ | Multiple Choice Question |
| LLM | Large Language Model |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| PDF | Portable Document Format |
| POS | Part of Speech |
| NLP | Natural Language Processing |

### 1.4 References

- SuperMemo Algorithm SM-2 Documentation
- FSRS (Free Spaced Repetition Scheduler) Specification
- IELTS Band Descriptors (British Council)
- FastAPI Documentation
- React 18 Documentation
- LangChain Documentation

### 1.5 Overview

This document is organized into 18 sections covering product vision, user personas, functional requirements (separated by backend and frontend), non-functional requirements, system architecture, data models, API specifications, SRS algorithm design, AI integration, UI/UX specifications, security, testing, roadmap, and risk analysis.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

To become the leading AI-powered vocabulary learning platform that transforms passive memorization into active vocabulary mastery through contextual usage, intelligent spacing, and adaptive difficulty.

### 2.2 Business Goals

| ID | Goal | Success Metric |
|----|------|----------------|
| BG-01 | Acquire 10,000 active users within 6 months | Monthly Active Users (MAU) |
| BG-02 | Achieve 70% user retention after 30 days | Day-30 Retention Rate |
| BG-03 | Users learn average 500 words per month | Words mastered per user |
| BG-04 | Achieve 4.5+ app store rating | Average rating |
| BG-05 | Generate 80% of revenue from subscriptions | MRR / Total Revenue |

### 2.3 Product Goals

| ID | Goal | Description |
|----|------|-------------|
| PG-01 | Vocabulary Mastery | Enable users to learn, retain, and actively use 30,000+ IELTS vocabulary |
| PG-02 | Contextual Learning | Teach word usage through AI-generated sentences and explanations |
| PG-03 | Long-term Retention | Implement scientifically-backed SRS for durable memory formation |
| PG-04 | Adaptive Difficulty | AI-driven difficulty adjustment based on user performance |
| PG-05 | IELTS Preparation | Provide IELTS-specific vocabulary training aligned with band score requirements |

---

## 3. Target Users & Personas

### 3.1 Primary Personas

#### Persona 1: IELTS Aspirant (Ahmed)

| Attribute | Description |
|-----------|-------------|
| Age | 22-28 |
| Goal | Achieve Band 7+ in IELTS |
| Pain Point | Limited vocabulary for Writing and Speaking modules |
| Behavior | Studies 1-2 hours daily, prefers mobile learning |
| Need | IELTS-specific vocabulary with academic usage examples |

#### Persona 2: University Student (Sarah)

| Attribute | Description |
|-----------|-------------|
| Age | 18-24 |
| Goal | Improve academic English for university coursework |
| Pain Point | Difficulty understanding academic texts and writing essays |
| Behavior | Studies in short bursts between classes |
| Need | Academic vocabulary with formal usage contexts |

#### Persona 3: Self-Learner (Chen)

| Attribute | Description |
|-----------|-------------|
| Age | 25-35 |
| Goal | Professional English fluency for career advancement |
| Pain Point | Inconsistent study habits, forgets words quickly |
| Behavior | Studies during commute, prefers gamified content |
| Need | Flexible learning schedule with strong retention system |

### 3.2 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| Guest | Unregistered visitor | View landing page, limited demo |
| Free User | Registered with basic access | 100 words/day, basic flashcards |
| Premium User | Paid subscription | Unlimited access, all modes, AI features |
| Admin | Platform administrator | User management, content moderation, analytics |

---

## 4. System Overview

### 4.1 System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        External Systems                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐ │
│  │ Gemma AI │  │ Email Service│  │ Payment Gateway (Stripe)  │ │
│  │   API    │  │  (SendGrid)  │  │                           │ │
│  └────┬─────┘  └──────┬───────┘  └─────────────┬─────────────┘ │
│       │               │                        │               │
└───────┼───────────────┼────────────────────────┼───────────────┘
        │               │                        │
┌───────▼───────────────▼────────────────────────▼───────────────┐
│                     IELTS Vocab Platform                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Gateway (FastAPI)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Auth    │ │Vocab     │ │ AI       │ │ SRS              │  │
│  │  Service │ │Service   │ │ Service  │ │ Engine           │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL  │  Redis  │  S3                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Dashboard │ │Library   │ │ Learning │ │ AI Tutor         │  │
│  │          │ │          │ │ Modes    │ │                  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend Framework | React 18 + Vite | Fast HMR, modern DX, large ecosystem |
| State Management | Zustand | Lightweight, TypeScript-first, minimal boilerplate |
| Styling | Tailwind CSS | Utility-first, consistent design, fast development |
| Animations | Framer Motion | Production-ready animations, gesture support |
| Backend Framework | FastAPI | Async support, auto-docs, type safety |
| Database | PostgreSQL | ACID compliance, JSON support, mature ecosystem |
| Cache | Redis | Sub-ms latency for SRS scheduling, session storage |
| Task Queue | Celery + Redis | Background AI processing, SRS recalculation |
| AI Orchestration | LangChain | LLM abstraction, prompt management, chains |
| LLM | Gemma API | Cost-effective, good performance for text generation |
| Object Storage | AWS S3 / MinIO | PDF storage, user uploads |
| Authentication | JWT + OAuth2 | Stateless auth, social login support |
| Email | SendGrid | Transactional emails, high deliverability |
| Payments | Stripe | Subscription management, global payments |
| Monitoring | Prometheus + Grafana | Metrics, alerting, dashboards |
| Logging | ELK Stack | Centralized logging, search, analysis |
| CI/CD | GitHub Actions | Automated testing, deployment |
| Containerization | Docker + Docker Compose | Consistent environments, easy deployment |

---

## 5. Functional Requirements - Backend

### 5.1 Authentication & User Management

#### FR-B-001: User Registration

**Priority:** P0 (Critical)

**Description:** The system shall allow new users to register with email and password.

**Acceptance Criteria:**
- User provides email, password, and display name
- Password must be minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number
- Email verification required before account activation
- Duplicate email registration prevented
- JWT token issued upon successful registration

**API Endpoint:**
```
POST /api/v1/auth/register
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
Response (201):
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "jwt_token",
  "created_at": "2026-05-21T10:00:00Z"
}
```

#### FR-B-002: User Login

**Priority:** P0 (Critical)

**Description:** The system shall authenticate users with email and password.

**Acceptance Criteria:**
- Support email/password login
- Issue JWT access token (15 min expiry) and refresh token (7 days)
- Track login attempts (lock after 5 failures for 15 minutes)
- Record login timestamp and IP address

#### FR-B-003: OAuth2 Social Login

**Priority:** P1 (High)

**Description:** The system shall support Google and GitHub OAuth2 login.

**Acceptance Criteria:**
- Google OAuth2 integration
- GitHub OAuth2 integration
- Auto-create account for new social logins
- Link social accounts to existing email accounts

#### FR-B-004: Password Reset

**Priority:** P1 (High)

**Description:** The system shall allow users to reset forgotten passwords.

**Acceptance Criteria:**
- Send reset link via email (expires in 1 hour)
- Token-based reset (single use)
- Password update requires current password confirmation

#### FR-B-005: User Profile Management

**Priority:** P1 (High)

**Description:** The system shall allow users to view and update their profiles.

**Acceptance Criteria:**
- Update display name, avatar, bio
- View learning statistics
- Export personal data (GDPR compliance)
- Delete account (soft delete with 30-day recovery)

### 5.2 Vocabulary Management

#### FR-B-006: PDF Upload & Parsing

**Priority:** P0 (Critical)

**Description:** The system shall accept PDF files and extract vocabulary entries.

**Acceptance Criteria:**
- Accept PDF files up to 50MB
- Parse structured vocabulary format: `Word | POS | Synonyms | Meaning`
- Handle multiple PDF layouts (table, list, card format)
- Extract and store word, part of speech, synonyms, meaning
- Queue parsing job via Celery for async processing
- Return parsing progress and status
- Store original PDF in S3

**API Endpoint:**
```
POST /api/v1/vocabulary/upload
Content-Type: multipart/form-data
Request:
- file: vocabulary.pdf
- tags: ["ielts", "academic"]
- difficulty: "auto" | "beginner" | "intermediate" | "advanced"

Response (202):
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_words": 500,
  "message": "PDF upload successful. Parsing in progress."
}
```

#### FR-B-007: CSV Upload & Import

**Priority:** P0 (Critical)

**Description:** The system shall accept CSV files for vocabulary import.

**Acceptance Criteria:**
- Accept CSV with configurable column mapping
- Support UTF-8 encoding for international characters
- Validate data format before import
- Duplicate detection and merge strategy
- Batch import up to 10,000 words per file

#### FR-B-008: Word CRUD Operations

**Priority:** P0 (Critical)

**Description:** The system shall provide full CRUD operations for vocabulary words.

**Acceptance Criteria:**
- Create, Read, Update, Delete individual words
- Bulk operations (delete, tag, difficulty update)
- Search by word, meaning, synonyms
- Filter by difficulty, category, POS, tags
- Pagination with configurable page size

**Data Model:**
```json
{
  "id": "uuid",
  "word": "ubiquitous",
  "part_of_speech": "adjective",
  "meaning": "present, appearing, or found everywhere",
  "synonyms": ["omnipresent", "pervasive", "universal"],
  "antonyms": ["rare", "scarce"],
  "pronunciation": "/juːˈbɪkwɪtəs/",
  "difficulty": "advanced",
  "ielts_band": 7.0,
  "tags": ["academic", "formal"],
  "examples": [
    "Smartphones have become ubiquitous in modern society.",
    "The ubiquitous nature of social media affects daily life."
  ],
  "etymology": "Latin: ubique (everywhere)",
  "created_at": "2026-05-21T10:00:00Z",
  "updated_at": "2026-05-21T10:00:00Z"
}
```

#### FR-B-009: Vocabulary Categories & Tags

**Priority:** P1 (High)

**Description:** The system shall support categorization and tagging of vocabulary.

**Acceptance Criteria:**
- Pre-defined categories: Academic, Formal, Informal, Technical, IELTS-specific
- Custom user tags (max 10 per word)
- Tag-based filtering and search
- Category statistics

#### FR-B-010: Word Search & Filtering

**Priority:** P0 (Critical)

**Description:** The system shall provide advanced search and filtering capabilities.

**Acceptance Criteria:**
- Full-text search across word, meaning, synonyms
- Fuzzy matching for typo tolerance
- Filter by: difficulty, POS, category, tags, IELTS band
- Sort by: alphabetical, difficulty, date added, mastery level
- Search suggestions and autocomplete

### 5.3 AI Service Integration

#### FR-B-011: AI Word Explanation

**Priority:** P0 (Critical)

**Description:** The system shall generate AI-powered explanations for vocabulary words.

**Acceptance Criteria:**
- Generate explanation including:
  - Simple meaning (B1 level English)
  - Academic usage context
  - Common mistakes
  - Synonym comparison (nuances)
  - Real-life usage scenarios
- Cache explanations (invalidate after 30 days)
- Support user feedback on explanation quality
- Rate limiting: 100 requests/hour for free, unlimited for premium

**Prompt Template:**
```
Explain the word "{word}" for IELTS students at Band {band_level} level.

Include:
1. Simple meaning in everyday English
2. Academic and formal usage context
3. Common mistakes students make with this word
4. How it differs from its synonyms: {synonyms}
5. Real-life usage scenarios

Format: JSON with keys: simple_meaning, academic_usage, common_mistakes, synonym_differences, real_life_examples
```

#### FR-B-012: AI Sentence Generation

**Priority:** P0 (Critical)

**Description:** The system shall generate context-appropriate example sentences.

**Acceptance Criteria:**
- Generate 5 sentences per request:
  1. Formal academic sentence
  2. IELTS Writing Task 2 usage
  3. Casual conversational usage
  4. High-band vocabulary sentence (Band 8+)
  5. Collocation example
- Tag each sentence with context type
- Rate each sentence difficulty (B1-C2)
- Cache generated sentences

**Prompt Template:**
```
Generate 5 IELTS-level sentences for the word "{word}" ({pos}).

Include:
1. Formal academic sentence
2. IELTS Writing Task 2 essay sentence
3. Casual conversational usage
4. Band 8+ vocabulary-rich sentence
5. Sentence showing common collocations

Format: JSON array with objects containing: sentence, context, band_level, collocations
```

#### FR-B-013: AI Quiz Generation

**Priority:** P1 (High)

**Description:** The system shall generate dynamic quizzes using AI.

**Acceptance Criteria:**
- Quiz types:
  - Meaning selection (4 options)
  - Synonym match (4 options)
  - Fill in the blank
  - Sentence completion
  - Context clue identification
- Difficulty adapts to user performance
- Generate from: weak words, recent words, SRS-due words
- Minimum 10 questions per quiz
- Track quiz performance metrics

#### FR-B-014: AI Difficulty Scoring

**Priority:** P1 (High)

**Description:** The system shall use AI to score word difficulty.

**Acceptance Criteria:**
- Score on scale: Beginner (A1-A2), Intermediate (B1-B2), Advanced (C1-C2)
- Consider: word frequency, morphological complexity, abstractness
- Map to IELTS band requirements
- Allow manual override
- Batch processing for imported vocabulary

#### FR-B-015: AI Tutor Chat

**Priority:** P2 (Medium)

**Description:** The system shall provide an AI tutor for interactive word learning.

**Acceptance Criteria:**
- Chat-based interface
- Context-aware responses (knows user's current word/study session)
- Capabilities:
  - Explain word simply
  - Provide IELTS Writing Task 2 examples
  - Compare synonyms
  - Correct user sentences
- Conversation history (last 50 messages)
- Rate limiting per user

### 5.4 Spaced Repetition System (SRS)

#### FR-B-016: SRS Engine

**Priority:** P0 (Critical)

**Description:** The system shall implement a scientifically-backed spaced repetition algorithm.

**Acceptance Criteria:**
- Implement modified SM-2 algorithm with FSRS enhancements
- Track per-word: easiness factor, interval, repetition count, next review date
- Update schedule based on user response quality (0-5 scale):
  - 0: Complete blackout
  - 1: Incorrect, but recognized after seeing answer
  - 2: Incorrect, but easy to recall after seeing answer
  - 3: Correct with serious difficulty
  - 4: Correct with minor hesitation
  - 5: Perfect recall
- Calculate next interval:
  - First review: 1 day
  - Second review: 3 days
  - Third review: 7 days
  - Fourth review: 14 days
  - Fifth review: 30 days
  - Subsequent: interval × easiness_factor
- Minimum easiness factor: 1.3
- Handle "forgotten" words (reset interval)

**Algorithm:**
```python
def calculate_next_review(word_progress, quality):
    """
    Modified SM-2 Algorithm
    
    Parameters:
    - word_progress: {interval, repetitions, easiness_factor}
    - quality: 0-5 (user response quality)
    
    Returns:
    - Updated word_progress with next_review_date
    """
    if quality >= 3:  # Correct response
        if word_progress.repetitions == 0:
            new_interval = 1
        elif word_progress.repetitions == 1:
            new_interval = 3
        elif word_progress.repetitions == 2:
            new_interval = 7
        elif word_progress.repetitions == 3:
            new_interval = 14
        elif word_progress.repetitions == 4:
            new_interval = 30
        else:
            new_interval = round(word_progress.interval * word_progress.easiness_factor)
        
        word_progress.repetitions += 1
    else:  # Incorrect response
        word_progress.repetitions = 0
        new_interval = 1
    
    # Update easiness factor
    ef = word_progress.easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    word_progress.easiness_factor = max(1.3, ef)
    word_progress.interval = new_interval
    word_progress.next_review = datetime.now() + timedelta(days=new_interval)
    
    return word_progress
```

#### FR-B-017: Due Words Retrieval

**Priority:** P0 (Critical)

**Description:** The system shall retrieve words due for review.

**Acceptance Criteria:**
- Return words sorted by: overdue duration, difficulty
- Configurable batch size (default: 20)
- Include word details, last review, current interval
- Support filtering by: category, difficulty, mastery level
- Handle timezone-aware scheduling

**API Endpoint:**
```
GET /api/v1/srs/due-words?limit=20&category=academic

Response (200):
{
  "due_words": [
    {
      "word_id": "uuid",
      "word": "ubiquitous",
      "meaning": "present everywhere",
      "last_reviewed": "2026-05-18T10:00:00Z",
      "current_interval": 3,
      "repetitions": 2,
      "easiness_factor": 2.5,
      "overdue_days": 1
    }
  ],
  "total_due": 45,
  "review_batch_size": 20
}
```

#### FR-B-018: Review Submission

**Priority:** P0 (Critical)

**Description:** The system shall process review responses and update SRS schedule.

**Acceptance Criteria:**
- Accept quality rating (0-5) for each reviewed word
- Update SRS parameters (interval, easiness, repetitions)
- Record review history
- Update mastery status:
  - New: First encounter
  - Learning: repetitions < 3
  - Familiar: repetitions 3-5, easiness > 2.0
  - Mastered: repetitions > 5, easiness > 2.3
- Update user statistics (streak, daily count)

#### FR-B-019: SRS Statistics

**Priority:** P1 (High)

**Description:** The system shall provide SRS performance statistics.

**Acceptance Criteria:**
- Words due today / this week / this month
- Mastery distribution (new, learning, familiar, mastered)
- Average easiness factor
- Retention rate (last 7/30/90 days)
- Review completion rate
- Forecasted review load

### 5.5 Quiz Engine

#### FR-B-020: Quiz Generation

**Priority:** P1 (High)

**Description:** The system shall generate quizzes from vocabulary database.

**Acceptance Criteria:**
- Quiz types:
  - Meaning Match: Select correct meaning from 4 options
  - Synonym Match: Select synonym from 4 options
  - Fill in the Blank: Complete sentence with correct word
  - Context Clue: Identify word meaning from context
  - Spelling: Type word from pronunciation/meaning
- Word selection strategy:
  - SRS-due words (priority)
  - Weak words (low accuracy)
  - Recently learned words
  - Random from category
- Configurable quiz length (10/20/30 questions)
- Difficulty adaptive based on performance

#### FR-B-021: Quiz Evaluation

**Priority:** P1 (High)

**Description:** The system shall evaluate quiz responses and provide feedback.

**Acceptance Criteria:**
- Score calculation (percentage, accuracy)
- Detailed feedback per question
- Update SRS schedule based on performance
- Track quiz history and improvement
- Identify patterns in mistakes

### 5.6 Progress Tracking

#### FR-B-022: Learning Progress

**Priority:** P1 (High)

**Description:** The system shall track and report user learning progress.

**Acceptance Criteria:**
- Track daily: words studied, reviews completed, accuracy
- Track cumulative: total words, mastered words, streak
- Calculate retention rate
- Generate weekly/monthly reports
- Export progress data (CSV, JSON)

#### FR-B-023: Streak Management

**Priority:** P1 (High)

**Description:** The system shall track and manage daily learning streaks.

**Acceptance Criteria:**
- Streak increments when minimum daily goal met
- Configurable daily goal (default: 20 words)
- Streak freeze (premium feature, 1 per week)
- Streak milestones and achievements
- Timezone-aware streak calculation

### 5.7 Payment & Subscription

#### FR-B-024: Subscription Management

**Priority:** P1 (High)

**Description:** The system shall manage user subscriptions via Stripe.

**Acceptance Criteria:**
- Free tier: 100 words/day, basic flashcards, limited AI
- Premium tier ($9.99/month): Unlimited access, all features
- Annual tier ($79.99/year): Premium + priority support
- Stripe Checkout integration
- Webhook handling for subscription events
- Grace period for failed payments (7 days)

---

## 6. Functional Requirements - Frontend

### 6.1 Landing Page

#### FR-F-001: Landing Page

**Priority:** P0 (Critical)

**Description:** The system shall display a compelling landing page.

**Acceptance Criteria:**
- Hero section with value proposition
- Feature showcase (3-4 key features)
- Testimonials section
- Pricing comparison table
- Call-to-action buttons (Sign Up Free, View Demo)
- Responsive design (mobile, tablet, desktop)
- Page load < 2 seconds

### 6.2 Authentication Pages

#### FR-F-002: Registration Page

**Priority:** P0 (Critical)

**Description:** The system shall provide a registration form.

**Acceptance Criteria:**
- Email, password, confirm password, name fields
- Real-time validation feedback
- Password strength indicator
- OAuth2 buttons (Google, GitHub)
- Terms of service and privacy policy links
- Loading state during submission
- Error handling with clear messages

#### FR-F-003: Login Page

**Priority:** P0 (Critical)

**Description:** The system shall provide a login form.

**Acceptance Criteria:**
- Email and password fields
- Remember me checkbox
- Forgot password link
- OAuth2 buttons
- Loading state
- Account lockout message

### 6.3 Dashboard

#### FR-F-004: Dashboard Overview

**Priority:** P0 (Critical)

**Description:** The system shall display a comprehensive learning dashboard.

**Acceptance Criteria:**
- **Stats Cards:**
  - Words learned today
  - Current streak
  - Total mastered words
  - Accuracy rate
- **Quick Actions:**
  - Start Review (SRS due words)
  - Continue Learning
  - Take Quiz
  - AI Tutor
- **Progress Chart:** Line chart showing words learned over time
- **Due Words Preview:** Next 5 words due for review
- **Streak Calendar:** Visual representation of daily activity
- **Recent Activity:** Last 10 learning sessions

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                    [Profile] [⚙] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Today   │ │ Streak  │ │ Mastered│ │Accuracy │          │
│  │  24     │ │  15 🔥  │ │  1,245  │ │  87%    │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ┌──────────────────────────┐ ┌──────────────────────────┐ │
│  │    Progress Chart        │ │    Due for Review        │ │
│  │    [Line Graph]          │ │    • ubiquitous          │ │
│  │                          │ │    • ephemeral           │ │
│  │                          │ │    • pragmatic           │ │
│  │                          │ │    [Start Review →]      │ │
│  └──────────────────────────┘ └──────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────┐ ┌──────────────────────────┐ │
│  │    Streak Calendar       │ │    Recent Activity       │ │
│  │    [May 2026]            │ │    • Quiz: 18/20 (90%)   │ │
│  │    ■ ■ ■ ■ □ □ □         │ │    • Review: 15 words    │ │
│  │                          │ │    • Learned: 8 new      │ │
│  └──────────────────────────┘ └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Vocabulary Library

#### FR-F-005: Vocabulary Library Page

**Priority:** P0 (Critical)

**Description:** The system shall display a searchable vocabulary library.

**Acceptance Criteria:**
- **Search Bar:** Full-text search with autocomplete
- **Filters Sidebar:**
  - Difficulty (Beginner, Intermediate, Advanced)
  - Part of Speech (Noun, Verb, Adjective, Adverb, etc.)
  - Category (Academic, Formal, IELTS, etc.)
  - Mastery Status (New, Learning, Familiar, Mastered)
  - IELTS Band (5.0 - 8.5)
- **Word List:**
  - Card or list view toggle
  - Word, POS, meaning preview
  - Mastery indicator (color-coded)
  - Quick actions (view, add to study, mark mastered)
- **Pagination:** Infinite scroll or traditional pagination
- **Sort:** Alphabetical, difficulty, date added, mastery

#### FR-F-006: Word Detail Page

**Priority:** P0 (Critical)

**Description:** The system shall display comprehensive word information.

**Acceptance Criteria:**
- **Header:** Word, pronunciation (audio button), POS
- **Meaning Section:**
  - Primary meaning
  - Secondary meanings
  - Usage notes
- **AI Explanation Panel:**
  - Simple explanation
  - Academic usage
  - Common mistakes
  - Synonym comparison
  - Real-life examples
- **Examples Section:**
  - AI-generated sentences (5 contexts)
  - User-contributed examples
- **Related Words:**
  - Synonyms (with nuance differences)
  - Antonyms
  - Word family
  - Collocations
- **SRS Status:**
  - Current mastery level
  - Next review date
  - Review history chart
- **Actions:**
  - Add to study list
  - Generate more sentences
  - Practice with this word
  - Report issue

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Library                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ubiquitous  /juːˈbɪkwɪtəs/  [🔊]  adjective              │
│  ─────────────────────────────────────────────────────────  │
│  Mastery: ████████░░ 80%  |  Next Review: Tomorrow          │
│  IELTS Band: 7.0  |  Difficulty: Advanced                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  📖 AI Explanation                    [Refresh] [👍]  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Simple Meaning:                                     │  │
│  │  "Found or present everywhere at the same time"      │  │
│  │                                                      │  │
│  │  Academic Usage:                                     │  │
│  │  "In academic writing, 'ubiquitous' describes        │  │
│  │  phenomena that are widespread and pervasive..."      │  │
│  │                                                      │  │
│  │  Common Mistakes:                                    │  │
│  │  "Don't confuse with 'unique' (one of a kind)..."   │  │
│  │                                                      │  │
│  │  Synonym Differences:                                │  │
│  │  • omnipresent - emphasizes divine/all-powerful      │  │
│  │  • pervasive - often has negative connotation        │  │
│  │  • universal - applies to all members of a group     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ✍️ Example Sentences                 [Generate More] │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  [Formal] Smartphones have become ubiquitous in      │  │
│  │           modern society.                            │  │
│  │  [IELTS]  The ubiquitous influence of technology     │  │
│  │           has transformed education.                 │  │
│  │  [Casual]  Coffee shops are ubiquitous in this city. │  │
│  │  [Band 8+] The ubiquity of digital media has         │  │
│  │            irrevocably altered communication.        │  │
│  │  [Collocation] ubiquitous presence, ubiquitous       │  │
│  │               nature, become ubiquitous              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────┐ ┌────────────────────────────┐ │
│  │  Synonyms              │ │  Word Family               │ │
│  │  • omnipresent (divine)│ │  • ubiquity (n)            │ │
│  │  • pervasive (neg.)    │ │  • ubiquitously (adv)      │ │
│  │  • universal           │ │  • ubiquitousness (n)      │ │
│  └────────────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6.5 Learning Modes

#### FR-F-007: Flashcard Mode

**Priority:** P0 (Critical)

**Description:** The system shall provide an interactive flashcard learning mode.

**Acceptance Criteria:**
- **Card Front:**
  - Word (large, centered)
  - Part of speech badge
  - Pronunciation button
- **Card Back (flip animation):**
  - Meaning
  - Synonyms (2-3)
  - AI-generated example sentence
  - Difficulty indicator
- **Interactions:**
  - Swipe left: Don't know (quality 1)
  - Swipe right: Know it (quality 4)
  - Tap: Flip card
  - Long press: View full details
- **Controls:**
  - Previous / Next buttons
  - Shuffle toggle
  - Auto-play mode (5s per card)
  - Sound toggle
- **Progress Bar:** Cards completed / total
- **Session Summary:** Accuracy, time spent, words reviewed

**Animation:**
```
Card Flip Animation (CSS 3D Transform):
- Duration: 600ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Perspective: 1000px
- Backface-visibility: hidden
```

#### FR-F-008: MCQ Challenge Mode

**Priority:** P0 (Critical)

**Description:** The system shall provide multiple-choice quiz challenges.

**Acceptance Criteria:**
- **Question Types:**
  1. Meaning Selection: "What does 'ubiquitous' mean?"
  2. Synonym Match: "Which word is a synonym of 'ubiquitous'?"
  3. Fill in the Blank: "Smartphones have become ___ in modern society."
  4. Context Clue: "In this sentence, what does 'ubiquitous' mean?"
- **UI Elements:**
  - Question text (with context if applicable)
  - 4 option buttons (A, B, C, D)
  - Timer (optional, configurable)
  - Progress indicator
  - Streak counter
- **Feedback:**
  - Correct: Green highlight, +10 points, confetti animation
  - Incorrect: Red highlight, show correct answer, explanation
  - Streak bonus: +5 points per consecutive correct
- **Session End:**
  - Score summary
  - Accuracy percentage
  - Time taken
  - Words to review
  - Share results option

#### FR-F-009: Sentence Builder Mode

**Priority:** P0 (Critical)

**Description:** The system shall provide AI-powered sentence building exercises.

**Acceptance Criteria:**
- **Input:** User selects or enters a word
- **AI Output:** 3-5 example sentences with:
  - Formal academic usage
  - IELTS Writing Task 2 style
  - Casual conversational usage
  - Band 8+ vocabulary-rich sentence
  - Collocation example
- **Sentence Analysis:**
  - Highlight target word
  - Show collocations
  - Indicate band level
  - Grammar pattern identification
- **User Interaction:**
  - Save favorite sentences
  - Copy to clipboard
  - Generate more sentences
  - Rate sentence quality
  - Submit own sentences for AI feedback

#### FR-F-010: Active Recall Test

**Priority:** P1 (High)

**Description:** The system shall test active recall through typing.

**Acceptance Criteria:**
- Show meaning/context → User types the word
- Show sentence with blank → User types missing word
- Show first letter as hint (optional)
- AI semantic matching for acceptable variations
- Scoring: Exact match (100%), Close match (70%), Wrong (0%)
- Show correct answer on failure
- Track recall accuracy per word

#### FR-F-011: Spaced Repetition Review

**Priority:** P0 (Critical)

**Description:** The system shall provide a dedicated SRS review interface.

**Acceptance Criteria:**
- Show only SRS-due words
- Display word → User recalls meaning → Reveal answer
- Quality rating buttons (0-5 scale):
  - Again (0-1): Didn't remember
  - Hard (2-3): Remembered with difficulty
  - Good (4): Remembered with minor hesitation
  - Easy (5): Perfect recall
- Keyboard shortcuts (1-4 for quality)
- Session statistics
- Daily progress tracking

### 6.6 AI Tutor

#### FR-F-012: AI Tutor Chat Interface

**Priority:** P2 (Medium)

**Description:** The system shall provide a chat-based AI tutor.

**Acceptance Criteria:**
- **Chat Interface:**
  - Message input with send button
  - Chat history (scrollable)
  - Typing indicator
  - Message timestamps
- **AI Capabilities:**
  - Explain word simply
  - Provide IELTS examples
  - Compare synonyms
  - Correct user sentences
  - Suggest study plan
- **Context Awareness:**
  - Knows current study session
  - Remembers recent words
  - Adapts to user level
- **Quick Actions:**
  - "Explain this word"
  - "Use in IELTS Writing"
  - "Compare with synonyms"
  - "Quiz me on recent words"

### 6.7 Progress Analytics

#### FR-F-013: Progress Analytics Page

**Priority:** P1 (High)

**Description:** The system shall display detailed learning analytics.

**Acceptance Criteria:**
- **Overview Cards:**
  - Total words learned
  - Words mastered
  - Current streak
  - Average accuracy
  - Total study time
- **Charts:**
  - Words learned over time (line chart)
  - Mastery distribution (pie chart)
  - Daily activity heatmap
  - Accuracy trend (line chart)
  - Category distribution (bar chart)
- **SRS Forecast:**
  - Upcoming reviews (next 7 days)
  - Review load prediction
  - Optimal study time suggestion
- **Achievements:**
  - Badges earned
  - Milestones reached
  - Leaderboard position

### 6.8 Settings

#### FR-F-014: User Settings

**Priority:** P1 (High)

**Description:** The system shall provide user configuration options.

**Acceptance Criteria:**
- **Profile Settings:**
  - Update name, email, avatar
  - Change password
  - Connected accounts (Google, GitHub)
- **Learning Settings:**
  - Daily word goal (10-100)
  - Review reminder time
  - Default quiz length
  - Auto-play speed for flashcards
- **Notification Settings:**
  - Email notifications toggle
  - Push notifications toggle
  - Reminder frequency
- **Display Settings:**
  - Theme (light/dark/system)
  - Font size
  - Language preference
- **Data Management:**
  - Export progress (CSV/JSON)
  - Import vocabulary
  - Delete account

---

## 7. Non-Functional Requirements

### 7.1 Performance Requirements

#### NFR-001: Response Time

| Operation | Target | Maximum Acceptable |
|-----------|--------|-------------------|
| Page Load (Initial) | < 1.5s | 3s |
| Page Load (Subsequent) | < 500ms | 1s |
| API Response (Simple) | < 100ms | 300ms |
| API Response (Complex) | < 500ms | 2s |
| AI Generation | < 3s | 10s |
| Search Results | < 200ms | 500ms |
| PDF Parsing (per 100 words) | < 30s | 60s |

#### NFR-002: Throughput

| Metric | Target |
|--------|--------|
| Concurrent Users | 10,000 |
| Requests per Second | 1,000 |
| AI Requests per Minute | 500 |
| PDF Uploads per Hour | 100 |

#### NFR-003: Resource Utilization

| Resource | Target |
|----------|--------|
| CPU Usage (Normal) | < 40% |
| CPU Usage (Peak) | < 80% |
| Memory Usage | < 70% |
| Database Connections | < 80% of pool |
| Redis Memory | < 60% of allocated |

### 7.2 Scalability Requirements

#### NFR-004: Horizontal Scaling

**Description:** The system shall support horizontal scaling.

**Requirements:**
- Stateless API servers (no local session storage)
- Database read replicas for read-heavy operations
- Redis cluster for cache distribution
- Celery worker auto-scaling based on queue depth
- Load balancer with health checks

#### NFR-005: Data Growth

**Description:** The system shall handle data growth.

**Requirements:**
- Support 1M+ vocabulary words
- Support 100K+ users
- Support 10M+ review records
- Database partitioning strategy for large tables
- Archive strategy for old data (>1 year)

### 7.3 Availability Requirements

#### NFR-006: Uptime

| Service | Target Uptime | Maximum Downtime |
|---------|---------------|------------------|
| API Services | 99.9% | 8.76 hours/year |
| Database | 99.95% | 4.38 hours/year |
| Cache (Redis) | 99.9% | 8.76 hours/year |
| AI Services | 99% | 87.6 hours/year |

#### NFR-007: Disaster Recovery

**Requirements:**
- Database backups: Daily full, hourly incremental
- Backup retention: 30 days
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour
- Multi-region backup storage

### 7.4 Security Requirements

#### NFR-008: Authentication & Authorization

**Requirements:**
- JWT token-based authentication
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token rotation on refresh
- Role-based access control (RBAC)
- Rate limiting per user/IP
- Account lockout after 5 failed attempts

#### NFR-009: Data Protection

**Requirements:**
- HTTPS/TLS 1.3 for all communications
- Password hashing: bcrypt with salt (12 rounds)
- Sensitive data encryption at rest (AES-256)
- PII data masking in logs
- CORS configuration (whitelist origins)
- SQL injection prevention (parameterized queries)
- XSS prevention (Content Security Policy)
- CSRF protection (SameSite cookies)

#### NFR-010: Compliance

**Requirements:**
- GDPR compliance (EU users)
- Data export capability
- Right to deletion
- Cookie consent management
- Privacy policy and terms of service
- Data processing agreements

### 7.5 Usability Requirements

#### NFR-011: Accessibility

**Requirements:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio ≥ 4.5:1
- Focus indicators
- Alt text for images
- ARIA labels for interactive elements

#### NFR-012: Internationalization

**Requirements:**
- English as primary language
- RTL support preparation
- Date/time localization
- Number formatting
- UTF-8 encoding throughout

#### NFR-013: Responsive Design

**Requirements:**
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px - 1024px
- Large Desktop: 1025px+
- Touch-friendly targets (min 44px)
- Gesture support (swipe, pinch)

### 7.6 Maintainability Requirements

#### NFR-014: Code Quality

**Requirements:**
- TypeScript strict mode (frontend)
- Python type hints (backend)
- Code coverage > 80%
- Linting: ESLint (frontend), Ruff (backend)
- Code formatting: Prettier (frontend), Black (backend)
- Documentation: Docstrings, JSDoc

#### NFR-015: Monitoring & Observability

**Requirements:**
- Application metrics (Prometheus)
- Custom dashboards (Grafana)
- Error tracking (Sentry)
- Log aggregation (ELK Stack)
- Distributed tracing (Jaeger)
- Health check endpoints
- Alerting rules (PagerDuty integration)

### 7.7 Compatibility Requirements

#### NFR-016: Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Safari | iOS 14+ |
| Chrome Android | Last 2 versions |

#### NFR-017: API Versioning

**Requirements:**
- URL-based versioning (/api/v1/, /api/v2/)
- Backward compatibility for 2 versions
- Deprecation notices (6 months minimum)
- Migration guides for breaking changes

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite)                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │   │
│  │  │Dashboard│ │Library  │ │Learning │ │ AI Tutor        │   │   │
│  │  │Module   │ │Module   │ │Modes    │ │ Module          │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Nginx / Traefik                           │   │
│  │  • SSL Termination  • Rate Limiting  • Load Balancing       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Application Layer                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    FastAPI Application                        │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │                 Middleware Stack                       │    │   │
│  │  │  • CORS  • Auth  • Rate Limit  • Logging  • Metrics │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │ Auth     │ │ Vocab    │ │ AI       │ │ SRS          │  │   │
│  │  │ Router   │ │ Router   │ │ Router   │ │ Router       │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │   │
│  │       │            │            │               │          │   │
│  │  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌──────▼───────┐  │   │
│  │  │ Auth     │ │ Vocab    │ │ AI       │ │ SRS          │  │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Engine       │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │   │
│  │       │            │            │               │          │   │
│  │  ┌────▼────────────▼────────────▼───────────────▼───────┐  │   │
│  │  │              Repository Layer (Data Access)           │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Data Layer                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐    │
│  │ PostgreSQL  │  │   Redis     │  │  AWS S3 / MinIO        │    │
│  │ (Primary)   │  │ (Cache/SRS) │  │  (File Storage)        │    │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Background Tasks                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Celery Workers                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │ PDF      │ │ AI       │ │ SRS      │ │ Email        │  │   │
│  │  │ Parser   │ │ Generator│ │ Scheduler│ │ Sender       │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐    │
│  │  Gemma AI   │  │  Stripe     │  │  SendGrid              │    │
│  │  API        │  │  Payments   │  │  Email                 │    │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                            │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │     users       │    │    vocabulary    │                    │
│  ├─────────────────┤    ├─────────────────┤                    │
│  │ id (PK)        │    │ id (PK)        │                    │
│  │ email          │    │ word           │                    │
│  │ password_hash  │    │ pos            │                    │
│  │ name           │    │ meaning        │                    │
│  │ avatar_url     │    │ synonyms[]     │                    │
│  │ streak         │    │ difficulty     │                    │
│  │ daily_goal     │    │ ielts_band     │                    │
│  │ created_at     │    │ tags[]         │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                              │
│           │    ┌─────────────────┴─────────────────┐           │
│           │    │                                     │           │
│           ▼    ▼                                     ▼           │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │ user_progress   │    │ word_sentences  │                    │
│  ├─────────────────┤    ├─────────────────┤                    │
│  │ id (PK)        │    │ id (PK)        │                    │
│  │ user_id (FK)   │    │ word_id (FK)   │                    │
│  │ word_id (FK)   │    │ sentence       │                    │
│  │ status         │    │ context_type   │                    │
│  │ interval       │    │ band_level     │                    │
│  │ repetitions    │    │ is_ai_generated│                    │
│  │ easiness_factor│    └─────────────────┘                    │
│  │ next_review    │                                            │
│  │ accuracy       │    ┌─────────────────┐                    │
│  │ last_reviewed  │    │ review_history  │                    │
│  └─────────────────┘    ├─────────────────┤                    │
│                          │ id (PK)        │                    │
│  ┌─────────────────┐    │ user_id (FK)   │                    │
│  │ quizzes         │    │ word_id (FK)   │                    │
│  ├─────────────────┤    │ quality (0-5)  │                    │
│  │ id (PK)        │    │ response_time  │                    │
│  │ user_id (FK)   │    │ reviewed_at    │                    │
│  │ quiz_type      │    └─────────────────┘                    │
│  │ score          │                                            │
│  │ total_questions│    ┌─────────────────┐                    │
│  │ correct_count  │    │ achievements    │                    │
│  │ completed_at   │    ├─────────────────┤                    │
│  └─────────────────┘    │ id (PK)        │                    │
│                          │ user_id (FK)   │                    │
│                          │ badge_type     │                    │
│                          │ earned_at      │                    │
│                          └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Environment                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Load Balancer (Nginx)                  │    │
│  │                    SSL Termination                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                    │                    │           │
│           ▼                    ▼                    ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  API Server │    │  API Server │    │  API Server │        │
│  │  (Pod 1)    │    │  (Pod 2)    │    │  (Pod 3)    │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│           │                    │                    │           │
│           └────────────────────┼────────────────────┘           │
│                                │                                 │
│           ┌────────────────────┼────────────────────┐           │
│           │                    │                    │           │
│           ▼                    ▼                    ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ PostgreSQL  │    │   Redis     │    │ Celery      │        │
│  │ (Primary)   │    │  Cluster    │    │ Workers     │        │
│  │     │       │    │             │    │ (Auto-scale)│        │
│  │     ▼       │    └─────────────┘    └─────────────┘        │
│  │ PostgreSQL  │                                               │
│  │ (Replica)   │                                               │
│  └─────────────┘                                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Monitoring Stack                       │    │
│  │  Prometheus │ Grafana │ Sentry │ ELK Stack               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Data Models

### 9.1 User Model

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    
    -- Learning Configuration
    daily_goal INTEGER DEFAULT 20,
    streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    
    -- Subscription
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    stripe_customer_id VARCHAR(100),
    
    -- Preferences
    theme VARCHAR(10) DEFAULT 'system',
    font_size VARCHAR(10) DEFAULT 'medium',
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Metadata
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);
```

### 9.2 Vocabulary Model

```sql
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL,
    normalized_word VARCHAR(100) NOT NULL,  -- lowercase, trimmed
    part_of_speech VARCHAR(20) NOT NULL,
    meaning TEXT NOT NULL,
    
    -- Additional Information
    pronunciation VARCHAR(100),
    etymology TEXT,
    frequency_rank INTEGER,
    
    -- Classification
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    ielts_band DECIMAL(2,1),
    
    -- Arrays (stored as JSONB)
    synonyms JSONB DEFAULT '[]',
    antonyms JSONB DEFAULT '[]',
    collocations JSONB DEFAULT '[]',
    word_family JSONB DEFAULT '[]',
    
    -- Tags and Categories
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(50),
    
    -- Source
    source_file_id UUID,
    uploaded_by UUID REFERENCES users(id),
    
    -- Metadata
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(normalized_word, part_of_speech)
);

CREATE INDEX idx_vocab_word ON vocabulary(normalized_word);
CREATE INDEX idx_vocab_difficulty ON vocabulary(difficulty);
CREATE INDEX idx_vocab_band ON vocabulary(ielts_band);
CREATE INDEX idx_vocab_tags ON vocabulary USING GIN(tags);
CREATE INDEX idx_vocab_search ON vocabulary USING GIN(
    to_tsvector('english', word || ' ' || meaning)
);
```

### 9.3 User Progress Model

```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    
    -- SRS Parameters
    status VARCHAR(20) DEFAULT 'new',  -- new, learning, familiar, mastered
    interval INTEGER DEFAULT 0,        -- days until next review
    repetitions INTEGER DEFAULT 0,     -- successful review count
    easiness_factor DECIMAL(3,2) DEFAULT 2.5,
    next_review TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    
    -- Performance Metrics
    total_reviews INTEGER DEFAULT 0,
    correct_reviews INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0.0,
    average_quality DECIMAL(3,2) DEFAULT 0.0,
    
    -- Metadata
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id, word_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_word ON user_progress(word_id);
CREATE INDEX idx_progress_review ON user_progress(next_review);
CREATE INDEX idx_progress_status ON user_progress(status);
CREATE INDEX idx_progress_due ON user_progress(user_id, next_review) 
    WHERE next_review IS NOT NULL;
```

### 9.4 Review History Model

```sql
CREATE TABLE review_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    progress_id UUID REFERENCES user_progress(id),
    
    -- Review Data
    quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
    response_time_ms INTEGER,
    
    -- Context
    review_mode VARCHAR(30),  -- flashcard, mcq, recall, srs
    
    -- Metadata
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_user ON review_history(user_id);
CREATE INDEX idx_review_word ON review_history(word_id);
CREATE INDEX idx_review_date ON review_history(reviewed_at);
CREATE INDEX idx_review_user_date ON review_history(user_id, reviewed_at);
```

### 9.5 AI Generated Content Model

```sql
CREATE TABLE ai_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    
    -- Content
    content_type VARCHAR(30) NOT NULL,  -- explanation, sentence, quiz
    content JSONB NOT NULL,
    
    -- AI Metadata
    model_used VARCHAR(50),
    prompt_template VARCHAR(100),
    generation_time_ms INTEGER,
    
    -- Quality
    user_rating DECIMAL(3,2),
    rating_count INTEGER DEFAULT 0,
    
    -- Cache
    expires_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_content_word ON ai_content(word_id);
CREATE INDEX idx_ai_content_type ON ai_content(content_type);
CREATE INDEX idx_ai_content_expiry ON ai_content(expires_at);
```

### 9.6 Quiz Model

```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Quiz Configuration
    quiz_type VARCHAR(30) NOT NULL,
    word_count INTEGER NOT NULL,
    
    -- Results
    score DECIMAL(5,2),
    correct_count INTEGER,
    total_questions INTEGER,
    
    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    word_id UUID REFERENCES vocabulary(id),
    
    -- Question
    question_type VARCHAR(30) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    
    -- Response
    user_answer VARCHAR(255),
    is_correct BOOLEAN,
    response_time_ms INTEGER,
    
    -- Order
    question_order INTEGER NOT NULL
);

CREATE INDEX idx_quiz_user ON quizzes(user_id);
CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
```

### 9.7 Achievement Model

```sql
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Achievement
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Progress
    progress_current INTEGER DEFAULT 0,
    progress_target INTEGER,
    is_completed BOOLEAN DEFAULT false,
    
    -- Metadata
    earned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_user ON achievements(user_id);
CREATE INDEX idx_achievements_type ON achievements(badge_type);
```

### 9.8 File Upload Model

```sql
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- File Info
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,  -- pdf, csv
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    
    -- Processing
    status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    words_extracted INTEGER DEFAULT 0,
    error_message TEXT,
    
    -- Metadata
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_uploads_user ON file_uploads(user_id);
CREATE INDEX idx_uploads_status ON file_uploads(status);
```

---

## 10. API Specifications

### 10.1 Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user account.

```
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response (201):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 900
}

Error (400):
{
  "detail": "Email already registered"
}
```

#### POST /api/v1/auth/login
Authenticate user and receive tokens.

```
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscription_tier": "premium"
  }
}
```

#### POST /api/v1/auth/refresh
Refresh access token.

```
Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 900
}
```

### 10.2 Vocabulary Endpoints

#### POST /api/v1/vocabulary/upload
Upload PDF or CSV file for vocabulary extraction.

```
Request:
Content-Type: multipart/form-data
- file: vocabulary.pdf
- tags: ["ielts", "academic"]
- difficulty: "auto"

Response (202):
{
  "job_id": "uuid",
  "status": "processing",
  "filename": "vocabulary.pdf",
  "estimated_words": 500,
  "message": "File uploaded successfully. Processing in background."
}
```

#### GET /api/v1/vocabulary/words
List vocabulary words with filtering and pagination.

```
Request:
GET /api/v1/vocabulary/words?page=1&limit=20&difficulty=advanced&pos=adjective&search=ubiq

Response (200):
{
  "words": [
    {
      "id": "uuid",
      "word": "ubiquitous",
      "part_of_speech": "adjective",
      "meaning": "present, appearing, or found everywhere",
      "pronunciation": "/juːˈbɪkwɪtəs/",
      "difficulty": "advanced",
      "ielts_band": 7.0,
      "synonyms": ["omnipresent", "pervasive"],
      "tags": ["academic", "formal"],
      "mastery_status": "learning",
      "next_review": "2026-05-22T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### GET /api/v1/vocabulary/words/{id}
Get detailed word information.

```
Response (200):
{
  "id": "uuid",
  "word": "ubiquitous",
  "part_of_speech": "adjective",
  "meaning": "present, appearing, or found everywhere",
  "pronunciation": "/juːˈbɪkwɪtəs/",
  "etymology": "Latin: ubique (everywhere)",
  "difficulty": "advanced",
  "ielts_band": 7.0,
  "synonyms": [
    {"word": "omnipresent", "nuance": "emphasizes divine/all-powerful presence"},
    {"word": "pervasive", "nuance": "often has negative connotation"},
    {"word": "universal", "nuance": "applies to all members of a group"}
  ],
  "antonyms": ["rare", "scarce"],
  "collocations": ["ubiquitous presence", "become ubiquitous", "ubiquitous nature"],
  "word_family": [
    {"word": "ubiquity", "pos": "noun"},
    {"word": "ubiquitously", "pos": "adverb"}
  ],
  "tags": ["academic", "formal"],
  "user_progress": {
    "status": "learning",
    "interval": 3,
    "repetitions": 2,
    "easiness_factor": 2.5,
    "next_review": "2026-05-22T10:00:00Z",
    "accuracy": 75.0
  }
}
```

### 10.3 AI Endpoints

#### POST /api/v1/ai/explain
Generate AI explanation for a word.

```
Request:
{
  "word_id": "uuid",
  "band_level": 7.0
}

Response (200):
{
  "word": "ubiquitous",
  "explanation": {
    "simple_meaning": "Something that is everywhere at the same time",
    "academic_usage": "In academic writing, 'ubiquitous' describes phenomena that are widespread and pervasive, often used in sociology, technology, and cultural studies.",
    "common_mistakes": [
      "Don't confuse with 'unique' (meaning one of a kind)",
      "Often misspelled as 'ubiqutous'",
      "Incorrect: 'The ubiquitous of social media' (should be 'ubiquity')"
    ],
    "synonym_differences": {
      "omnipresent": "Emphasizes being present everywhere at once, often with divine connotation",
      "pervasive": "Often implies spreading widely, sometimes with negative undertones",
      "universal": "Applies to all members of a group or category"
    },
    "real_life_examples": [
      "Smartphones have become ubiquitous in developed countries.",
      "The ubiquitous influence of social media affects all age groups.",
      "WiFi access is now ubiquitous in urban areas."
    ]
  },
  "generated_at": "2026-05-21T10:00:00Z",
  "cached": false
}
```

#### POST /api/v1/ai/sentences
Generate example sentences for a word.

```
Request:
{
  "word_id": "uuid",
  "count": 5,
  "contexts": ["formal", "ielts", "casual", "band8", "collocation"]
}

Response (200):
{
  "word": "ubiquitous",
  "sentences": [
    {
      "sentence": "Smartphones have become ubiquitous in modern society, fundamentally altering how people communicate.",
      "context": "formal",
      "band_level": 7.0,
      "collocations": ["become ubiquitous"]
    },
    {
      "sentence": "The ubiquitous nature of technology has transformed the educational landscape, making information accessible to all.",
      "context": "ielts",
      "band_level": 7.5,
      "collocations": ["ubiquitous nature"]
    },
    {
      "sentence": "Coffee shops are pretty ubiquitous in this neighborhood - there's one on every corner.",
      "context": "casual",
      "band_level": 6.0,
      "collocations": []
    },
    {
      "sentence": "The pervasive and ubiquitous influence of digital media has irrevocably transformed contemporary communication paradigms.",
      "context": "band8",
      "band_level": 8.5,
      "collocations": ["ubiquitous influence"]
    },
    {
      "sentence": "The ubiquitous presence of surveillance cameras raises important questions about privacy.",
      "context": "collocation",
      "band_level": 7.0,
      "collocations": ["ubiquitous presence"]
    }
  ]
}
```

#### POST /api/v1/ai/quiz
Generate an AI-powered quiz.

```
Request:
{
  "word_ids": ["uuid1", "uuid2", "uuid3"],
  "quiz_type": "mixed",
  "question_count": 10
}

Response (200):
{
  "quiz_id": "uuid",
  "questions": [
    {
      "id": "uuid",
      "type": "meaning_selection",
      "question": "What does 'ubiquitous' mean?",
      "options": [
        "Found or present everywhere",
        "Extremely rare and valuable",
        "Difficult to understand",
        "Related to time and space"
      ],
      "correct_answer": "Found or present everywhere",
      "explanation": "Ubiquitous means present, appearing, or found everywhere."
    },
    {
      "id": "uuid",
      "type": "fill_blank",
      "question": "Smartphones have become _____ in modern society.",
      "options": ["ubiquitous", "unique", "obsolete", "sporadic"],
      "correct_answer": "ubiquitous",
      "explanation": "The sentence describes smartphones being everywhere, so 'ubiquitous' is correct."
    }
  ],
  "total_questions": 10,
  "time_limit_seconds": 300
}
```

### 10.4 SRS Endpoints

#### GET /api/v1/srs/due-words
Get words due for review.

```
Request:
GET /api/v1/srs/due-words?limit=20&category=academic

Response (200):
{
  "due_words": [
    {
      "word_id": "uuid",
      "word": "ubiquitous",
      "part_of_speech": "adjective",
      "meaning": "present, appearing, or found everywhere",
      "pronunciation": "/juːˈbɪkwɪtəs/",
      "last_reviewed": "2026-05-18T10:00:00Z",
      "current_interval": 3,
      "repetitions": 2,
      "easiness_factor": 2.5,
      "overdue_days": 1,
      "mastery_status": "learning"
    }
  ],
  "total_due": 45,
  "review_batch_size": 20,
  "estimated_time_minutes": 15
}
```

#### POST /api/v1/srs/review
Submit a review response.

```
Request:
{
  "word_id": "uuid",
  "quality": 4,
  "response_time_ms": 2500,
  "review_mode": "flashcard"
}

Response (200):
{
  "word_id": "uuid",
  "previous_status": "learning",
  "new_status": "learning",
  "previous_interval": 3,
  "new_interval": 7,
  "next_review": "2026-05-28T10:00:00Z",
  "easiness_factor": 2.55,
  "repetitions": 3,
  "message": "Great job! Next review in 7 days."
}
```

#### GET /api/v1/srs/statistics
Get SRS performance statistics.

```
Response (200):
{
  "overview": {
    "total_words": 1500,
    "new": 200,
    "learning": 400,
    "familiar": 500,
    "mastered": 400
  },
  "today": {
    "due_count": 45,
    "completed_count": 20,
    "accuracy": 85.0
  },
  "forecast": [
    {"date": "2026-05-22", "due_count": 38},
    {"date": "2026-05-23", "due_count": 25},
    {"date": "2026-05-24", "due_count": 42}
  ],
  "retention": {
    "last_7_days": 82.5,
    "last_30_days": 78.3,
    "last_90_days": 75.0
  }
}
```

### 10.5 Learning Endpoints

#### POST /api/v1/learning/session/start
Start a learning session.

```
Request:
{
  "mode": "flashcard",
  "word_count": 20,
  "category": "academic",
  "difficulty": "intermediate"
}

Response (200):
{
  "session_id": "uuid",
  "mode": "flashcard",
  "words": [...],
  "total_words": 20
}
```

#### POST /api/v1/learning/session/{id}/complete
Complete a learning session.

```
Request:
{
  "words_reviewed": 20,
  "correct_count": 17,
  "total_time_seconds": 300
}

Response (200):
{
  "session_id": "uuid",
  "accuracy": 85.0,
  "words_learned": 5,
  "streak_updated": true,
  "current_streak": 16,
  "xp_earned": 170,
  "achievements_unlocked": []
}
```

### 10.6 User Endpoints

#### GET /api/v1/users/me
Get current user profile.

```
Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://...",
  "subscription_tier": "premium",
  "daily_goal": 20,
  "streak": 15,
  "longest_streak": 30,
  "total_words_learned": 1245,
  "total_words_mastered": 450,
  "created_at": "2026-01-15T10:00:00Z"
}
```

#### PUT /api/v1/users/me
Update user profile.

```
Request:
{
  "name": "John Smith",
  "daily_goal": 30,
  "theme": "dark"
}

Response (200):
{
  "id": "uuid",
  "name": "John Smith",
  "daily_goal": 30,
  "theme": "dark",
  "updated_at": "2026-05-21T10:00:00Z"
}
```

#### GET /api/v1/users/me/progress
Get user learning progress.

```
Request:
GET /api/v1/users/me/progress?period=30d

Response (200):
{
  "period": "30d",
  "words_learned": 150,
  "words_reviewed": 450,
  "accuracy": 82.5,
  "study_time_minutes": 1200,
  "daily_progress": [
    {"date": "2026-05-01", "words": 15, "accuracy": 80},
    {"date": "2026-05-02", "words": 20, "accuracy": 85}
  ],
  "category_distribution": {
    "academic": 45,
    "formal": 30,
    "ielts": 25
  }
}
```

---

## 11. SRS Algorithm Design

### 11.1 Algorithm Overview

The system implements a modified SM-2 algorithm enhanced with concepts from FSRS (Free Spaced Repetition Scheduler) for optimal vocabulary retention.

### 11.2 Core Parameters

| Parameter | Description | Initial Value | Range |
|-----------|-------------|---------------|-------|
| interval | Days until next review | 0 | 0 - 365 |
| repetitions | Successful review count | 0 | 0 - ∞ |
| easiness_factor | Difficulty multiplier | 2.5 | 1.3 - 3.0 |
| quality | User response quality | - | 0 - 5 |

### 11.3 Quality Rating Scale

| Quality | Description | Action |
|---------|-------------|--------|
| 0 | Complete blackout | Reset to 1 day |
| 1 | Incorrect, recognized after seeing | Reset to 1 day |
| 2 | Incorrect, easy to recall after seeing | Reset to 1 day |
| 3 | Correct with serious difficulty | Increase interval |
| 4 | Correct with minor hesitation | Increase interval |
| 5 | Perfect recall | Increase interval significantly |

### 11.4 Interval Calculation

```python
def calculate_interval(quality: int, repetitions: int, 
                       easiness_factor: float, current_interval: int) -> tuple:
    """
    Calculate next review interval based on SM-2 algorithm.
    
    Returns:
        tuple: (new_interval, new_repetitions, new_easiness_factor)
    """
    if quality < 3:
        # Incorrect response - reset
        new_interval = 1
        new_repetitions = 0
    else:
        # Correct response - increase interval
        new_repetitions = repetitions + 1
        
        if new_repetitions == 1:
            new_interval = 1
        elif new_repetitions == 2:
            new_interval = 3
        elif new_repetitions == 3:
            new_interval = 7
        elif new_repetitions == 4:
            new_interval = 14
        elif new_repetitions == 5:
            new_interval = 30
        else:
            new_interval = round(current_interval * easiness_factor)
    
    # Update easiness factor
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    new_ef = max(1.3, new_ef)  # Minimum EF is 1.3
    
    return new_interval, new_repetitions, new_ef
```

### 11.5 Status Classification

```python
def classify_mastery(repetitions: int, easiness_factor: float, 
                     accuracy: float) -> str:
    """
    Classify word mastery level based on SRS parameters.
    """
    if repetitions == 0:
        return "new"
    elif repetitions < 3:
        return "learning"
    elif repetitions >= 5 and easiness_factor > 2.3 and accuracy > 85:
        return "mastered"
    elif repetitions >= 3 and easiness_factor > 2.0:
        return "familiar"
    else:
        return "learning"
```

### 11.6 Forgetting Curve Integration

The system tracks forgetting curves to optimize review scheduling:

```python
def calculate_retention_probability(days_since_review: int, 
                                     stability: float) -> float:
    """
    Calculate probability of recall based on forgetting curve.
    
    R(t) = exp(-t/S)
    where t = days since last review, S = stability
    """
    import math
    return math.exp(-days_since_review / stability)
```

### 11.7 Adaptive Difficulty

The system adjusts quiz difficulty based on user performance:

```python
def adjust_difficulty(user_accuracy: float, current_difficulty: str) -> str:
    """
    Adjust difficulty based on recent performance.
    """
    difficulties = ["beginner", "intermediate", "advanced"]
    current_idx = difficulties.index(current_difficulty)
    
    if user_accuracy > 90 and current_idx < 2:
        return difficulties[current_idx + 1]
    elif user_accuracy < 60 and current_idx > 0:
        return difficulties[current_idx - 1]
    else:
        return current_difficulty
```

---

## 12. AI Integration Strategy

### 12.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Service Architecture                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    LangChain Orchestrator                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │ Prompt      │  │ Chain       │  │ Memory      │     │    │
│  │  │ Templates   │  │ Manager     │  │ Buffer      │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    LLM Service Layer                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │ Gemma API   │  │ Fallback    │  │ Cache       │     │    │
│  │  │ (Primary)   │  │ Handler     │  │ Manager     │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Response Processing                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │ JSON        │  │ Validation  │  │ Post-       │     │    │
│  │  │ Parser      │  │ Engine      │  │ Processing  │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Prompt Templates

#### Word Explanation Prompt

```python
WORD_EXPLANATION_PROMPT = """
You are an expert IELTS vocabulary teacher. Explain the word "{word}" for 
students preparing for IELTS at Band {band_level} level.

Part of Speech: {pos}
Synonyms: {synonyms}

Provide your explanation in the following JSON format:
{{
    "simple_meaning": "A clear, simple explanation in B1-level English",
    "academic_usage": "How this word is used in academic and formal contexts",
    "common_mistakes": ["List of common mistakes students make"],
    "synonym_differences": {{
        "synonym1": "How it differs from {word}",
        "synonym2": "How it differs from {word}"
    }},
    "real_life_examples": ["3 real-life usage examples"],
    "tips": ["2-3 memory tips for remembering this word"]
}}

Important:
- Keep explanations clear and concise
- Focus on IELTS-relevant usage
- Highlight subtle differences between synonyms
- Include common collocations
"""
```

#### Sentence Generation Prompt

```python
SENTENCE_GENERATION_PROMPT = """
Generate {count} example sentences for the word "{word}" ({pos}).

Context: The word means "{meaning}"

For each sentence, provide:
1. The sentence itself
2. The context type (formal, ielts, casual, band8, collocation)
3. The IELTS band level of the sentence
4. Any collocations used

Return as JSON array:
[
    {{
        "sentence": "The example sentence.",
        "context": "formal",
        "band_level": 7.0,
        "collocations": ["collocation 1"]
    }}
]

Requirements:
- Formal: Academic or professional context
- IELTS: Suitable for Writing Task 2
- Casual: Everyday conversational usage
- Band 8+: Advanced vocabulary and complex structures
- Collocation: Show common word pairings
"""
```

#### Quiz Generation Prompt

```python
QUIZ_GENERATION_PROMPT = """
Create a quiz question for the word "{word}" ({pos}).

Word meaning: {meaning}
Synonyms: {synonyms}

Question type: {question_type}

Generate a question with 4 options where only one is correct.

Return as JSON:
{{
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "The correct option",
    "explanation": "Why this answer is correct"
}}

For fill-in-the-blank type:
- Create a sentence with a blank where the word fits
- Provide 4 word options including the target word

For meaning-selection type:
- Ask what the word means
- Provide 1 correct meaning and 3 plausible but incorrect meanings

For synonym-match type:
- Ask for a synonym
- Provide 1 correct synonym and 3 unrelated words
"""
```

### 12.3 Caching Strategy

```python
class AICacheManager:
    """
    Manages caching of AI-generated content.
    """
    
    CACHE_TTL = {
        "explanation": 30 * 24 * 3600,  # 30 days
        "sentences": 7 * 24 * 3600,      # 7 days
        "quiz": 1 * 3600,                # 1 hour
        "difficulty": 90 * 24 * 3600     # 90 days
    }
    
    async def get_or_generate(self, content_type: str, word_id: str, 
                               generator_func) -> dict:
        """
        Get cached content or generate new.
        """
        cache_key = f"ai:{content_type}:{word_id}"
        
        # Try cache first
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
        
        # Generate new content
        content = await generator_func()
        
        # Cache with appropriate TTL
        ttl = self.CACHE_TTL.get(content_type, 3600)
        await self.redis.setex(cache_key, ttl, json.dumps(content))
        
        return content
```

### 12.4 Rate Limiting

```python
class AIRateLimiter:
    """
    Rate limiting for AI API calls.
    """
    
    LIMITS = {
        "free": {
            "explain": 50,      # per day
            "sentences": 30,    # per day
            "quiz": 10,         # per day
            "chat": 20          # per day
        },
        "premium": {
            "explain": -1,      # unlimited
            "sentences": -1,
            "quiz": -1,
            "chat": -1
        }
    }
    
    async def check_limit(self, user_id: str, tier: str, 
                          action: str) -> bool:
        """
        Check if user has exceeded rate limit.
        """
        limit = self.LIMITS[tier][action]
        
        if limit == -1:  # Unlimited
            return True
        
        key = f"rate:{user_id}:{action}:{datetime.now().date()}"
        current = await self.redis.get(key) or 0
        
        return int(current) < limit
```

### 12.5 Error Handling

```python
class AIServiceError(Exception):
    """Base exception for AI service errors."""
    pass

class RateLimitExceeded(AIServiceError):
    """Rate limit exceeded."""
    pass

class InvalidResponseError(AIServiceError):
    """AI returned invalid response."""
    pass

class AIServiceUnavailable(AIServiceError):
    """AI service is unavailable."""
    pass

async def handle_ai_error(error: Exception, fallback_strategy: str = "cache"):
    """
    Handle AI service errors with fallback strategies.
    """
    if isinstance(error, RateLimitExceeded):
        raise HTTPException(429, "AI rate limit exceeded. Please try again later.")
    
    if isinstance(error, AIServiceUnavailable):
        if fallback_strategy == "cache":
            # Try to return stale cached content
            return await get_stale_cache()
        elif fallback_strategy == "default":
            # Return default response
            return get_default_response()
    
    raise HTTPException(500, "AI service error. Please try again.")
```

---

## 13. UI/UX Design Specifications

### 13.1 Design System

#### Color Palette

```css
/* Light Theme */
:root {
    --primary: #6366F1;        /* Indigo */
    --primary-hover: #4F46E5;
    --primary-light: #E0E7FF;
    
    --success: #10B981;        /* Emerald */
    --success-light: #D1FAE5;
    
    --warning: #F59E0B;        /* Amber */
    --warning-light: #FEF3C7;
    
    --error: #EF4444;          /* Red */
    --error-light: #FEE2E2;
    
    --background: #FFFFFF;
    --surface: #F9FAFB;
    --surface-hover: #F3F4F6;
    
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --text-tertiary: #9CA3AF;
    
    --border: #E5E7EB;
    --border-hover: #D1D5DB;
}

/* Dark Theme */
[data-theme="dark"] {
    --primary: #818CF8;
    --primary-hover: #6366F1;
    --primary-light: #1E1B4B;
    
    --background: #0F172A;
    --surface: #1E293B;
    --surface-hover: #334155;
    
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-tertiary: #64748B;
    
    --border: #334155;
    --border-hover: #475569;
}
```

#### Typography

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Type Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Spacing

```css
/* Spacing Scale (4px base) */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

#### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

#### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### 13.2 Component Library

#### Button Variants

```tsx
// Primary Button
<Button variant="primary" size="md">
  Start Learning
</Button>

// Secondary Button
<Button variant="secondary" size="md">
  View Details
</Button>

// Ghost Button
<Button variant="ghost" size="md">
  Cancel
</Button>

// Danger Button
<Button variant="danger" size="md">
  Delete
</Button>

// Sizes: sm (32px), md (40px), lg (48px)
```

#### Card Component

```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Word of the Day</CardTitle>
    <CardDescription>Expand your vocabulary</CardDescription>
  </CardHeader>
  <CardContent>
    <h3 className="text-2xl font-bold">Ubiquitous</h3>
    <p className="text-secondary">Found or present everywhere</p>
  </CardContent>
  <CardFooter>
    <Button>Learn More</Button>
  </CardFooter>
</Card>
```

#### Input Component

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  icon={<MailIcon />}
/>
```

### 13.3 Animation Specifications

#### Page Transitions

```tsx
// Framer Motion page transition
const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
};
```

#### Card Flip Animation

```tsx
// Flashcard flip
const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
};

const flipTransition = {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1]
};
```

#### Success Animation

```tsx
// Confetti on correct answer
const confettiConfig = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
};
```

### 13.4 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 13.5 Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Keyboard Navigation | All interactive elements focusable, logical tab order |
| Screen Reader | ARIA labels, roles, live regions for dynamic content |
| Color Contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Focus Indicators | Visible focus ring on all interactive elements |
| Alt Text | Descriptive alt text for all images |
| Form Labels | Explicit labels for all form inputs |
| Error Messages | Associated with inputs via aria-describedby |
| Skip Links | Skip to main content link |
| Reduced Motion | Respect prefers-reduced-motion |

---

## 14. Security Requirements

### 14.1 Authentication Security

| Requirement | Implementation |
|-------------|---------------|
| Password Hashing | bcrypt with 12 salt rounds |
| Token Expiry | Access: 15 min, Refresh: 7 days |
| Token Rotation | New refresh token on each refresh |
| Account Lockout | 5 failed attempts → 15 min lockout |
| Session Management | Redis-based session storage |
| MFA | Optional TOTP-based 2FA (Phase 2) |

### 14.2 API Security

| Requirement | Implementation |
|-------------|---------------|
| HTTPS | TLS 1.3 required for all endpoints |
| CORS | Whitelist allowed origins |
| Rate Limiting | 100 req/min per user, 1000 req/min per IP |
| Input Validation | Pydantic models for all inputs |
| SQL Injection | Parameterized queries via SQLAlchemy |
| XSS Prevention | Content Security Policy headers |
| CSRF | SameSite cookies, CSRF tokens |

### 14.3 Data Security

| Requirement | Implementation |
|-------------|---------------|
| Encryption at Rest | AES-256 for sensitive data |
| Encryption in Transit | TLS 1.3 |
| PII Handling | Masked in logs, encrypted in DB |
| Data Backup | Daily encrypted backups |
| Access Control | RBAC with principle of least privilege |
| Audit Logging | All data modifications logged |

### 14.4 Infrastructure Security

| Requirement | Implementation |
|-------------|---------------|
| Container Security | Minimal base images, no root users |
| Network Security | VPC, private subnets for DB |
| Secrets Management | Environment variables, AWS Secrets Manager |
| Dependency Scanning | Automated vulnerability scanning |
| DDoS Protection | Cloudflare / AWS Shield |

---

## 15. Testing Strategy

### 15.1 Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E Tests │  (10%)
                    │   Cypress   │
                    ├─────────────┤
                    │ Integration │  (20%)
                    │   Tests     │
                    ├─────────────┤
                    │   Unit      │  (70%)
                    │   Tests     │
                    └─────────────┘
```

### 15.2 Backend Testing

#### Unit Tests

```python
# Example: SRS Algorithm Test
def test_calculate_interval_correct_response():
    """Test interval calculation for correct response."""
    interval, reps, ef = calculate_interval(
        quality=4,
        repetitions=2,
        easiness_factor=2.5,
        current_interval=3
    )
    
    assert interval == 7
    assert reps == 3
    assert ef > 2.5  # EF should increase for quality 4

def test_calculate_interval_incorrect_response():
    """Test interval calculation for incorrect response."""
    interval, reps, ef = calculate_interval(
        quality=1,
        repetitions=3,
        easiness_factor=2.5,
        current_interval=7
    )
    
    assert interval == 1
    assert reps == 0
    assert ef < 2.5  # EF should decrease for quality 1
```

#### Integration Tests

```python
# Example: API Integration Test
async def test_upload_vocabulary_pdf(client, auth_headers):
    """Test PDF vocabulary upload."""
    with open("test_vocab.pdf", "rb") as f:
        response = await client.post(
            "/api/v1/vocabulary/upload",
            headers=auth_headers,
            files={"file": ("test.pdf", f, "application/pdf")},
            data={"tags": '["ielts"]'}
        )
    
    assert response.status_code == 202
    assert "job_id" in response.json()
```

### 15.3 Frontend Testing

#### Component Tests

```tsx
// Example: Flashcard Component Test
describe('Flashcard', () => {
    it('renders word on front', () => {
        render(<Flashcard word={mockWord} />);
        expect(screen.getByText('ubiquitous')).toBeInTheDocument();
    });
    
    it('flips to show meaning on click', async () => {
        render(<Flashcard word={mockWord} />);
        
        fireEvent.click(screen.getByText('ubiquitous'));
        
        await waitFor(() => {
            expect(screen.getByText('present everywhere')).toBeInTheDocument();
        });
    });
});
```

#### E2E Tests

```tsx
// Example: Learning Flow E2E Test
describe('Learning Flow', () => {
    it('completes a full review session', () => {
        cy.login('user@example.com', 'password');
        cy.visit('/dashboard');
        
        cy.findByText('Start Review').click();
        
        // Review 5 words
        for (let i = 0; i < 5; i++) {
            cy.findByTestId('flashcard').click();
            cy.findByText('Good').click();
        }
        
        cy.findByText('Session Complete').should('be.visible');
        cy.findByText('80%').should('be.visible'); // Accuracy
    });
});
```

### 15.4 Performance Testing

```javascript
// k6 Load Test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 100 },  // Ramp up
        { duration: '5m', target: 100 },  // Stay at 100 users
        { duration: '2m', target: 200 },  // Ramp to 200
        { duration: '5m', target: 200 },  // Stay at 200
        { duration: '2m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
        http_req_failed: ['rate<0.01'],    // <1% error rate
    },
};

export default function () {
    const res = http.get('https://api.example.com/api/v1/vocabulary/words');
    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(1);
}
```

### 15.5 Test Coverage Requirements

| Layer | Minimum Coverage |
|-------|------------------|
| Backend Unit | 85% |
| Backend Integration | 70% |
| Frontend Components | 80% |
| Frontend E2E | Critical paths 100% |

---

## 16. Development Roadmap

### 16.1 Phase 1: MVP (Weeks 1-8)

#### Week 1-2: Project Setup & Auth
- [ ] Initialize project structure (monorepo)
- [ ] Setup FastAPI backend with project structure
- [ ] Setup React frontend with Vite + Tailwind
- [ ] Implement user registration and login
- [ ] JWT authentication middleware
- [ ] Database migrations (Alembic)
- [ ] Docker Compose for local development

#### Week 3-4: Vocabulary Core
- [ ] Vocabulary CRUD API
- [ ] PDF upload and parsing (Celery task)
- [ ] CSV import functionality
- [ ] Vocabulary search and filtering
- [ ] Word detail page (frontend)
- [ ] Vocabulary library page

#### Week 5-6: Basic Learning Modes
- [ ] Flashcard mode (frontend + backend)
- [ ] Basic SRS algorithm implementation
- [ ] Review submission API
- [ ] Due words retrieval
- [ ] Dashboard with basic stats

#### Week 7-8: AI Integration (Basic)
- [ ] LangChain setup with Gemma API
- [ ] Word explanation generation
- [ ] Basic sentence generation
- [ ] Caching layer for AI responses
- [ ] Polish UI/UX

**MVP Deliverables:**
- User registration/login
- PDF/CSV vocabulary upload
- Vocabulary library with search
- Flashcard mode with basic SRS
- AI word explanations
- Basic dashboard

### 16.2 Phase 2: Enhanced Learning (Weeks 9-16)

#### Week 9-10: Advanced Learning Modes
- [ ] MCQ Challenge mode
- [ ] Active Recall Test mode
- [ ] Quiz generation with AI
- [ ] Quiz evaluation and scoring

#### Week 11-12: SRS Enhancement
- [ ] Implement full SM-2 algorithm
- [ ] Forgetting curve integration
- [ ] SRS statistics and forecasting
- [ ] Mastery classification system
- [ ] Review history tracking

#### Week 13-14: AI Features Enhancement
- [ ] Advanced sentence generation (5 contexts)
- [ ] Difficulty scoring with AI
- [ ] Quiz question generation
- [ ] Prompt optimization

#### Week 15-16: Analytics & Progress
- [ ] Progress analytics page
- [ ] Charts and visualizations
- [ ] Achievement system
- [ ] Streak management
- [ ] Export functionality

**Phase 2 Deliverables:**
- MCQ and Recall modes
- Full SRS with statistics
- Advanced AI features
- Progress analytics
- Achievement system

### 16.3 Phase 3: Premium Features (Weeks 17-24)

#### Week 17-18: AI Tutor Chat
- [ ] Chat interface
- [ ] Context-aware responses
- [ ] Conversation history
- [ ] Quick action buttons

#### Week 19-20: Payment & Subscription
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Premium feature gating
- [ ] Billing portal

#### Week 21-22: Gamification
- [ ] Leaderboard system
- [ ] Daily challenges
- [ ] XP and leveling
- [ ] Badges and achievements

#### Week 23-24: Polish & Optimization
- [ ] Performance optimization
- [ ] Caching improvements
- [ ] UI polish and animations
- [ ] Mobile responsiveness

**Phase 3 Deliverables:**
- AI Tutor chat
- Payment system
- Gamification features
- Performance optimization

### 16.4 Phase 4: Scale & Launch (Weeks 25-32)

#### Week 25-26: Testing & QA
- [ ] Comprehensive unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Security audit

#### Week 27-28: DevOps & Deployment
- [ ] CI/CD pipeline
- [ ] Production environment setup
- [ ] Monitoring and alerting
- [ ] Backup strategy
- [ ] SSL certificates

#### Week 29-30: Beta Launch
- [ ] Beta user recruitment
- [ ] Feedback collection
- [ ] Bug fixes
- [ ] Performance tuning

#### Week 31-32: Production Launch
- [ ] Production deployment
- [ ] Marketing launch
- [ ] User support setup
- [ ] Documentation

**Phase 4 Deliverables:**
- Production-ready application
- CI/CD pipeline
- Monitoring stack
- Beta feedback incorporated

---

## 17. Risk Analysis & Mitigation

### 17.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API rate limits | High | High | Implement caching, fallback strategies, multiple API keys |
| PDF parsing accuracy | Medium | High | Multiple parsing strategies, manual correction UI, feedback loop |
| SRS algorithm effectiveness | Low | High | A/B testing, user feedback, algorithm tuning |
| Database performance at scale | Medium | Medium | Indexing strategy, read replicas, query optimization |
| Third-party service outages | Medium | Medium | Fallback providers, graceful degradation, status page |

### 17.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user adoption | Medium | High | MVP validation, user research, marketing strategy |
| Competitor features | High | Medium | Focus on AI differentiation, rapid iteration |
| Content quality issues | Medium | High | AI output validation, user feedback, manual review |
| Revenue targets not met | Medium | High | Freemium model, multiple revenue streams, cost optimization |

### 17.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Development delays | High | Medium | Agile methodology, MVP scope control, buffer time |
| Team capacity | Medium | High | Clear documentation, modular architecture, outsourcing option |
| Security breach | Low | Critical | Security audit, penetration testing, incident response plan |
| Data loss | Low | Critical | Regular backups, disaster recovery plan, multi-region storage |

### 17.4 Risk Response Plan

```
┌─────────────────────────────────────────────────────────────────┐
│                    Risk Response Workflow                         │
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Identify   │────▶│  Assess     │────▶│  Plan       │       │
│  │  Risk       │     │  Impact     │     │  Response   │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                                       │               │
│         ▼                                       ▼               │
│  ┌─────────────┐                       ┌─────────────┐        │
│  │  Monitor    │                       │  Execute    │        │
│  │  Triggers   │                       │  Mitigation │        │
│  └─────────────┘                       └─────────────┘        │
│         │                                       │               │
│         └───────────────────┬───────────────────┘               │
│                             ▼                                   │
│                    ┌─────────────┐                              │
│                    │  Review &   │                              │
│                    │  Update     │                              │
│                    └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 18. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|-----------|
| Active Recall | Learning technique where actively stimulating memory during learning |
| Band Score | IELTS scoring system from 0-9 |
| Collocation | Words that frequently appear together |
| Easiness Factor | Multiplier determining interval growth in SRS |
| Forgetting Curve | Graph showing memory decay over time |
| Interval | Time between SRS reviews |
| Leitner System | Physical flashcard SRS system using boxes |
| Mastery | Level of word knowledge (new, learning, familiar, mastered) |
| Quality Rating | User's self-assessment of recall quality (0-5) |
| Repetition | Successful review count in SRS |
| Spacing Effect | Psychological phenomenon where spaced learning improves retention |

### Appendix B: API Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async processing) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Appendix C: Environment Variables

```env
# Application
APP_NAME=ielts-vocab-platform
APP_ENV=development
APP_DEBUG=true
APP_PORT=8000
APP_SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/vocab_db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379/0
REDIS_CACHE_TTL=3600

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_EXPIRE=900
JWT_REFRESH_TOKEN_EXPIRE=604800

# AI
GEMMA_API_KEY=your-api-key
GEMMA_API_URL=https://api.gemma.example.com
GEMMA_MODEL=gemma-7b
GEMMA_MAX_TOKENS=2048

# Storage
S3_BUCKET=vocab-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@vocab-app.com

# Payments
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_ENABLED=true
```

### Appendix D: Database Indexes

```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_progress_due_review 
ON user_progress(user_id, next_review) 
WHERE next_review IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_vocab_search_text 
ON vocabulary USING GIN(to_tsvector('english', word || ' ' || meaning));

CREATE INDEX CONCURRENTLY idx_review_history_user_date 
ON review_history(user_id, reviewed_at DESC);

CREATE INDEX CONCURRENTLY idx_users_active_streak 
ON users(streak DESC) 
WHERE is_active = true;
```

### Appendix E: Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| AUTH_001 | Invalid credentials | 401 |
| AUTH_002 | Account locked | 423 |
| AUTH_003 | Token expired | 401 |
| AUTH_004 | Invalid token | 401 |
| VOCAB_001 | Word not found | 404 |
| VOCAB_002 | Duplicate word | 409 |
| VOCAB_003 | Invalid file format | 400 |
| VOCAB_004 | File too large | 413 |
| AI_001 | Rate limit exceeded | 429 |
| AI_002 | Service unavailable | 503 |
| AI_003 | Invalid response | 500 |
| SRS_001 | No due words | 404 |
| SRS_002 | Invalid quality rating | 400 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-21 | System | Initial SRS document |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |

---

*End of Software Requirements Specification*

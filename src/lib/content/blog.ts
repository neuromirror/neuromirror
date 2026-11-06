export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: "Cognitive Health" | "Journaling" | "Memory Preservation" | "Digital Privacy";
  readingTime: string;
  tags: string[];
  content: string; // HTML/Markdown string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "science-of-cognitive-linguistic-journaling",
    title: "The Science of Cognitive Linguistic Journaling: How Word Patterns Reflect Mind Health",
    description:
      "Explore how subtle shifts in vocabulary diversity, sentence cadence, and descriptive phrasing serve as a reflective mirror to our cognitive vitality over time.",
    publishedAt: "2026-10-24",
    updatedAt: "2026-11-01",
    author: {
      name: "Dr. Elena Vance",
      role: "Cognitive Linguistics & Wellness Research",
    },
    category: "Cognitive Health",
    readingTime: "6 min read",
    tags: ["Cognitive Linguistics", "Self-Reflection", "Neuroplasticity", "Type-Token Ratio"],
    content: `
      <p class="lead">
        Language is not merely a vehicle for communication; it is an intimate reflection of how our brains organize concepts, retrieve memories, and navigate emotional complexity. Over the last two decades, psycholinguists and cognitive neuroscientists have uncovered a fascinating reality: everyday writing patterns change subtly alongside our cognitive vitality.
      </p>

      <h2>1. The Lexical Fingerprint: Type-Token Ratio (TTR)</h2>
      <p>
        In computational linguistics, one of the most reliable metrics for analyzing verbal richness is the <strong>Type-Token Ratio (TTR)</strong>. This measures the number of unique words (types) relative to the total number of words (tokens) in a piece of writing.
      </p>
      <p>
        When we feel energetic and intellectually stimulated, our semantic retrieval pathways fire rapidly. We choose diverse adjectives, nuanced verbs, and evocative descriptions. Under periods of mental fatigue, high stress, or prolonged burnout, our vocabulary narrows. We lean heavily on familiar high-frequency filler words (such as "really," "thing," "stuff," and "good").
      </p>
      <p>
        Tracking this ratio across weeks and months does not offer a medical diagnosis, but it does provide an objective barometer of cognitive ease and expressive variety.
      </p>

      <h2>2. Syntactic Complexity and Clause Cadence</h2>
      <p>
        Beyond individual words, the architecture of our sentences reveals how our working memory is handling cognitive load. Syntactic depth refers to how many nested clauses, subordinations, and dependent thoughts we link together before concluding a sentence.
      </p>
      <ul>
        <li><strong>Multi-clause compound structures:</strong> Typically present during deep contemplation, synthesis of conflicting perspectives, or relaxed narrative recounting.</li>
        <li><strong>Staccato, truncated sentences:</strong> Often appear during acute stress, executive fatigue, or task-oriented checklist journaling.</li>
      </ul>
      <p>
        By observing fluctuations in sentence cadence, journalers can recognize when cognitive fatigue is setting in long before physical exhaustion manifests.
      </p>

      <h2>3. The Longitudinal Self-Baseline Advantage</h2>
      <p>
        Traditional standardized tests compare an individual against an arbitrary demographic population average. But human beings are inherently diverse: a professional novelist naturally writes with a different vocabulary profile than an engineer or an architect.
      </p>
      <p>
        This is why self-referential baseline tracking is vastly superior for personal wellness. NeuroMirror does not grade your writing against anyone else; it simply helps you notice your own rhythms, trends, and seasonal variations over time.
      </p>

      <h2>4. Practical Writing Habits for Cognitive Longevity</h2>
      <ol>
        <li><strong>Embrace Sensory Recall:</strong> Instead of writing "I went for a walk," describe the air temperature, the sound of leaves underfoot, or the specific shade of the evening sky. Sensory descriptions activate parietal and occipital neural networks.</li>
        <li><strong>Dictate and Review:</strong> Use voice journaling to speak your raw stream of consciousness, then review the text transcript. Translating spoken thoughts into reviewed prose strengthens audio-linguistic feedback loops.</li>
        <li><strong>Reflect on Emotional Resonance:</strong> Name specific emotions with precision. Distinguishing between feeling "frustrated," "apprehensive," or "restless" enhances emotional granularity and frontal lobe regulation.</li>
      </ol>
    `,
  },
  {
    slug: "preserving-family-memories-voice-archiving-guide",
    title: "Preserving Family Memories: A Practical Guide to Digital Reminiscence and Voice Archiving",
    description:
      "A compassionate, actionable guide on capturing personal and generational stories using digital journaling, voice recordings, and searchable memory vaults.",
    publishedAt: "2026-10-28",
    updatedAt: "2026-11-03",
    author: {
      name: "Marcus Aurelius Reed",
      role: "Digital Archival & Family History Specialist",
    },
    category: "Memory Preservation",
    readingTime: "8 min read",
    tags: ["Family Memories", "Oral History", "Voice Journaling", "Memory Vault"],
    content: `
      <p class="lead">
        Every family possesses an irreplaceable library of lived wisdom: the story of an immigrant grandfather's first winter, the secret recipe perfected over forty Sunday dinners, or the nostalgic memory of a forgotten childhood home. Too often, these stories vanish when memories fade.
      </p>

      <h2>The Power of Spoken Reminiscence</h2>
      <p>
        For many older family members, typing on a small keyboard or staring at a blank page can feel intimidating or physically fatiguing. Voice journaling eliminates this friction completely.
      </p>
      <p>
        Speaking aloud taps into episodic memory through conversational pathways. When a loved one speaks naturally, vocal inflections, spontaneous digressions, and forgotten details naturally emerge. Modern speech-to-text engines like Cloudflare's Whisper transcription allow spoken words to be captured into private, permanent text records without storing intrusive audio files on external servers.
      </p>

      <h2>Prompt Themes for Meaningful Oral History</h2>
      <p>
        To guide fruitful conversations with parents, grandparents, or even for your own personal autobiography, avoid vague questions like "Tell me about your life." Instead, provide anchored prompts:
      </p>
      <ul>
        <li><em>"What was the very first music album or radio song you remember buying with your own money?"</em></li>
        <li><em>"Tell me about the kitchen in the house you grew up in. What did it smell like at 8:00 AM?"</em></li>
        <li><em>"Who was the teacher or mentor that changed how you thought about what was possible for yourself?"</em></li>
        <li><em>"What was a decision that felt frightening at the moment, but turned out to be the best choice you ever made?"</em></li>
      </ul>

      <h2>Organizing with Tags and Searchable Notebooks</h2>
      <p>
        A journal entry is only as valuable as your ability to find it when it matters. By categorizing entries into notebooks (such as <em>Early Years</em>, <em>Career Lessons</em>, <em>Family Recipes</em>, and <em>Philosophy & Values</em>), family archives transform from chaotic piles of notes into an organized digital heirloom.
      </p>

      <h2>Privacy and Dignity First</h2>
      <p>
        Personal reflections require absolute safety. Family members must know that their private recollections are protected with database-level row-level security (RLS) and will never be shared with advertisers or fed into public training datasets. True remembrance requires trust.
      </p>
    `,
  },
  {
    slug: "dementia-awareness-vs-self-observation",
    title: "Dementia Awareness vs. Self-Observation: Why Mindful Reflection Matters",
    description:
      "Understanding the critical boundary between non-diagnostic cognitive journaling and clinical medical evaluations.",
    publishedAt: "2026-11-02",
    updatedAt: "2026-11-05",
    author: {
      name: "Dr. Elena Vance",
      role: "Cognitive Linguistics & Wellness Research",
    },
    category: "Cognitive Health",
    readingTime: "5 min read",
    tags: ["Dementia Awareness", "Health Ethics", "Medical Disclaimer", "Mindful Reflection"],
    content: `
      <p class="lead">
        In an era of rapid AI adoption, digital health tools often make sensationalized claims about "diagnosing" conditions from a few typed words or voice clips. At NeuroMirror, we take a principled, scientifically grounded stance: technology must inform without alarming.
      </p>

      <h2>Why AI Cannot and Should Not "Diagnose" You</h2>
      <p>
        A true clinical assessment for cognitive impairments like Alzheimer's disease or vascular dementia requires comprehensive neuropsychological testing, biomarker evaluation, neuroimaging (such as MRI or PET scans), metabolic panels, and careful clinical interviews conducted by qualified neurologists and geriatricians.
      </p>
      <p>
        Writing style on any given day is influenced by dozens of transient factors:
      </p>
      <ul>
        <li>Poor sleep or insomnia the night before</li>
        <li>Medication side effects or adjustments</li>
        <li>Dehydration or mild viral illnesses</li>
        <li>Acute workplace deadlines or grief</li>
      </ul>
      <p>
        A machine learning model reading a brief journal entry cannot differentiate between a stressed writer rushing to finish an email and someone experiencing genuine linguistic aphasia.
      </p>

      <h2>What Informational Self-Observation Actually Provides</h2>
      <p>
        If writing analysis cannot diagnose, what is its true value? The answer is <strong>mindful self-awareness and longitudinal documentation</strong>.
      </p>
      <p>
        When individuals keep a regular journal, they compile an authentic, longitudinal timeline of their thoughts, vocabulary, and cognitive habits. If they do decide to consult a medical professional about memory or concentration concerns, having months of dated, organized entries provides concrete context that is far more useful than vague recollections of "feeling off."
      </p>

      <h2>A Calmer Relationship with Your Mind</h2>
      <p>
        Rather than generating anxious scores, percentile grades, or pseudo-medical badges, NeuroMirror is designed to offer calm, reflective questions. It acts as an empathetic sounding board that encourages you to write more, notice what brings you clarity, and cherish your ongoing inner life.
      </p>
    `,
  },
  {
    slug: "digital-privacy-for-personal-health-journals",
    title: "Digital Privacy for Personal Health Journals: Why Client-Isolated Data & RLS Are Essential",
    description:
      "An in-depth look at how modern web architectures safeguard your innermost reflections using PostgreSQL Row-Level Security and ephemeral AI processing.",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-06",
    author: {
      name: "Siddharth Nair",
      role: "Lead Software Architect",
    },
    category: "Digital Privacy",
    readingTime: "7 min read",
    tags: ["PostgreSQL RLS", "Cloudflare Workers", "Supabase", "Data Ethics", "Security"],
    content: `
      <p class="lead">
        A journal is the most intimate software application a human being can use. When you write about your fears, relationships, and health concerns, the underlying system architecture must provide ironclad guarantees that your words remain solely yours.
      </p>

      <h2>The Flaw in Traditional Centralized Databases</h2>
      <p>
        In conventional web applications, a single backend service connects to a database with administrative superpowers ("superuser" or "service role"). If an application vulnerability exists in one API endpoint, an attacker or bad actor can potentially query tables across multiple user accounts.
      </p>

      <h2>The Row-Level Security (RLS) Standard</h2>
      <p>
        At NeuroMirror, our database is built upon PostgreSQL Row-Level Security (RLS) managed by Supabase Auth. With RLS enabled:
      </p>
      <pre><code>CREATE POLICY "journals_owner_access" 
ON public.journals 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);</code></pre>
      <p>
        Every single SQL query executed by the database engine checks the cryptographically signed JWT token of the requesting user. Even if a bug were present in frontend UI code, the PostgreSQL kernel itself rejects any operation attempting to access a row that does not belong to <code>auth.uid()</code>.
      </p>

      <h2>Zero AI Model Training on User Data</h2>
      <p>
        Many consumer applications quietly reserve the right in their terms of service to "use user content to train and improve machine learning algorithms." We fundamentally reject this practice.
      </p>
      <p>
        When you voluntarily request a cognitive-language analysis, your selected journal entry is sent over an encrypted TLS connection directly to an isolated Cloudflare Workers AI container. The analysis is generated server-side in ephemeral RAM, returned to your private account, and immediately purged from model memory. Your words are never used to train global LLM weights.
      </p>

      <h2>True Sovereignty Over Your Thoughts</h2>
      <p>
        You have the unrestricted right to edit, modify, or permanently delete individual journal entries at any moment. When a journal is deleted, all associated cognitive observations and metadata are immediately wiped. Your mind belongs to you.
      </p>
    `,
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
}

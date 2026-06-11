export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  category: string;
  color: string;
}

export const mockNews: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'Twin Brothers, One Mission: How Two CFRs Saved a Life at Bedok',
    date: '8 Jun 2026',
    excerpt: 'Identical twins Marcus and Matthew Lim responded to a cardiac arrest alert at Bedok Mall, performing CPR in perfect coordination until paramedics arrived.',
    body: `On the afternoon of June 5th, Community First Responders Marcus and Matthew Lim received simultaneous cardiac arrest alerts on their myResponder apps while shopping at Bedok Mall.

Without hesitation, the 28-year-old twins rushed to the scene where a 67-year-old man had collapsed near the food court. Marcus immediately began chest compressions while Matthew retrieved the nearest AED from the mall's information counter.

"We train together every month at our local community centre," said Marcus. "When the alert came, we didn't even need to discuss — we just moved."

The twins maintained CPR for approximately 8 minutes until SCDF paramedics arrived. The patient was stabilized and transported to Changi General Hospital, where he made a full recovery.

"This is exactly the kind of community spirit myResponder was designed to foster," said Colonel (COL) Lim Boon Hwee, Commander of SCDF's 4th Civil Defence Division. "The Lim brothers exemplify what it means to be Community First Responders."

The brothers have been registered CFRs since 2024 and have responded to a combined 15 cases.`,
    category: 'Community Stories',
    color: '#E53935',
  },
  {
    id: 'news-002',
    title: 'SCDF Launches 10th Edition of the Civil Defence Emergency Handbook!',
    date: '5 Jun 2026',
    excerpt: 'The updated handbook covers new guidelines for high-rise firefighting and includes QR codes linking to instructional videos.',
    body: `The Singapore Civil Defence Force (SCDF) has launched the 10th edition of the Civil Defence Emergency Handbook, a comprehensive guide updated to include the latest emergency response procedures.

Key updates in this edition include:
• Revised CPR guidelines aligned with 2026 International Liaison Committee on Resuscitation (ILCOR) standards
• New section on high-rise firefighting with practical tips for residents
• Enhanced first aid procedures for common workplace injuries
• QR codes throughout linking to SCDF instructional videos

The handbook is available free of charge at all SCDF fire stations and community centres. A digital version can be downloaded from the SCDF website and the myResponder app.

"Emergency preparedness starts with knowledge," said Commissioner Eric Yap. "This handbook empowers every Singaporean to be a life-saver in their community."

Over 500,000 copies of previous editions have been distributed since the handbook's inception in 2007.`,
    category: 'Announcements',
    color: '#1565C0',
  },
  {
    id: 'news-003',
    title: 'New AED Locations Added Across 50 HDB Estates',
    date: '2 Jun 2026',
    excerpt: 'SCDF partners with town councils to install 200 new AEDs in void decks and community spaces across Singapore.',
    body: `In a major expansion of Singapore's public AED network, the SCDF has partnered with 16 town councils to install 200 new Automated External Defibrillators across 50 HDB estates island-wide.

The new AEDs have been strategically placed in high-traffic void decks, community centres, and near senior activity centres to maximize accessibility during cardiac emergencies.

Each AED location has been added to the myResponder app's "Find AEDs" feature, enabling Community First Responders to quickly locate the nearest device when responding to alerts.

"Every minute without defibrillation reduces a cardiac arrest victim's chance of survival by 7-10%," explained Dr. Tan Wei Ming, Senior Medical Officer at SCDF. "Having AEDs within reach of every HDB block is a game-changer."

The installation brings Singapore's total public AED count to over 12,000 — one of the highest per-capita ratios in the world.`,
    category: 'Infrastructure',
    color: '#2E7D32',
  },
  {
    id: 'news-004',
    title: 'CFR Appreciation Night 2026: Celebrating Our Everyday Heroes',
    date: '28 May 2026',
    excerpt: 'Over 300 outstanding Community First Responders were honoured at the annual appreciation event held at the SCDF HQ.',
    body: `The annual Community First Responder Appreciation Night was held at SCDF Headquarters on May 25th, recognizing over 300 outstanding CFRs who have made significant contributions to emergency response in their communities.

Highlights of the evening included:
• Presentation of the Platinum CFR Award to 12 responders with over 50 successful interventions
• Launch of the "CFR Mentor" programme pairing experienced responders with newcomers
• Keynote address by Minister of State for Home Affairs on the future of community emergency response
• Live demonstration of the enhanced myResponder app features

Guest of honour, Mr. Desmond Tan, Minister of State for Home Affairs, praised the CFR community: "You represent the best of Singapore — ordinary people doing extraordinary things to save lives."

Since its launch, the myResponder app has facilitated over 15,000 community responses to cardiac arrest and fire emergencies.`,
    category: 'Events',
    color: '#FF8F00',
  },
  {
    id: 'news-005',
    title: 'Ready for the Haze? Essential Tips to Protect Your Family',
    date: '25 May 2026',
    excerpt: 'With the dry season approaching, SCDF shares key preparation steps for haze conditions and fire prevention.',
    body: `As Singapore approaches the traditionally drier months, SCDF is reminding residents to take proactive steps to protect their families from haze conditions and increased fire risks.

Key recommendations:
1. Stock up on N95 masks for all family members
2. Keep windows and doors sealed during heavy haze
3. Ensure home fire extinguishers are in working condition
4. Clear rubbish chutes regularly to prevent fires
5. Register as a CFR on the myResponder app to stay informed

"The dry season historically sees a 30% increase in vegetation and rubbish chute fires," warned Assistant Commissioner (AC) Chua Hock Yong. "Prevention is always better than cure."

Residents can report fire hazards through the myResponder app's "Fire Hazard" feature, which allows photo submissions and automatic geolocation tagging.

For emergencies, always call 995.`,
    category: 'Safety Tips',
    color: '#6D4C41',
  },
  {
    id: 'news-006',
    title: 'Youth Brigade Trains 500 Students in Life-Saving Skills',
    date: '20 May 2026',
    excerpt: 'SCDF\'s youth outreach programme completed its largest training cohort yet, equipping secondary school students with CPR and first aid skills.',
    body: `The SCDF Youth Brigade has completed its largest-ever training cohort, certifying 500 secondary school students in basic CPR, AED usage, and first aid skills.

The 3-day programme, held across 10 schools island-wide, included hands-on practice with training mannequins, AED simulators, and scenario-based exercises.

"It was incredible to learn these skills," said 15-year-old Priya Nair from Raffles Girls' School. "I now feel confident that I could help someone in an emergency."

All participants were encouraged to register as Community First Responders on the myResponder app, with parental consent for those under 16.

The Youth Brigade programme is part of SCDF's long-term vision to create a "Nation of Life-savers," with a target of training 100,000 youths by 2030.`,
    category: 'Youth',
    color: '#7B1FA2',
  },
];

export const carouselCards = [
  {
    id: 'getting-started',
    title: 'Getting started as a CFR',
    category: 'GENERAL',
    color: '#003B73',
  },
  {
    id: 'extinguishing-fires',
    title: 'Extinguishing Fires',
    category: 'FIRE-FIGHTING',
    color: '#E53935',
  },
  {
    id: 'intro-cardiac',
    title: 'Introduction to Cardiac Arrest',
    category: 'MEDICAL',
    color: '#C62828',
  },
];

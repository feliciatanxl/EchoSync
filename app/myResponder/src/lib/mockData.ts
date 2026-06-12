// @ts-nocheck
export const MOCK_STATS = {
  cardiacArrest: 0,
  fire: 0,
  registeredCFRs: 268974,
  casesToday: 16,
};

export const MOCK_NEWS = [
  {
    id: '1',
    title: 'Twin Brothers, One Mission: Saving Lives as Community First Responders',
    image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
    date: '2026-05-30',
    views: 434,
    likes: 47,
    category: 'Community',
    summary: 'Meet the twin brothers who have dedicated their lives to saving others as CFRs in Singapore.',
  },
  {
    id: '2',
    title: 'SCDF Launches 10th Edition of the Civil Defence Emergency Handbook!',
    image_url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80',
    date: '2026-05-30',
    views: 151,
    likes: 21,
    category: 'Announcement',
    summary: 'The Singapore Civil Defence Force launches the 10th edition of the Civil Defence Emergency Handbook.',
  },
  {
    id: '3',
    title: 'Nanyang Poly Student Responds to Over 50 Cardiac Arrests Since Age 16',
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    date: '2025-09-15',
    views: 3809,
    likes: 475,
    category: 'Cardiac arrest',
    summary: 'An inspiring story of a young NP student who has responded to over 50 cardiac arrests.',
  },
];

export const MOCK_COURSES = [
  {
    id: '1',
    title: 'Getting started as a CFR',
    description: 'Learn more about the role of a Community First Responder, and how to use the myResponder app.',
    tags: ['CFR', 'Basics'],
    icon: '❤️',
  },
  {
    id: '2',
    title: 'Extinguishing Fires',
    description: 'Learn how you can extinguish a fire.',
    tags: ['Fire-fighting', 'Fire'],
    icon: '🧯',
  },
  {
    id: '3',
    title: 'Introduction to CPR',
    description: 'Learn the fundamentals of CPR and how to keep someone alive until paramedics arrive.',
    tags: ['CPR', 'Cardiac arrest'],
    icon: '🫀',
  },
  {
    id: '4',
    title: 'Using an AED',
    description: 'Understand how to locate and operate an Automated External Defibrillator.',
    tags: ['AED', 'Cardiac arrest'],
    icon: '⚡',
  },
  {
    id: '5',
    title: 'Handling Traumatic Injuries',
    description: 'Basic first aid for cuts, burns and traumatic injuries.',
    tags: ['First Aid'],
    icon: '🩹',
  },
];

export const MOCK_HALL_OF_FAME = {
  platinum: [
    { name: 'Timothy Tan Zhiyu', cases: 88 },
    { name: 'Lim Koy Soon', cases: 88 },
    { name: 'Rohit Tiwari', cases: 65 },
    { name: 'Chen Wei Ming', cases: 61 },
    { name: 'Sarah Lim Hui Ling', cases: 58 },
    { name: 'Mohammed Faizal', cases: 54 },
  ],
  gold: [
    { name: 'Priya Nair', cases: 42 },
    { name: 'David Wong Kok Wai', cases: 39 },
    { name: 'Tan Boon Huat', cases: 37 },
    { name: 'Jessica Koh Mei Ling', cases: 35 },
    { name: 'Ravi Shankar', cases: 33 },
    { name: 'Lee Xiao Hui', cases: 30 },
  ],
  silver: [
    { name: 'Ahmad Rizal', cases: 22 },
    { name: 'Ng Pei Shan', cases: 21 },
    { name: 'Brandon Teo Jun Wei', cases: 19 },
    { name: 'Nurul Ain', cases: 17 },
    { name: 'Kevin Loh Kai Xiang', cases: 15 },
    { name: 'Michelle Tan', cases: 14 },
  ],
};

export const MOCK_AEDS = [
  { id: 1, lat: 1.3697, lng: 103.8497, name: 'AMK Hub', count: 4 },
  { id: 2, lat: 1.3710, lng: 103.8480, name: 'Ang Mo Kio Bus Interchange', count: 4 },
  { id: 3, lat: 1.3725, lng: 103.8510, name: 'Djit Sun Mall', count: 1 },
  { id: 4, lat: 1.3680, lng: 103.8520, name: 'AMK Specialist Centre', count: 2 },
  { id: 5, lat: 1.3650, lng: 103.8490, name: 'S\'pore Bu Free Clinic', count: 3 },
  { id: 6, lat: 1.3700, lng: 103.8540, name: 'Cheng San CC', count: 2 },
  { id: 7, lat: 1.3720, lng: 103.8560, name: 'Block 596A', count: 4 },
  { id: 8, lat: 1.3660, lng: 103.8550, name: 'Ang Mo Kio Town Garden', count: 1 },
  { id: 9, lat: 1.3640, lng: 103.8530, name: 'Block 323', count: 2 },
  { id: 10, lat: 1.3630, lng: 103.8470, name: 'Block 325A', count: 2 },
];

export const AVATARS = [
  { id: 'a1', emoji: '👨‍💼', bg: '#e74c3c' },
  { id: 'a2', emoji: '👨‍🦲', bg: '#16a085' },
  { id: 'a3', emoji: '🧔', bg: '#2c3e50' },
  { id: 'a4', emoji: '👨‍🔬', bg: '#c0392b' },
  { id: 'a5', emoji: '👴', bg: '#2980b9' },
  { id: 'a6', emoji: '👩‍💼', bg: '#f39c12' },
  { id: 'a7', emoji: '👩‍🦱', bg: '#e74c3c' },
  { id: 'a8', emoji: '👩‍🦳', bg: '#8e44ad' },
  { id: 'a9', emoji: '👩', bg: '#16a085' },
  { id: 'a10', emoji: '👱‍♀️', bg: '#2c3e50' },
  { id: 'a11', emoji: '🐘', bg: '#2980b9' },
  { id: 'a12', emoji: '🦊', bg: '#16a085' },
  { id: 'a13', emoji: '🦓', bg: '#e74c3c' },
  { id: 'a14', emoji: '🐱', bg: '#e67e22' },
  { id: 'a15', emoji: '🐼', bg: '#f39c12' },
];
export interface LeaderboardEntry {
  rank: number;
  name: string;
  cases: number;
  avatar: string;
}

export const leaderboard: Record<'platinum' | 'gold' | 'silver', LeaderboardEntry[]> = {
  platinum: [
    { rank: 1, name: 'Timothy Tan Zhiyu', cases: 88, avatar: '🏅' },
    { rank: 2, name: 'Dr. Sarah Chen Wei Ling', cases: 76, avatar: '🏅' },
    { rank: 3, name: 'Muhammad Faiz bin Hassan', cases: 72, avatar: '🏅' },
    { rank: 4, name: 'Rachel Goh Hui Min', cases: 65, avatar: '🏅' },
    { rank: 5, name: 'Sgt (Ret) Kumar Patel', cases: 61, avatar: '🏅' },
    { rank: 6, name: 'David Wong Chee Keong', cases: 58, avatar: '🏅' },
    { rank: 7, name: 'Priya Lakshmi Nair', cases: 55, avatar: '🏅' },
    { rank: 8, name: 'Lim Jia Hao Marcus', cases: 52, avatar: '🏅' },
    { rank: 9, name: 'Fatimah bte Abdullah', cases: 50, avatar: '🏅' },
    { rank: 10, name: 'Jonathan Teo Boon Kiat', cases: 50, avatar: '🏅' },
  ],
  gold: [
    { rank: 1, name: 'Ng Wei Ting', cases: 48, avatar: '🥇' },
    { rank: 2, name: 'Ahmad Rizal bin Yusof', cases: 45, avatar: '🥇' },
    { rank: 3, name: 'Clara Sim Mei Xin', cases: 42, avatar: '🥇' },
    { rank: 4, name: 'Tan Beng Huat', cases: 40, avatar: '🥇' },
    { rank: 5, name: 'Ravi Shankar', cases: 38, avatar: '🥇' },
    { rank: 6, name: 'Michelle Lee Siew Hua', cases: 36, avatar: '🥇' },
    { rank: 7, name: 'Chua Kah Wai', cases: 34, avatar: '🥇' },
    { rank: 8, name: 'Nurul Izzah bte Ismail', cases: 33, avatar: '🥇' },
    { rank: 9, name: 'Gary Ong Chee Beng', cases: 31, avatar: '🥇' },
    { rank: 10, name: 'Deepa Krishnan', cases: 30, avatar: '🥇' },
  ],
  silver: [
    { rank: 1, name: 'Kevin Ho Jian Ming', cases: 28, avatar: '🥈' },
    { rank: 2, name: 'Siti Nurhaliza', cases: 26, avatar: '🥈' },
    { rank: 3, name: 'Benjamin Loh Wee Kiat', cases: 24, avatar: '🥈' },
    { rank: 4, name: 'Aisha bte Rahman', cases: 22, avatar: '🥈' },
    { rank: 5, name: 'Christopher Tan', cases: 21, avatar: '🥈' },
    { rank: 6, name: 'Indira Devi', cases: 20, avatar: '🥈' },
    { rank: 7, name: 'Jason Ng Kok Leong', cases: 19, avatar: '🥈' },
    { rank: 8, name: 'Linda Tan Mei Ling', cases: 18, avatar: '🥈' },
    { rank: 9, name: 'Hafiz bin Osman', cases: 17, avatar: '🥈' },
    { rank: 10, name: 'Samantha Koh Hui Shan', cases: 15, avatar: '🥈' },
  ],
};

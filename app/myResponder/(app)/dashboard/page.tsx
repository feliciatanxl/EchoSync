'use client';

import Link from 'next/link';
import { incidentStats } from '@/app/myResponder/data/mockIncidents';
import { mockNews, carouselCards } from '@/app/myResponder/data/mockNews';

export default function DashboardPage() {
  return (
    <div className="mr-page mr-animate-fade-in">
      {/* Header */}
      <header className="mr-header">
        <div className="mr-flex mr-items-center mr-gap-8">
          <span className="mr-header-title">myRESPONDER</span>
          <span className="mr-alert-pill off">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
            Alert off
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </header>

      {/* Stat Grid */}
      <div className="mr-stat-grid">
        {/* Cardiac */}
        <Link href="/myResponder/dashboard/cardiac" className="mr-stat-box" style={{ textDecoration: 'none' }}>
          <div className="mr-stat-box-icon" style={{ background: '#FFEBEE' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#E53935">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="mr-stat-box-label">Cardiac arrest</span>
          <span className="mr-stat-box-value">{incidentStats.cardiacToday}</span>
        </Link>

        {/* Fire */}
        <Link href="/myResponder/dashboard/fire" className="mr-stat-box" style={{ textDecoration: 'none' }}>
          <div className="mr-stat-box-icon" style={{ background: '#FFF3E0' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF9800">
              <path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.19-4.47 3-5.74V4a1 1 0 011.5-.87l.5.29V2a1 1 0 012 0v1.42l.5-.29A1 1 0 0114 4v6.26c1.81 1.27 3 3.36 3 5.74 0 3.87-3.13 7-7 7zm0-12a5 5 0 00-5 5 5 5 0 0010 0 5 5 0 00-5-5z"/>
            </svg>
          </div>
          <span className="mr-stat-box-label">Fire</span>
          <span className="mr-stat-box-value">{incidentStats.fireToday}</span>
        </Link>

        {/* Registered CFRs */}
        <div className="mr-stat-box" style={{ cursor: 'default' }}>
          <div className="mr-stat-box-icon" style={{ background: '#E8F0FE' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#003B73">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <span className="mr-stat-box-label">Registered CFRs</span>
          <span className="mr-stat-box-value">{incidentStats.registeredCFRs.toLocaleString()}</span>
        </div>

        {/* Cases today */}
        <Link href="/myResponder/map" className="mr-stat-box" style={{ textDecoration: 'none' }}>
          <div className="mr-stat-box-icon" style={{ background: '#E8F5E9' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#43A047">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
            </svg>
          </div>
          <span className="mr-stat-box-label">Cases today</span>
          <span className="mr-stat-box-value">{incidentStats.casesToday}</span>
        </Link>
      </div>

      {/* Banner Card */}
      <div className="mr-px-16 mr-mb-16">
        <div className="mr-card mr-flex mr-items-center mr-justify-between" style={{ cursor: 'pointer' }}>
          <div style={{ flex: 1 }}>
            <p className="mr-body-sm" style={{ fontWeight: 600 }}>Guidelines for Continued Assistance from Community First Responder</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 12 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="mr-hscroll no-scrollbar">
        {carouselCards.map((card) => (
          <div key={card.id} className="mr-hscroll-card">
            <div
              className="mr-hscroll-card-img"
              style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` }}
            />
            <div className="mr-hscroll-card-body">
              <span
                className="mr-caption"
                style={{
                  background: `${card.color}18`,
                  color: card.color,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: 6,
                }}
              >
                {card.category}
              </span>
              <p className="mr-hscroll-card-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest community news */}
      <div className="mr-section-header">Latest community news</div>
      <div className="mr-px-16" style={{ paddingBottom: 16 }}>
        {mockNews.map((article) => (
          <Link
            key={article.id}
            href={`/myResponder/dashboard/article/${article.id}`}
            className="mr-news-card"
          >
            <div
              className="mr-news-thumb"
              style={{ background: article.color }}
            />
            <div className="mr-news-info">
              <span
                className="mr-caption"
                style={{
                  color: article.color,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: 11,
                }}
              >
                {article.category}
              </span>
              <span className="mr-news-title">{article.title}</span>
              <span className="mr-news-date">{article.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

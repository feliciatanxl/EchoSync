'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { mockNews } from '@/app/myResponder/data/mockNews';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const article = mockNews.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="mr-page mr-animate-fade-in">
        <header className="mr-header">
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="mr-header-title">Not Found</span>
        </header>
        <div className="mr-page-content mr-text-center">
          <p className="mr-title-md mr-mt-24">Article not found</p>
          <p className="mr-body-sm mr-mt-8" style={{ color: 'var(--gray-500)' }}>
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            className="mr-btn mr-btn-secondary mr-mt-24"
            onClick={() => router.push('/myResponder/dashboard')}
            style={{ maxWidth: 200, margin: '24px auto 0' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt });
      } catch {
        /* user cancelled */
      }
    } else {
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="mr-page mr-animate-fade-in" style={{ paddingBottom: 0 }}>
      {/* Header */}
      <header className="mr-header">
        <div className="mr-flex mr-items-center mr-gap-8" style={{ flex: 1 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span
            style={{
              background: `${article.color}18`,
              color: article.color,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {article.category}
          </span>
        </div>
      </header>

      {/* Article Content */}
      <div className="mr-px-16 mr-mt-16">
        <h1 className="mr-title-lg" style={{ marginBottom: 8 }}>{article.title}</h1>
        <div className="mr-flex mr-items-center mr-gap-8 mr-mb-24">
          <span className="mr-caption">{article.date}</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gray-300)' }} />
          <span
            className="mr-caption"
            style={{ color: article.color, fontWeight: 600 }}
          >
            {article.category}
          </span>
        </div>

        {/* Hero color block */}
        <div style={{
          width: '100%',
          height: 180,
          borderRadius: 'var(--radius-md)',
          background: `linear-gradient(135deg, ${article.color}, ${article.color}99)`,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>

        <div className="mr-body" style={{ whiteSpace: 'pre-line', color: 'var(--gray-800)', lineHeight: 1.7 }}>
          {article.body}
        </div>
      </div>

      {/* Floating Footer */}
      <div style={{
        width: '100%',
        background: 'white',
        borderTop: '1px solid var(--gray-200)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        flexShrink: 0,
        zIndex: 100,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
      }}>
        <button
          onClick={() => setLiked(!liked)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={liked ? '#E53935' : 'none'}
            stroke={liked ? '#E53935' : 'var(--gray-500)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.2s' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: liked ? '#E53935' : 'var(--gray-500)' }}>
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>

        <button
          onClick={handleShare}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)' }}>Share</span>
        </button>
      </div>
    </div>
  );
}

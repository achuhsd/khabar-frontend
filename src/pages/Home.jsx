import { useNavigate } from 'react-router-dom'

const articles = [
  {
    id: 1,
    category: '🏛 Politics',
    title: 'RBI Raises Interest Rates — What It Means For You',
    time: '2 hours ago',
    read: '3 min read',
    color: '#FF6B47'
  },
  {
    id: 2,
    category: '💻 Tech',
    title: "India's AI Startups Are Building the Future",
    time: '4 hours ago',
    read: '4 min read',
    color: '#1ECFAA'
  },
  {
    id: 3,
    category: '💰 Business',
    title: 'Sensex Hits All Time High — Should You Invest Now?',
    time: '1 hour ago',
    read: '5 min read',
    color: '#FFD166'
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F2C',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '80px'
    }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        background: '#0A0F2C',
        zIndex: 100,
        borderBottom: '1px solid #161B3A'
      }}>
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: 0 }}>
          KHABAR <span style={{ color: '#FF6B47' }}>⚡</span>
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: '#161B3A',
            border: '1px solid #1A2040',
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>🔥</span>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>7 days</span>
          </div>
          <div style={{
            background: '#161B3A',
            border: '1px solid #1A2040',
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ color: '#FFD166', fontSize: '12px', fontWeight: '700' }}>4/6 🪙</span>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 }}>
          Good Morning, Aditya 👋
        </h2>
        <p style={{ color: '#A0A8C0', fontSize: '12px', margin: '4px 0 0' }}>
          Your news. Your city. Your world.
        </p>
      </div>

      {/* Study Timer */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#161B3A',
          borderRadius: '14px',
          padding: '12px 16px',
          border: '1px solid #1A2040'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#FF6B47', fontSize: '13px', fontWeight: '700' }}>28 min</span>
            <span style={{ color: '#A0A8C0', fontSize: '13px' }}>/ 60 min</span>
            <span style={{ fontSize: '16px' }}>📖</span>
          </div>
          <div style={{ background: '#1A2040', borderRadius: '4px', height: '6px' }}>
            <div style={{ background: '#FF6B47', borderRadius: '4px', height: '6px', width: '47%' }} />
          </div>
        </div>
      </div>

      {/* Trending Hero Card */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(to top, rgba(10,15,44,0.95) 0%, rgba(10,15,44,0.4) 60%, transparent 100%), linear-gradient(135deg, #1a2040, #0d1235)',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '20px',
          border: '1px solid #1A2040',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: '14px', left: '14px',
            background: '#FF6B47', borderRadius: '20px',
            padding: '4px 10px', fontSize: '10px',
            fontWeight: '700', color: '#fff',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            📈 TRENDING
          </div>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 10px', lineHeight: '1.3' }}>
            RBI Raises Interest Rates — What It Means For You
          </h3>
          <button style={{
            background: '#FF6B47', color: '#fff',
            border: 'none', borderRadius: '20px',
            padding: '8px 16px', fontSize: '12px',
            fontWeight: '700', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            width: 'fit-content'
          }}>
            ✨ Explain Like a Friend
          </button>
          <p style={{ color: '#A0A8C0', fontSize: '11px', margin: '8px 0 0' }}>3 min read</p>
        </div>
      </div>

      {/* Explain Like a Friend Preview */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#161B3A',
          borderRadius: '14px',
          padding: '14px 16px',
          border: '1px solid #1A2040'
        }}>
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: '0 0 12px' }}>
            Explain Like a Friend ✨
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px' }}>📌</div>
              <div style={{ color: '#A0A8C0', fontSize: '10px', marginTop: '4px' }}>What<br/>happened</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px' }}>🔍</div>
              <div style={{ color: '#A0A8C0', fontSize: '10px', marginTop: '4px' }}>Why it<br/>happened</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px' }}>💡</div>
              <div style={{ color: '#A0A8C0', fontSize: '10px', marginTop: '4px' }}>What it<br/>means for you</div>
            </div>
            <div style={{ fontSize: '32px' }}>🤖</div>
          </div>
        </div>
      </div>

      {/* More For You */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>More for You</h3>
          <span
            onClick={() => navigate('/cardswipe')}
            style={{ color: '#1ECFAA', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            See all →
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {articles.slice(0, 2).map(article => (
            <div key={article.id} style={{
              background: '#161B3A',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid #1A2040'
            }}>
              <div style={{
                height: '100px',
                background: `linear-gradient(135deg, ${article.color}22, #0d1235)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                {article.category.split(' ')[0]}
              </div>
              <div style={{ padding: '10px' }}>
                <p style={{ color: '#fff', fontSize: '11px', fontWeight: '700', margin: '0 0 6px', lineHeight: '1.4' }}>
                  {article.title}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: article.color, fontSize: '9px', fontWeight: '700' }}>
                    {article.category.split(' ').slice(1).join(' ')}
                  </span>
                  <span style={{ color: '#A0A8C0', fontSize: '9px' }}>{article.read}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        background: '#161B3A',
        borderTop: '1px solid #1A2040',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0 16px',
        zIndex: 100
      }}>
        {[{
  icon: '🏠', label: 'Home', path: '/home'
},
{
  icon: '🔍', label: 'Explore', path: '/cardswipe'   // 👈 pehle /home tha, ab /cardswipe
},
{
  icon: '🤖', label: 'AI', path: '/chat', special: true   // 👈 pehle /home tha, ab /chat
},
{
  icon: '🏆', label: 'Quiz', path: '/quiz'
},
{
  icon: '👤', label: 'Profile', path: '/profile'   // 👈 Profile bante hi kaam karega
},
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              ...(item.special ? {
                background: '#7c3aed',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                justifyContent: 'center',
                marginTop: '-16px',
                border: '3px solid #0A0F2C'
              } : {})
            }}
          >
            <span style={{ fontSize: item.special ? '20px' : '18px' }}>{item.icon}</span>
            {!item.special && (
              <span style={{
                fontSize: '10px',
                color: item.active ? '#FF6B47' : '#A0A8C0',
                fontWeight: item.active ? '700' : '400'
              }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
import React from 'react';

const Privacy = () => {
  return (
    <div className="container section-padding" style={{ minHeight: '80vh', marginTop: '80px' }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '50px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ 
          marginBottom: '40px', 
          textAlign: 'center', 
          background: 'linear-gradient(90deg, var(--accent) 0%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 'clamp(2rem, 5vw, 3rem)'
        }}>
          Privacy Policy
        </h1>
        
        <div style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '30px', fontSize: '1.2rem', textAlign: 'center' }}>
            Samashti Student Council ("we", "our", "us") is committed to protecting the privacy of users of this website.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>1. Information Collected</h3>
              <p>We may collect personal information such as name, email address, phone number, and event registration details, along with basic usage data.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>2. Use of Information</h3>
              <p style={{ marginBottom: '10px' }}>The collected information is used to:</p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '8px' }}><span style={{ position: 'absolute', left: '0', color: 'var(--accent)' }}>•</span> Manage event registrations and participation</li>
                <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '8px' }}><span style={{ position: 'absolute', left: '0', color: 'var(--accent)' }}>•</span> Communicate updates and notifications</li>
                <li style={{ position: 'relative', paddingLeft: '20px', marginBottom: '8px' }}><span style={{ position: 'absolute', left: '0', color: 'var(--accent)' }}>•</span> Improve website functionality and user experience</li>
              </ul>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>3. Data Sharing</h3>
              <p>We do not sell or rent personal information. Data may be shared only with authorized personnel for administrative purposes or when required by law.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>4. Data Storage and Security</h3>
              <p>User data is stored securely using trusted platforms such as Supabase and Vercel. Reasonable measures are taken to protect information.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>5. Cookies</h3>
              <p>Cookies may be used to enhance user experience and analyze website usage.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>6. Data Retention</h3>
              <p>Personal data is retained only for as long as necessary to fulfill its intended purpose.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>7. User Rights</h3>
              <p>Users may request access, correction, or deletion of their personal data by contacting us.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>8. Consent</h3>
              <p>By using this website, users consent to the terms of this Privacy Policy.</p>
            </section>

            <section style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>  
              <a href="mailto:samashtiofficial@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>samashtiofficial@gmail.com</a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

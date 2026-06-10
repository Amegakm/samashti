import React from 'react';

const Terms = () => {
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
          Terms and Conditions
        </h1>
        
        <div style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '30px', fontSize: '1.2rem', textAlign: 'center' }}>
            By accessing and using this website, you agree to comply with the following terms:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>1. Use of Website</h3>
              <p>This website is intended for legitimate use related to Samashti events. Users must not engage in unlawful or misleading activities.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>2. User Responsibility</h3>
              <p>Users are responsible for maintaining the confidentiality of their account and for all activities conducted under it.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>3. Event Participation</h3>
              <p>Providing false or misleading information may result in disqualification. Event details are subject to change without prior notice.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>4. Intellectual Property</h3>
              <p>All content on this website, including logos and materials, is the property of Samashti Student Council and may not be used without permission.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>5. Limitation of Liability</h3>
              <p>We are not liable for any technical issues, interruptions, or data loss arising from the use of this website.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>6. Termination</h3>
              <p>We reserve the right to restrict or terminate access in case of violation of these terms.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>7. Modifications</h3>
              <p>These terms may be updated at any time without prior notice.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>8. Governing Rules</h3>
              <p>These terms are governed by the policies of Jain (Deemed-to-be University).</p>
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

export default Terms;

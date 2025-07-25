import LoginForm from './components/LoginForm'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {/* Acon 로고 및 제목 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '60px'
        }}>
          <img 
            src="images/photos/img_logo.png"  
            alt="Acon Logo"
            style={{
              width: '60px',
              height: '67px',
              marginRight: '16px'
            }}
          />
          <h1 style={{ 
            margin: 0, 
            fontSize: '40px', 
            fontWeight: '600',
            color: 'var(--color-black)',
            fontFamily: '-apple-system'
          }}>
            Acon
          </h1>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}
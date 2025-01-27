import LandingNav from './LandingNav'
import styled from 'styled-components'
import { useState } from 'react'
import Signin from './Signin'
import Signup from './Signup'
import About from './About'
import SignupParent from './SignupParent'
import SignupStudio from './SignupStudio'
import RequestResetPassword from './RequestResetPassword'

const StyledLandingPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
`

const StyledLandingContent = styled.div`
  margin: 0 auto;
`
const PageSignInStyle = styled.div`
  height: 50px;
  display: grid;
  place-items: center;
`
const LoginButtonsDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  button {
    margin: 0;
  }
`
const FooterStyle = styled.footer`
  height: 40px;
  text-align: center;
  width: 100%;
  margin-top: auto;
  a {
    padding: 0;
    margin: 0;
  }
`
function LandingPage() {
  const [view, setView] = useState('aboutParent')

  return (
    <StyledLandingPage>
      <LandingNav setView={setView} />
      {/* about content here, brief about for each cartegory, with a link to more detailed about for specific category */}
      <StyledLandingContent>
        {view.slice(0, 5) === 'about' && (
          <About view={view} setView={setView} />
        )}
        {view === 'signin' && <Signin setView={setView} />}
        {view === 'signup' && <Signup view={view} setView={setView} />}
        {view === 'signupParent' && <SignupParent />}
        {view === 'signupStudio' && <SignupStudio />}
        {view == 'requestPassword' && <RequestResetPassword />}
      </StyledLandingContent>
      {view === 'about' ||
        (view === 'aboutParent' && (
          <LoginButtonsDiv>
            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '160px',
              }}
              className='btn-action-primary'
              onClick={() => setView('signin')}
            >
              <p className='font14'>Have an Account?</p>
              <p>Sign In</p>
            </button>
            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '160px',
              }}
              className='btn-action-secondary'
              onClick={() => setView('signup')}
            >
              <p className='font14'>New User? </p>
              <p>Try it Out!</p>
            </button>
          </LoginButtonsDiv>
        ))}
      <FooterStyle>
        <p>
          <span>
            <a
              className='btn-action-primary-textOnly'
              href='mailto:cghayden@gmail.com'
            >
              cghayden@gmail.com
            </a>
          </span>
        </p>
      </FooterStyle>
    </StyledLandingPage>
  )
}

export default LandingPage
export { StyledLandingPage, StyledLandingContent }

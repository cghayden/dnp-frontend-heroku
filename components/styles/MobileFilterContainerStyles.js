import styled from 'styled-components'

const MobileFilterContainerStyles = styled.div`
  border-radius: 5px;
  box-shadow: -6px 12px 14px 10px rgba(0, 0, 0, 0.3);
  background: ${(props) => props.theme.gray2};
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  width: 95vw;
  position: fixed;
  top: ${(props) => props.theme.mobileHeaderHeight};
  right: 0;
  height: auto;
  overflow: hidden;
  z-index: 1000;
  transition: all 0.5s;
  transform: translate3d(${(props) => (props.showFilter ? 0 : '110%')}, 0, 0);

  @media screen and (min-width: ${(props) => props.theme.mediumScreen}) {
    display: none;
  }
`

export { MobileFilterContainerStyles }

import React, { Fragment } from "react";
import MobileStatusBar from "./Parent/MobileStatusBar";
import MobileNav from "./Parent/MobileNav";
import DesktopNav from "./Parent/DesktopNav";
import ContentHeader from "./ContentHeader";
import styled from "styled-components";

const MainStyle = styled.main`
  margin-top: ${props => props.theme.mobileMainTop};
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  align-items: center;
  @media (min-width: ${props => props.theme.largeScreen}) {
    margin-top: ${props => props.theme.navHeight};
    margin-left: ${props => props.theme.sidebarWidth};
    padding-top: 1rem;
  }
`;

//action is a component that triggers an pageAction for the page, i.e add a dancer, or create a new dance
const SubNavMainLayout = ({
  children,
  mobileHeader = "",
  page = "",
  pageAction = null
}) => {
  return (
    <Fragment>
      <MobileStatusBar mobileHeader={mobileHeader} pageAction={pageAction} />
      <MobileNav />
      <DesktopNav />
      <MainStyle>
        <ContentHeader page={page} pageAction={pageAction} />
        {children}
      </MainStyle>
    </Fragment>
  );
};

export default SubNavMainLayout;

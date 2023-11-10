import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StepsWrapper, useCurrentPosition } from './components/order';
import Sidebar from './components/Sidebar';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Container } from 'components/BaseComponents/Container';
import React from 'react';

export default function SetupView() {
  const MemoizedSidebar = React.memo(Sidebar);
  const MemoizedHeader = React.memo(Header);
  const stepElement = useRoutes(StepsWrapper());
  const { index } = useCurrentPosition();

  const canAccess = 10 >= index;

  // redirect to first step
  if (!canAccess) {
    return <Navigate to="" replace />;
  }

  // or load the requested step
  return (
    <>
      <Container>
        <MemoizedSidebar />
        <Content header={<MemoizedHeader />} stepElement={stepElement}></Content>
      </Container>
    </>
  );
}

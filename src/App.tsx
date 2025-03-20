import styled from 'styled-components';
import WorldMap from './components/WorldMap';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;

const Author = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>French 378 Final Project</Title>
        <Author>Ian Chiu</Author>
      </Header>
      <WorldMap />
    </AppContainer>
  );
}

export default App;
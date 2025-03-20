import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const GlobalStyle = styled.div`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
`;

const NavBar = styled.nav`
  background-color: #333;
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const NavButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isActive ? '#FF6B6B' : 'white'};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ContentContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  height: 100vh;
  overflow-y: auto;
  position: relative;
`;

const MapContainer = styled.div<{ isZoomed: boolean }>`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  position: relative;
  background-color: #333;
  justify-content: center;
  align-items: ${props => props.isZoomed ? 'center' : 'flex-start'};
  overflow: hidden;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  border: 2px solid #555;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CountryButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const InfoPanel = styled.div<{ isVisible: boolean }>`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};

  h2 {
    margin-top: 0;
    color: #333;
  }

  h3 {
    color: #444;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  p {
    margin: 0.5em 0;
    line-height: 1.5;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 1.2rem;
`;

const ClaimText = styled.h1`
  text-decoration: underline;
  margin-bottom: 1rem;
`;

const ClaimContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
  max-height: calc(100vh - 64px); /* Adjust based on navbar height */
`;

const SourcesText = styled.p`
  line-height: 1.8;
  margin-bottom: 1.2rem;
`;

const countryInfo = {
  "Haiti": {
    name: "Haiti - Economic Isolation",
    description: `
### Overview
Haiti is a Caribbean country that shares the island of Hispaniola with the Dominican Republic. In 1697, France colonized what is now modern-day Haiti and renamed it Saint-Domingue. Haiti won its independence from France after the Haitian Revolution between 1791 and 1804.

### Before French Colonization
Before French colonization, the island comprising modern-day Haiti and the Dominican Republic was first inhabited and settled by indigenous peoples called Taíno and Ciboney. Their economies mainly consisted of farming, fishing, inter-island trading, and lucrative gold mining. However, Spanish colonization and enslavement resulted in the near-total elimination of the native population.

### During French Colonization
Haiti under French rule experienced exponential economic growth as France invested huge sums of money and manpower to transform the small island into a global producer of cash crops (sugar, coffee, indigo, cacao, and cotton). The combination of Haiti's warm tropical climate, rich volcanic soil, and enormous number of slaves from the Transatlantic Slave Trade resulted in a French colony that outproduced the entire Spanish empire in the Americas (John Carter Brown). By the turn of the century and the start of the Haitian Revolution, Haiti was occupied by approximately 500,000 enslaved Africans but only 32,000 European colonists (Britannica). Haiti eventually won independence from France through the leadership of Toussaint Louverture, Jean-Jacques Dessalines, and Henry Christophe in 1803 (Britannica).

### After French Colonization
While the main economic policy used by the French during the colonization period was resource and wealth extraction—which resulted in no actual economic benefit for Haitians—the most damaging policy came after Haiti won independence. In exchange for French recognition of Haitian independence, Haiti was forced to pay France an enormous indemnity annually until 1887 (Britannica). It was not until 1947 that the debt was completely paid off. According to the New York Times, it is estimated that in 2018, Haiti's per capita income could have been nearly six times its current size had this debt not been imposed (New York Times).

### Analysis
Haiti today is the poorest country in the Americas and suffers from extreme gang violence, food insecurity, economic instability, security challenges, and widespread poverty. Even though Haiti was one of the most prosperous colonies during French rule, none of that wealth was reinvested in Haiti, resulting in many of the problems we see today. France's imposition of the annual indemnity payments was primarily designed to ensure that Haiti remained economically dependent on France even after its independence. In the first pivotal years of Haiti as an independent nation, the payments it had to make to France grossly exceeded the governmental budget, resulting in a near-complete standstill in building much-needed infrastructure for newly freed Haitians. As the New York Times reports, due to Haiti's inability to pay the annual indemnity, France pushed the country toward borrowing from French banks. These French banks then invested the money in French projects such as the Eiffel Tower. Just as wealth was extracted by sending the proceeds of cash crops back to France during colonization, even after independence, Haiti was deliberately economically isolated from the world and essentially continued the same pattern of wealth extraction that had characterized its time as a colony. This economic isolation created a dependency that has led to persistent underdevelopment and instability.`,
    coordinates: [-72.2852, 19.0958] as [number, number]
  },
  "Algeria": {
    name: "Algeria - Monoculture",
    description: `
### Overview
Algeria is a large African country on the Mediterranean that was first invaded and colonized by France in 1830. Resentment due to forced French and Algerian segregation eventually culminated in a bitter war of independence from 1954 to 1962, resulting in an Algerian victory.

### Before French Colonization
Before French colonization, Algeria had a long history of both independence and conquest by foreign rulers. Pre-colonial Algeria's economy mainly consisted of rural subsistence farming and trade with neighboring countries across the Mediterranean (MERIP). Algeria and other North African states formed the Barbary States, which engaged in state-sponsored piracy against European and American ships. These frequent pirate attacks eventually led to France invading, conquering, and colonizing Algeria (Office of the Historian).

### During French Colonization
French Algeria, like many of France's other colonies, was primarily exploited for agriculture. When France conquered Algeria, they introduced private land ownership, a concept foreign to native Algerians at the time (Jesuis Baher). This cultural shift marked the first of many changes that reinforced the imposed French monoculture on Algerians. While France sought to subjugate Algeria and dominate its cultural heritage and identity, they simultaneously reinforced a policy of separation. Only French colonists were allowed to hold positions of power, and most land was French-owned and controlled. Unemployment was widespread and opportunities were scarce for Algerians as France implemented a systematic approach to extracting wealth from the country through agricultural monoculture.

### After French Colonization
After the devastation of the Algerian Revolution, many of the country's institutions and infrastructure were unusable. The colonial legacy of oppression left by France resulted in nearly 30 years of instability. The combination of destruction and lack of French investment into the country to improve the wellbeing of Algerians left its people vulnerable and state institutions weak. However, Algeria has now entered a period of relative stability with the discovery of natural gas resources and oil helping to bolster the economy (Jesuis Baher).

### Analysis
While Algeria has regained relative stability following independence, the previous generation of Algerians struggled with rebuilding their country after centuries of economic exploitation through France's agricultural monoculture system. Algerians today still grapple with the legacy of French colonialism. Forced cultural assimilation by the French resulted in a partial loss of Algerian identity and created a prolonged economic dependency on France, perfectly illustrating how France's monoculture policies created long-term dependencies that continue to affect Algeria's development and economic stability.`,
    coordinates: [2.6326, 36.7538] as [number, number]
  },
  "Vietnam": {
    name: "Vietnam - Resource Extraction",
    description: `
### Overview
Vietnam is a Southeast Asian country with a vast history of being invaded and colonized by foreign powers. France first invaded and colonized Vietnam in 1858, maintaining control until 1954 during the first Indochina War.

### Before French Colonization
Before French colonization, Vietnam was exclusively agricultural, supporting Vietnamese monarchies. Most Vietnamese cultivated rice and relied on subsistence farming with minimal trade (Britannica).

### During French Colonization
Napoleon III conquered Vietnam in 1857. While France proclaimed its "white man's burden," the true motivation was economic exploitation of Vietnam's resources and creating an overseas market for French goods. As Britannica states, "Vietnam was to become a source of raw materials and a market for tariff-protected goods produced by French industries" (Britannica). French Indochina experienced rapid industrialization as France exploited the region's natural resources and fertile land to grow cash crops. The French seized land and forcibly conscripted Vietnamese farmers to work in rice and rubber plantations. Under French rule, Vietnamese people were systematically excluded from these newfound riches through discriminatory social policies. All positions of power within government and the economy remained exclusively in French hands. Vietnam finally gained independence after Ho Chi Minh's declaration following World War II and the first Indochina War.

### After French Colonization
Today, Vietnam is regarded as one of the fastest-growing economies in the world. However, newly independent Vietnam initially struggled with poverty, famine, and disease. Years of war and French exploitation left the country lacking basic infrastructure and without the means to invest in its own people. These factors, combined with communist economic policies, left the country destitute and on the verge of collapse. Through opening up to foreign investment and reducing economic restrictions, Vietnam has lifted 28 million people out of poverty over one and a half decades (World Bank) and now boasts one of the highest GDPs in Southeast Asia.

### Analysis
While Vietnam stands as a model of economic success today, France's colonial period undoubtedly left irreversible scars on the country. Decades of economic exploitation and resource extraction greatly benefited France while leaving many Vietnamese in poverty. In the years immediately following Vietnam's independence, the severe lack of resources and infrastructure prevented the country from rebuilding and improving living conditions for its people, demonstrating how France's extractive economic policies created long-term dependencies that hindered Vietnam's development for decades.`,
    coordinates: [105.8342, 21.0278] as [number, number]
  }
};

const WorldMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({ coordinates: [0, 0], zoom: 1 });
  const [activePage, setActivePage] = useState<'map' | 'claim' | 'sources'>('claim');

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    const country = countryInfo[countryName as keyof typeof countryInfo];
    setPosition({
      coordinates: country.coordinates,
      zoom: 4
    });
  };

  const handleWorldView = () => {
    setSelectedCountry(null);
    setPosition({
      coordinates: [0, 0],
      zoom: 1
    });
  };

  return (
    <>
      <GlobalStyle />
      <NavBar>
        <NavButton 
          isActive={activePage === 'claim'} 
          onClick={() => setActivePage('claim')}
        >
          Claim
        </NavButton>
        <NavButton 
          isActive={activePage === 'map'} 
          onClick={() => setActivePage('map')}
        >
          Interactive Map
        </NavButton>
        <NavButton 
          isActive={activePage === 'sources'} 
          onClick={() => setActivePage('sources')}
        >
          Sources
        </NavButton>
      </NavBar>

      <ContentContainer isVisible={activePage === 'map'}>
        <MapContainer isZoomed={position.zoom > 1}>
          <ButtonContainer>
            <CountryButton onClick={handleWorldView}>World View</CountryButton>
            <CountryButton onClick={() => handleCountrySelect("Algeria")}>Algeria</CountryButton>
            <CountryButton onClick={() => handleCountrySelect("Vietnam")}>Vietnam</CountryButton>
            <CountryButton onClick={() => handleCountrySelect("Haiti")}>Haiti</CountryButton>
          </ButtonContainer>
          <MapWrapper>
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
                center: [0, 20]
              }}
            >
              <ZoomableGroup center={position.coordinates} zoom={position.zoom}>
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) => {
                    if (!geographies) {
                      setError("Failed to load map data");
                      return null;
                    }
                    return geographies.map((geo) => {
                      const isHighlighted = selectedCountry === geo.properties.name;
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isHighlighted ? "#FF6B6B" : "#D6D6DA"}
                          stroke={isHighlighted ? "#FF0000" : "#FFF"}
                          strokeWidth={isHighlighted ? 2 : 0.5}
                          style={{
                            default: {
                              outline: "none",
                            },
                            hover: {
                              outline: "none",
                            },
                            pressed: {
                              outline: "none",
                            },
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </MapWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InfoPanel isVisible={!!selectedCountry}>
            {selectedCountry && (
              <>
                <h2>{countryInfo[selectedCountry as keyof typeof countryInfo].name}</h2>
                <ReactMarkdown>
                  {countryInfo[selectedCountry as keyof typeof countryInfo].description}
                </ReactMarkdown>
              </>
            )}
          </InfoPanel>
        </MapContainer>
      </ContentContainer>

      <ContentContainer isVisible={activePage === 'claim'}>
        <ClaimContainer>
          <ClaimText>Claim</ClaimText>
          <br></br>
          <p>
          Despite France's portrayal of colonial rule as a civilizing mission, its use of three key economic tools—monoculture in 
          Algeria, resource extraction in Vietnam, and economic isolation in Haiti—allowed France to prosper while creating long-term 
          dependencies that led to persistent underdevelopment and economic instability in these former colonies.
          </p>

          <br></br>
          <ClaimText>Description of Website</ClaimText>
          <br></br>
          <p>
          Hi! "Welcome to my French 378 Final Project. In this website, you'll be able to navigate
          between three countries via the buttons on the map and see a before and after French colonization
          description of the economics of that country. The purpose of this website is to give a snapshot of
          how France's deliberate use of three key economic policies has led to persisting underdevelopment. 
          While it should be acknowledged that there were many economic policies employed by France, in this project,
          I'll focus on the three that I believe have had the largest impact: monoculture in Algeria, resource extraction
          in Vietnam, and economic isolation in Haiti. Hope you enjoy!
          </p>
        </ClaimContainer>
      </ContentContainer>

      <ContentContainer isVisible={activePage === 'sources'}>
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Sources</h1>
          <SourcesText>
"Algeria." Encyclopædia Britannica, Encyclopædia Britannica, Inc., www.britannica.com/place/Algeria.

"Early Period." Haiti, Encyclopædia Britannica, Inc., www.britannica.com/place/Haiti/Early-period.

"Economy." Remember Haiti, John Carter Brown Library, www.brown.edu/Facilities/John_Carter_Brown_Library/exhibitions/remember_haiti/economy.php.

"French Colonialism in Vietnam." Alpha History, alphahistory.com/vietnamwar/french-colonialism-in-vietnam/.

"Haiti." Encyclopædia Britannica, Encyclopædia Britannica, Inc., www.britannica.com/place/Haiti.

"Origins of the Algerian Proletariat." Middle East Research and Information Project, Jan. 1981, merip.org/1981/01/origins-of-the-algerian-proletariat/.

"Precolonial and Postcolonial Algeria." Je Suis Baher, www.jesuisbaher.com/post/precolonial-and-postcolonial-algeria.

"The Barbary Wars, 1801-1805 and 1815-1816." Office of the Historian, history.state.gov/milestones/1801-1829/barbary-wars.

"Vietnam: A Country Profile." Eye on Asia, www.eyeonasia.gov.sg/asean-countries/know/overview-of-asean-countries/vietnam-a-country-profile/.

"Vietnam Overview." World Bank, www.worldbank.org/en/country/vietnam/overview.

"Why Is Vietnam's Economy Growing So Fast?" Vietnam Briefing, www.vietnam-briefing.com/news/why-is-vietnams-economy-growing-so-fast.html/.

"World War II and Independence." Vietnam, Encyclopædia Britannica, Inc., www.britannica.com/topic/history-of-Vietnam/World-War-II-and-independence.

Porter, Catherine. "Invade Haiti, Wall Street Urged. The U.S. Obliged." The New York Times, 20 May 2022, www.nytimes.com/2022/05/20/world/americas/haiti-history-colonized-france.html.
          </SourcesText>
        </div>
      </ContentContainer>
    </>
  );
};

export default WorldMap; 
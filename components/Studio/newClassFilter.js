import styled from "styled-components";
import CategoryFilter from "../Parent/CategoryFilter";

const FilterPanelStyles = styled.div`
  a,
  button {
    border-radius: 0;
    margin: 0;
    padding: 10px 0.5rem 0.5rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    &:hover {
      color: hsl(200, 95%, 95%);
      background: ${(props) => props.theme.indigo5};
    }
  }

  ul {
    font-size: 1rem;
    align-items: start;
    @media (max-width: ${(props) => props.theme.largeScreen}) {
      font-size: 0.8rem;
    }
  }
`;

const FilterPanelHeader = styled.div`
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  align-items: center;
  justify-content: space-evenly;
  padding: 0 1rem;
  @media (min-width: ${(props) => props.theme.largeScreen}) {
    display: none;
  }
`;

const CloseFilterPanel = styled.button`
  display: inline-block;
  margin-left: auto;
  @media (min-width: ${(props) => props.theme.largeScreen}) {
    display: none;
  }
`;

const ActiveFilters = styled.div`
  grid-column: 1/-1;
  display: grid;
  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0.25rem 0;

    li {
      padding: 0.25rem 0.5rem;
      margin: 0.25rem 0.5rem;
      background: ${(props) => props.theme.indigo7};
      color: ${(props) => props.theme.gray0};
      border-radius: 5px;
    }
  }
  @media (min-width: ${(props) => props.theme.largeScreen}) {
    display: none;
  }
`;

const Categories = styled.div`
  padding: 0;
  display: grid;
  grid-row-gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(100px, 150px));
  justify-content: center;
  @media (min-width: ${(props) => props.theme.largeScreen}) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
  }
`;

const CheckboxAreaHeader = styled.div`
  grid-column: 1/-1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  h3 {
    font-size: 1.25rem;
  }
  button {
    background-color: ${(props) => props.theme.red5};
    color: ${(props) => props.theme.red0};
    margin: 0;
  }
  @media (min-width: ${(props) => props.theme.largeScreen}) {
    display: none;
  }
`;

const NewClassFilter = ({
  studio,
  classFilter,
  setFilter,
  open,
  closeControls,
}) => {
  const filterOptions = ["competitiveLevel", "ageDivision", "style", "day"];
  const days = ["Mon.", "Tue.", "Wed.", "Thur.", "Fri", "Sat.", "Sun."];
  const activeFilters = [].concat.apply([], Object.values(classFilter));
  const clearFilter = () => {
    setFilter({});
  };
  return (
    <FilterPanelStyles showControlPanel={open}>
      {/* <h2>Filter By:</h2> */}
      {/* <FilterPanelHeader>
        <CloseFilterPanel onClick={closeControls}>Close</CloseFilterPanel>
      </FilterPanelHeader> */}
      {/* show clear button if there are active filters*/}
      {/* {Object.keys(classFilter).length > 0 && (
          <button onClick={clearFilter}>Clear All</button>
        )} */}
      {/* <ActiveFilters>
        {/*display a list of the active filters */}
      {/* {Object.keys(classFilter).length > 0 && (
        <ul>
          {activeFilters.map((choice) => (
            <li key={choice}>{choice}</li>
          ))}
        </ul>
      )} */}
      {/* </ActiveFilters> */}
      <Categories>
        {filterOptions.map((filterCategory) => {
          const pluralCategory = filterCategory.concat("s");
          return (
            <CategoryFilter
              key={filterCategory}
              setFilter={setFilter}
              classFilter={classFilter}
              category={filterCategory}
              selections={
                filterCategory === "day" ? days : studio[pluralCategory]
              }
            />
          );
        })}
      </Categories>
    </FilterPanelStyles>
  );
};

export default NewClassFilter;
export { ActiveFilters };
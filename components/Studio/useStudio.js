import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const STUDIO_USER_QUERY = gql`
  query STUDIO_USER_QUERY {
    myStudio {
      id
      email
      studioName
      styles
      competitiveLevels
      ageDivisions
      danceClasses {
        id
        name
      }
      makeupSets {
        id
        name
      }
      dancers {
        id
        firstName
      }
    }
  }
`;

function useStudio() {
  const { data, error, loading } = useQuery(STUDIO_USER_QUERY);
  if (loading) return;
  if (error) return { status: "error", error };
  if (data) return data.myStudio;
  return null;
}

export { useStudio, STUDIO_USER_QUERY };

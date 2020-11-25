import { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import NewStudioLayout from '../../components/Studio/NewStudioLayout'
import {
  SubNav,
  NavSection,
  NavSectionHeading,
} from '../../components/Studio/NewStudioNav'
import Dancer from '../../components/Studio/Dancer'
import { STUDIO_ALL_DANCERS_QUERY } from '../../components/Studio/Queries'
import PlusSvg from '../../components/Icons/PlusSvg'

export default function newDancersPage() {
  const { data, error, loading } = useQuery(STUDIO_ALL_DANCERS_QUERY)
  const [choice, setChoice] = useState()
  const [createNew, setCreateNew] = useState(false)

  if (data) {
    return (
      <NewStudioLayout>
        <SubNav>
          <NavSection>
            <NavSectionHeading>
              <h2>Dancers</h2>
              <button
                onClick={() => {
                  setChoice(null)
                  setCreateNew(true)
                }}
              >
                <PlusSvg />
              </button>
            </NavSectionHeading>
            <ul>
              {data.studioDancers.map((dancer) => (
                <button
                  className={choice === dancer.id ? `activeStudioNav` : null}
                  key={dancer.id}
                  onClick={() => {
                    setCreateNew(false)
                    setChoice(dancer.id)
                  }}
                >
                  {dancer.lastName}, {dancer.firstName}
                </button>
              ))}
            </ul>
          </NavSection>
        </SubNav>
        <div className='selectionWindow'>
          {choice && <Dancer id={choice} />}
          {createNew && <div>Add a new Dancer form</div>}
        </div>
      </NewStudioLayout>
    )
  }
  return null
}

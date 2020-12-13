import React from 'react'
import Card from '../../components/styles/Card'
import DancerCard from './DancerCard'
import CreateDancerForm from './CreateDancerForm'

const Dancers = ({ hasDancers, dancers }) => {
  // if has dancers, show dancers cards
  if (hasDancers) {
    return (
      <>
        {dancers.map((dancer) => (
          <DancerCard key={dancer.id} dancer={dancer} />
        ))}
      </>
    )
  }

  // if no dancers, show welcome and add dancer/browse studios
  if (!hasDancers) {
    return (
      <>
        <Card>
          <p>
            Welcome to Dancernotes! To begin, use the form below to add a Dancer
            to your account.
          </p>
        </Card>
        <CreateDancerForm />
      </>
    )
  }
}

export default Dancers

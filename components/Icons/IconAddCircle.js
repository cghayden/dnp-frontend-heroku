import React from 'react'
import styled from 'styled-components'

const StyledAddIcon = styled.div`
  width: 40px;
  height: 40px;
  fill: blue;
`
function IconAddCircle() {
  return (
    <StyledAddIcon>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='icon-add-circle'
      >
        <circle cx='12' cy='12' r='10' className='primary' />
        <path
          className='secondary'
          d='M13 11h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4z'
        />
      </svg>
    </StyledAddIcon>
  )
}

export default IconAddCircle

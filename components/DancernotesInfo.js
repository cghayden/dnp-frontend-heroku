import React from 'react';
import Card from './styles/Card';
const DancernotesInfo = () => {
  return (
    <p>
      To submit feedback or questions, please contact:
      <span>
        {' '}
        <a
          className='btn-action-primary-textOnly'
          href='mailto:admin@coreyhayden.tech'
        >
          admin@coreyhayden.tech
        </a>
      </span>
    </p>
  );
};

export default DancernotesInfo;

import React, { Fragment } from 'react';
import spinner from './spinner.gif';

export default () => (
  <Fragment>
    <div
      style={{
        height: '85vh',
        margin: 'auto',
        display: 'flex',
        AlignItems: 'center'
      }}
    >
      <img
        src={spinner}
        style={{ width: '50px', margin: 'auto', display: 'block' }}
        alt='Loding...'
        className='spinner'
      />
    </div>
  </Fragment>
);

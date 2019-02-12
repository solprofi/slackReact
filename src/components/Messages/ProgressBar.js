import React from 'react'
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ percentUploaded, uploadState }) => (
  uploadState === 'uploading' && (
    <Progress
      inverted
      indicating
      size='medium'
      percent={percentUploaded}
      progress
      className='progress__bar'
    />
  )
)
export default ProgressBar;

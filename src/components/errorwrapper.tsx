import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SuspenseWithPerf } from 'reactfire'

export default function Errorwrapper({children}:any) {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
         <SuspenseWithPerf fallback={<div></div>} traceId='p'>
          {children}
         </SuspenseWithPerf>
        </ErrorBoundary>
        
    )
}

function ErrorFallBack({error}:any){
   
    return(
        <div role="alert">
        <p>Error loading projects:</p>
        <pre>{error.message}</pre>
        </div>
   )
}
import {Suspense} from 'react'
import PostJobForm from './PostJobForm'

export default function PostJob(){
  return(
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--text2)'}}>Laden...</div>}>
      <PostJobForm/>
    </Suspense>
  )
}

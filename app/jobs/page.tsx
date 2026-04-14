import {createClient} from '@/lib/supabase-server'
import AppShell from '@/components/AppShell'
import JobsClient from './JobsClient'

function hav(a:number,b:number,c:number,d:number){const R=6371,dL=(c-a)*Math.PI/180,dG=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dG/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
const CC:Record<string,[number,number]>={'berlin':[52.52,13.405],'münchen':[48.137,11.576],'hamburg':[53.551,9.993],'frankfurt':[50.11,8.682],'köln':[50.938,6.96],'düsseldorf':[51.227,6.773],'krefeld':[51.337,6.585],'willich':[51.263,6.549],'dortmund':[51.514,7.468],'essen':[51.455,7.012],'duisburg':[51.434,6.762],'bonn':[50.733,7.099],'aachen':[50.776,6.084],'stuttgart':[48.775,9.182]}
function fc(loc:string):[number,number]|null{const l=loc.toLowerCase();for(const[c,co]of Object.entries(CC))if(l.includes(c)||c.includes(l))return co;const m=l.match(/\d{5}/);if(m){const p=m[0];if(p.startsWith('47'))return[51.337,6.585];if(p.startsWith('40')||p.startsWith('41'))return[51.227,6.773];if(p.startsWith('50')||p.startsWith('51'))return[50.938,6.96];if(p.startsWith('10')||p.startsWith('12'))return[52.52,13.405]}return null}

export default async function JobsPage({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const params=await searchParams
  const supabase=createClient()
  let q=supabase.from('jobs').select('*').eq('is_active',true).order('created_at',{ascending:false})
  if(params.q)q=q.ilike('title',`%${params.q}%`)
  if(params.type)q=q.eq('type',params.type)
  if(params.contract)q=q.eq('contract',params.contract)
  if(params.level)q=q.eq('level',params.level)
  if(params.field)q=q.ilike('field',`%${params.field}%`)
  if(params.salary_min)q=q.gte('salary_min',parseInt(params.salary_min))
  const {data}=await q;let list=data||[]
  const cLat=params.clat?parseFloat(params.clat):null
  const cLng=params.clng?parseFloat(params.clng):null
  const rad=params.radius?parseFloat(params.radius):null
  if(cLat&&cLng&&rad&&rad<999){list=list.filter((j:any)=>{if(j.lat&&j.lng)return hav(cLat,cLng,j.lat,j.lng)<=rad;const co=fc(j.location);if(co)return hav(cLat,cLng,co[0],co[1])<=rad;return(params.city||'').toLowerCase()?j.location.toLowerCase().includes(params.city.toLowerCase()):false})}
  else if(params.city&&!cLat){list=list.filter((j:any)=>j.location.toLowerCase().includes(params.city.toLowerCase()))}
  const {data:{user}}=await supabase.auth.getUser()
  return(
    <AppShell>
      <JobsClient jobs={list} searchParams={params} user={user}/>
    </AppShell>
  )
}

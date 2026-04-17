import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import DashboardClient from './DashboardClient'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/register')
  const isEmp = profile.role === 'employer'
  let jobs: any[] = []
  let interests: any[] = []
  let conversations: any[] = []
  let myInterests: any[] = []
  let myOfferings: any[] = []
  let myRequests: any[] = []

  // Eigene Marktplatz-Angebote laden (für alle Nutzer)
  const { data: offeringsData } = await supabase
    .from('skill_offerings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  myOfferings = offeringsData || []

  // Eigene Gesuche laden
  const { data: requestsData } = await supabase
    .from('skill_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  myRequests = requestsData || []

  if (isEmp) {
    const { data } = await supabase.from('jobs').select('*').eq('employer_id', user.id).order('created_at', { ascending: false })
    jobs = data || []
    const jobIds = jobs.map((j: any) => j.id) || []
    if (jobIds.length > 0) {
      const { data: intData } = await supabase
        .from('job_interests')
        .select('*, applicant:applicant_id(full_name, avatar_url, bio), job:job_id(id, title)')
        .eq('action', 'like')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false })
      interests = intData || []
    }
    const { data: convData } = await supabase
      .from('conversations')
      .select('*, applicant:applicant_id(full_name, avatar_url), job:job_id(title)')
      .eq('employer_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(10)
    conversations = convData || []
  } else {
    const { data: convData } = await supabase
      .from('conversations')
      .select('*, employer:employer_id(full_name, avatar_url, company_name), job:job_id(title, company)')
      .eq('applicant_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(10)
    conversations = convData || []
    const { data: intData } = await supabase
      .from('job_interests')
      .select('*, job:job_id(id, title, company, location, salary_min, salary_max)')
      .eq('applicant_id', user.id)
      .eq('action', 'like')
      .order('created_at', { ascending: false })
      .limit(8)
    myInterests = intData || []
  }
  const lc = ['ja','jb','jc','jd']

  return (
    <AppShell>
      <DashboardClient
        profile={profile}
        userId={user.id}
        isEmp={isEmp}
        jobs={jobs}
        conversations={conversations}
        interests={interests}
        myInterests={myInterests}
        myOfferings={myOfferings}
        myRequests={myRequests}
        lc={lc}
      />
    </AppShell>
  )
}

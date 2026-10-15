import { useEffect, useState } from 'react'
import supabase from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) {
          setSession(data.session ?? null)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium">Checking your session…</h2>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Welcome to NeuroMirror</h2>
          <p>Please sign in to continue.</p>
          {/* You should replace these with your auth UI components */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">NeuroMirror</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">Signed in as {session.user?.email}</div>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
            onClick={async () => {
              await supabase.auth.signOut()
              setSession(null)
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">You are signed in. Build your assessments, journal entries, and games here.</p>
      </main>
    </div>
  )
}

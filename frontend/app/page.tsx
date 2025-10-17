import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-led-purple-dark opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-led-blue-dark opacity-20 blur-3xl animate-pulse" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-led-blue via-led-purple to-led-purple-dark bg-clip-text text-transparent">
          Servy
        </h1>

        <p className="text-2xl text-gray-300 mb-4">
          The future of home service booking
        </p>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          AI-powered platform connecting homeowners with trusted service providers.
          <br />
          Powered by ChatGPT and MCP.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-[20px] bg-gradient-to-r from-led-blue-dark to-led-purple-dark text-white font-semibold hover:shadow-lg hover:shadow-led-purple/50 transition-all hover:scale-105"
          >
            Vendor Signup
          </Link>
          <a
            href="/api/mcp"
            target="_blank"
            className="px-8 py-4 rounded-[20px] frosted-glass border border-white/20 text-white font-semibold hover:border-led-blue transition-all hover:scale-105"
          >
            View MCP Endpoint
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="frosted-glass rounded-[24px] p-6 led-glow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered</h3>
            <p className="text-gray-400 text-sm">
              Book services naturally through ChatGPT conversations
            </p>
          </div>

          <div className="frosted-glass rounded-[24px] p-6 led-glow">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Instant Matching</h3>
            <p className="text-gray-400 text-sm">
              Get matched with the best providers for your needs
            </p>
          </div>

          <div className="frosted-glass rounded-[24px] p-6 led-glow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Trusted & Safe</h3>
            <p className="text-gray-400 text-sm">
              All vendors are verified, licensed, and insured
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 frosted-glass rounded-[24px] p-8 text-left">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Try it in ChatGPT
          </h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-led-blue flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Enable developer mode in ChatGPT settings</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-led-purple flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                Add MCP server: <code className="bg-white/10 px-2 py-1 rounded">https://your-domain.vercel.app/mcp</code>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-led-blue-dark flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>Try: &quot;Show me power washers in Austin&quot;</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        Built with Next.js, Supabase & MCP
      </footer>
    </div>
  )
}

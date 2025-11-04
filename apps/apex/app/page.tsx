export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="border-b border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">📈 Apex</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Statistics Tracking Tool
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            Visualize your performance metrics with beautiful, interactive charts. Track your
            progress and reach new peaks.
          </p>

          {/* Coming Soon Placeholder */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Chart Placeholder */}
            <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg p-12 flex items-center justify-center h-80">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Interactive Charts
                </h3>
                <p className="text-slate-500 dark:text-slate-400">Coming soon</p>
              </div>
            </div>

            {/* Analytics Placeholder */}
            <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg p-12 flex items-center justify-center h-80">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Performance Analytics
                </h3>
                <p className="text-slate-500 dark:text-slate-400">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg p-12 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Upcoming Features
            </h2>
            <ul className="grid md:grid-cols-3 gap-6 text-left">
              <li className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Real-time Charts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Interactive visualizations of your data
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Trend Analysis</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Identify patterns and growth opportunities
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Goal Tracking</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Monitor progress toward your targets
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-lg">
            🚀 Integration with Flourish coming soon
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800">
      <nav className="border-b border-green-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            💰 Flow
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
              Financial Tracking Tool
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Track your income, expenses, and build wealth. Let money flow healthily and create
              abundance.
            </p>
          </div>

          {/* Coming Soon Placeholder */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16">
            {/* Transaction Tracking */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-green-100 dark:border-slate-700/50 hover:border-green-300 dark:hover:border-green-600">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                💸
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
                Transaction Tracking
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>

            {/* Budget Management */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-emerald-100 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
                Budget Management
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>

            {/* Wealth Analysis */}
            <div className="group bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center min-h-[280px] border border-teal-100 dark:border-slate-700/50 hover:border-teal-300 dark:hover:border-teal-600 sm:col-span-2 lg:col-span-1">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📈
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
                Wealth Analysis
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-full">
                Coming soon
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-20 bg-white/60 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Upcoming Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-3xl flex-shrink-0">💳</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                    Multi-Account Support
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Track multiple bank accounts and credit cards
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-3xl flex-shrink-0">🏷️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                    Category Management
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Organize transactions by custom categories
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-3xl flex-shrink-0">⏱️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                    Recurring Transactions
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Set up automatic transactions for regular payments
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-3xl flex-shrink-0">📱</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                    Mobile Responsive
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Track finances on the go with full mobile support
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-16 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
            <p className="text-slate-700 dark:text-slate-300 text-lg font-medium text-center">
              🚀 Integration with Apex statistics coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

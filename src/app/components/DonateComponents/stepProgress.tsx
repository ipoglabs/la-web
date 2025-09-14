export default function StepProgressBar() {
  return (
<>
{/* <!-- Steps Progress --> */}
      <div className="bg-slate-800 min-h-8 py-1 flex items-center">
        <div
          className="max-w-screen-lg container mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-36 pt-3 pb-2.5"
        >
          {/* <!-- Below SM: Steps Progress --> */}
          <nav className="w-full sm:hidden" aria-label="Progress">
            <div className="flex flex-row flex-nowrap gap-x-4">
              <div className="w-full h-2 rounded-sm bg-teal-600 mb-1"></div>
              <div className="w-full h-2 rounded-sm bg-slate-400 mb-1"></div>
              <div className="w-full h-2 rounded-sm bg-slate-400 mb-1"></div>
            </div>
            <p className="text-base font-medium text-slate-200">
              Step 1: Choose Amount
            </p>
          </nav>

          {/* <!-- Above SM: Steps Progress --> */}
          <nav className="w-full max-sm:hidden" aria-label="Progress">
            <ol role="list" className="flex space-x-4">
              <li className="flex-1">
                <div className="w-full h-1.5 rounded-sm bg-teal-600 mb-1"></div>
                <p className="text-base font-medium text-slate-200">
                  Step 1: Choose Amount
                </p>
              </li>
              <li className="flex-1">
                <div className="w-full h-1.5 rounded-sm bg-slate-400 mb-1"></div>
                <p className="text-base font-medium text-slate-400">
                  Step 2: Select Payment Type
                </p>
              </li>
              <li className="flex-1">
                <div className="w-full h-1.5 rounded-sm bg-slate-400 mb-1"></div>
                <p className="text-base font-medium text-slate-400">
                  Step 3: Payment Confirmation
                </p>
              </li>
            </ol>
          </nav>
        </div>
      </div>
</>
  );
}
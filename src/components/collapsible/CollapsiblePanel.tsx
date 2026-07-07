import React, { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
  headerClass?: string;
  icon?: ReactNode;
};

export default function CollapsiblePanel({ title, description, children, headerClass, icon }: Props) {
  const hasBg = Boolean(headerClass);

  return (
    <details className="break-inside-avoid group cursor-pointer">
      <summary
        className={
          `cursor-pointer flex flex-row items-center justify-between pl-3 pt-2 pb-2 ${headerClass ? headerClass : 'bg-white group-open:bg-slate-50'} ` +
          "border border-slate-400 shadow-sm rounded-lg group-open:rounded-b-none min-h-20"
        }
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-14 h-14 rounded-md flex items-center justify-center shrink-0 ${hasBg ? 'bg-white/12 text-white/90' : 'bg-slate-100 text-slate-700'}`} aria-hidden>
            {icon ? (
              <div className="w-full h-full p-2 flex items-center justify-center text-current">
                {icon}
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full p-2">
                <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H14a2 2 0 0 1 2 2v8.5A1.5 1.5 0 0 1 14.5 16H5.5A2.5 2.5 0 0 1 3 13.5v-7zM6 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold truncate ${hasBg ? 'text-white title-shadow' : 'text-slate-700'}`} title={title}>{title}</h3>
            {description && <p className={`text-sm font-normal leading-4 ${hasBg ? 'text-white/90 title-shadow' : 'text-slate-600'}`}>{description}</p>}
          </div>
        </div>

        <div className="flex-none mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block w-5 h-5 group-open:hidden">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden w-5 h-5 group-open:inline-block">
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </summary>

      <div
        className={
          "bg-white rounded-lg border border-slate-400 divide-y divide-dashed divide-slate-300 p-1 group-open:rounded-t-none -mt-1"
        }
      >
        {children}
      </div>
    </details>
  );
}

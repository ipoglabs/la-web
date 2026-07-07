'use client'

import { SCWhatsNextCheckIcon, SCWhatsNextNoCheckIcon } from '@/components/icons/la-icons'

type StepItem = {
  title:       string
  description: string
  isCompleted: boolean
}

export interface WhatsNextProps {
  heading: string
  data:    StepItem[]
}

export default function WhatsNext({ heading, data }: WhatsNextProps) {
  return (
    <div className="w-full text-left">
      <p className="text-sm font-semibold text-slate-700 mb-3">{heading}</p>

      <div className="relative">
        {/* Dashed line — centred on the icons (icon is w-6, so centre = left-3 = 12px) */}
        <span className="absolute left-2.75 top-6 bottom-2 border-l border-dashed border-slate-500" />

        <ul>
        {data.map((item, index) => (
          <li key={index} className="relative flex items-start gap-3 pb-2 last:pb-0">

            {/* Icon with white bg to mask the line behind it */}
            <div className="shrink-0 relative z-10 bg-white rounded-full">
              {item.isCompleted
                ? <SCWhatsNextCheckIcon  className="w-6 h-6 text-blue-500" />
                : <SCWhatsNextNoCheckIcon className="w-6 h-6 text-slate-400" />
              }
            </div>

            {/* Text */}
            <div className="pt-0.5 mb-1">
              <p className="text-xs font-semibold text-slate-700 leading-snug uppercase tracking-wide">{item.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>

          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}

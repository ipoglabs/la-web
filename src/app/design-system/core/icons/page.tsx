"use client";

import LaSection from "@/components/la/la-section";
import { LaText, LaSeparator } from "@/components/la";
import Icon, { ICON_KEYS } from "@/components/icons/Icon";
import {
  TickIcon,
  ErrorIcon,
  WarningIcon,
  GearIcon,
  SearchIcon,
  PhoneIcon,
  AddCircleIcon,
  MessagesIcon,
  HelpIcon,
  PlusIcon,
  BookmarkIcon,

  TE_BoldIcon,
  TE_ItalicIcon,
  TE_UnderlineIcon,
  TE_StrikethroughIcon,
  TE_BulletListIcon,
  TE_NumberListIcon,
  TE_MoreIcon,
  TE_FontSizeIcon,
  TE_QuoteIcon,

  Solid_X_24by24,
  Outline_XCircle_24by24,
  Outline_PlusCircle_24by24,
  Solid_BlingStar_24by24,
  Solid_CheckCircle_24by24,
  Outline_CheckCircle_24by24,
  Outline_UnCheckCircle_24by24,
  Outline_Clock_24by24,
  Solid_SliderVertical_24by24,
  Solid_SliderHorizontal_24by24,
  Outline_Heart_24by24,
  SolidFilterHorizontal24by24,
  Solid_Heart_24by24,
  Outline_MapPin_24by24,
  Outline_MapTriFold_24by24,
  Outline_CrossHair_24by24,
  Outline_CrossHairSimple_24by24,

  Solid_Plus_50by50_2pt,
  Outline_Plus_50by50_2pt,
  Solid_Heart_50by50_2pt,
  Outline_Heart_50by50_2pt,
  Outline_MapPin_50by50_2pt,
  Outline_MapTriFold_50by50_2pt,
  Outline_CrossHair_50by50_2pt,
  Outline_CrossHairSimple_50by50_2pt,
  
} from "@/components/icons/la-icons";

export default function IconsPage() {
 
  return (
    <>
    
    {/* 
    <LaSection title="Icons">
      <LaText
        type="small"
        as="p"
        className="text-sm font-semibold uppercase tracking-widest text-slate-400"
      >
        Specific Collections
      </LaText>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {ICON_KEYS.map((key) => {
                const label = key
                  .split("-")
                  .map((s) => s[0].toUpperCase() + s.slice(1))
                  .join(" ");
                return (
                  <div key={key} className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
                    <div className="text-slate-800"><Icon name={key} /></div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                );
              })}
      </div>
    </LaSection>
    <LaSeparator className="bg-slate-100" />
    */}

    {/* ───── 24 by 24 Icon Collections ───── */}
    <LaSection title="Specific Icon Collections">
      <LaText type="small" as="p" className="text-sm text-slate-500">24 by 24 Icons, 1.5pt Stroke</LaText>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TickIcon /></div>
          <div className="text-xs text-slate-700">TickIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><ErrorIcon /></div>
          <div className="text-xs text-slate-700">ErrorIcon 24by24</div>        
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><WarningIcon /></div>
          <div className="text-xs text-slate-700">WarningIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><GearIcon /></div>
          <div className="text-xs text-slate-700">GearIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><SearchIcon /></div>
          <div className="text-xs text-slate-700">SearchIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><PhoneIcon /></div>
          <div className="text-xs text-slate-700">PhoneIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><AddCircleIcon /></div>
          <div className="text-xs text-slate-700">AddCircleIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><MessagesIcon /></div>
          <div className="text-xs text-slate-700">MessagesIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><HelpIcon /></div>
          <div className="text-xs text-slate-700">HelpIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><PlusIcon /></div>
          <div className="text-xs text-slate-700">PlusIcon 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><BookmarkIcon /></div>
          <div className="text-xs text-slate-700">BookmarkIcon 24by24</div>
        </div>
      </div>
    </LaSection>
    <LaSeparator className="bg-slate-100" />

    {/* ───── 24 by 24 Icon Collections ───── */}
    <LaSection title="24 by 24 Icons, 1.5pt Stroke">
      <LaText type="small" as="p" className="text-sm text-slate-500">Inline SVG icon gallery used across the app.</LaText>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_UnCheckCircle_24by24 /></div>
          <div className="text-xs text-slate-700">Outline UnCheckCircle 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_CheckCircle_24by24 /></div>
          <div className="text-xs text-slate-700">Outline CheckCircle 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_CheckCircle_24by24 /></div>
          <div className="text-xs text-slate-700">Solid CheckCircle 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_XCircle_24by24 /></div>
          <div className="text-xs text-slate-700">Outline XCircle 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_X_24by24 /></div>
          <div className="text-xs text-slate-700">Solid X 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_PlusCircle_24by24 /></div>
          <div className="text-xs text-slate-700">Outline PlusCircle 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_Clock_24by24 /></div>
          <div className="text-xs text-slate-700">Outline Clock 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_SliderHorizontal_24by24 /></div>
          <div className="text-xs text-slate-700">Solid SliderHorizontal 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_SliderVertical_24by24 /></div>
          <div className="text-xs text-slate-700">Solid SliderVertical 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_BlingStar_24by24 /></div>
          <div className="text-xs text-slate-700">Solid BlingStar 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_Heart_24by24 /></div>
          <div className="text-xs text-slate-700">Outline Heart 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><SolidFilterHorizontal24by24 /></div>
          <div className="text-xs text-slate-700">SolidFilterHorizontal 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_Heart_24by24 /></div>
          <div className="text-xs text-slate-700">Solid Heart 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_MapPin_24by24 /></div>
          <div className="text-xs text-slate-700">Outline MapPin 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_MapTriFold_24by24 /></div>
          <div className="text-xs text-slate-700">Outline MapTriFold 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_CrossHair_24by24 /></div>
          <div className="text-xs text-slate-700">Outline CrossHair 24by24</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_CrossHairSimple_24by24 /></div>
          <div className="text-xs text-slate-700">Outline CrossHairSimple 24by24</div>
        </div>        
      </div>
    </LaSection>
    <LaSeparator className="bg-slate-100" />

    {/* ───── 50 by 50 Icon Collections, Stroke 2px ───── */}
    <LaSection title="50 by 50 Icons - 2pt Stroke">
      <LaText type="small" as="p" className="text-sm text-slate-500">Inline SVG icon gallery used across the app.</LaText>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_Plus_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Solid Plus</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_Plus_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline Plus</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_Heart_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline Heart</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Solid_Heart_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Solid Heart</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_MapPin_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline MapPin</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_MapTriFold_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline MapTriFold</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_CrossHair_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline CrossHair</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><Outline_CrossHairSimple_50by50_2pt /></div>
          <div className="text-xs text-slate-700">Outline CrossHairSimple</div>
        </div>
      </div>
    </LaSection>
    <LaSeparator className="bg-slate-100" />

    {/* ───── Rich Text Editor Icons -  24 by 24  ───── */}
    <LaSection title="Rich Text Editor Icons - 16 by 16">
      <LaText type="small" as="p" className="text-sm text-slate-500">Inline SVG icon gallery used across the app.</LaText>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_BoldIcon /></div>
          <div className="text-xs text-slate-700">TE Bold Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_ItalicIcon /></div>
          <div className="text-xs text-slate-700">TE Italic Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_UnderlineIcon /></div>
          <div className="text-xs text-slate-700">TE Underline Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_StrikethroughIcon /></div>
          <div className="text-xs text-slate-700">TE Strikethrough Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_BulletListIcon /></div>
          <div className="text-xs text-slate-700">TE BulletList Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_NumberListIcon /></div>
          <div className="text-xs text-slate-700">TE NumberList Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_MoreIcon /></div>
          <div className="text-xs text-slate-700">TE More Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_FontSizeIcon /></div>
          <div className="text-xs text-slate-700">TE FontSize Icon</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-white border border-slate-100 shadow-sm">
          <div className="text-slate-800"><TE_QuoteIcon /></div>
          <div className="text-xs text-slate-700">TE Quote Icon</div>
        </div>

      </div> 
    </LaSection>
    <LaSeparator className="bg-slate-100" />

    {/* ───── Lucid Icon Collections ───── */}
    <LaSection title="Lucide Icons">
      <LaText type="small" as="p" className="text-sm text-slate-500">Inline SVG icon gallery used across the app.</LaText>    
    </LaSection>
    
    </>
  );
}

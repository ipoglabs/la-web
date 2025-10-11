'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useRegisterStore } from '@/store/registerStore';
import { generalInfoSchema } from '@/lib/validators';

// JSON data
import COUNTRIES_JSON from '@/data/countries.json';
import STATES_JSON from '@/data/states.json';

// shadcn/ui
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

// util (if you already have a cn util, import it instead)
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

const COUNTRIES = COUNTRIES_JSON as readonly string[];
const STATES_BY_COUNTRY = STATES_JSON as Record<string, string[]>;

function calcAge(dobISO?: string) {
  if (!dobISO) return undefined;
  const today = new Date();
  const dob = new Date(dobISO);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/* ------------------------- Reusable SearchableSelect ------------------------- */
type SearchableSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean;
};

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled,
  ...rest
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = value || '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', disabled && 'opacity-60')}
          {...rest}
        >
          {selectedLabel ? selectedLabel : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder="Type to search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isActive = value === opt;
                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', isActive ? 'opacity-100' : 'opacity-0')} />
                    {opt}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* --------------------------------- Page --------------------------------- */
export default function GeneralInfoPage() {
  const router = useRouter();
  const { general, updateGeneral } = useRegisterStore();

  // Move country/state into local UI state, seeded from store (if user comes back)
  const [country, setCountry] = useState<string>(general.country || '');
  const [stateName, setStateName] = useState<string>(general.state || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const states = useMemo<string[]>(
    () => (country && STATES_BY_COUNTRY[country]) ? STATES_BY_COUNTRY[country] : [],
    [country]
  );

  useEffect(() => {
    if (stateName && !states.includes(stateName)) setStateName('');
  }, [states, stateName]);

  const next = () => {
    const mappedErrors: Record<string, string> = {};

    // Derive residency to keep backend compatibility
    const residency = country && stateName ? `${stateName}, ${country}` : '';

    // Construct object for zod validation
    const toValidate = {
      ...general,
      country,
      state: stateName,
      residency,
    };

    // Friendly messages
    if (!general.firstName?.trim()) {
      mappedErrors.firstName = 'Please enter your first name so people know who you are.';
    }
    if (!general.lastName?.trim() && !mappedErrors.lastName) {
      mappedErrors.lastName = 'Please enter your last name.';
    }
    if (!general.dateOfBirth) {
      mappedErrors.dateOfBirth = 'Please enter your date of birth.';
    } else {
      const age = calcAge(general.dateOfBirth);
      if (typeof age === 'number' && age < 18) {
        mappedErrors.dateOfBirth =
          'Sorry — you need to be 18 or older to use Lokalads. If that’s wrong, double-check your birth date.';
      }
    }
    if (!general.gender) {
      mappedErrors.gender = 'Please select a gender option.';
    }
    if (!country || !stateName) {
      mappedErrors.locality = 'Tell us where you’re based so we can show local listings.';
      if (!country) mappedErrors.country = 'Select your country.';
      if (!stateName) mappedErrors.state = 'Select your state/region.';
    }
    if (!general.email) {
      mappedErrors.email = 'Please enter a valid email address.';
    }

    const parsed = generalInfoSchema.safeParse(toValidate);
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        const key = i.path.join('.');
        if (!mappedErrors[key]) mappedErrors[key] = i.message;
      });
    }

    if (Object.keys(mappedErrors).length > 0) {
      setErrors(mappedErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }

    // Persist to store (including derived residency)
    updateGeneral({
      country,
      state: stateName,
      residency,
    });

    setErrors({});
    router.push('/register/email-verification');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1 — General Information</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A few details to personalise your Lokalads experience.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                placeholder="Janet"
                value={general.firstName}
                onChange={(e) => updateGeneral({ firstName: e.target.value })}
                aria-invalid={!!errors.firstName}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your real name so buyers/sellers know who they’re contacting
              </p>
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                placeholder="Willson"
                value={general.lastName}
                onChange={(e) => updateGeneral({ lastName: e.target.value })}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* DOB / Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date of birth</Label>
              <Input
                type="date"
                value={general.dateOfBirth}
                onChange={(e) => updateGeneral({ dateOfBirth: e.target.value })}
                aria-invalid={!!errors.dateOfBirth}
              />
              <p className="text-xs text-muted-foreground mt-1">
                We need this to confirm you’re 18+
              </p>
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <Label>Gender</Label>
              <select
                className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={general.gender}
                onChange={(e) => updateGeneral({ gender: e.target.value as any })}
                aria-invalid={!!errors.gender}
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="hidden md:block" />
          </div>

          {/* Locality: Country + State (shadcn searchable) */}
          <div>
            <Label>Locality</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SearchableSelect
                  value={country}
                  onChange={(v) => {
                    setCountry(v);
                    // reset state if country changed
                    setStateName('');
                  }}
                  options={COUNTRIES.slice()}
                  placeholder="Select country…"
                  aria-invalid={!!errors.country || !!errors.locality}
                />
                {errors.country && (
                  <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <SearchableSelect
                  value={stateName}
                  onChange={(v) => setStateName(v)}
                  options={states}
                  placeholder={country ? 'Select state/region…' : 'Select country first'}
                  disabled={!country}
                  aria-invalid={!!errors.state || !!errors.locality}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
                {!errors.state && errors.locality && (
                  <p className="text-sm text-red-600 mt-1">{errors.locality}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Used to show relevant local rules and content.
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={general.email}
              onChange={(e) => updateGeneral({ email: e.target.value })}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={next}>Next: Verify Email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

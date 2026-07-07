export type FeedbackSentiment = "great" | "could-be-better" | "frustrating";

export interface FeedbackPayload {
  sentiment: FeedbackSentiment;
  reasons: string[];
  journey: string;
  issueAndImprovement: string;
  allowContact: boolean;
}

export interface FeedbackReasonOption {
  label: string;
  value: string;
}

export const SENTIMENT_OPTIONS: Array<{ label: string; value: FeedbackSentiment }> = [
  { label: "Great",           value: "great"           },
  { label: "Could be better", value: "could-be-better" },
  { label: "Frustrating",     value: "frustrating"     },
];

export const REASON_OPTIONS: Record<FeedbackSentiment, FeedbackReasonOption[]> = {
  great: [
    { label: "Easy to complete",  value: "easy_to_complete" },
    { label: "Fast and smooth",   value: "fast_and_smooth"  },
    { label: "Clear content",     value: "clear_content"    },
    { label: "Felt intuitive",    value: "felt_intuitive"   },
  ],
  "could-be-better": [
    { label: "A bit confusing",      value: "a_bit_confusing"      },
    { label: "Too many steps",       value: "too_many_steps"        },
    { label: "Not enough guidance",  value: "not_enough_guidance"   },
    { label: "Visual clutter",       value: "visual_clutter"        },
  ],
  frustrating: [
    { label: "Something broke",          value: "something_broke"          },
    { label: "Hard to find what I needed", value: "hard_to_find"             },
    { label: "Errors blocked me",         value: "errors_blocked_me"         },
    { label: "Too slow",                  value: "too_slow"                  },
  ],
};

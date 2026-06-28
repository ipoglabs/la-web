"use client";

type Props = {
  rating: number;
  setRating: (n: number) => void;
  comment: string;
  setComment: (v: string) => void;
  submitReview: () => void;
};

export default function ReviewForm({
  rating,
  setRating,
  comment,
  setComment,
  submitReview,
}: Props) {
  return (
    <div>
      {/* <h3 className="font-semibold text-lg mb-4">Write Review</h3> */}

      {/* ⭐ STARS */}
      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2">Rate this user</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => setRating(s)}
              className={`cursor-pointer text-3xl ${
                s <= rating
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {rating > 0
            ? `You selected ${rating} star${rating > 1 ? "s" : ""}`
            : "Tap to rate"}
        </p>
      </div>

      {/* COMMENT */}
      <div className="mb-4">
        <label className="text-sm text-slate-600 block mb-1">
          Review Feedback (optional)
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={submitReview}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}
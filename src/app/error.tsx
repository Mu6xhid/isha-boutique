"use client";

export default function Error({ error, reset }: any) {
  console.error(error);

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <button
        className="mt-4 underline text-blue-600"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}

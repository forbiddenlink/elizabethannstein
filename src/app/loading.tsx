export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[50]">
      <div className="w-48 max-w-full">
        <div className="h-0.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full w-1/3 rounded-full bg-[var(--color-text-primary)] animate-[shimmer-slide_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

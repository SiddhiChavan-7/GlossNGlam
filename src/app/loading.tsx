export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm font-medium animate-pulse">Loading amazing designs...</p>
    </div>
  )
}

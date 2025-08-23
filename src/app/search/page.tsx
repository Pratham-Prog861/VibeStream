import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold">Search</h1>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Artists, songs, or playlists" className="pl-12 text-lg h-14" />
      </div>
      <p className="text-muted-foreground text-center pt-8">Find your next favorite song.</p>
    </div>
  )
}

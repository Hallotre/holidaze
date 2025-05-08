import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

/**
 * Displays the host information for a venue.
 * @param owner - Profile object for the venue owner
 */
export function VenueHostInfo({ owner }: { owner?: Profile }) {
  if (!owner) return null;
  return (
    <div className="mt-8 p-6 border rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Hosted by {owner.name}</h2>
        <Link href={`/profile/${owner.name}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <UserCircle size={16} />
            <span>View Profile</span>
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href={`/profile/${owner.name}`} className="block">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border transition-transform hover:scale-105">
            {owner.avatar ? (
              <Image
                src={owner.avatar.url}
                alt={owner.avatar.alt || owner.name}
                fill
                className="object-cover"
                sizes="4rem"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                {owner.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div>
          <p className="text-muted-foreground">
            {owner.bio || `Contact ${owner.name} for more information about this venue.`}
          </p>
        </div>
      </div>
    </div>
  );
}
import Image from "next/image";
import { Profile } from "@/types/user";

/**
 * Displays the host information for a venue.
 * @param owner - Profile object for the venue owner
 */
export function VenueHostInfo({ owner }: { owner?: Profile }) {
  if (!owner) return null;
  return (
    <div className="mt-8 p-6 border rounded-xl">
      <h2 className="text-xl font-bold mb-4">Hosted by {owner.name}</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border">
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
        <div>
          <p className="text-muted-foreground">
            {owner.bio || `Contact ${owner.name} for more information about this venue.`}
          </p>
        </div>
      </div>
    </div>
  );
} 
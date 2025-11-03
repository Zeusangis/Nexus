import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileWarning } from "lucide-react";

interface LimitationsSectionProps {
  limitations: string | null;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const LimitationsSection: React.FC<LimitationsSectionProps> = ({
  limitations,
  isEditing,
  onFieldChange,
}) => {
  if (!isEditing && !limitations) return null;

  return (
    <div className="mt-4 p-4 rounded-lg bg-muted/50">
      <div className="flex items-start gap-2 mb-2">
        <FileWarning className="h-4 w-4 mt-1 text-muted-foreground" />
        <Label className="text-sm text-muted-foreground">Limitations</Label>
      </div>
      {isEditing ? (
        <Textarea
          value={limitations || ""}
          onChange={(e) => onFieldChange("limitations", e.target.value)}
          placeholder="Enter any physical limitations or injuries..."
          className="w-full min-h-[80px]"
        />
      ) : (
        <p className="text-sm">{limitations || "None"}</p>
      )}
    </div>
  );
};

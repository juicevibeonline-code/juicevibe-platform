import { Button } from "@/components/ui/Button";

interface FormFooterProps {
  onCancel: () => void;
  onSubmitLabel?: string;
  isLoading?: boolean;
  submitVariant?: "primary" | "danger";
}

export function FormFooter({ onCancel, onSubmitLabel = "Save", isLoading, submitVariant = "primary" }: FormFooterProps) {
  return (
    <div className="flex gap-2 pt-4 border-t border-border">
      <Button type="button" variant="ghost" className="flex-1 text-xs" onClick={onCancel}>Cancel</Button>
      <Button type="submit" variant={submitVariant} className="flex-1 text-xs" isLoading={isLoading}>{onSubmitLabel}</Button>
    </div>
  );
}

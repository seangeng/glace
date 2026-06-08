import * as RS from "@radix-ui/react-select";
import { Check, ChevronDown } from "./Icons";

/**
 * Minimal shadcn-style select built on Radix — replaces the native <select>
 * so the chevron is properly aligned and the menu matches the site's glass.
 */
export function Select({
  value,
  onValueChange,
  options,
  ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: readonly string[];
  ariaLabel?: string;
}) {
  return (
    <RS.Root value={value} onValueChange={onValueChange}>
      <RS.Trigger className="sel-trigger" aria-label={ariaLabel}>
        <RS.Value />
        <RS.Icon className="sel-chevron">
          <ChevronDown className="sel-chevron-icon" />
        </RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content className="sel-content" position="popper" sideOffset={6}>
          <RS.Viewport>
            {options.map((o) => (
              <RS.Item key={o} value={o} className="sel-item">
                <RS.ItemText>{o}</RS.ItemText>
                <RS.ItemIndicator className="sel-check">
                  <Check className="sel-check-icon" />
                </RS.ItemIndicator>
              </RS.Item>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
}

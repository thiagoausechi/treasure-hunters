import { CheckIcon, ChevronDown, X } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type SelectOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface InputSelectProvided {
  options: SelectOption[];
  onValueChange?: (v: string) => void;
  placeholder: string;
  clearable: boolean;
  disabled: boolean;
  selectedValue: string;
  setSelectedValue: SetState<string>;
  isPopoverOpen: boolean;
  setIsPopoverOpen: SetState<boolean>;
  onOptionSelect: (v: string) => void;
  onClearAllOptions: () => void;
}

export const InputSelect: React.FC<{
  options: SelectOption[];
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: (v: InputSelectProvided) => React.ReactNode;
}> = ({
  options,
  value = "",
  onValueChange,
  placeholder = "Select...",
  clearable = false,
  disabled = false,
  className,
  children,
  ...restProps
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(value);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const onOptionSelect = (option: string) => {
    setSelectedValue(option);
    onValueChange?.(option);
    setIsPopoverOpen(false);
  };

  const onClearAllOptions = () => {
    setSelectedValue("");
    onValueChange?.("");
    setIsPopoverOpen(false);
  };

  React.useEffect(() => {
    if (isPopoverOpen && value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [isPopoverOpen]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        {children({
          options,
          onValueChange,
          placeholder,
          clearable,
          disabled,
          selectedValue,
          setSelectedValue,
          isPopoverOpen,
          setIsPopoverOpen,
          onOptionSelect,
          onClearAllOptions,
        })}
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", className)}
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
        {...restProps}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-[unset] overflow-y-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[20rem] min-h-[10rem] overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onOptionSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-1 flex h-4 w-4 items-center justify-center",
                        isSelected ? "text-primary" : "invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selectedValue && clearable && (
                  <>
                    <CommandItem
                      onSelect={onClearAllOptions}
                      className="flex-1 cursor-pointer justify-center"
                    >
                      Clear
                    </CommandItem>
                    <Separator
                      orientation="vertical"
                      className="mx-2 flex h-full min-h-6"
                    />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className="max-w-full flex-1 cursor-pointer justify-center"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
InputSelect.displayName = "InputSelect";

export const InputSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  InputSelectProvided & {
    className?: string;
    children?: (v: SelectOption) => React.ReactNode;
    style?: React.CSSProperties;
  }
>(
  (
    {
      options,
      // onValueChange,
      placeholder,
      clearable,
      disabled,
      selectedValue,
      // setSelectedValue,
      // isPopoverOpen,
      setIsPopoverOpen,
      // onOptionSelect,
      onClearAllOptions,
      className,
      style,
      children,
    },
    ref,
  ) => {
    const onTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <Button
        ref={ref}
        onClick={onTogglePopover}
        variant="outline"
        type="button"
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between p-1 [&_svg]:pointer-events-auto",
          "hover:bg-transparent",
          disabled && "[&_svg]:pointer-events-none",
          className,
        )}
        style={style}
      >
        {selectedValue ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center px-2">
              {[selectedValue].map((value, index) => {
                const option = options.find((o) => o.value === value);

                if (!option) {
                  return <div key={`${index}-${value}`}></div>;
                }

                if (children) {
                  return (
                    <div key={`${index}-${value}`}>{children(option)}</div>
                  );
                }

                return (
                  <div
                    key={`${index}-${value}`}
                    className={cn("text-foreground")}
                  >
                    {option?.icon && (
                      <option.icon className="mr-1 h-3.5 w-3.5" />
                    )}
                    {option?.label}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              {selectedValue && clearable && (
                <>
                  <X
                    className={cn(
                      "text-muted-foreground mx-1 h-4 cursor-pointer",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAllOptions();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                </>
              )}
              <ChevronDown className="text-muted-foreground mx-1 h-4 cursor-pointer" />
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full items-center justify-between">
            <span className="text-muted-foreground mx-3 text-sm">
              {placeholder}
            </span>
            <ChevronDown className="text-muted-foreground mx-1 h-4 cursor-pointer" />
          </div>
        )}
      </Button>
    );
  },
);
InputSelectTrigger.displayName = "InputSelectTrigger";

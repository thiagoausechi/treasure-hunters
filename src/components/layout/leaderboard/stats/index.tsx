export interface StatProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function Stat(props: StatProps) {
  const { label, value } = props;
  return (
    <div className="bg-muted flex flex-col items-center justify-center rounded-xl p-2">
      {value}
      <span className="text-muted-foreground mt-1 text-xs">{label}</span>
    </div>
  );
}

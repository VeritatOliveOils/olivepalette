interface Props {
  fruitiness: number | null;
  bitterness: number | null;
  pungency: number | null;
}

function Bar({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-olive-700">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-2 w-full rounded-full bg-olive-100">
        <div
          className="h-2 rounded-full bg-olive-600"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function TasteProfile({ fruitiness, bitterness, pungency }: Props) {
  if (fruitiness == null && bitterness == null && pungency == null) return null;
  return (
    <div className="space-y-3">
      <Bar label="Fruitiness" value={fruitiness} />
      <Bar label="Bitterness" value={bitterness} />
      <Bar label="Pungency" value={pungency} />
    </div>
  );
}

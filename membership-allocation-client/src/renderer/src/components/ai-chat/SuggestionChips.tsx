const suggestions = [
  ['Last 5 Members', 'Who are the last 5 members that joined?'],
  ['Pending Applications', 'Show pending membership applications.'],
  ['Monthly Donations', 'How many donations were made this month?'],
  ['Recent Events', 'Which events have the highest attendance?'],
  ['Inactive Members', 'Show inactive members.']
] as const

export function SuggestionChips({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map(([label, prompt]) => (
        <button
          key={label}
          type="button"
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onSelect(prompt)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

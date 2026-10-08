import './LoadingState.css'

/** Grey placeholder rows in the shape of the table, so the page doesn't jump when data arrives. */
export function LoadingState() {
  return (
    <div className="loading" role="status" aria-busy="true">
      <span className="sr-only">Loading leads…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="loading__row" aria-hidden="true">
          <span className="loading__bar loading__bar--wide" />
          <span className="loading__bar" />
          <span className="loading__bar" />
          <span className="loading__bar loading__bar--short" />
        </div>
      ))}
    </div>
  )
}

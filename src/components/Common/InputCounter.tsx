type Props = {
  currentLength: number
  maxLength: number
  className?: string
  children?: React.ReactNode
}
export function InputCounter({
  currentLength,
  children,
  maxLength,
  className,
}: Props) {
  const defaultClassName = "text-sm text-gray-400"
  const mergeClassName = `${defaultClassName} ${className}`
  return (
    <div className={mergeClassName}>
      {children}
      <div>
        {currentLength} / {maxLength}
      </div>
    </div>
  )
}

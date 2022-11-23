export interface SliderProps {
  value: number
  onChange?: (value: number) => void
}

export const Slider = (props: SliderProps) => {
  return (
    <div class="slider">
      <input
        type="range"
        min="0"
        max="100"
        value={props.value}
        onInput={(e) => {
          props.onChange?.(parseInt(e.currentTarget.value))
        }}
      />
    </div>
  )
}

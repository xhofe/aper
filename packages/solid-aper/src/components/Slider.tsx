import { mergeProps } from "solid-js"

export interface SliderProps {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
}

export const Slider = (props: SliderProps) => {
  const merged = mergeProps({ min: 0, max: 100 }, props)
  return (
    <div class="slider">
      <input
        type="range"
        min={merged.min}
        max={merged.max}
        value={props.value}
        onInput={(e) => {
          props.onChange?.(parseInt(e.currentTarget.value))
        }}
      />
    </div>
  )
}

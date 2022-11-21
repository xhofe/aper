import type { Component } from "solid-js"
import Aper from "."

const App: Component = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        padding: "20px",
        "box-sizing": "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          // border: "1px solid #719"
        }}
      >
        <Aper
          audios={[
            {
              name: "南山忆",
              url: "http://localhost:5244/d/%E5%8D%97%E5%B1%B1%E5%BF%86.mp3",
              artist: "许嵩",
              lrc: "http://localhost:5244/d/%E5%8D%97%E5%B1%B1%E5%BF%86.lrc",
            },
            {
              name: "少女",
              url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E5%B0%91%E5%A5%B3.flac",
              artist: "赵雷",
            },
            {
              name: "我记得",
              url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E6%88%91%E8%AE%B0%E5%BE%97.flac",
              artist: "赵雷",
            },
          ]}
        />
      </div>
    </div>
  )
}

export default App

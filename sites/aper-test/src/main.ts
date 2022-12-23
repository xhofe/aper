import "./style.css"
import Aper from "aper"
import "aper/dist/style.css"

const app = document.querySelector<HTMLDivElement>("#app")!
const ap = new Aper({
  container: app,
  defaultCover: "https://jsd.nn.ci/gh/Xhofe/Xhofe/avatar/avatar.svg",
  audios: [
    {
      name: "少女",
      url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E5%B0%91%E5%A5%B3.flac",
      artist: "赵雷",
      lrc: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E5%B0%91%E5%A5%B3.lrc",
    },
    {
      name: "我记得",
      url: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E6%88%91%E8%AE%B0%E5%BE%97.flac",
      artist: "赵雷",
      lrc: "https://pan.nn.ci/d/Onedrive/%E7%BD%B2%E5%89%8D%E8%A1%97%E5%B0%91%E5%B9%B4/%E8%B5%B5%E9%9B%B7-%E6%88%91%E8%AE%B0%E5%BE%97.lrc",
    },
  ],
})

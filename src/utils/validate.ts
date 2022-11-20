const alphabet = 'ABCEFGHJKLMNPQRSTWXY123456789'

/**生成一个随机数**/
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}
/**生成一个随机色**/
const randomColor = (min: number, max: number) => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

/**绘制验证码图片**/
export const drawCaptcha = (canvas: HTMLCanvasElement): string => {
  // const canvas = document.querySelector(selector) as HTMLCanvasElement
  const width = canvas.width
  const height = canvas.height
  const ctx = canvas.getContext('2d')
  const text = []
  if (!ctx) {
    return ''
  }
  ctx.textBaseline = 'bottom'

  /**绘制背景色**/
  ctx.fillStyle = randomColor(180, 240) //颜色若太深可能导致看不清
  ctx.fillRect(0, 0, width, height)
  /**绘制文字**/
  for (let i = 0; i < 4; i++) {
    text.push(alphabet[randomNum(0, alphabet.length)])
    ctx.fillStyle = randomColor(30, 130)  //随机生成字体颜色
    ctx.font = randomNum(25, 35) + 'px SimHei' //随机生成字体大小
    const x = 10 + i * 25;
    const y = randomNum(25, 45)
    const deg = randomNum(-45, 45)
    //修改坐标原点和旋转角度
    ctx.translate(x, y)
    ctx.rotate(deg * Math.PI / 180)
    ctx.fillText(text[i], 0, 0)
    //恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180)
    ctx.translate(-x, -y)
  }
  /**绘制干扰线**/
  for (let i = 0; i < 10; i++) {
    ctx.strokeStyle = randomColor(40, 180)
    ctx.beginPath()
    ctx.moveTo(randomNum(0, width), randomNum(0, height))
    ctx.lineTo(randomNum(0, width), randomNum(0, height))
    ctx.stroke()
  }
  /**绘制干扰点**/
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = randomColor(0, 255)
    ctx.beginPath()
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
  return text.join('')
}

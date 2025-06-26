export const RandomProfileAvatar = () => {
    const idx = Math.floor(Math.random() * 108) + 1  // generate Number between 1-100
    const RandomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    return RandomAvatar
}
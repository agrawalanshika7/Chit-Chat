function timeConverter(date) {
    const now = new Date();
    const diffrenceInS = (now - date.toDate()) / 1000
    const diffrenceInM = Math.floor(diffrenceInS / 60)
    const diffrenceInH = Math.floor(diffrenceInM / 60)
    const diffrenceInD = Math.floor(diffrenceInH / 24)

    let resoult = `${diffrenceInM}m ago`;
    
    if (diffrenceInM > 59) {
        if (diffrenceInH > 24) return resoult =  `${diffrenceInD}d ago`;
        resoult = `${diffrenceInH}h ago`

    }
    
    return resoult;
}

export default timeConverter;
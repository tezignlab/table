const Images = {

    wrap(src: string | undefined) {
        if (src != undefined && src.length > 0) {
            return {uri: src}
        }
        return require(`../assets/images/empty.png`)
    },

};

export default Images;




class MathHelper {
    clamp(currentNum, min, max){
        return Math.min(Math.max(currentNum, min), max);
    };

    smoothstep(x){
        return x**2 * (3 - (2 * x));
    }
}

export default MathHelper;
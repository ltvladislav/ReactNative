
export default class Calculator {
    static getFunctionResult = (x, y) => {
        return Calculator.roundToDec((2.33 * Math.log(Math.sqrt(1 + Math.pow(Math.cos(y), 2)))) / (Math.exp(y) + Math.pow(Math.sin(x), 2)), 5);
    }
    static roundToDec(value, dec = 2) {
        return Math.round(value * Math.pow(10, dec)) / Math.pow(10, dec);
    }
}
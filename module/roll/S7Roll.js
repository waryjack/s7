export default class S7Roll {

    constructor(formula) {
        let suffix = ""
        let dice = formula.substring(0,expr.substring(0,expr.length-3));
        let mode = formula.substring(expr.length-3);

        switch(mode) {
            case "adv": suffix = "cs>3"; break;
            case "std": suffix = "cs>4"; break;
            case "dis": suffix = "cs>5"; break;
        }
        super(dice+suffix);
    }

    
}
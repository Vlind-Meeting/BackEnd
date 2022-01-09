
const RMSE = (x1, x2, x3, x4, x5, x6, x7, x8, x9, q1, q2, q3, q4, q5, q6, q7, q8, q9) => {
    let result = Math.sqrt((Math.pow(x1-q1,2)*0.999 + Math.pow(x2-q2,2)*0.998 + Math.pow(x3-q3, 2)*0.997
    + Math.pow(x4-q4,2)*1.001 + Math.pow(x5-q5,2)*1.002 + Math.pow(x6-q6, 2)*1.003
    + Math.pow(x7-q7,2)*1.004 + Math.pow(x8-q8,2)*0.996 + Math.pow(x9-q9, 2))*0.995/9);
    return result;
};

const MBTI = (m1, m2) => {
    let arr = [
        [4, 4, 4, 5, 4, 5, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 4, 5, 4, 5, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 5, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1],
        [4, 5, 4, 4, 4, 4, 4, 5, 3, 3, 3, 3, 2, 2, 2, 2],
        [5, 4, 4, 4, 4, 4, 5, 4, 3, 3, 3, 3, 2, 2, 2, 2],
        [4, 4, 4, 4, 4, 5, 4, 4, 3, 3, 3, 3, 2, 2, 2, 5],
        [4, 4, 5, 4, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
        [1, 1, 1, 5, 3, 3, 3, 3, 2, 2, 2, 2, 3, 5, 3, 5],
        [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 5, 3, 5, 3],
        [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 3, 5, 3, 5],
        [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 5, 3, 3, 3],
        [1, 1, 1, 1, 2, 3, 2, 2, 3, 5, 3, 5, 4, 4, 4, 4],
        [1, 1, 1, 1, 2, 3, 2, 2, 5, 3, 5, 3, 4, 4, 4, 4],
        [1, 1, 1, 1, 2, 3, 2, 2, 3, 5, 3, 3, 4, 4, 4, 4],
        [1, 1, 1, 1, 2, 3, 5, 2, 5, 3, 5, 3, 4, 4, 4, 4]
    ]
    let i = trans(m1);
    let j = trans(m2);
    return arr[i][j];
}
const trans = (m) => {
    if(m === "INFP")
        return 0;
    else if(m === "ENFP")
        return 1;
    else if(m === "INFJ")
        return 2;
    else if(m === "ENFJ")
        return 3;
    else if(m === "INTJ")
        return 4;
    else if(m === "ENTJ")
        return 5;
    else if(m === "INTP")
        return 6;
    else if(m === "ENTP")
        return 7;
    else if(m === "ISFP")
        return 8;
    else if(m === "ESFP")
        return 9;
    else if(m === "ISTP")
        return 10;
    else if(m === "ESTP")
        return 11;
    else if(m === "ISFJ")
        return 12;
    else if(m === "ESFJ")
        return 13;
    else if(m === "ISTJ")
        return 14;
    else if(m === "ESTJ")
        return 15;
    else
        return null;
}

// export default {RMSE, MBTI};
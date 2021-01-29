const LinkedList = require('./linked-list-service');

const questionList = new LinkedList.LinkedList();

// create the list
let wordArray = ['waisyeocheu','noteu','seutaendeu','ssain','hompi','geonbae','gaebalja','seutateueob'];

let listValues = wordArray.map(word => {
    let wordObject = {
        word: word,
        memoryValue: 1
    }

    return wordObject;
})

listValues.forEach( wordObject => {
    questionList.insertLast(wordObject);
})

LinkedList.displayList(questionList);
"use strict";

function initQuestion(dom, obj) {
    applyQuestion(dom, obj, (dom, obj) => {
        //applyPerson(dom, obj);
        addDOM(dom);
    });
}
function applyPerson2(dom: HTMLElement, obj): HTMLElement {
    if (typeof obj[`image`] === "undefined") {
        obj[`image`] = ``;
    }
    if (obj[`@type`] === `Person`) {
        [
            { selector: ".questionperson", after: obj[`@id`], fn: changeID },
            { selector: ".rpQuestionPersonName", after: getAuthorName(obj[`name`]), fn: changeTXT },
            { selector: ".rpQuestionPersonImage", after: obj[`image`], fn: changeSRC },
            { selector: ".rpQuestionPersonURL", after: obj[`url`], fn: changeURL },
            { selector: ".answerperson", after: obj[`@id`], fn: changeID },
            { selector: ".rpAnswerPersonName", after: getAuthorName(obj[`name`]), fn: changeTXT },
            { selector: ".rpAnswerPersonImage", after: obj[`image`], fn: changeSRC },
            { selector: ".rpAnswerPersonURL", after: obj[`url`], fn: changeURL }
        ].map((a) => {
            return applyDOM(dom, a);
        });
    }
    //addDOM(dom);
    return dom;
}
function applyQuestion(dom: HTMLElement, obj, fn): HTMLElement {
    if (obj[`@type`] === `Question`) {
        if (typeof obj[`author`][`url`] !== "undefined") {
            getContextFromHTTP(obj[`author`][`url`], (subdom) => {
                getJSONLDs(subdom).map((obj) => {
                    applyPerson2(dom, obj);
                });
            });
        }
        if (typeof obj[`acceptedAnswer`][`author`][`url`] !== "undefined") {
            getContextFromHTTP(obj[`acceptedAnswer`][`author`][`url`], (subdom) => {
                getJSONLDs(subdom).map((obj) => {
                    applyPerson2(dom, obj);
                });
            });
        }
        [
            { selector: ".rpQuestionText", after: obj[`text`], fn: changeTXT },
            { selector: ".rpAnswerText", after: obj[`acceptedAnswer`][`text`], fn: changeTXT },
            { selector: ".rpQuestionPersonName", after: getAuthorName(obj[`author`]), fn: changeTXT },
            { selector: ".rpAnswerPersonName", after: getAuthorName(obj[`acceptedAnswer`][`author`]), fn: changeTXT },
            { selector: ".rpQuestionPersonImage", after: obj[`author`][`image`], fn: changeSRC },
            { selector: ".rpAnswerPersonImage", after: obj[`acceptedAnswer`][`author`][`image`], fn: changeSRC }
        ].forEach((a) => {
            return applyDOM(dom, a);
        });
        if (typeof obj[`author`][`url`] === "undefined") {
            fn(dom, obj);
        }
    }
    return dom;
}
initModule("//interview.ninkigumi.com/templ.html",
    "//interview.ninkigumi.com/organization/family1st/sitemap.txt", initQuestion);
//initModule("/marketing/interview/templ.html",
//    "/marketing/interview/organization/family1st/sitemap.txt", initQuestion);

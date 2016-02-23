"use strict";

function initQuestion(dom, obj) {
    applyQuestion(dom, obj, (dom, obj) => {
        //applyPerson(dom, obj);
        addDOM(dom);
    });
}
function applyPerson2(obj, subobj): any {
    if (obj[`@type`] === `Person`) {
        if (typeof subobj[`image`] !== "undefined") {
            obj[`image`] = subobj[`image`];
        }
    }
    return obj;
}
function applyQuestion(dom: HTMLElement, obj, fn): HTMLElement {
    if (obj[`@type`] === `Question`) {
        if (typeof obj[`author`][`url`] !== "undefined") {
            getContextFromHTTP(obj[`author`][`url`], (subdom) => {
                getJSONLDs(subdom).map((subobj) => {
                    obj = applyPerson2(obj, subobj);
                });
            });
        }
        if (typeof obj[`acceptedAnswer`][`author`][`url`] !== "undefined") {
            getContextFromHTTP(obj[`acceptedAnswer`][`author`][`url`], (subdom) => {
                getJSONLDs(subdom).map((subobj) => {
                    obj = applyPerson2(obj, subobj);
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

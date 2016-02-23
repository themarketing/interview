"use strict";
function initQuestion(dom, obj) {
    applyQuestion(dom, obj, function (dom, obj) {
        addDOM(dom);
    });
}
function applyPerson2(obj, subobj) {
    if (subobj["@type"] === "Person") {
        if (typeof subobj["image"] !== "undefined") {
            if (subobj["url"] === obj["author"]["url"]) {
                obj["author"]["image"] = subobj["image"];
            }
            if (subobj["url"] === obj["acceptedAnswer"]["author"]["url"]) {
                obj["acceptedAnswer"]["author"]["image"] = subobj["image"];
            }
        }
    }
    return obj;
}
function a(obj, aa, fn2) {
    if (typeof aa !== "undefined") {
        getContextFromHTTP(aa, function (subdom) {
            getJSONLDs(subdom).map(function (subobj) {
                applyPerson2(obj, subobj);
                fn2(obj);
                return obj;
            });
        });
    }
    else {
        fn2(obj);
        return obj;
    }
}
function applyQuestion(dom, obj, fn) {
    if (obj["@type"] === "Question") {
        if (typeof obj["author"]["image"] === "undefined") {
            obj["author"]["image"] = "";
        }
        if (typeof obj["acceptedAnswer"]["author"]["image"] === "undefined") {
            obj["acceptedAnswer"]["author"]["image"] = "";
        }
        a(obj, obj["author"]["url"], function (obj) {
            a(obj, obj["acceptedAnswer"]["author"]["url"], function (obj) {
                [
                    { selector: ".rpQuestionText", after: obj["text"], fn: changeTXT },
                    { selector: ".rpAnswerText", after: obj["acceptedAnswer"]["text"], fn: changeTXT },
                    { selector: ".rpQuestionPersonName", after: getAuthorName(obj["author"]), fn: changeTXT },
                    { selector: ".rpAnswerPersonName", after: getAuthorName(obj["acceptedAnswer"]["author"]), fn: changeTXT },
                    { selector: ".rpQuestionPersonImage", after: obj["author"]["image"], fn: changeSRC },
                    { selector: ".rpAnswerPersonImage", after: obj["acceptedAnswer"]["author"]["image"], fn: changeSRC }
                ].map(function (a) {
                    return applyDOM(dom, a);
                });
                if (typeof obj["author"]["url"] === "undefined") {
                    fn(dom, obj);
                }
            });
        });
    }
    return dom;
}
initModule("//interview.ninkigumi.com/templ.html", "//interview.ninkigumi.com/organization/family1st/sitemap.txt", initQuestion);

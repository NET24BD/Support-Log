/* =====================================================
   LINK4 COMMUNICATION
   GLOBAL SESSION TIMEOUT SYSTEM

   AUTO LOGOUT:
   3 MINUTES INACTIVITY

   FILE NAME:
   session-timeout.js
===================================================== */


/* =====================================================
   SETTINGS
===================================================== */

/*
   3 Minutes
   3 × 60 × 1000 = 180000 Milliseconds
*/

const AUTO_LOGOUT_TIME = 3 * 60 * 1000;


/* =====================================================
   LOGIN PAGE
===================================================== */

/*
   তোমার Login Page যদি Root Folder-এর index.html হয়
   তাহলে এই Path ঠিক আছে।

   Dashboard folder-এর ভিতরের Page থেকে:
   ../index.html
*/

const LOGIN_PAGE = "../index.html";


/* =====================================================
   TIMER VARIABLE
===================================================== */

let inactivityTimer = null;


/* =====================================================
   CHECK USER LOGIN
===================================================== */

function isUserLoggedIn(){

    return (

        localStorage.getItem("loggedIn") === "true"

    );

}


/* =====================================================
   CLEAR LOGIN SESSION
===================================================== */

function clearLoginSession(){

    /* ================================================
       CLEAR LOCAL STORAGE
    ================================================ */

    localStorage.removeItem(
        "loggedIn"
    );


    localStorage.removeItem(
        "username"
    );


    localStorage.removeItem(
        "name"
    );


    localStorage.removeItem(
        "role"
    );


    /* ================================================
       CLEAR SESSION STORAGE
    ================================================ */

    sessionStorage.clear();

}


/* =====================================================
   AUTO LOGOUT
===================================================== */

function performAutoLogout(){

    /* ================================================
       STOP TIMER
    ================================================ */

    if(

        inactivityTimer !== null

    ){

        clearTimeout(

            inactivityTimer

        );

        inactivityTimer = null;

    }


    /* ================================================
       CLEAR LOGIN SESSION
    ================================================ */

    clearLoginSession();


    /* ================================================
       REDIRECT TO LOGIN PAGE
    ================================================ */

    window.location.replace(

        LOGIN_PAGE + "?session=expired"

    );

}


/* =====================================================
   START / RESET INACTIVITY TIMER
===================================================== */

function resetInactivityTimer(){

    /* ================================================
       USER LOGGED IN না হলে TIMER চালু হবে না
    ================================================ */

    if(

        !isUserLoggedIn()

    ){

        return;

    }


    /* ================================================
       OLD TIMER CLEAR
    ================================================ */

    if(

        inactivityTimer !== null

    ){

        clearTimeout(

            inactivityTimer

        );

    }


    /* ================================================
       NEW 3 MINUTE TIMER
    ================================================ */

    inactivityTimer = setTimeout(

        function(){

            performAutoLogout();

        },

        AUTO_LOGOUT_TIME

    );

}


/* =====================================================
   USER ACTIVITY EVENTS
===================================================== */

/*
   User নিচের যেকোনো কাজ করলে
   3 Minutes Timer আবার শুরু হবে।

   Mouse Move
   Mouse Click
   Keyboard
   Scroll
   Touch
   Wheel
*/

const USER_ACTIVITY_EVENTS = [

    "mousemove",

    "mousedown",

    "click",

    "keydown",

    "keypress",

    "scroll",

    "touchstart",

    "touchmove",

    "wheel"

];


/* =====================================================
   ADD ACTIVITY LISTENERS
===================================================== */

USER_ACTIVITY_EVENTS.forEach(

    function(eventName){

        document.addEventListener(

            eventName,

            function(){

                resetInactivityTimer();

            },

            true

        );

    }

);


/* =====================================================
   START TIMER
===================================================== */

resetInactivityTimer();


/* =====================================================
   PAGE VISIBILITY CHECK
===================================================== */

/*
   User যদি অন্য Tab থেকে আবার এই Website-এ ফিরে আসে
   তখন Login Status Check করবে।

   Logged Out থাকলে Login Page-এ পাঠাবে।
*/

document.addEventListener(

    "visibilitychange",

    function(){

        if(

            document.visibilityState === "visible"

        ){

            if(

                !isUserLoggedIn()

            ){

                window.location.replace(

                    LOGIN_PAGE

                );

                return;

            }


            resetInactivityTimer();

        }

    }

);


/* =====================================================
   BROWSER BACK / CACHE SECURITY
===================================================== */

window.addEventListener(

    "pageshow",

    function(){

        if(

            !isUserLoggedIn()

        ){

            window.location.replace(

                LOGIN_PAGE

            );

            return;

        }


        resetInactivityTimer();

    }

);


/* =====================================================
   CROSS TAB LOGOUT
===================================================== */

/*
   যদি অন্য কোনো Tab থেকে Logout করা হয়,
   তাহলে এই Tab-ও Login Page-এ চলে যাবে।
*/

window.addEventListener(

    "storage",

    function(event){

        if(

            event.key === "loggedIn"

        ){

            if(

                event.newValue !== "true"

            ){

                window.location.replace(

                    LOGIN_PAGE

                );

            }

        }

    }

);


/* =====================================================
   INITIAL LOGIN CHECK
===================================================== */

if(

    !isUserLoggedIn()

){

    window.location.replace(

        LOGIN_PAGE

    );

}

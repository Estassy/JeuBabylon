import { Engine } from "@babylonjs/core";

import Soccer from "./game";

let canvas;
let engine;

const babylonInit = async () => {
    
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, false, {
            adaptToDeviceRatio: true,
    });
    
    window.addEventListener("resize", function () {
        engine.resize();
    });
};



babylonInit().then(() => {
    const soccer = new Soccer(canvas, engine);
    soccer.start();    
});


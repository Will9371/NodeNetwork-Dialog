import { ModeSelector } from "./ModeSelector.js";
document.addEventListener("DOMContentLoaded", () => { const modeSelector = new ModeSelector(); });

import { Diagram } from './Diagram.js';
const diagram = new Diagram();
diagram.attachEventListeners();

import { TextBoxManager } from '/TextBoxManager.js';
document.addEventListener("DOMContentLoaded", () => 
{
    const textBox = document.getElementById("text-box");
    const textBoxInput = document.querySelector("#textbox-input");
    const textBoxManager = new TextBoxManager(textBox, textBoxInput);
    textBoxInput.addEventListener("input", textBoxManager.handleTextBoxChange.bind(textBoxManager));
});
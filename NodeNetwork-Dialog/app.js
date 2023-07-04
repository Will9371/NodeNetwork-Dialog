import { Diagram } from './Diagram.js';
const diagram = new Diagram();
diagram.attachEventListeners();

import { TextBoxManager } from '/TextBoxManager.js';
document.addEventListener("DOMContentLoaded", () => 
{
    const textBox = document.getElementById("text-box");
    const textBoxManager = new TextBoxManager(textBox);
});
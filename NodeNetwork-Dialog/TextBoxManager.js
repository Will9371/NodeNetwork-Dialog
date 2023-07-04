export default class TextBoxManager 
{
    constructor(textBoxElement) 
    {
        this.textBoxElement = textBoxElement;
        console.log(this.textBoxElement === null);

        // Listen for the "modeChanged" event from the document
        document.addEventListener("modeChanged", this.handleModeChanged.bind(this));
    }

    handleModeChanged(event) 
    {
        const mode = event.detail.mode;

        // Check if the mode is "view" and toggle the text box visibility accordingly
        if (mode === "view") 
        {
            this.textBoxElement.classList.add("active");
        } 
        else 
        {
            this.textBoxElement.classList.remove("active");
        }
    }
}

export { TextBoxManager };
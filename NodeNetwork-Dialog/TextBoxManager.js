export default class TextBoxManager 
{
    constructor(textBoxElement) 
    {
        this.textBoxElement = textBoxElement;

        // Prevent clicks on the overlay from affecting circles
        this.overlay = document.getElementById("overlay");
        overlay.addEventListener("mousedown", (e) => e.stopPropagation());

        document.addEventListener("modeChanged", this.handleModeChanged.bind(this));
        document.addEventListener("selectionChanged", this.handleSelectionChanged.bind(this));
    }

    handleModeChanged(event) 
    {
        const mode = event.detail.mode;
        //this.setActive(mode === "view")
    }
    
    handleSelectionChanged(event)
    {
        const circle = event.detail.selectedCircle;
        this.setActive(circle !== null)
    }
    
    setActive(value) 
    {
        if (value) 
            this.textBoxElement.classList.add("active");
        else
            this.textBoxElement.classList.remove("active");
    }
}

export { TextBoxManager };
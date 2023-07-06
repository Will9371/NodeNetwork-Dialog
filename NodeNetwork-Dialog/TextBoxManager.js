export default class TextBoxManager 
{
    constructor(textBox, inputText) 
    {
        this.textBox = textBox;
        this.inputText = inputText;
        this.selectedCircle = null;

        // Prevent clicks on the overlay from affecting circles
        this.overlay = document.getElementById("overlay");
        overlay.addEventListener("mousedown", (e) => e.stopPropagation());
        
        document.addEventListener("selectionChanged", this.handleSelectionChanged.bind(this));

        // Prevent keybindings from being triggered when user is typing in the input field
        this.inputText.addEventListener("keydown", (event) => { event.stopPropagation(); });
    }
    
    handleSelectionChanged(event)
    {
        this.selectedCircle = event.detail.selectedCircle;
        this.setActive(this.selectedCircle !== null)
        
        if (this.selectedCircle !== null)
            this.inputText.value = this.selectedCircle.text;
    }
    
    setActive(value) 
    {
        if (value)
            this.textBox.classList.add("active");
        else
            this.textBox.classList.remove("active");
    }

    handleTextBoxChange(event) 
    {
        const newText = event.target.value; // get the new text data from the input field
        this.selectedCircle.text = newText; // update the text data in the selected circle
    }
}

export { TextBoxManager };